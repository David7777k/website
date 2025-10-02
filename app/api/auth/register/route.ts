import { NextRequest, NextResponse } from 'next/server'
import { AuthSystem } from '@/lib/auth-system'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, birthdate } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: 'Ім\'я, email та пароль є обов\'язковими полями' 
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Пароль має бути не менше 6 символів' 
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Невірний формат email' 
      }, { status: 400 })
    }

    try {
      const user = await AuthSystem.createUser({
        name,
        email,
        password,
        phone: phone || undefined,
        birthdate: birthdate ? new Date(birthdate) : undefined,
        role: 'guest'
      })

      // Generate referral code for new user
      const referralCode = await AuthSystem.generateReferralCode(user.id)

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          referral_code: referralCode
        }
      }, { status: 201 })

    } catch (error: any) {
      if (error.message === 'USER_ALREADY_EXISTS') {
        return NextResponse.json({ 
          error: 'Користувач з таким email вже існує' 
        }, { status: 409 })
      }
      throw error
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      error: 'Внутрішня помилка сервера' 
    }, { status: 500 })
  }
}