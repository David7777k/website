import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-system'
import { QRSystem } from '@/lib/qr-system'
import QRCode from 'qrcode'

/**
 * POST /api/qr/generate
 * Generate a signed QR code for authenticated user
 * 
 * Body:
 * - type: 'visit' | 'promo' | 'referral' | 'staff_check'
 * - subject?: string (optional custom description)
 * - ttlMinutes?: number (optional, defaults to env or 60)
 * 
 * Returns:
 * - token: signed QR payload
 * - qrCodeDataUrl: base64 image data URL
 * - expiresAt: ISO timestamp
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await req.json()
    const { type, subject, ttlMinutes } = body

    // Validate type
    const validTypes = ['visit', 'promo', 'referral', 'staff_check']
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid QR type. Must be one of: visit, promo, referral, staff_check' },
        { status: 400 }
      )
    }

    // Check permissions (only admins can generate staff_check QRs)
    if (type === 'staff_check' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can generate staff check QR codes' },
        { status: 403 }
      )
    }

    // Generate QR token
    const token = await QRSystem.generateQR({
      subject: subject || `${type} QR code`,
      type,
      userId,
      ttlMinutes
    })

    // Parse expiration from token
    const [payloadBase64] = token.split('.')
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString())
    const expiresAt = new Date(payload.exp * 1000).toISOString()

    // Generate QR code image
    const qrCodeDataUrl = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2,
      color: {
        dark: '#10B981',  // PANDA green
        light: '#1F2937'  // Dark background
      }
    })

    return NextResponse.json({
      success: true,
      token,
      qrCodeDataUrl,
      expiresAt,
      type
    })

  } catch (error: any) {
    console.error('[QR Generate] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/qr/generate?type=visit
 * Quick generate for specific type (no body needed)
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const type = searchParams.get('type') || 'visit'

  // Forward to POST with default params
  return POST(
    new NextRequest(req.url, {
      method: 'POST',
      body: JSON.stringify({ type })
    })
  )
}