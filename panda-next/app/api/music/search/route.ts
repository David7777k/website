import { NextRequest, NextResponse } from 'next/server'
import { SpotifyAPI } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    if (query.length < 2) {
      return NextResponse.json({ 
        tracks: [],
        message: 'Query too short' 
      })
    }

    const tracks = await SpotifyAPI.searchForJukebox(query, limit)

    return NextResponse.json({
      tracks,
      query,
      total: tracks.length
    })

  } catch (error) {
    console.error('Music search error:', error)
    return NextResponse.json({ 
      error: 'Failed to search music',
      tracks: []
    }, { status: 500 })
  }
}