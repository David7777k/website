import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users/[id] - получить детали пользователя
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        visits: {
          orderBy: { created_at: 'desc' },
          include: {
            user: { select: { name: true } }
          }
        },
        wheel_spins: {
          orderBy: { spun_at: 'desc' },
          take: 20
        },
        coupons: {
          orderBy: { created_at: 'desc' }
        },
        music_orders: {
          orderBy: { created_at: 'desc' },
          take: 10
        },
        tips: {
          orderBy: { created_at: 'desc' },
          include: {
            staff: { select: { name: true } }
          },
          take: 10
        },
        ratings: {
          orderBy: { created_at: 'desc' },
          include: {
            staff: { select: { name: true } }
          },
          take: 10
        },
        referrals_sent: {
          include: {
            referee: { select: { name: true, email: true } }
          }
        },
        referrals_received: {
          include: {
            referrer: { select: { name: true, email: true } }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate user metrics
    const confirmedVisits = user.visits.filter(v => v.status === 'confirmed')
    const totalSpent = confirmedVisits.reduce((sum, v) => sum + (v.bill_amount || 0), 0)
    const totalTips = user.tips.reduce((sum, t) => sum + t.amount, 0)
    const activeCoupons = user.coupons.filter(c => !c.redeemed_at && c.expires_at > new Date())
    
    const metrics = {
      totalVisits: user.visits.length,
      confirmedVisits: confirmedVisits.length,
      totalSpent,
      avgOrderValue: confirmedVisits.length > 0 ? Math.round(totalSpent / confirmedVisits.length) : 0,
      totalWheelSpins: user.wheel_spins.length,
      totalTipsGiven: totalTips,
      activeCoupons: activeCoupons.length,
      expiredCoupons: user.coupons.filter(c => !c.redeemed_at && c.expires_at <= new Date()).length,
      usedCoupons: user.coupons.filter(c => c.redeemed_at).length,
      referralsSent: user.referrals_sent.length,
      referralsReceived: user.referrals_received.length,
      avgServiceRating: user.ratings.length > 0 
        ? user.ratings.reduce((sum, r) => sum + r.service_rating, 0) / user.ratings.length 
        : 0,
      avgPersonalityRating: user.ratings.length > 0
        ? user.ratings.reduce((sum, r) => sum + r.personality_rating, 0) / user.ratings.length
        : 0
    }

    return NextResponse.json({
      user: {
        ...user,
        metrics
      }
    })

  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/users/[id] - обновить пользователя
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true, id: true, name: true }
    })

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updates = await request.json()
    const allowedFields = ['name', 'phone', 'role', 'is_blocked', 'risk_score', 'smoke_theme_enabled', 'birthdate']
    
    const updateData: any = {}
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'birthdate' && updates[key]) {
          updateData[key] = new Date(updates[key])
        } else {
          updateData[key] = updates[key]
        }
      }
    })

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        admin_id: adminUser.id,
        admin_name: adminUser.name || 'Unknown',
        action: 'update_user',
        target_type: 'user',
        target_id: params.id,
        details: `Updated fields: ${Object.keys(updateData).join(', ')}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - удалить пользователя
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true, id: true, name: true }
    })

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get user info before deletion
    const userToDelete = await prisma.user.findUnique({
      where: { id: params.id },
      select: { name: true, email: true }
    })

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: params.id }
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        admin_id: adminUser.id,
        admin_name: adminUser.name || 'Unknown',
        action: 'delete_user',
        target_type: 'user',
        target_id: params.id,
        details: `Deleted user: ${userToDelete.name} (${userToDelete.email})`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}