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
        <h1 className="text-4xl md:text-6xl font-black gradient-text-bamboo">
          🎵 Джукбокс
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Замовляй свою улюблену музику та створюй атмосферу
        </p>
      </div>

      {/* Current Playing + Queue */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span>🎶</span> Зараз грає
        </h2>
        
        <div className="card pattern-bamboo">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-bamboo flex items-center justify-center text-2xl text-black animate-pulse">
              🎵
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Perfect</h3>
              <p className="text-text-secondary">Ed Sheeran</p>
              <p className="text-sm text-muted">Замовив: Дмитро К.</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bamboo">01:23</div>
              <div className="text-xs text-muted">залишилось</div>
            </div>
          </div>
        </div>

        {/* Queue */}
        {currentQueue.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted">Далі в черзі:</h3>
            {currentQueue.map((track, index) => (
              <div key={track.id} className="card">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-panel flex items-center justify-center text-sm font-bold text-muted">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{track.title}</h4>
                    <p className="text-sm text-text-secondary">{track.artist}</p>
                    <p className="text-xs text-muted">Замовив: {track.orderedBy}</p>
                  </div>
                  <div className="text-sm text-bamboo font-medium">
                    через {track.timeLeft}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Order Track Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span>🎤</span> Замовити трек
        </h2>

        <div className="card">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Назва треку або виконавець</label>
              <input 
                type="text"
                placeholder="Наприклад: Ed Sheeran - Perfect"
                className="w-full px-4 py-3 bg-panel border border-subtle rounded-xl focus:border-bamboo focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Додаткова інформація (необов'язково)</label>
              <textarea 
                placeholder="Особливі побажання щодо треку..."
                rows={3}
                className="w-full px-4 py-3 bg-panel border border-subtle rounded-xl focus:border-bamboo focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="glass-effect p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Вартість замовлення:</span>
                <span className="text-2xl font-bold text-bamboo">50₴</span>
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <p>• Максимальна довжина треку: 6 хвилин</p>
                <p>• Один трек на 10 хвилин на користувача</p>
                <p>• Заборонено: неетичний контент, реклама</p>
              </div>
            </div>

            <button className="btn btn-primary w-full text-lg py-4">
              Замовити за 50₴
            </button>
          </form>
        </div>
      </section>

      {/* Rules */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span>📋</span> Правила
        </h2>
        
        <div className="card">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-bamboo mb-2">✅ Дозволено:</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Популярна музика українською, англійською</li>
                <li>• Хіти, класика, сучасні треки</li>
                <li>• Треки довжиною до 6 хвилин</li>
                <li>• Один трек на 10 хвилин на людину</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-accent mb-2">❌ Заборонено:</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Російська музика та пропаганда</li>
                <li>• Неетичний, образливий контент</li>
                <li>• Надто голосна або агресивна музика</li>
                <li>• Реклама або підкасти</li>
                <li>• Треки довше 6 хвилин</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Popular Tracks */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span>🔥</span> Популярне сьогодні
        </h2>
        
        <div className="grid md:grid-cols-2 gap-3">
          {recentTracks.map((track, index) => (
            <button key={index} className="card-interactive text-left group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-bamboo/20 flex items-center justify-center text-bamboo">
                  🎵
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold group-hover:text-bamboo transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-sm text-text-secondary">{track.artist}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-bamboo">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Status Info */}
      <section className="card pattern-bamboo text-center">
        <div className="space-y-4">
          <div className="text-4xl">🎧</div>
          <h3 className="text-xl font-bold">Музичний настрій PANDA</h3>
          <p className="text-text-secondary">
            Наша команда модерує всі треки, щоб підтримувати приємну атмосферу для всіх гостей
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="px-4 py-2 bg-glass rounded-full text-sm">🎵 Якісний звук</span>
            <span className="px-4 py-2 bg-glass rounded-full text-sm">⚡ Швидка обробка</span>
            <span className="px-4 py-2 bg-glass rounded-full text-sm">🎭 Різні жанри</span>
          </div>
        </div>
      </section>
    </div>
  )
}