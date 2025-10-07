import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user data with relations
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        role: true,
        referral_code: true,
        created_at: true,
        is_blocked: true,
        smoke_theme_enabled: true,
        // Count relations
        _count: {
          select: {
            visits: {
              where: {
                status: 'confirmed'
              }
            },
            coupons: {
              where: {
                redeemed_at: null,
                expires_at: {
                  gt: new Date()
                }
              }
            },
            referrals_sent: {
              where: {
                status: 'confirmed'
              }
            }
          }
        },
        // Get active coupons
        coupons: {
          where: {
            redeemed_at: null,
            expires_at: {
              gt: new Date()
            }
          },
          orderBy: {
            created_at: 'desc'
          },
          take: 10
        },
        // Get recent visits
        visits: {
          orderBy: {
            created_at: 'desc'
          },
          take: 5,
          select: {
            id: true,
            visit_code: true,
            status: true,
            bill_amount: true,
            confirmed_at: true,
            created_at: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate bonus points (from active coupons)
    const bonusPoints = user.coupons.reduce((sum, coupon) => {
      return sum + (coupon.value_pct || 0)
    }, 0)

    // Format response
    const profileData = {
      id: user.id,
      name: user.name || 'Гість',
      email: user.email,
      phone: user.phone,
      avatar: user.image,
      role: user.role,
      status: user.role === 'user' ? 'Користувач' : user.role === 'staff' ? 'Персонал' : user.role === 'admin' ? 'Адміністратор' : 'Гість',
      referralCode: user.referral_code,
      referralLink: `${process.env.APP_URL || 'http://localhost:3000'}/ref/${user.referral_code}`,
      visitCount: user._count.visits,
      bonusPoints: bonusPoints,
      referralCount: user._count.referrals_sent,
      activeCoupons: user.coupons.map(coupon => ({
        id: coupon.id,
        title: `${coupon.value_pct}% знижка на меню`,
        code: coupon.code,
        type: coupon.type,
        validUntil: coupon.expires_at.toLocaleDateString('uk-UA'),
        discount: `${coupon.value_pct}.00%`
      })),
      recentVisits: user.visits.map(visit => ({
        id: visit.id,
        date: visit.created_at.toLocaleDateString('uk-UA'),
        status: visit.status === 'confirmed' ? 'Підтверджено' : visit.status === 'pending' ? 'Очікує' : 'Закінчився',
        amount: visit.bill_amount
      })),
      createdAt: user.created_at,
      isBlocked: user.is_blocked,
      smokeThemeEnabled: user.smoke_theme_enabled
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, phone, smokeThemeEnabled } = body

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(typeof smokeThemeEnabled === 'boolean' && { smoke_theme_enabled: smokeThemeEnabled })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        smoke_theme_enabled: true
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
