import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '7d'

    // Mock analytics data - replace with real database aggregations
    const analyticsData = {
      overview: {
        totalVisits: 1247,
        uniqueVisitors: 892,
        avgVisitDuration: 87, // minutes
        conversionRate: 68.5,
        totalRevenue: 285400,
        bounceRate: 12.3
      },
      visits: {
        byDay: [
          { date: '2024-01-01', count: 145 },
          { date: '2024-01-02', count: 167 },
          { date: '2024-01-03', count: 198 },
          { date: '2024-01-04', count: 223 },
          { date: '2024-01-05', count: 189 },
          { date: '2024-01-06', count: 156 },
          { date: '2024-01-07', count: 169 }
        ],
        byHour: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: Math.floor(Math.random() * 50) + 10
        })),
        sources: [
          { source: 'Direct', count: 489, percentage: 39.2 },
          { source: 'Google', count: 374, percentage: 30.0 },
          { source: 'Social Media', count: 249, percentage: 20.0 },
          { source: 'Referrals', count: 135, percentage: 10.8 }
        ]
      },
      menu: {
        byCategory: [
          { category: 'Кальяни', orders: 456, revenue: 136800 },
          { category: 'Коктейлі', orders: 389, revenue: 58350 },
          { category: 'Закуски', orders: 312, revenue: 46800 },
          { category: 'Десерти', orders: 198, revenue: 19800 }
        ],
        topItems: [
          { name: 'Кальян Mix Fruit', orders: 156, revenue: 46800, likes: 234 },
          { name: 'Mojito Classic', orders: 142, revenue: 21300, likes: 198 },
          { name: 'Крила Buffalo', orders: 98, revenue: 19600, likes: 167 },
          { name: 'Кальян Premium', orders: 87, revenue: 34800, likes: 145 },
          { name: 'Bruschetta Mix', orders: 76, revenue: 11400, likes: 123 }
        ],
        trends: Array.from({ length: 7 }, (_, i) => ({
          date: `2024-01-0${i + 1}`,
          orders: Math.floor(Math.random() * 100) + 200
        }))
      },
      staff: {
        ratings: [
          { name: 'Олександр', avgRating: 4.8, totalRatings: 156, tips: 12400 },
          { name: 'Максим', avgRating: 4.7, totalRatings: 142, tips: 11200 },
          { name: 'Дмитро', avgRating: 4.6, totalRatings: 134, tips: 10800 },
          { name: 'Андрій', avgRating: 4.5, totalRatings: 128, tips: 9800 }
        ],
        ratingTrends: Array.from({ length: 7 }, (_, i) => ({
          date: `2024-01-0${i + 1}`,
          avgRating: 4.5 + Math.random() * 0.5
        })),
        tipStats: {
          total: 44200,
          avgPerVisit: 35.4,
          topStaff: [
            { name: 'Олександр', amount: 12400 },
            { name: 'Максим', amount: 11200 }
          ]
        }
      },
      revenue: {
        avgCheck: 229,
        byCategory: [
          { category: 'Кальяни', amount: 136800, percentage: 47.9 },
          { category: 'Коктейлі', amount: 58350, percentage: 20.4 },
          { category: 'Закуски', amount: 46800, percentage: 16.4 },
          { category: 'Десерти', amount: 19800, percentage: 6.9 },
          { category: 'Інше', amount: 23650, percentage: 8.4 }
        ],
        topSales: [
          { item: 'Кальян Premium', revenue: 34800, orders: 87 },
          { item: 'Кальян Mix Fruit', revenue: 46800, orders: 156 },
          { item: 'VIP Lounge', revenue: 28500, orders: 19 }
        ],
        trends: Array.from({ length: 7 }, (_, i) => ({
          date: `2024-01-0${i + 1}`,
          revenue: Math.floor(Math.random() * 10000) + 35000
        }))
      }
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}