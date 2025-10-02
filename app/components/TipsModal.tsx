"use client"
import React, { useState } from 'react'

interface TipsModalProps {
  open: boolean
  onClose: () => void
}

export default function TipsModal({ open, onClose }: TipsModalProps) {
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  const staff = [
    { id: 1, name: 'Олександр К.', rating: 4.9, photo: null, instagram: '@alex_hookah' },
    { id: 2, name: 'Марія В.', rating: 4.8, photo: null, instagram: '@maria_panda' },
    { id: 3, name: 'Дмитро П.', rating: 4.7, photo: null, instagram: '@dima_smoke' },
    { id: 4, name: 'Анна С.', rating: 4.9, photo: null, instagram: '@anna_hookah' }
  ]

  const quickAmounts = [50, 100, 150, 200]

  const handleTip = () => {
    if (!selectedStaff || !amount) return
    
    // TODO: Integrate with LiqPay
    alert(`Чайові ${amount}₴ для ${staff.find(s => s.id === selectedStaff)?.name}`)
    onClose()
  }

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
            <div className="grid grid-cols-2 gap-3">
              {staff.map((person) => (
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
                    {person.photo ? (
                      <img 
                        src={person.photo} 
                        alt={person.name}
                        className="w-12 h-12 rounded-full mx-auto"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-bamboo flex items-center justify-center text-black font-bold mx-auto">
                        {person.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm">{person.name}</h4>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted">
                        <span>⭐</span>
                        <span>{person.rating}</span>
                      </div>
                      <p className="text-xs text-bamboo">{person.instagram}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
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

          {/* Payment Methods */}
          {selectedStaff && amount && (
            <div className="space-y-4">
              <h3 className="font-semibold text-bamboo">Спосіб оплати:</h3>
              
              <div className="space-y-3">
                {/* LiqPay */}
                <button
                  onClick={handleTip}
                  className="w-full p-4 border border-subtle rounded-2xl hover:border-bamboo hover:bg-glass transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                      L
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold">LiqPay</h4>
                      <p className="text-sm text-muted">Карта, Apple Pay, Google Pay</p>
                    </div>
                  </div>
                  <div className="text-bamboo font-semibold">{amount}₴</div>
                </button>

                {/* Direct to card */}
                <div className="p-4 border border-subtle rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-panel rounded-xl flex items-center justify-center text-bamboo">
                      💳
                    </div>
                    <div>
                      <h4 className="font-semibold">Прямо на карту</h4>
                      <p className="text-sm text-muted">Переказ на карту майстра</p>
                    </div>
                  </div>
                  
                  <div className="bg-panel p-3 rounded-xl">
                    <p className="text-sm text-muted mb-2">Номер карти:</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-bamboo">5375 4141 1234 5678</span>
                      <button
                        onClick={() => navigator.clipboard.writeText('5375414112345678')}
                        className="btn btn-ghost text-xs"
                      >
                        Копіювати
                      </button>
                    </div>
                  </div>
                </div>
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