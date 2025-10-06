import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-system'
import { QRSystem } from '@/lib/qr-system'

/**
 * GET /api/qr/stats
 * Get QR validation statistics
 * 
 * Query params:
 * - userId?: string (filter by user, optional)
 * - validatorId?: string (filter by validator, optional)
 * - startDate?: ISO date string
 * - endDate?: ISO date string
 * 
 * Requires: Staff or Admin role
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const role = session.user.role
    const userId = session.user.id

    // Check permissions
    if (role !== 'staff' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Only staff and admin can view QR statistics' },
        { status: 403 }
      )
    }

    // Parse query params
    const searchParams = req.nextUrl.searchParams
    const filters: any = {}

    // Admin can see all, staff can only see their own validations
    if (role === 'staff') {
      filters.validatorId = userId
    } else if (searchParams.get('validatorId')) {
      filters.validatorId = searchParams.get('validatorId')!
    }

    if (searchParams.get('userId')) {
      filters.userId = searchParams.get('userId')!
    }

    if (searchParams.get('startDate')) {
      filters.startDate = new Date(searchParams.get('startDate')!)
    }

    if (searchParams.get('endDate')) {
      filters.endDate = new Date(searchParams.get('endDate')!)
    }

    // Get statistics
    const stats = await QRSystem.getValidationStats(filters)

    // Get recent validations (limit based on role)
    const limit = role === 'admin' ? 100 : 50
    const recentValidations = await QRSystem.getRecentValidations(limit)

    return NextResponse.json({
      success: true,
      stats,
      recent: recentValidations.map(v => ({
        id: v.id,
        type: v.qr_type,
        subject: v.qr_subject,
        success: v.success,
        error: v.error_message,
        validated_at: v.validated_at,
        user: {
          id: v.user.id,
          name: v.user.name,
          email: v.user.email
        },
        validator: {
          id: v.validator.id,
          name: v.validator.name,
          role: v.validator.role
        }
      }))
    })

  } catch (error: any) {
    console.error('[QR Stats] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get QR statistics' },
      { status: 500 }
    )
  }
}
