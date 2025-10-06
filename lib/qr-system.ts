// QR Code Security System for PANDA Lounge
// Provides signed QR codes with TTL, nonce, and anti-replay protection

import { createHmac, randomBytes } from 'crypto'
import { prisma } from './prisma'

export type QRPayloadType = 'visit' | 'promo' | 'referral' | 'staff_check'

export interface QRPayload {
  sub: string              // Subject (purpose)
  type: QRPayloadType      // QR type
  userId: string           // User ID
  nonce: string            // Unique identifier
  exp: number              // Expiration timestamp (Unix)
  iat: number              // Issued at timestamp (Unix)
}

export interface QRValidationResult {
  valid: boolean
  payload?: QRPayload
  error?: string
  event_id?: string
}

export class QRSystem {
  private static readonly SECRET = process.env.QR_SECRET || 'fallback-secret-key'
  private static readonly TTL_MINUTES = parseInt(process.env.QR_TTL_MINUTES || '60')
  
  /**
   * Generate a signed QR code payload
   */
  static async generateQR(data: {
    subject: string
    type: QRPayloadType
    userId: string
    ttlMinutes?: number
  }): Promise<string> {
    const { subject, type, userId, ttlMinutes = this.TTL_MINUTES } = data
    
    // Create payload
    const now = Math.floor(Date.now() / 1000)
    const payload: QRPayload = {
      sub: subject,
      type,
      userId,
      nonce: randomBytes(16).toString('hex'),
      iat: now,
      exp: now + (ttlMinutes * 60)
    }
    
    // Serialize payload
    const payloadString = JSON.stringify(payload)
    const payloadBase64 = Buffer.from(payloadString).toString('base64url')
    
    // Generate HMAC-SHA256 signature
    const signature = this.sign(payloadBase64)
    
    // Return signed token: payload.signature
    return `${payloadBase64}.${signature}`
  }
  
  /**
   * Validate and parse a QR code
   */
  static async validateQR(
    token: string,
    validatorId: string,
    validatorRole: string
  ): Promise<QRValidationResult> {
    try {
      // Parse token
      const parts = token.split('.')
      if (parts.length !== 2) {
        return { valid: false, error: 'INVALID_FORMAT' }
      }
      
      const [payloadBase64, signature] = parts
      
      // Verify signature
      const expectedSignature = this.sign(payloadBase64)
      if (signature !== expectedSignature) {
        return { valid: false, error: 'INVALID_SIGNATURE' }
      }
      
      // Decode payload
      const payloadString = Buffer.from(payloadBase64, 'base64url').toString()
      const payload: QRPayload = JSON.parse(payloadString)
      
      // Validate expiration
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp < now) {
        return { valid: false, error: 'EXPIRED', payload }
      }
      
      // Check for replay attack (nonce already used)
      const existingEvent = await prisma.qRValidationEvent.findFirst({
        where: { qr_nonce: payload.nonce }
      })
      
      if (existingEvent) {
        // Log replay attempt
        await this.logValidation({
          payload,
          validatorId,
          success: false,
          error: 'REPLAY_ATTACK'
        })
        
        return { valid: false, error: 'ALREADY_USED', payload }
      }
      
      // Check role permissions
      if (!this.canValidateQRType(validatorRole, payload.type)) {
        return { valid: false, error: 'INSUFFICIENT_PERMISSIONS', payload }
      }
      
      // Log successful validation
      const event = await this.logValidation({
        payload,
        validatorId,
        success: true
      })
      
      return { 
        valid: true, 
        payload,
        event_id: event.id
      }
      
    } catch (error) {
      console.error('[QRSystem] Validation error:', error)
      return { valid: false, error: 'VALIDATION_ERROR' }
    }
  }
  
  /**
   * Generate HMAC-SHA256 signature
   */
  private static sign(data: string): string {
    return createHmac('sha256', this.SECRET)
      .update(data)
      .digest('base64url')
  }
  
  /**
   * Check if role can validate specific QR type
   */
  private static canValidateQRType(role: string, type: QRPayloadType): boolean {
    const permissions: Record<string, QRPayloadType[]> = {
      admin: ['visit', 'promo', 'referral', 'staff_check'],
      staff: ['visit', 'promo'],
      guest: []
    }
    
    const allowedTypes = permissions[role] || []
    return allowedTypes.includes(type)
  }
  
  /**
   * Log validation event to database
   */
  private static async logValidation(data: {
    payload: QRPayload
    validatorId: string
    success: boolean
    error?: string
  }): Promise<any> {
    const { payload, validatorId, success, error } = data
    
    return await prisma.qRValidationEvent.create({
      data: {
        qr_type: payload.type,
        qr_nonce: payload.nonce,
        qr_subject: payload.sub,
        qr_issued_at: new Date(payload.iat * 1000),
        qr_expires_at: new Date(payload.exp * 1000),
        user_id: payload.userId,
        validator_id: validatorId,
        validated_at: new Date(),
        success,
        error_message: error || null
      }
    })
  }
  
  /**
   * Generate QR code for user visit
   */
  static async generateVisitQR(userId: string): Promise<string> {
    return await this.generateQR({
      subject: 'Visit confirmation',
      type: 'visit',
      userId,
      ttlMinutes: 60 // 1 hour validity
    })
  }
  
  /**
   * Generate QR code for promo/coupon
   */
  static async generatePromoQR(userId: string, promoCode: string): Promise<string> {
    return await this.generateQR({
      subject: `Promo: ${promoCode}`,
      type: 'promo',
      userId,
      ttlMinutes: 1440 // 24 hours validity
    })
  }
  
  /**
   * Get validation statistics
   */
  static async getValidationStats(filters?: {
    userId?: string
    validatorId?: string
    startDate?: Date
    endDate?: Date
  }) {
    const where: any = {}
    
    if (filters?.userId) where.user_id = filters.userId
    if (filters?.validatorId) where.validator_id = filters.validatorId
    if (filters?.startDate || filters?.endDate) {
      where.validated_at = {}
      if (filters.startDate) where.validated_at.gte = filters.startDate
      if (filters.endDate) where.validated_at.lte = filters.endDate
    }
    
    const [total, successful, failed, byType] = await Promise.all([
      prisma.qRValidationEvent.count({ where }),
      prisma.qRValidationEvent.count({ where: { ...where, success: true } }),
      prisma.qRValidationEvent.count({ where: { ...where, success: false } }),
      prisma.qRValidationEvent.groupBy({
        by: ['qr_type'],
        where,
        _count: true
      })
    ])
    
    return {
      total,
      successful,
      failed,
      success_rate: total > 0 ? (successful / total * 100).toFixed(2) : '0',
      by_type: byType.map(item => ({
        type: item.qr_type,
        count: item._count
      }))
    }
  }
  
  /**
   * Get recent validation events
   */
  static async getRecentValidations(limit: number = 50) {
    return await prisma.qRValidationEvent.findMany({
      take: limit,
      orderBy: { validated_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        validator: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })
  }
}
