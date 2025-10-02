"use client"
import React from 'react'

export default function FeaturedSection() {
  return (
    <section className="space-y-8 mb-16">
      {/* Promotions */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Акції та бонуси</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center text-accent text-2xl">
                📱
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Сторіс в Instagram</h3>
                <p className="text-text-secondary text-sm mb-3">Опублікуй сторіс з відміткою та отримай <span className="text-bamboo font-semibold">знижку 10%</span></p>
                <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full">Постійна акція</span>
              </div>
            </div>
          </div>

          <div className="card group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bamboo/20 to-bamboo-light/10 flex items-center justify-center text-bamboo text-2xl">
                👥
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Програма рефералів</h3>
                <p className="text-text-secondary text-sm mb-3">Запроси друзів і отримуй <span className="text-bamboo font-semibold">бонуси</span> за кожного</p>
                <span className="text-xs px-3 py-1 bg-bamboo/20 text-bamboo rounded-full">До 3х на місяць</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Особливості PANDA</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-bamboo/50 to-transparent"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-bamboo to-bamboo-light mx-auto mb-4 flex items-center justify-center text-3xl text-black float-animation">
              🎂
            </div>
            <h3 className="font-semibold text-lg mb-2">День народження</h3>
            <p className="text-text-secondary text-sm">Святкуй свій день народження з особливими пропозиціями</p>
          </div>

          <div className="card text-center">
            <div className="w-20 h-20 rounded-3xl bg-panel mx-auto mb-4 flex items-center justify-center text-3xl text-bamboo">
              💰
            </div>
            <h3 className="font-semibold text-lg mb-2">Чайові кальянщику</h3>
            <p className="text-text-secondary text-sm">Відзначь роботу майстра прямо через додаток</p>
          </div>

          <div className="card text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/10 mx-auto mb-4 flex items-center justify-center text-3xl text-accent">
              ❓
            </div>
            <h3 className="font-semibold text-lg mb-2">FAQ</h3>
            <p className="text-text-secondary text-sm">Відповіді на найчастіші питання про заклад</p>
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="card pattern-bamboo">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-white mx-auto mb-6 flex items-center justify-center text-4xl">
            🐼
          </div>
          <h2 className="text-3xl font-bold mb-4 gradient-text-bamboo">Кальянна PANDA</h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Затишне місце в серці Києва, де традиції кальянної культури поєднуються з сучасним сервісом. 
            Ми створили атмосферу, де кожен гість відчуває себе частиною нашої великої родини.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="px-4 py-2 bg-glass rounded-full text-sm">🕒 Працюємо до 02:00</span>
            <span className="px-4 py-2 bg-glass rounded-full text-sm">📍 Київ, центр</span>
            <span className="px-4 py-2 bg-glass rounded-full text-sm">🚭 18+</span>
          </div>
        </div>
      </div>
    </section>
  )
}