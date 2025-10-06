"use client"
import React, { useState, useEffect } from 'react'

interface StaffMember {
  id: number
  name: string
  rating?: number
  photo_url?: string | null
  instagram?: string | null
  card_number?: string | null
  average_service?: number | null
  average_personality?: number | null
}

interface TipsModalProps {
  open: boolean
  onClose: () => void
}

export default function TipsModal({ open, onClose }: TipsModalProps) {
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const quickAmounts = [50, 100, 150, 200]

  // Load staff from API
  useEffect(() => {
    if (open) {
      loadStaff()
    }
  }, [open])

  const loadStaff = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/staff')
      if (response.ok) {
        const data = await response.json()
        setStaff(data.staff || [])
      }
    } catch (error) {
      console.error('Error loading staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCard = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedStaffMember = staff.find(s => s.id === selectedStaff)
  const averageRating = selectedStaffMember 
    ? ((selectedStaffMember.average_service || 0) + (selectedStaffMember.average_personality || 0)) / 2
    : 0

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg)] border border-subtle rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text-bamboo">❤️ Подякувати кальянщику</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-panel border border-subtle hover:bg-glass transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Staff Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-bamboo">Оберіть майстра:</h3>
            {loading ? (
              <div className="text-center py-8 text-muted">Завантаження...</div>
            ) : staff.length === 0 ? (
              <div className="text-center py-8 text-muted">Немає доступного персоналу</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {staff.map((person) => {
                  const avgRating = ((person.average_service || 0) + (person.average_personality || 0)) / 2
                  return (
                    <button
                      key={person.id}
                      onClick={() => setSelectedStaff(person.id)}
                      className={`p-4 rounded-2xl border transition-all ${
                        selectedStaff === person.id
                          ? 'border-bamboo bg-bamboo/20'
                          : 'border-subtle hover:border-bamboo/50 hover:bg-glass'
                      }`}
                    >
                      <div className="text-center space-y-2">
                        {person.photo_url ? (
                          <img 
                            src={person.photo_url} 
                            alt={person.name}
                            className="w-12 h-12 rounded-full mx-auto object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-bamboo flex items-center justify-center text-black font-bold mx-auto">
                            {person.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-sm">{person.name}</h4>
                          {avgRating > 0 && (
                            <div className="flex items-center justify-center gap-1 text-xs text-muted">
                              <span>⭐</span>
                              <span>{avgRating.toFixed(1)}</span>
                            </div>
                          )}
                          {person.instagram && (
                            <p className="text-xs text-bamboo">{person.instagram}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Amount Selection */}
          {selectedStaff && (
            <div className="space-y-4">
              <h3 className="font-semibold text-bamboo">Сума чайових:</h3>
              
              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className={`p-3 rounded-xl border transition-all ${
                      amount === quickAmount.toString()
                        ? 'border-bamboo bg-bamboo/20 text-bamboo'
                        : 'border-subtle hover:border-bamboo/50'
                    }`}
                  >
                    {quickAmount}₴
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Або введіть суму:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Сума в гривнях"
                  className="w-full px-4 py-3 bg-panel border border-subtle rounded-xl focus:border-bamboo focus:outline-none transition-colors"
                  min="10"
                  max="1000"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Повідомлення (необов'язково):</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Дякую за чудове обслуговування!"
                  rows={3}
                  className="w-full px-4 py-3 bg-panel border border-subtle rounded-xl focus:border-bamboo focus:outline-none transition-colors resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-muted mt-1">{message.length}/200</p>
              </div>
            </div>
          )}

          {/* Payment - Direct to Card */}
          {selectedStaff && amount && selectedStaffMember && (
            <div className="space-y-4">
              <h3 className="font-semibold text-bamboo">Переказ на карту майстра:</h3>
              
              <div className="p-4 border border-bamboo rounded-2xl bg-bamboo/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-bamboo rounded-xl flex items-center justify-center text-black text-xl">
                    💳
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedStaffMember.name}</h4>
                    <p className="text-sm text-muted">Переказ на карту</p>
                  </div>
                </div>
                
                {selectedStaffMember.card_number ? (
                  <div className="bg-panel p-4 rounded-xl space-y-3">
                    <div>
                      <p className="text-xs text-muted mb-2">Номер карти:</p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-bamboo text-lg">{selectedStaffMember.card_number}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleCopyCard(selectedStaffMember.card_number!)}
                      className="w-full btn btn-primary py-3"
                    >
                      {copied ? '✓ Скопійовано!' : '📋 Копіювати номер карти'}
                    </button>

                    <div className="pt-3 border-t border-subtle">
                      <p className="text-xs text-muted mb-2">Сума чайових:</p>
                      <p className="text-2xl font-bold text-bamboo">{amount}₴</p>
                      {message && (
                        <div className="mt-2">
                          <p className="text-xs text-muted">Ваше повідомлення:</p>
                          <p className="text-sm italic">"{message}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-panel p-4 rounded-xl text-center text-muted">
                    <p>Номер карти не вказано</p>
                    <p className="text-xs mt-2">Зверніться до персоналу</p>
                  </div>
                )}
              </div>

              <div className="bg-panel p-3 rounded-xl text-xs text-muted">
                <p>💡 Після переказу повідомте про це майстру</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-text-secondary">
            <p>Чайові допомагають майстрам покращувати сервіс ❤️</p>
          </div>
        </div>
      </div>
    </div>
  )
}