'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Button from './components/ui/Button'
import Card from './components/ui/Card'
import Badge from './components/ui/Badge'
import SmokeEffect from './components/SmokeEffect'
import { 
  Calendar, 
  Menu as MenuIcon, 
  Music, 
  Gift, 
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Users,
  Star,
  TrendingUp
} from 'lucide-react'

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const features = [
    {
      icon: '🔥',
      title: 'Преміум кальяни',
      description: 'Авторські мікси від професійних кальянщиків з багаторічним досвідом',
      color: 'from-accent/20 to-accent-hover/20',
      badge: 'Топ вибір'
    },
    {
      icon: '🎵',
      title: 'Spotify джукбокс',
      description: 'Обирай улюблені треки та створюй атмосферу вечора',
      color: 'from-accent-dark/20 to-accent/20',
      badge: 'Live'
    },
    {
      icon: '🍽️',
      title: 'Кухня & коктейлі',
      description: 'Авторські страви та безалкогольні коктейлі від шеф-кухаря',
      color: 'from-accent/20 to-accent-light/20',
      badge: 'Новинки'
    },
  ]

  const quickActions = [
    {
      icon: Calendar,
      title: 'Афіша',
      subtitle: 'Події тижня',
      href: '/events',
      color: 'from-accent to-accent-hover'
    },
    {
      icon: MenuIcon,
      title: 'Меню',
      subtitle: 'Страви & напої',
      href: '/menu',
      color: 'from-accent-dark to-accent'
    },
    {
      icon: Music,
      title: 'Музика',
      subtitle: 'Джукбокс',
      href: '/music',
      color: 'from-accent to-accent-light'
    },
    {
      icon: Gift,
      title: 'Колесо удачі',
      subtitle: 'Виграй приз',
      href: '#wheel',
      color: 'from-accent-hover to-accent-light',
      pulse: true
    },
  ]

  return (
    <div className="space-y-20 page-transition">
      {/* Hero Section with Image */}
      <motion.section 
        className="hero-section emerald-mist overflow-hidden"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <div className="relative h-[600px] lg:h-[700px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1662805522314-d316b95046b1?w=1920&q=80"
              alt="PANDA Hookah Lounge"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base via-base/50 to-transparent" />
            {/* Smoke Effect (BETA) */}
            <SmokeEffect enabled={true} intensity="low" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 space-y-8">
            <motion.div variants={fadeInUp} className="space-y-6">
              <motion.div 
                className="text-8xl md:text-9xl"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                🐼
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gradient leading-tight">
                PANDA Hookah
              </h1>
              
              <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed">
                Найкраща кальянна в центрі Києва з унікальною атмосферою,<br className="hidden md:block"/>
                преміум кальянами та професійним сервісом
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge variant="accent" className="text-base">
                  <Sparkles size={14} />
                  Відкрито зараз
                </Badge>
                <Badge className="text-base">
                  <Star size={14} className="fill-warn text-warn" />
                  4.9 рейтинг
                </Badge>
                <Badge className="text-base">
                  <Users size={14} />
                  500+ гостей
                </Badge>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="primary" className="text-lg px-8 py-4 shadow-glow-strong">
                <Phone size={20} />
                Забронювати столик
              </Button>
              <Button variant="secondary" className="text-lg px-8 py-4">
                <MapPin size={20} />
                Як дістатися
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions Grid */}
      <motion.section 
        className="space-y-8"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            ⚡ Швидкі дії
          </h2>
          <p className="text-text-muted text-lg">
            Обери, що цікавить найбільше
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={stagger}
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon
            
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
              >
                <Link href={action.href}>
                  <Card className="text-center h-full relative overflow-hidden group">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    
                    {/* Content */}
                    <div className="relative p-6 space-y-4">
                      <div className={`
                        inline-flex items-center justify-center w-16 h-16 
                        rounded-2xl bg-gradient-to-br ${action.color}
                        transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6
                        ${action.pulse ? 'animate-pulse' : ''}
                      `}>
                        <Icon size={28} strokeWidth={2.5} className="text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                        <p className="text-sm text-text-muted">{action.subtitle}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="space-y-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            🌟 Чому обирають PANDA?
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Ми створили ідеальне місце для відпочинку з друзями
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={stagger}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
            >
              <Card className="h-full text-center relative overflow-hidden group">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-8 space-y-4">
                  {feature.badge && (
                    <Badge variant="accent" className="mb-2">
                      {feature.badge}
                    </Badge>
                  )}
                  
                  <motion.div 
                    className="text-6xl"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold">
                    {feature.title}
                  </h3>
                  
                  <p className="text-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="glass-card p-8 md:p-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-accent">500+</div>
            <div className="text-sm text-text-muted">Щасливих гостей</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-accent">4.9</div>
            <div className="text-sm text-text-muted">Рейтинг</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-accent">50+</div>
            <div className="text-sm text-text-muted">Смаків кальяну</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-accent">24/7</div>
            <div className="text-sm text-text-muted">Підтримка</div>
          </div>
        </div>
      </motion.section>

      {/* Location Section */}
      <motion.section 
        className="glass-card overflow-hidden relative"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <motion.div 
                className="text-5xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                📍
              </motion.div>
              <h3 className="text-3xl font-bold">Завітайте до нас</h3>
              <p className="text-text-muted text-lg">
                Ми знаходимося в самому серці Києва
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={24} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Адреса</div>
                  <div className="text-text-muted">вул. Хрещатик, 1, Київ</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock size={24} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Режим роботи</div>
                  <div className="text-text-muted">Щодня 12:00 - 02:00</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone size={24} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Телефон</div>
                  <a href="tel:+380937045713" className="text-accent hover:text-accent-hover">
                    +380 93 704 5713
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary">
                <MapPin size={18} />
                Відкрити на карті
              </Button>
              <Button variant="secondary">
                <Phone size={18} />
                Подзвонити
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1533893269696-b1adfc2e49a7?w=800&q=80"
              alt="PANDA Lounge Interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base/60 to-transparent" />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="text-center space-y-8 py-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            🎉 Приєднуйтесь до PANDA родини
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Забронюйте столик прямо зараз та отримайте вітальний бонус
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" className="text-lg px-8 py-4">
            <TrendingUp size={20} />
            Забронювати зараз
          </Button>
          <Button variant="secondary" className="text-lg px-8 py-4">
            <Gift size={20} />
            Подивитися акції
          </Button>
        </div>
      </motion.section>
    </div>
  )
}
