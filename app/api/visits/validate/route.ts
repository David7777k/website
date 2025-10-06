import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { qrCode } = body

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code is required' }, { status: 400 })
    }

    // Mock validation - replace with real database lookup
    const visitData = {
      id: 'visit_' + Date.now(),
      tableNumber: 12,
      timestamp: new Date().toISOString(),
      staffId: 'staff_1',
      staffName: 'Олександр',
      valid: true
    }

    return NextResponse.json(visitData)
  } catch (error) {
    console.error('Error validating visit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}