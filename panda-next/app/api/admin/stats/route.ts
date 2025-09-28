import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

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

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get basic stats
    const stats = await Promise.all([
      // Today's visits
      prisma.visit.count({
        where: {
          created_at: { gte: todayStart },
          status: 'confirmed'
        }
      }),
      
      // Week's visits
      prisma.visit.count({
        where: {
          created_at: { gte: weekStart },
          status: 'confirmed'
        }
      }),
      
      // Month's revenue (sum of bill amounts)
      prisma.visit.aggregate({
        where: {
          created_at: { gte: monthStart },
          status: 'confirmed',
          bill_amount: { not: null }
        },
        _sum: {
          bill_amount: true
        }
      }),
      
      // Active users (logged in last 30 days)
      prisma.user.count({
        where: {
          last_login: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Pending music orders
      prisma.musicOrder.count({
        where: { status: 'pending' }
      }),
      
      // Today's wheel spins
      prisma.wheelSpin.count({
        where: {
          spun_at: { gte: todayStart }
        }
      }),
      
      // Active coupons
      prisma.coupon.count({
        where: {
          expires_at: { gte: now },
          redeemed_at: null
        }
      }),

      // Total users
      prisma.user.count(),

      // High risk users
      prisma.user.count({
        where: {
          risk_score: { gte: 10 }
        }
      })
    ])

    // Get recent activity
    const recentActivity = await Promise.all([
      // Recent visits
      prisma.visit.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { name: true } }
        }
      }),
      
      // Recent wheel spins
      prisma.wheelSpin.findMany({
        take: 5,
        orderBy: { spun_at: 'desc' },
        include: {
          user: { select: { name: true } }
        }
      }),
      
      // Recent music orders
      prisma.musicOrder.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { name: true } }
        }
      })
    ])

    // Format activity for frontend
    const formattedActivity = [
      ...recentActivity[0].map(visit => ({
        id: `visit-${visit.id}`,
        type: 'visit',
        message: visit.status === 'confirmed' ? 'Візит підтверджено' : 'Новий візит',
        user: visit.user.name || 'Невідомий',
        time: formatTimeAgo(visit.created_at),
        data: { bill_amount: visit.bill_amount }
      })),
      ...recentActivity[1].map(spin => ({
        id: `wheel-${spin.id}`,
        type: 'wheel',
        message: `Виграш: ${spin.prize}`,
        user: spin.user.name || 'Невідомий',
        time: formatTimeAgo(spin.spun_at),
        data: { prize: spin.prize }
      })),
      ...recentActivity[2].map(order => ({
        id: `music-${order.id}`,
        type: 'music',
        message: `Замовлено: ${order.title}`,
        user: order.user.name || 'Невідомий',
        time: formatTimeAgo(order.created_at),
        data: { amount: order.paid_amount, status: order.status }
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)

    // Get chart data for the last 7 days
    const chartData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      const [visits, spins, revenue] = await Promise.all([
        prisma.visit.count({
          where: {
            created_at: { gte: dayStart, lt: dayEnd },
            status: 'confirmed'
          }
        }),
        prisma.wheelSpin.count({
          where: {
            spun_at: { gte: dayStart, lt: dayEnd }
          }
        }),
        prisma.visit.aggregate({
          where: {
            created_at: { gte: dayStart, lt: dayEnd },
            status: 'confirmed',
            bill_amount: { not: null }
          },
          _sum: { bill_amount: true }
        })
      ])
      
      chartData.push({
        date: date.toISOString().split('T')[0],
        visits,
        spins,
        revenue: revenue._sum.bill_amount || 0
      })
    }

    return NextResponse.json({
      stats: {
        todayVisits: stats[0],
        weekVisits: stats[1],
        monthRevenue: stats[2]._sum.bill_amount || 0,
        activeUsers: stats[3],
        pendingMusicOrders: stats[4],
        todayWheelSpins: stats[5],
        activeCoupons: stats[6],
        totalUsers: stats[7],
        highRiskUsers: stats[8]
      },
      recentActivity: formattedActivity,
      chartData
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'щойно'
  if (diffMins < 60) return `${diffMins} хв тому`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} год тому`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} дн тому`
}