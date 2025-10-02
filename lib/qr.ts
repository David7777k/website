import QRCode from 'qrcode'

export interface QRCodeOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  type?: 'image/png' | 'image/jpeg' | 'image/webp'
  quality?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  width?: number
}

export class QRCodeGenerator {
  static async generateDataURL(
    text: string, 
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions = {
      errorCorrectionLevel: 'M' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    }

    const finalOptions = { ...defaultOptions, ...options }

    try {
      return await QRCode.toDataURL(text, finalOptions)
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`)
    }
  }

  static async generateBuffer(
    text: string, 
    options: QRCodeOptions = {}
  ): Promise<Buffer> {
    const defaultOptions = {
      errorCorrectionLevel: 'M' as const,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    }

    const finalOptions = { ...defaultOptions, ...options }

    try {
      return await QRCode.toBuffer(text, finalOptions)
    } catch (error) {
      throw new Error(`Failed to generate QR code buffer: ${error}`)
    }
  }

  // For visits
  static async generateVisitQR(visitCode: string): Promise<string> {
    const visitUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/visit/confirm/${visitCode}`
    return this.generateDataURL(visitUrl, {
      errorCorrectionLevel: 'H',
      color: {
        dark: '#10B981', // Bamboo green
        light: '#FFFFFF'
      },
      width: 300
    })
  }

  // For promo codes
  static async generatePromoQR(promoCode: string): Promise<string> {
    const promoData = JSON.stringify({
      type: 'promo',
      code: promoCode,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/promo/apply/${promoCode}`
    })
    
    return this.generateDataURL(promoData, {
      errorCorrectionLevel: 'H',
      color: {
        dark: '#8B5CF6', // Purple for promos
        light: '#FFFFFF'
      },
      width: 280
    })
  }

  // For referral codes
  static async generateReferralQR(referralCode: string): Promise<string> {
    const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/referral/${referralCode}`
    return this.generateDataURL(referralUrl, {
      errorCorrectionLevel: 'H',
      color: {
        dark: '#F59E0B', // Amber for referrals
        light: '#FFFFFF'
      },
      width: 280
    })
  }

  // For staff tips
  static async generateTipQR(staffId: number, amount?: number): Promise<string> {
    const tipData = JSON.stringify({
      type: 'tip',
      staffId,
      amount,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/tip/${staffId}${amount ? `?amount=${amount}` : ''}`
    })
    
    return this.generateDataURL(tipData, {
      errorCorrectionLevel: 'M',
      color: {
        dark: '#EF4444', // Red for tips
        light: '#FFFFFF'
      },
      width: 260
    })
  }
}