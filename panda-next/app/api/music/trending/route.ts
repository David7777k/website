import { NextRequest, NextResponse } from 'next/server'
import { SpotifyAPI } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const tracks = await SpotifyAPI.getTrendingTracks(limit)

    return NextResponse.json({
      tracks,
      total: tracks.length,
      message: 'Trending tracks from Spotify'
    })

  } catch (error) {
    console.error('Trending music error:', error)
    return NextResponse.json({ 
      error: 'Failed to get trending music',
      tracks: []
    }, { status: 500 })
  }
}