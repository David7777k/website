import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TipsManager } from '@/lib/tips'

// GET /api/tips/staff - получить всех сотрудников для чаевых
export async function GET(request: NextRequest) {
  try {
    const staff = await prisma.staff.findMany({
      where: { is_active: true },
      include: {
        tips: {
          select: {
            amount: true,
            created_at: true
          }
        },
        _count: {
          select: {
            tips: true,
            ratings: true
          }
        }
      },
      orderBy: [
        { average_service: 'desc' },
        { name: 'asc' }
      ]
    })

    const staffWithStats = staff.map(member => {
      const tipsStats = TipsManager.calculateTipsStats(member.tips)
      const bankInfo = member.card_number ? TipsManager.getBankInfo(member.card_number) : null
      
      return {
        id: member.id,
        name: member.name,
        instagram: member.instagram,
        photo_url: member.photo_url,
        card_number: member.card_number ? TipsManager.formatCardNumber(member.card_number) : null,
        card_number_full: member.card_number, // For copying
        bank_info: bankInfo,
        ratings: {
          service: member.average_service || 0,
          personality: member.average_personality || 0,
          count: member._count.ratings
        },
        tips: {
          ...tipsStats,
          recent: member.tips
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
        }
      }
    })

    return NextResponse.json({
      staff: staffWithStats,
      suggested_amounts: TipsManager.SUGGESTED_AMOUNTS,
      tip_messages: TipsManager.TIP_MESSAGES
    })

  } catch (error) {
    console.error('Error fetching staff for tips:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}