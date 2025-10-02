import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock referral data - replace with real database query
    const referralData = {
      referralCode: 'PANDA2024',
      referralLink: `https://panda-hookah.com/ref/PANDA2024`,
      totalReferrals: 8,
      tokensBalance: 450,
      tokensEarned: 680,
      level: 'silver',
      referrals: [
        {
          id: '1',
          name: 'Олексій К.',
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          visits: 5,
          tokensEarned: 100
        },
        {
          id: '2',
          name: 'Марія П.',
          joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          visits: 3,
          tokensEarned: 60
        },
        {
          id: '3',
          name: 'Дмитро С.',
          joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          visits: 8,
          tokensEarned: 160
        }
      ],
      challenges: [
        {
          id: '1',
          title: 'Перші 5 рефералів',
          description: 'Запросіть 5 друзів для отримання бонусу',
          reward: 100,
          progress: 8,
          target: 5,
          completed: true
        },
        {
          id: '2',
          title: '10 активних рефералів',
          description: 'Запросіть 10 друзів які зроблять мінімум 3 візити',
          reward: 250,
          progress: 3,
          target: 10,
          completed: false
        }
      ]
    }

    return NextResponse.json(referralData)
  } catch (error) {
    console.error('Error fetching referral data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}