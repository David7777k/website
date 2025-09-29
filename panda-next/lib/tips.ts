// Direct card transfer system for tips (no payment processing)
// Just provides card numbers and tracking

export interface StaffMember {
  id: number
  name: string
  card_number?: string
  instagram?: string
  photo_url?: string
  average_service?: number
  average_personality?: number
  tips_total?: number
}

export interface TipRecord {
  id: number
  staff_id: number
  amount: number
  message?: string
  created_at: Date
  user_id?: string
}

export class TipsManager {
  // Format card number for display (mask middle digits)
  static formatCardNumber(cardNumber: string): string {
    if (!cardNumber) {
      return cardNumber
    }
    
    // Remove spaces and format
    const cleanNumber = cardNumber.replace(/\s/g, '')
    if (cleanNumber.length < 16) {
      return cardNumber
    }
    
    // Format: 5375 41** **** 7890
    return cleanNumber.replace(/(\d{4})(\d{2})\d{6}(\d{4})/, '$1 $2** **** $3')
  }

  // Validate card number (basic Luhn algorithm)
  static isValidCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '')
    
    if (!/^\d{16}$/.test(cleanNumber)) {
      return false
    }

    // Luhn algorithm
    let sum = 0
    let isEven = false

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  // Generate tip link for sharing
  static generateTipLink(staffId: number, amount?: number): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const params = amount ? `?amount=${amount}` : ''
    return `${baseUrl}/tip/${staffId}${params}`
  }

  // Common tip amounts
  static readonly SUGGESTED_AMOUNTS = [50, 100, 150, 200, 300, 500]

  // Tip messages templates
  static readonly TIP_MESSAGES = [
    "Дякую за чудовий сервіс! 🙏",
    "Кальян був ідеальний! 💨",
    "Дуже привітний персонал ❤️",
    "Чудова атмосфера! 🔥",
    "Обов'язково повернуся! ⭐",
    "Найкращий кальянщик! 👑"
  ]

  // Get tips statistics for staff member
  static calculateTipsStats(tips: TipRecord[]) {
    if (tips.length === 0) {
      return {
        total: 0,
        count: 0,
        average: 0,
        thisMonth: 0,
        thisWeek: 0
      }
    }

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const total = tips.reduce((sum, tip) => sum + tip.amount, 0)
    const thisMonth = tips
      .filter(tip => new Date(tip.created_at) >= monthStart)
      .reduce((sum, tip) => sum + tip.amount, 0)
    const thisWeek = tips
      .filter(tip => new Date(tip.created_at) >= weekStart)
      .reduce((sum, tip) => sum + tip.amount, 0)

    return {
      total,
      count: tips.length,
      average: Math.round(total / tips.length),
      thisMonth,
      thisWeek
    }
  }

  // Generate thank you message
  static generateThankYouMessage(
    staffName: string, 
    amount: number,
    customMessage?: string
  ): string {
    const baseMessage = `Дякуємо за чайові ${amount}₴ для ${staffName}! 💚`
    
    if (customMessage) {
      return `${baseMessage}\n\n"${customMessage}"`
    }

    const randomMessage = this.TIP_MESSAGES[Math.floor(Math.random() * this.TIP_MESSAGES.length)]
    return `${baseMessage}\n\n${randomMessage}`
  }

  // Popular tip amounts analysis
  static analyzeTipAmounts(tips: TipRecord[]) {
    const amounts = tips.map(tip => tip.amount)
    const amountCounts = amounts.reduce((acc, amount) => {
      acc[amount] = (acc[amount] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const sortedAmounts = Object.entries(amountCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([amount, count]) => ({
        amount: parseInt(amount),
        count,
        percentage: Math.round((count / tips.length) * 100)
      }))

    return sortedAmounts
  }

  // Bank-specific formatting
  static getBankInfo(cardNumber: string) {
    const cleanNumber = cardNumber.replace(/\s/g, '')
    const firstDigit = cleanNumber[0]
    const firstFour = cleanNumber.slice(0, 4)

    // Ukrainian banks detection
    if (firstFour.startsWith('5375')) {
      return { bank: 'ПриватБанк', color: '#00A651', logo: '💳' }
    }
    if (firstFour.startsWith('4149') || firstFour.startsWith('4627')) {
      return { bank: 'Монобанк', color: '#000000', logo: '⚫' }
    }
    if (firstDigit === '4') {
      return { bank: 'Visa', color: '#1A1F71', logo: '💳' }
    }
    if (firstDigit === '5') {
      return { bank: 'Mastercard', color: '#EB001B', logo: '💳' }
    }
    
    return { bank: 'Банківська карта', color: '#6B7280', logo: '💳' }
  }

  // Generate copy text for manual transfer
  static generateCopyText(staffMember: StaffMember, amount: number): string {
    const bankInfo = this.getBankInfo(staffMember.card_number || '')
    
    return `Чайові для ${staffMember.name}
Сума: ${amount}₴
Карта: ${staffMember.card_number}
Банк: ${bankInfo.bank}

Дякуємо! 🐼💚`
  }
}