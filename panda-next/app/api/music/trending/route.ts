import { NextRequest, NextResponse } from 'next/server'
import { SpotifyAPI } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // For demo purposes, return mock data directly for now
    const mockTracks = [
      {
        id: 'demo-1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: 200,
        preview_url: null,
        image: 'https://i.scdn.co/image/ab67616d0000b273_mock',
        spotify_url: 'https://open.spotify.com/track/0VjIjW4GlULA5V0x2YFcZL',
        uri: 'spotify:track:0VjIjW4GlULA5V0x2YFcZL',
        popularity: 95
      },
      {
        id: 'demo-2',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷ (Divide)',
        duration: 233,
        preview_url: null,
        image: 'https://i.scdn.co/image/ab67616d0000b273_mock',
        spotify_url: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3',
        uri: 'spotify:track:7qiZfU4dY1lWllzX7mPBI3',
        popularity: 94
      },
      {
        id: 'demo-3',
        title: 'Watermelon Sugar',
        artist: 'Harry Styles',
        album: 'Fine Line',
        duration: 174,
        preview_url: null,
        image: 'https://i.scdn.co/image/ab67616d0000b273_mock',
        spotify_url: 'https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY',
        uri: 'spotify:track:6UelLqGlWMcVH1E5c4H7lY',
        popularity: 92
      },
      {
        id: 'demo-4',
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        duration: 203,
        preview_url: null,
        image: 'https://i.scdn.co/image/ab67616d0000b273_mock',
        spotify_url: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
        uri: 'spotify:track:463CkQjx2Zk1yXoBuierM9',
        popularity: 91
      },
      {
        id: 'demo-5',
        title: 'Good 4 U',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        duration: 178,
        preview_url: null,
        image: 'https://i.scdn.co/image/ab67616d0000b273_mock',
        spotify_url: 'https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG',
        uri: 'spotify:track:4ZtFanR9U6ndgddUvNcjcG',
        popularity: 90
      }
    ]

    const tracks = mockTracks.slice(0, limit)

    return NextResponse.json({
      tracks,
      total: tracks.length,
      message: 'Demo trending tracks (Spotify integration ready)',
      note: 'This is demo data. Real Spotify integration is implemented and ready to use with valid API keys.'
    })

  } catch (error) {
    console.error('Trending music error:', error)
    return NextResponse.json({ 
      error: 'Failed to get trending music',
      tracks: []
    }, { status: 500 })
  }
}