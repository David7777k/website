// Google Maps API integration for PANDA hookah bar

export interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  user_ratings_total?: number
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  formatted_phone_number?: string
  website?: string
  vicinity?: string
}

export interface DirectionsResult {
  routes: Array<{
    legs: Array<{
      distance: {
        text: string
        value: number
      }
      duration: {
        text: string
        value: number
      }
      start_address: string
      end_address: string
      steps: Array<{
        html_instructions: string
        distance: {
          text: string
          value: number
        }
        duration: {
          text: string
          value: number
        }
      }>
    }>
    overview_polyline: {
      points: string
    }
  }>
}

export class GoogleMapsAPI {
  private static apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

  // PANDA hookah bar coordinates (example - replace with actual)
  static readonly PANDA_LOCATION = {
    lat: 50.4501, // Kyiv coordinates - replace with actual
    lng: 30.5234,
    address: "вул. Хрещатик, 1, Київ, Україна", // Replace with actual address
    name: "PANDA Hookah Bar"
  }

  static async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'place_id,name,formatted_address,geometry,rating,user_ratings_total,photos,opening_hours,formatted_phone_number,website,vicinity',
      key: this.apiKey,
      language: 'uk'
    })

    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params}`)
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status}`)
    }

    return data.result
  }

  static async searchNearbyPlaces(
    lat: number,
    lng: number,
    radius: number = 1000,
    type: string = 'restaurant'
  ): Promise<PlaceDetails[]> {
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: radius.toString(),
      type,
      key: this.apiKey,
      language: 'uk'
    })

    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`)
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status}`)
    }

    return data.results
  }

  static async getDirections(
    origin: string,
    destination?: string,
    mode: 'driving' | 'walking' | 'transit' | 'bicycling' = 'driving'
  ): Promise<DirectionsResult> {
    const dest = destination || `${this.PANDA_LOCATION.lat},${this.PANDA_LOCATION.lng}`
    
    const params = new URLSearchParams({
      origin,
      destination: dest,
      mode,
      key: this.apiKey,
      language: 'uk'
    })

    const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?${params}`)
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status}`)
    }

    return data
  }

  static async geocodeAddress(address: string): Promise<{
    lat: number
    lng: number
    formatted_address: string
  }> {
    const params = new URLSearchParams({
      address,
      key: this.apiKey,
      language: 'uk'
    })

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'OK' || data.results.length === 0) {
      throw new Error(`Geocoding failed: ${data.status}`)
    }

    const result = data.results[0]
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formatted_address: result.formatted_address
    }
  }

  static getStaticMapUrl(
    lat: number,
    lng: number,
    zoom: number = 15,
    width: number = 400,
    height: number = 300,
    markers?: Array<{ lat: number; lng: number; label?: string }>
  ): string {
    const params = new URLSearchParams({
      center: `${lat},${lng}`,
      zoom: zoom.toString(),
      size: `${width}x${height}`,
      maptype: 'roadmap',
      key: this.apiKey
    })

    // Add markers
    if (markers && markers.length > 0) {
      const markerStrings = markers.map(marker => {
        const label = marker.label ? `label:${marker.label}|` : ''
        return `${label}${marker.lat},${marker.lng}`
      })
      params.append('markers', markerStrings.join('|'))
    } else {
      // Default marker at center
      params.append('markers', `color:red|${lat},${lng}`)
    }

    return `https://maps.googleapis.com/maps/api/staticmap?${params}`
  }

  // Helper methods for PANDA hookah bar
  static getDirectionsToPanda(userLocation: string) {
    return this.getDirections(userLocation)
  }

  static getPandaStaticMap(width: number = 400, height: number = 300) {
    return this.getStaticMapUrl(
      this.PANDA_LOCATION.lat,
      this.PANDA_LOCATION.lng,
      16,
      width,
      height,
      [{
        lat: this.PANDA_LOCATION.lat,
        lng: this.PANDA_LOCATION.lng,
        label: 'P'
      }]
    )
  }

  static async getNearbyCompetitors(radius: number = 2000) {
    return this.searchNearbyPlaces(
      this.PANDA_LOCATION.lat,
      this.PANDA_LOCATION.lng,
      radius,
      'night_club'
    )
  }

  static generateGoogleMapsUrl(
    lat?: number,
    lng?: number,
    query?: string
  ): string {
    const baseUrl = 'https://www.google.com/maps'
    
    if (lat && lng) {
      return `${baseUrl}/@${lat},${lng},16z`
    }
    
    if (query) {
      return `${baseUrl}/search/${encodeURIComponent(query)}`
    }
    
    // Default to PANDA location
    return `${baseUrl}/@${this.PANDA_LOCATION.lat},${this.PANDA_LOCATION.lng},16z`
  }

  static generateDirectionsUrl(origin: string): string {
    return `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(this.PANDA_LOCATION.address)}`
  }
}