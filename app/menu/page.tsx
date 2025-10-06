'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Heart, TrendingUp } from 'lucide-react'

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('hookah')

  const menuCategories = [
    {
      id: 'hookah',
      name: 'Кальяни',
      icon: '💨',
      items: [
        { 
          name: 'Класичний кальян', 
          price: 350, 
          description: 'Традиційний кальян з якісним тютюном',
          image: 'https://images.unsplash.com/photo-1662805522314-d316b95046b1?w=400&q=80',
          popular: true,
          likes: 342
        },
        { 
          name: 'Преміум кальян', 
          price: 450, 
          description: 'Кальян з преміальним тютюном та молоком',
          image: 'https://images.unsplash.com/photo-1662805522314-d316b95046b1?w=400&q=80',
          popular: true,
          likes: 289
        },
        { 
          name: 'Фруктовий кальян', 
          price: 400, 
          description: 'На фруктовій чаші з натуральними соками',
          image: 'https://images.unsplash.com/photo-1662805522314-d316b95046b1?w=400&q=80',
          likes: 156
        },
        { 
          name: 'Міксовий кальян', 
          price: 500, 
          description: 'Авторський мікс смаків від майстра',
          image: 'https://images.unsplash.com/photo-1662805522314-d316b95046b1?w=400&q=80',
          badge: 'Хіт сезону',
          likes: 428
        }
      ]
    },
    {
      id: 'drinks',
      name: 'Напої',
      icon: '🥤',
      items: [
        { 
          name: 'Авторські коктейлі', 
          price: 150, 
          description: 'Безалкогольні коктейлі від бармена',
          image: 'https://images.unsplash.com/photo-1617721042693-0812f6d26d44?w=400&q=80',
          popular: true,
          likes: 234
        },
        { 
          name: 'Свіжевичавлені соки', 
          price: 120, 
          description: 'Натуральні соки з сезонних фруктів',
          image: 'https://images.unsplash.com/photo-1701173660076-e5dd42dfa8cf?w=400&q=80',
          likes: 198
        },
        { 
          name: 'Преміум кава', 
          price: 90, 
          description: 'Еспресо, латте, капучино',
          image: 'https://images.unsplash.com/photo-1617721042693-0812f6d26d44?w=400&q=80',
          likes: 167
        },
        { 
          name: 'Домашній лимонад', 
          price: 100, 
          description: 'Освіжаючий лимонад з м\'ятою',
          image: 'https://images.unsplash.com/photo-1701173660076-e5dd42dfa8cf?w=400&q=80',
          badge: 'Новинка',
          likes: 143
        }
      ]
    }
  ]

  const currentCategory = menuCategories.find(c => c.id === activeCategory)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  return (
    <div className="space-y-12 page-transition">
      <motion.div 
        className="text-center space-y-4"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <h1 className="text-4xl md:text-6xl font-black text-gradient">
          Меню PANDA
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Ласкаво просимо до нашого світу смаків і ароматів
        </p>
      </motion.div>

      <motion.div 
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {menuCategories.map(category => (
          <motion.button
            key={category.id}
            variants={fadeInUp}
            onClick={() => setActiveCategory(category.id)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm
              whitespace-nowrap transition-all duration-200
              ${activeCategory === category.id
                ? 'bg-accent text-base shadow-glow'
                : 'bg-surface/80 text-text-muted hover:bg-surface hover:text-accent'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">{category.icon}</span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-2 gap-6"
        initial="initial"
        animate="animate"
        variants={stagger}
        key={activeCategory}
      >
        {currentCategory?.items.map((item, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
          >
            <Card className="menu-card overflow-hidden h-full">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="menu-card-image"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {item.popular && (
                    <Badge variant="accent" className="backdrop-blur-md">
                      <TrendingUp size={14} />
                      Популярне
                    </Badge>
                  )}
                  {item.badge && (
                    <Badge variant="warn" className="backdrop-blur-md">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <button className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-surface/80 backdrop-blur-md flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200">
                  <Heart size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {item.name}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-accent">
                      {item.price}₴
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <Heart size={16} className="fill-danger text-danger" />
                    <span>{item.likes} вподобань</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Замовити
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="glass-card p-8 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Не знайшли те, що шукали?</h3>
          <p className="text-text-muted">
            Зв'яжіться з нами, і ми допоможемо підібрати ідеальний варіант
          </p>
          <Button variant="primary" className="mt-4">
            Зв'язатися з нами
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
