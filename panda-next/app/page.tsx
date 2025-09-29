'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const features = [
    {
      icon: '🔥',
      title: 'Преміум кальяни',
      description: 'Використовуємо лише найкращий тютюн та обладнання від провідних брендів',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: '🎵',
      title: 'Spotify джукбокс',
      description: 'Замовляй улюблені треки прямо з Spotify та створюй власний плейлист',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: '👨‍🍳',
      title: 'Майстри-кальянщики',
      description: 'Професійні кальянщики з багаторічним досвідом та авторськими міксами',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🍽️',
      title: 'Кухня & коктейли',
      description: 'Різноманітне меню страв, закусок та авторських безалкогольних коктейлів',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: '🎡',
      title: 'Колесо фортуни',
      description: 'Щоденні розіграші призів, бонусів та знижок для наших гостей',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '💎',
      title: 'VIP простір',
      description: 'Окремі приватні зони для особливих подій та корпоративів',
      color: 'from-gray-600 to-gray-800'
    }
  ]

  const quickActions = [
    {
      icon: '📞',
      title: 'Забронювати',
      subtitle: 'Столик на сьогодні',
      href: 'tel:+380937045713',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      pulse: true
    },
    {
      icon: '🍽️',
      title: 'Меню',
      subtitle: 'Страви & напої',
      href: '/menu',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: '🎡',
      title: 'Колесо удачі',
      subtitle: 'Виграй призи',
      href: '#wheel',
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      glow: true
    },
    {
      icon: '🎵',
      title: 'Музика',
      subtitle: 'Spotify джукбокс',
      href: '/music',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      icon: '👤',
      title: 'Профіль',
      subtitle: 'Бонуси & QR',
      href: '/profile',
      color: 'bg-gradient-to-br from-gray-600 to-gray-700'
    },
    {
      icon: '📅',
      title: 'Афіша',
      subtitle: 'Події & акції',
      href: '/events',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600'
    }
  ]

  return (
    <div className="space-y-16 panda-fade-in">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-8 py-12"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.div variants={fadeInUp} className="space-y-6">
          <motion.div 
            className="text-8xl md:text-9xl panda-float"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            🐼
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black panda-gradient-text leading-tight"
          >
            PANDA Hookah
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Найкраща кальянна в центрі Києва з унікальною атмосферою,<br/>
            преміум кальянами та професійним сервісом
          </motion.p>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a 
            href="tel:+380937045713" 
            className="panda-btn panda-btn-primary text-lg px-8 py-4 panda-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📞 Забронювати столик
          </motion.a>
          <motion.a 
            href="#features" 
            className="panda-btn panda-btn-secondary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔥 Дізнатися більше
          </motion.a>
        </motion.div>
      </motion.section>

      {/* Quick Actions Grid */}
      <motion.section 
        className="space-y-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold text-center text-white"
        >
          ⚡ Швидкі дії
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={stagger}
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={action.href}
                className={`
                  block p-6 rounded-2xl text-center text-white transition-all duration-300
                  ${action.color}
                  ${action.pulse ? 'animate-pulse' : ''}
                  ${action.glow ? 'panda-glow' : ''}
                  hover:shadow-2xl
                `}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-bold text-sm mb-1">{action.title}</h3>
                <p className="text-xs opacity-90">{action.subtitle}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features"
        className="space-y-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold text-center text-white"
        >
          🌟 Чому обирають PANDA?
        </motion.h2>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -5 }}
              className="panda-card panda-card-interactive text-center group"
            >
              <motion.div 
                className={`text-5xl mb-6 inline-block p-4 rounded-2xl bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Location & Contact */}
      <motion.section 
        className="panda-card text-center bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 space-y-6">
          <motion.div 
            className="text-6xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            📍
          </motion.div>
          <h3 className="text-3xl font-bold text-white">Завітайте до нас</h3>
          <div className="space-y-2 text-white/90">
            <p className="text-xl font-semibold">вул. Хрещатик, 1, Київ</p>
            <p className="text-lg">📞 +380 93 704 5713</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-medium">
              🚇 Майдан Незалежності
            </span>
            <span className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-medium">
              🚗 Безкоштовна парковка
            </span>
            <span className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white font-medium">
              ⏰ 12:00 - 02:00
            </span>
          </div>

          <motion.div
            className="pt-6"
            whileHover={{ scale: 1.05 }}
          >
            <a 
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              🗺️ Відкрити на карті
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Social Proof */}
      <motion.section 
        className="text-center space-y-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-2xl font-bold text-white"
        >
          🎉 Приєднуйтесь до PANDA родини
        </motion.h2>
        
        <motion.div 
          variants={fadeInUp}
          className="flex justify-center items-center gap-8 text-gray-400"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">500+</div>
            <div className="text-sm">Щасливих гостей</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">4.9</div>
            <div className="text-sm">Рейтинг ⭐</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">24/7</div>
            <div className="text-sm">Підтримка</div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}

