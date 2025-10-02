import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { visitId, tableNumber } = body

    if (!visitId) {
      return NextResponse.json({ error: 'Visit ID is required' }, { status: 400 })
    }

    // Mock confirmation - replace with real database update
    console.log(`Confirming visit ${visitId} at table ${tableNumber}`)

    return NextResponse.json({ 
      success: true,
      message: 'Visit confirmed successfully',
      bonusPoints: 50
    })
  } catch (error) {
    console.error('Error confirming visit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}