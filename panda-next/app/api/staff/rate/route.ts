import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { visitId, staffId, serviceRating, friendlinessRating, tipAmount } = body

    if (!visitId || !staffId || !serviceRating || !friendlinessRating) {
      return NextResponse.json({ 
        error: 'Visit ID, staff ID, and ratings are required' 
      }, { status: 400 })
    }

    // Validate ratings
    if (serviceRating < 1 || serviceRating > 5 || friendlinessRating < 1 || friendlinessRating > 5) {
      return NextResponse.json({ 
        error: 'Ratings must be between 1 and 5' 
      }, { status: 400 })
    }

    const avgRating = (serviceRating + friendlinessRating) / 2

    // Mock implementation - replace with real database update
    console.log(`Rating staff ${staffId}: service=${serviceRating}, friendliness=${friendlinessRating}, tip=${tipAmount || 0}`)

    // If high rating and tip, add bonus from establishment
    let establishmentBonus = 0
    if (avgRating >= 4 && tipAmount && tipAmount > 0) {
      establishmentBonus = Math.floor(tipAmount * 0.1) // 10% bonus
    }

    return NextResponse.json({ 
      success: true,
      message: 'Rating submitted successfully',
      tipAmount: tipAmount || 0,
      establishmentBonus,
      totalTip: (tipAmount || 0) + establishmentBonus
    })
  } catch (error) {
    console.error('Error rating staff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}