import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users - получить список пользователей с фильтрацией
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const riskLevel = searchParams.get('riskLevel') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role && role !== 'all') {
      where.role = role
    }
    
    if (riskLevel) {
      switch (riskLevel) {
        case 'low':
          where.risk_score = { lt: 5 }
          break
        case 'medium':
          where.risk_score = { gte: 5, lt: 10 }
          break
        case 'high':
          where.risk_score = { gte: 10 }
          break
      }
    }

    // Get users with related data
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          visits: {
            select: {
              id: true,
              status: true,
              created_at: true,
              bill_amount: true
            },
            orderBy: { created_at: 'desc' },
            take: 5
          },
          wheel_spins: {
            select: { spun_at: true, prize: true },
            orderBy: { spun_at: 'desc' },
            take: 3
          },
          coupons: {
            where: {
              expires_at: { gte: new Date() },
              redeemed_at: null
            },
            select: { type: true, code: true, expires_at: true }
          },
          _count: {
            select: {
              visits: true,
              wheel_spins: true,
              coupons: true,
              tips: true,
              music_orders: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    // Calculate additional metrics for each user
    const usersWithMetrics = users.map(user => {
      const confirmedVisits = user.visits.filter(v => v.status === 'confirmed')
      const totalSpent = confirmedVisits.reduce((sum, v) => sum + (v.bill_amount || 0), 0)
      const lastVisit = confirmedVisits[0]?.created_at || null
      const lastWheelSpin = user.wheel_spins[0]?.spun_at || null
      
      return {
        ...user,
        metrics: {
          totalSpent,
          confirmedVisits: confirmedVisits.length,
          activeCoupons: user.coupons.length,
          lastVisit,
          lastWheelSpin,
          avgOrderValue: confirmedVisits.length > 0 ? Math.round(totalSpent / confirmedVisits.length) : 0
        }
      }
    })

    return NextResponse.json({
      users: usersWithMetrics,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/users - создать пользователя (для тестирования)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true, id: true, name: true }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { name, email, phone, role: userRole, birthdate } = await request.json()

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: userRole || 'guest',
        birthdate: birthdate ? new Date(birthdate) : null,
      }
    })

    // Log admin action
    await prisma.adminLog.create({
      data: {
        admin_id: user.id,
        admin_name: user.name || 'Unknown',
        action: 'create_user',
        target_type: 'user',
        target_id: newUser.id,
        details: `Created user: ${name} (${email})`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json({ user: newUser }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}