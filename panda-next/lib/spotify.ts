// Spotify API integration for PANDA hookah bar jukebox
// Using Client Credentials Flow for public track search (no user auth required)

export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  duration_ms: number
  preview_url: string | null
  external_urls: {
    spotify: string
  }
  uri: string
  popularity: number
}

export interface SpotifySearchResult {
  tracks: {
    href: string
    items: SpotifyTrack[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
  }
}

export class SpotifyAPI {
  private static clientId = process.env.SPOTIFY_CLIENT_ID!
  private static clientSecret = process.env.SPOTIFY_CLIENT_SECRET!
  private static tokenCache: { token: string; expiresAt: number } | null = null

  private static async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token
    }

    // Get new token using Client Credentials flow
    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    })

    if (!response.ok) {
      throw new Error(`Spotify auth failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Cache token with expiration
    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000) - 60000 // Subtract 1 minute for safety
    }

    return data.access_token
  }

  static async searchTracks(
    query: string, 
    limit: number = 20,
    offset: number = 0
  ): Promise<SpotifySearchResult> {
    const token = await this.getAccessToken()
    
    const params = new URLSearchParams({
      q: query,
      type: 'track',
      limit: limit.toString(),
      offset: offset.toString(),
      market: 'UA' // Ukraine market
    })

    const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  static async getTrack(trackId: string): Promise<SpotifyTrack> {
    const token = await this.getAccessToken()
    
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}?market=UA`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Spotify track fetch failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  static async getPopularTracks(
    genre?: string,
    limit: number = 20
  ): Promise<SpotifyTrack[]> {
    let query = 'year:2020-2025' // Recent tracks
    
    if (genre) {
      query += ` genre:${genre}`
    }

    const result = await this.searchTracks(query, limit)
    return result.tracks.items.sort((a, b) => b.popularity - a.popularity)
  }

  // Helper methods for our jukebox
  static formatTrackForJukebox(track: SpotifyTrack) {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      duration: Math.floor(track.duration_ms / 1000),
      preview_url: track.preview_url,
      image: track.album.images[1]?.url || track.album.images[0]?.url,
      spotify_url: track.external_urls.spotify,
      uri: track.uri,
      popularity: track.popularity
    }
  }

  static async searchForJukebox(query: string, limit: number = 10) {
    try {
      const result = await this.searchTracks(query, limit)
      return result.tracks.items
        .filter(track => track.preview_url) // Only tracks with preview
        .map(track => this.formatTrackForJukebox(track))
    } catch (error) {
      console.error('Spotify search error:', error)
      throw new Error('Failed to search tracks')
    }
  }

  static async getTrendingTracks(limit: number = 20) {
    try {
      // Try to get real data first
      const queries = [
        'year:2024-2025',
        'year:2023-2024 genre:pop',
        'year:2023-2024 genre:hip-hop'
      ]

      const results = await Promise.all(
        queries.map(query => this.searchTracks(query, Math.ceil(limit / queries.length)))
      )

      const allTracks = results.flatMap(result => result.tracks.items)
      
      if (allTracks.length > 0) {
        // Sort by popularity and remove duplicates
        const uniqueTracks = allTracks
          .filter((track, index, self) => 
            self.findIndex(t => t.id === track.id) === index
          )
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, limit)
          .filter(track => track.preview_url)

        return uniqueTracks.map(track => this.formatTrackForJukebox(track))
      } else {
        // Fallback to mock data for demo
        return this.getMockTrendingTracks(limit)
      }
    } catch (error) {
      console.error('Trending tracks error, using mock data:', error)
      return this.getMockTrendingTracks(limit)
    }
  }

  // Mock data for demo when Spotify API is not available
  private static getMockTrendingTracks(limit: number = 20) {
    const mockTracks = [
      {
        id: 'mock-1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: 200,
        preview_url: null,
        image: '/api/placeholder/300/300',
        spotify_url: 'https://open.spotify.com/track/0VjIjW4GlULA5V0x2YFcZL',
        uri: 'spotify:track:0VjIjW4GlULA5V0x2YFcZL',
        popularity: 95
      },
      {
        id: 'mock-2',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷ (Divide)',
        duration: 233,
        preview_url: null,
        image: '/api/placeholder/300/300',
        spotify_url: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3',
        uri: 'spotify:track:7qiZfU4dY1lWllzX7mPBI3',
        popularity: 94
      },
      {
        id: 'mock-3',
        title: 'Watermelon Sugar',
        artist: 'Harry Styles',
        album: 'Fine Line',
        duration: 174,
        preview_url: null,
        image: '/api/placeholder/300/300',
        spotify_url: 'https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY',
        uri: 'spotify:track:6UelLqGlWMcVH1E5c4H7lY',
        popularity: 92
      },
      {
        id: 'mock-4',
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        duration: 203,
        preview_url: null,
        image: '/api/placeholder/300/300',
        spotify_url: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
        uri: 'spotify:track:463CkQjx2Zk1yXoBuierM9',
        popularity: 91
      },
      {
        id: 'mock-5',
        title: 'Good 4 U',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        duration: 178,
        preview_url: null,
        image: '/api/placeholder/300/300',
        spotify_url: 'https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG',
        uri: 'spotify:track:4ZtFanR9U6ndgddUvNcjcG',
        popularity: 90
      },
      {
        id: 'mock-6',
        title: 'Stay',
        artist: 'The Kid LAROI, Justin Bieber',
        album: 'F*CK LOVE 3: OVER YOU',
        duration: 141,
        preview_url: null,
        image: '/api/placeholder/300/300',
        spotify_url: 'https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20',
        uri: 'spotify:track:5HCyWlXZPP0y6Gqq8TgA20',
        popularity: 89
      }
    ]

    return mockTracks.slice(0, limit)
  }
}