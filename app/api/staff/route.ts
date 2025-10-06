import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint is public - no auth required for viewing staff
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      where: {
        is_active: true
      },
      select: {
        id: true,
        name: true,
        photo_url: true,
        instagram: true,
        card_number: true,
        average_service: true,
        average_personality: true,
        is_active: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ 
      success: true,
      staff 
    })
  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff' },
      { status: 500 }
    )
  }
}
