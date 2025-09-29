'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface SpotifyTrack {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  preview_url: string | null
  image: string
  spotify_url: string
  popularity: number
}

interface MusicOrder {
  id: number
  title: string
  artist: string
  orderedBy: string
  timeLeft: string
  status: 'playing' | 'queued' | 'pending'
}

export default function MusicPage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([])
  const [trendingTracks, setTrendingTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null)
  const [orderAmount, setOrderAmount] = useState(50)

  // Mock current queue
  const currentQueue: MusicOrder[] = [
    { id: 1, title: "Shape of You", artist: "Ed Sheeran", orderedBy: "Анна К.", timeLeft: "02:45", status: 'playing' },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd", orderedBy: "Максим П.", timeLeft: "05:20", status: 'queued' },
    { id: 3, title: "Watermelon Sugar", artist: "Harry Styles", orderedBy: "Вікторія С.", timeLeft: "08:35", status: 'queued' }
  ]

  useEffect(() => {
    fetchTrendingTracks()
  }, [])

  const fetchTrendingTracks = async () => {
    try {
      const response = await fetch('/api/music/trending')
      if (response.ok) {
        const data = await response.json()
        setTrendingTracks(data.tracks)
      }
    } catch (error) {
      console.error('Error fetching trending tracks:', error)
    }
  }

  const searchTracks = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return

    setLoading(true)
    try {
      const response = await fetch(`/api/music/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.tracks)
      }
    } catch (error) {
      console.error('Error searching tracks:', error)
    } finally {
      setLoading(false)
    }
  }

  const orderTrack = async (track: SpotifyTrack) => {
    if (!session) {
      alert('Потрібно увійти в систему для замовлення музики')
      return
    }

    try {
      const response = await fetch('/api/music/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          track_id: track.id,
          title: track.title,
          artist: track.artist,
          amount: orderAmount,
          spotify_url: track.spotify_url
        })
      })

      if (response.ok) {
        alert(`Трек "${track.title}" замовлено за ${orderAmount}₴!`)
        setSelectedTrack(null)
      } else {
        alert('Помилка при замовленні треку')
      }
    } catch (error) {
      console.error('Error ordering track:', error)
      alert('Помилка при замовленні треку')
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white">
          🎵 Джукбокс
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Замовляй свою улюблену музику через Spotify та створюй атмосферу
        </p>
      </div>

      {/* Music Search */}
      <section className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span>🔍</span> Пошук музики
        </h2>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchTracks()}
            placeholder="Назва треку або виконавець..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400"
          />
          <button
            onClick={searchTracks}
            disabled={loading || searchQuery.length < 2}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '🔄' : '🔍'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="grid gap-3">
            <h3 className="text-lg font-semibold text-white">Результати пошуку:</h3>
            {searchResults.map((track) => (
              <div key={track.id} className="bg-gray-700 rounded-xl p-4 flex items-center gap-4">
                {track.image && (
                  <img 
                    src={track.image} 
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-white font-medium">{track.title}</h4>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                  <p className="text-gray-500 text-xs">{formatDuration(track.duration)} • Популярність: {track.popularity}/100</p>
                </div>
                {track.preview_url && (
                  <audio controls className="w-32">
                    <source src={track.preview_url} type="audio/mpeg" />
                  </audio>
                )}
                <button
                  onClick={() => setSelectedTrack(track)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Замовити
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Current Playing + Queue */}
      <section className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span>🎶</span> Зараз грає
        </h2>
        
        <div className="bg-green-600 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl animate-pulse">
              🎵
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Perfect</h3>
              <p className="text-white/80">Ed Sheeran</p>
              <p className="text-sm text-white/60">Замовив: Дмитро К.</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">01:23</div>
              <div className="text-xs text-white/60">залишилось</div>
            </div>
          </div>
        </div>

        {/* Queue */}
        {currentQueue.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-400">Далі в черзі:</h3>
            {currentQueue.map((track, index) => (
              <div key={track.id} className="bg-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold text-gray-300">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{track.title}</h4>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                    <p className="text-xs text-gray-500">Замовив: {track.orderedBy}</p>
                  </div>
                  <div className="text-sm text-green-400 font-medium">
                    через {track.timeLeft}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trending Tracks */}
      {trendingTracks.length > 0 && (
        <section className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span>🔥</span> Популярні треки зараз
          </h2>
          
          <div className="grid gap-3">
            {trendingTracks.slice(0, 6).map((track) => (
              <div key={track.id} className="bg-gray-700 rounded-xl p-4 flex items-center gap-4">
                {track.image && (
                  <img 
                    src={track.image} 
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-white font-medium">{track.title}</h4>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-green-600 px-2 py-1 rounded-full text-white">
                      Популярність: {track.popularity}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                </div>
                {track.preview_url && (
                  <audio controls className="w-32">
                    <source src={track.preview_url} type="audio/mpeg" />
                  </audio>
                )}
                <button
                  onClick={() => setSelectedTrack(track)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Замовити
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Order Modal */}
      {selectedTrack && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Замовити трек</h3>
              <button
                onClick={() => setSelectedTrack(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              {selectedTrack.image && (
                <img 
                  src={selectedTrack.image} 
                  alt={selectedTrack.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h4 className="text-white font-medium">{selectedTrack.title}</h4>
                <p className="text-gray-400">{selectedTrack.artist}</p>
                <p className="text-gray-500 text-sm">{formatDuration(selectedTrack.duration)}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Сума замовлення:</label>
              <select
                value={orderAmount}
                onChange={(e) => setOrderAmount(parseInt(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value={50}>50₴ - Стандарт</option>
                <option value={100}>100₴ - Пріоритет</option>
                <option value={150}>150₴ - VIP</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTrack(null)}
                className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Скасувати
              </button>
              <button
                onClick={() => orderTrack(selectedTrack)}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Замовити за {orderAmount}₴
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music Rules */}
      <section className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span>📋</span> Правила джукбоксу
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-400 mb-3">✅ Дозволено:</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Популярна музика (українська, англійська)</li>
              <li>• Хіти, класика, сучасні треки</li>
              <li>• Треки довжиною до 6 хвилин</li>
              <li>• Один трек на 10 хвилин на людину</li>
              <li>• Музика з Spotify каталогу</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-red-400 mb-3">❌ Заборонено:</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Російська музика та пропаганда</li>
              <li>• Неетичний, образливий контент</li>
              <li>• Надто голосна або агресивна музика</li>
              <li>• Реклама або підкасти</li>
              <li>• Треки довше 6 хвилин</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-600/10 border border-green-600/20 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎧</span>
            <div>
              <h4 className="text-green-400 font-semibold">Музика через Spotify</h4>
              <p className="text-gray-300 text-sm">
                Всі треки завантажуються з офіційного каталогу Spotify з високою якістю звуку
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}