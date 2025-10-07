'use client'

import { useState } from 'react'

type TimeSlot = {
  time: string
  available: boolean
}

export default function BookingsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [step, setStep] = useState<'datetime' | 'details' | 'confirm'>('datetime')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const timeSlots: TimeSlot[] = [
    { time: '12:00', available: true },
    { time: '13:00', available: true },
    { time: '14:00', available: false },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: true },
    { time: '18:00', available: false },
    { time: '19:00', available: true },
    { time: '20:00', available: true },
    { time: '21:00', available: true },
    { time: '22:00', available: false },
    { time: '23:00', available: true },
  ]

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Show success message or redirect
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl mb-4 border-2 border-lime-500/30">
            <span className="text-5xl">📅</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Бронювання столика
          </h1>
          <p className="text-gray-400">
            Забронюйте столик у найкращій кальянній Києва
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-3 mb-8">
          {[
            { id: 'datetime', icon: '📅', label: 'Дата і час' },
            { id: 'details', icon: '✍️', label: 'Деталі' },
            { id: 'confirm', icon: '✅', label: 'Підтвердження' },
          ].map((s, idx) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                step === s.id
                  ? 'bg-lime-500 text-black font-semibold'
                  : idx < ['datetime', 'details', 'confirm'].indexOf(step)
                  ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                  : 'bg-gray-900 text-gray-500 border border-gray-800'
              }`}
            >
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm font-medium hidden md:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800">
          {/* Step 1: Date & Time */}
          {step === 'datetime' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Виберіть дату та час
              </h2>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Дата візиту
                </label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {Array.from({ length: 14 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() + i)
                    const isSelected = selectedDate.toDateString() === date.toDateString()
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'bg-lime-500 text-black font-semibold'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        <div className={`text-xs ${isSelected ? 'text-black/70' : 'text-gray-500'}`}>{date.toLocaleDateString('uk', { weekday: 'short' })}</div>
                        <div className="text-lg font-bold">{date.getDate()}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Час візиту
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-4 rounded-xl font-semibold transition-all ${
                        selectedTime === slot.time
                          ? 'bg-lime-500 text-black'
                          : slot.available
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                          : 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-800'
                      }`}
                    >
                      {slot.time}
                      {!slot.available && <div className="text-xs mt-1">Зайнято</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Кількість гостей
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 text-white font-bold text-xl"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-white">{guests}</div>
                    <div className="text-sm text-gray-400">гостей</div>
                  </div>
                  <button
                    onClick={() => setGuests(Math.min(12, guests + 1))}
                    className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 text-white font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep('details')}
                disabled={!selectedTime}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  selectedTime
                    ? 'bg-lime-500 hover:bg-lime-600 text-black'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-800'
                }`}
              >
                Далі →
              </button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Контактна інформація
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Ваше ім'я *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введіть ваше ім'я"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Номер телефону *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+380 XX XXX XX XX"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Коментар (необов'язково)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Особливі побажання, алергії тощо"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('datetime')}
                  className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
                >
                  ← Назад
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!name || !phone}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    name && phone
                      ? 'btn-primary hover:shadow-xl'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Далі →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Підтвердіть бронювання
              </h2>

              <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400">Дата</span>
                  <span className="text-white font-semibold">
                    {selectedDate.toLocaleDateString('uk', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400">Час</span>
                  <span className="text-white font-semibold">{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400">Гостей</span>
                  <span className="text-white font-semibold">{guests}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400">Ім'я</span>
                  <span className="text-white font-semibold">{name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Телефон</span>
                  <span className="text-white font-semibold">{phone}</span>
                </div>
                {comment && (
                  <div className="pt-3 border-t border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Коментар:</div>
                    <div className="text-white">{comment}</div>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 text-sm">
                  📞 Ми зателефонуємо вам для підтвердження бронювання протягом 15 хвилин
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
                >
                  ← Назад
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                    isSubmitting
                      ? 'bg-gray-700 text-gray-400 cursor-wait'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  {isSubmitting ? '⏳ Бронюємо...' : '✅ Підтвердити бронювання'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6">
            <div className="text-4xl mb-3">⏰</div>
            <h3 className="text-xl font-bold text-accent mb-2">Час роботи</h3>
            <p className="text-gray-400">
              Пн-Чт: 12:00 - 00:00<br />
              Пт-Нд: 12:00 - 02:00
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Адреса</h3>
            <p className="text-gray-400">
              вул. Хрещатик, 1<br />
              Київ, Україна
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}