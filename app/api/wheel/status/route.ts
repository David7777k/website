import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-system'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * GET /api/wheel/status
 * Check if user can spin the wheel
 * FSM States: LOCKED (not authenticated) | READY (can spin) | COOLDOWN (must wait)
 * Returns: { canSpin: boolean, state: string, nextSpinDate?: Date, lastPrize?: string, timeLeft?: object }
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      logger.debug({
        action: 'wheel_status_unauthorized'
      })
      
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          canSpin: false, 
          state: 'LOCKED',
          message: 'Увійдіть для доступу до колеса фортуни'
        },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get user's last spin
    const lastSpin = await prisma.wheelSpin.findFirst({
      where: { user_id: userId },
      orderBy: { spun_at: 'desc' }
    })

    if (!lastSpin) {
      // Never spun before - can spin!
      return NextResponse.json({
        canSpin: true,
        state: 'READY',
        message: 'Безкоштовний спін доступний!'
      })
    }

    const now = new Date()
    const nextAllowedAt = new Date(lastSpin.next_allowed_at)

    if (now < nextAllowedAt) {
      // Still in cooldown
      const timeLeft = nextAllowedAt.getTime() - now.getTime()
      const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      
      return NextResponse.json({
        canSpin: false,
        state: 'COOLDOWN',
        nextSpinDate: nextAllowedAt,
        lastPrize: lastSpin.prize_name,
        message: `Наступний спін через: ${daysLeft}д ${hoursLeft}г`,
        timeLeft: {
          days: daysLeft,
          hours: hoursLeft,
          minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        }
      })
    }

    // Cooldown expired - can spin again!
    return NextResponse.json({
      canSpin: true,
      state: 'READY',
      lastPrize: lastSpin.prize_name,
      message: 'Можна крутити знову!'
    })

  } catch (error: any) {
    console.error('Wheel status error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        canSpin: false,
        state: 'ERROR',
        message: 'Помилка перевірки статусу'
      },
      { status: 500 }
    )
  }
}
