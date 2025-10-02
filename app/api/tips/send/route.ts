import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/lib/prisma'
import { TipsManager } from '@/lib/tips'

// POST /api/tips/send - записать чаевые в систему (не обрабатывать платеж)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { staff_id, amount, message, anonymous = false } = await request.json()

    if (!staff_id || !amount || amount <= 0) {
      return NextResponse.json({ 
        error: 'Staff ID and valid amount are required' 
      }, { status: 400 })
    }

    // Validate staff member exists
    const staff = await prisma.staff.findUnique({
      where: { id: staff_id, is_active: true }
    })

    if (!staff) {
      return NextResponse.json({ 
        error: 'Staff member not found' 
      }, { status: 404 })
    }

    // Get user if authenticated
    let user = null
    if (session?.user?.email && !anonymous) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
    }

    // Record the tip
    const tip = await prisma.tip.create({
      data: {
        staff_id,
        amount,
        message: message || null,
        user_id: user?.id || null
      }
    })

    // Update staff tips total
    await prisma.staff.update({
      where: { id: staff_id },
      data: {
        tips_total: {
          increment: amount
        }
      }
    })

    // Generate response with copy text and thank you message
    const copyText = TipsManager.generateCopyText(staff, amount)
    const thankYouMessage = TipsManager.generateThankYouMessage(
      staff.name, 
      amount, 
      message
    )

    return NextResponse.json({
      success: true,
      tip: {
        id: tip.id,
        amount,
        staff_name: staff.name,
        created_at: tip.created_at
      },
      transfer_info: {
        staff_name: staff.name,
        card_number: staff.card_number,
        formatted_card: TipsManager.formatCardNumber(staff.card_number || ''),
        bank_info: TipsManager.getBankInfo(staff.card_number || ''),
        amount,
        copy_text: copyText
      },
      thank_you_message: thankYouMessage
    }, { status: 201 })

  } catch (error) {
    console.error('Error recording tip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}