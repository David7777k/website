import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-system'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * POST /api/wheel/spin
 * FSM: Spin the wheel and get a prize
 * Returns: { success: boolean, prize: object, coupon: object, nextSpinDate: Date }
 * 
 * FSM States: LOCKED -> READY -> SPINNING -> RESULT -> COOLDOWN
 * Cooldown: 7 days between spins
 * Anti-abuse: IP tracking, audit logging
 */
export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7)
  
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      logger.warn({
        action: 'wheel_spin_unauthorized',
        details: { requestId }
      })
      
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Потрібна авторизація' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    logger.info({
      userId,
      action: 'wheel_spin_attempt',
      ip: clientIp,
      details: { requestId }
    })

    // ANTI-ABUSE: Check last spin
    const lastSpin = await prisma.wheelSpin.findFirst({
      where: { user_id: userId },
      orderBy: { spun_at: 'desc' }
    })

    const now = new Date()

    if (lastSpin) {
      const nextAllowedAt = new Date(lastSpin.next_allowed_at)
      
      if (now < nextAllowedAt) {
        const timeLeft = nextAllowedAt.getTime() - now.getTime()
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        
        // Log abuse attempt with structured logging
        await logger.auditLog(prisma, {
          userId,
          action: 'wheel_spin_blocked',
          entityType: 'WheelSpin',
          ip: clientIp,
          userAgent,
          details: {
            reason: 'cooldown_active',
            nextAllowedAt: nextAllowedAt.toISOString(),
            timeLeftMs: timeLeft,
            lastSpinId: lastSpin.id,
            requestId
          }
        })
        
        logger.warn({
          userId,
          action: 'wheel_spin_cooldown_violation',
          ip: clientIp,
          details: {
            daysLeft,
            hoursLeft,
            nextAllowedAt: nextAllowedAt.toISOString()
          }
        })

        return NextResponse.json(
          {
            success: false,
            error: 'COOLDOWN_ACTIVE',
            message: `Колесо заблоковано. Наступний спін через: ${daysLeft}д ${hoursLeft}г`,
            nextSpinDate: nextAllowedAt,
            timeLeft: {
              days: daysLeft,
              hours: hoursLeft
            }
          },
          { status: 429 } // Too Many Requests
        )
      }
    }

    // Get active prizes
    const activePrizes = await prisma.wheelPrize.findMany({
      where: { is_active: true }
    })

    if (activePrizes.length === 0) {
      logger.error({
        userId,
        action: 'wheel_spin_no_prizes',
        details: { requestId }
      })
      
      return NextResponse.json(
        {
          success: false,
          error: 'NO_PRIZES',
          message: 'Призи тимчасово недоступні'
        },
        { status: 503 }
      )
    }
    
    // Validate prize probability distribution
    const totalProbability = activePrizes.reduce((sum, p) => sum + p.probability, 0)
    if (totalProbability <= 0) {
      logger.error({
        userId,
        action: 'wheel_spin_invalid_probabilities',
        details: { 
          totalProbability,
          prizesCount: activePrizes.length,
          requestId
        }
      })
      
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PRIZE_CONFIG',
          message: 'Помилка конфігурації призів'
        },
        { status: 500 }
      )
    }

    // Select random prize based on probability
    const totalWeight = activePrizes.reduce((sum, p) => sum + p.probability, 0)
    let random = Math.random() * totalWeight
    
    let selectedPrize = activePrizes[0]
    for (const prize of activePrizes) {
      random -= prize.probability
      if (random <= 0) {
        selectedPrize = prize
        break
      }
    }

    // Check if prize has max_per_period limit
    if (selectedPrize.max_per_period && selectedPrize.current_count >= selectedPrize.max_per_period) {
      // Prize limit reached, select next available
      const availablePrizes = activePrizes.filter(
        p => !p.max_per_period || p.current_count < p.max_per_period
      )
      
      if (availablePrizes.length === 0) {
        // Fallback to first prize
        selectedPrize = activePrizes[0]
      } else {
        selectedPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)]
      }
    }

    // Calculate next spin date (7 days from now)
    const nextAllowedAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // TRANSACTION: Create spin record + update prize counter + create coupon
    const result = await prisma.$transaction(async (tx) => {
      // 1. Record the spin
      const spin = await tx.wheelSpin.create({
        data: {
          user_id: userId,
          prize_id: selectedPrize.id,
          prize_name: selectedPrize.name,
          state: 'COMPLETED',
          next_allowed_at: nextAllowedAt,
          ip: clientIp
        }
      })

      // 2. Update prize counter if has limit
      if (selectedPrize.max_per_period) {
        await tx.wheelPrize.update({
          where: { id: selectedPrize.id },
          data: { current_count: { increment: 1 } }
        })
      }

      // 3. Create coupon/promo for the user (7 days validity)
      let coupon = null
      if (selectedPrize.type === 'discount' && selectedPrize.value) {
        const couponCode = `WHEEL${Date.now().toString(36).toUpperCase()}`
        const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

        coupon = await tx.coupon.create({
          data: {
            user_id: userId,
            type: selectedPrize.type,
            value_pct: selectedPrize.value,
            kind: 'wheel_prize',
            code: couponCode,
            expires_at: expiresAt
          }
        })
      }

      // 4. Log the action to audit trail
      await tx.auditLog.create({
        data: {
          user_id: userId,
          action: 'wheel_spin_success',
          entity_type: 'WheelSpin',
          entity_id: spin.id.toString(),
          details: JSON.stringify({
            prize_id: selectedPrize.id,
            prize_name: selectedPrize.name,
            prize_type: selectedPrize.type,
            prize_value: selectedPrize.value,
            coupon_code: coupon?.code,
            coupon_expires: coupon?.expires_at,
            next_allowed_at: nextAllowedAt.toISOString(),
            requestId
          }),
          ip_address: clientIp,
          user_agent: userAgent
        }
      })

      return { spin, coupon }
    })
    
    // Structured logging for successful spin
    logger.info({
      userId,
      action: 'wheel_spin_completed',
      entityType: 'WheelSpin',
      entityId: result.spin.id.toString(),
      ip: clientIp,
      details: {
        prizeName: selectedPrize.name,
        prizeType: selectedPrize.type,
        hasCoupon: !!result.coupon,
        requestId
      }
    })

    return NextResponse.json({
      success: true,
      prize: {
        id: selectedPrize.id,
        name: selectedPrize.name,
        description: selectedPrize.description,
        type: selectedPrize.type,
        value: selectedPrize.value,
        color: selectedPrize.color,
        icon: selectedPrize.icon
      },
      coupon: result.coupon ? {
        code: result.coupon.code,
        expiresAt: result.coupon.expires_at
      } : null,
      nextSpinDate: nextAllowedAt,
      message: `Вітаємо! Ви виграли: ${selectedPrize.name}`
    })

  } catch (error: any) {
    console.error('Wheel spin error:', error)
    
    // Log error
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.id) {
        await prisma.auditLog.create({
          data: {
            user_id: session.user.id,
            action: 'wheel_spin_error',
            entity_type: 'WheelSpin',
            details: JSON.stringify({
              error: error.message,
              stack: error.stack
            }),
            ip_address: req.headers.get('x-forwarded-for') || 'unknown'
          }
        })
      }
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Помилка обертання колеса. Спробуйте пізніше.'
      },
      { status: 500 }
    )
  }
}