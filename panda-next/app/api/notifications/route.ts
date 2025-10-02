import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock notifications data - replace with real database query
    const notifications = [
      {
        id: '1',
        type: 'visit',
        title: 'Візит підтверджено',
        message: 'Ваш візит успішно підтверджено. Отримано +50 бонусів!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        priority: 'medium',
        actionUrl: '/profile/visits'
      },
      {
        id: '2',
        type: 'promo',
        title: 'Нова акція!',
        message: 'Знижка 20% на всі кальяни до кінця тижня!',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        priority: 'high',
        actionUrl: '/promos'
      },
      {
        id: '3',
        type: 'wheel',
        title: 'Колесо фортуни',
        message: 'Колесо фортуни доступне для обертання!',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        read: true,
        priority: 'low'
      }
    ]

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}