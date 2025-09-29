import { NextRequest, NextResponse } from 'next/server'
import { QRCodeGenerator } from '@/lib/qr'

export async function POST(request: NextRequest) {
  try {
    const { type, data, options = {} } = await request.json()

    if (!type || !data) {
      return NextResponse.json({ 
        error: 'Type and data parameters are required' 
      }, { status: 400 })
    }

    let qrCodeDataURL: string

    switch (type) {
      case 'visit':
        qrCodeDataURL = await QRCodeGenerator.generateVisitQR(data.visitCode)
        break
        
      case 'promo':
        qrCodeDataURL = await QRCodeGenerator.generatePromoQR(data.promoCode)
        break
        
      case 'referral':
        qrCodeDataURL = await QRCodeGenerator.generateReferralQR(data.referralCode)
        break
        
      case 'tip':
        qrCodeDataURL = await QRCodeGenerator.generateTipQR(data.staffId, data.amount)
        break
        
      case 'custom':
        qrCodeDataURL = await QRCodeGenerator.generateDataURL(data.text, options)
        break
        
      default:
        return NextResponse.json({ 
          error: 'Invalid QR code type. Supported types: visit, promo, referral, tip, custom' 
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      type,
      qrCode: qrCodeDataURL
    })

  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate QR code' 
    }, { status: 500 })
  }
}