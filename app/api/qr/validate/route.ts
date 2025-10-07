import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-system'
import { QRSystem } from '@/lib/qr-system'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/qr/validate
 * Validate a QR code (Staff/Admin only)
 * 
 * Body:
 * - token: string (the QR code token to validate)
 * 
 * Returns:
 * - valid: boolean
 * - payload: QR payload if valid
 * - user: User info if valid
 * - error: Error message if invalid
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate validator
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const validatorId = session.user.id
    const validatorRole = session.user.role

    // Check if validator is staff or admin
    if (validatorRole !== 'staff' && validatorRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only staff and admin can validate QR codes' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { token } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Validate QR code
    const result = await QRSystem.validateQR(token, validatorId, validatorRole)

    if (!result.valid) {
      // Return validation error
      return NextResponse.json({
        valid: false,
        error: result.error,
        message: getErrorMessage(result.error || 'UNKNOWN_ERROR')
      }, { status: 400 })
    }

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: result.payload!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
        visits: {
          where: { status: 'confirmed' },
          take: 1,
          orderBy: { confirmed_at: 'desc' }
        },
        _count: {
          select: {
            visits: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        valid: false,
        error: 'USER_NOT_FOUND',
        message: 'User associated with QR code not found'
      }, { status: 404 })
    }

    // If it's a visit QR, create visit record
    if (result.payload!.type === 'visit') {
      // Generate unique visit code
      const visitCode = `V${Date.now().toString(36).toUpperCase()}`
      
      await prisma.visit.create({
        data: {
          user_id: user.id,
          visit_code: visitCode,
          status: 'confirmed',
          staff_name: session.user?.name || 'Staff',
          confirmed_at: new Date(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      })
    }

    // Success response
    return NextResponse.json({
      valid: true,
      payload: result.payload,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        totalVisits: user._count.visits,
        lastVisit: user.visits[0]?.confirmed_at || null
      },
      message: getSuccessMessage(result.payload!.type),
      event_id: result.event_id
    })

  } catch (error: any) {
    console.error('[QR Validate] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to validate QR code' },
      { status: 500 }
    )
  }
}

/**
 * Get user-friendly error messages
 */
function getErrorMessage(errorCode: string): string {
  const messages: Record<string, string> = {
    'INVALID_FORMAT': 'QR код має невірний формат',
    'INVALID_SIGNATURE': 'QR код підроблено або пошкоджено',
    'EXPIRED': 'QR код прострочений',
    'ALREADY_USED': 'QR код вже використано',
    'REPLAY_ATTACK': 'Спроба повторного використання QR коду',
    'INSUFFICIENT_PERMISSIONS': 'Недостатньо прав для валідації цього типу QR коду',
    'VALIDATION_ERROR': 'Помилка валідації QR коду',
    'USER_NOT_FOUND': 'Користувач не знайдений'
  }

  return messages[errorCode] || 'Невідома помилка валідації'
}

/**
 * Get success messages by QR type
 */
function getSuccessMessage(type: string): string {
  const messages: Record<string, string> = {
    'visit': '✅ Візит підтверджено',
    'promo': '✅ Промокод активовано',
    'referral': '✅ Реферал підтверджено',
    'staff_check': '✅ Перевірка персоналу пройдена'
  }

  return messages[type] || '✅ QR код валідовано'
}
