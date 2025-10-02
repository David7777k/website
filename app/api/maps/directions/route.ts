import { NextRequest, NextResponse } from 'next/server'
import { GoogleMapsAPI } from '@/lib/maps'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const origin = searchParams.get('origin')
    const mode = searchParams.get('mode') as 'driving' | 'walking' | 'transit' | 'bicycling' || 'driving'

    if (!origin) {
      return NextResponse.json({ error: 'Origin parameter is required' }, { status: 400 })
    }

    const directions = await GoogleMapsAPI.getDirectionsToPanda(origin)
    
    // Simplify response for frontend
    const route = directions.routes[0]
    if (!route) {
      return NextResponse.json({ error: 'No route found' }, { status: 404 })
    }

    const leg = route.legs[0]
    const response = {
      distance: leg.distance,
      duration: leg.duration,
      start_address: leg.start_address,
      end_address: leg.end_address,
      steps: leg.steps.slice(0, 10), // Limit steps for mobile
      google_maps_url: GoogleMapsAPI.generateDirectionsUrl(origin)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Directions API error:', error)
    return NextResponse.json({ 
      error: 'Failed to get directions' 
    }, { status: 500 })
  }
}