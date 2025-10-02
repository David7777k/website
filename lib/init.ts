import { SettingsManager } from './settings'
import { prisma } from './prisma'

export async function initializeApp() {
  try {
    console.log('🐼 Initializing PANDA app...')
    
    // Initialize system settings
    await SettingsManager.initializeSettings()
    console.log('✅ System settings initialized')
    
    // Create default wheel prizes if they don't exist
    const existingPrizes = await prisma.wheelPrize.count()
    if (existingPrizes === 0) {
      await prisma.wheelPrize.createMany({
        data: [
          {
            name: '5% скидка на кальян',
            description: 'Скидка 5% на любой кальян',
            type: 'discount',
            value: 5,
            probability: 25,
            color: '#10B981'
          },
          {
            name: '5% скидка на кухню',
            description: 'Скидка 5% на блюда из меню',
            type: 'discount',
            value: 5,
            probability: 25,
            color: '#F59E0B'
          },
          {
            name: 'Бесплатный чай',
            description: 'Чай на выбор в подарок',
            type: 'free_item',
            value: 0,
            probability: 20,
            color: '#8B5CF6'
          },
          {
            name: 'Бесплатный трек',
            description: 'Один трек в подарок в джукбокс',
            type: 'free_item',
            value: 0,
            probability: 15,
            color: '#EF4444'
          },
          {
            name: '10% скидка на коктейли',
            description: 'Скидка 10% на любые коктейли',
            type: 'discount',
            value: 10,
            probability: 15,
            color: '#06B6D4'
          }
        ]
      })
      console.log('✅ Default wheel prizes created')
    }
    
    // Create default staff members if they don't exist
    const existingStaff = await prisma.staff.count()
    if (existingStaff === 0) {
      await prisma.staff.createMany({
        data: [
          {
            name: 'Олександр К.',
            instagram: '@oleksandr_hookah',
            average_service: 4.8,
            average_personality: 4.9,
            card_number: '5375 4112 3456 7890'
          },
          {
            name: 'Марія В.',
            instagram: '@maria_panda',
            average_service: 4.7,
            average_personality: 4.8,
            card_number: '5375 4112 3456 7891'
          },
          {
            name: 'Дмитро П.',
            instagram: '@dmitro_shisha',
            average_service: 4.6,
            average_personality: 4.7,
            card_number: '5375 4112 3456 7892'
          },
          {
            name: 'Анна С.',
            instagram: '@anna_panda_bar',
            average_service: 4.9,
            average_personality: 4.9,
            card_number: '5375 4112 3456 7893'
          }
        ]
      })
      console.log('✅ Default staff members created')
    }
    
    // Create sample menu items if they don't exist
    const existingMenuItems = await prisma.menuItem.count()
    if (existingMenuItems === 0) {
      await prisma.menuItem.createMany({
        data: [
          // Hookah
          { category: 'hookah', name: 'Класичний кальян', price: 300, is_available: true },
          { category: 'hookah', name: 'Преміум кальян', price: 450, is_available: true },
          { category: 'hookah', name: 'VIP кальян', price: 600, is_available: true },
          
          // Kitchen
          { category: 'kitchen', name: 'Цезар з куркою', price: 180, is_available: true },
          { category: 'kitchen', name: 'Паста Карбонара', price: 220, is_available: true },
          { category: 'kitchen', name: 'Стейк з телятини', price: 350, is_available: true },
          
          // Cocktails
          { category: 'cocktails', name: 'Мохіто', price: 120, is_available: true },
          { category: 'cocktails', name: 'Пінаколада', price: 140, is_available: true },
          { category: 'cocktails', name: 'Лонг Айленд', price: 160, is_available: true },
          
          // Tea
          { category: 'tea', name: 'Зелений чай', price: 50, is_available: true },
          { category: 'tea', name: 'Чорний чай', price: 50, is_available: true },
          { category: 'tea', name: 'Фруктовий чай', price: 60, is_available: true },
        ]
      })
      console.log('✅ Sample menu items created')
    }
    
    console.log('🐼 PANDA app initialization completed!')
    
  } catch (error) {
    console.error('❌ Error initializing app:', error)
    throw error
  }
}