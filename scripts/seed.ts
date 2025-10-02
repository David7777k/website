import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@panda.com' },
      update: {},
      create: {
        email: 'admin@panda.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'admin',
        phone: '+380501234567',
        emailVerified: new Date(),
      },
    })
    console.log('✅ Created admin user:', admin.email)
  } catch (e) {
    console.log('⚠️ Admin user already exists')
  }

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10)
  try {
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@panda.com' },
      update: {},
      create: {
        email: 'demo@panda.com',
        name: 'Demo User',
        password: demoPassword,
        role: 'guest',
        phone: '+380509876543',
        emailVerified: new Date(),
      },
    })
    console.log('✅ Created demo user:', demoUser.email)
  } catch (e) {
    console.log('⚠️ Demo user already exists')
  }

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 10)
  try {
    const staffUser = await prisma.user.upsert({
      where: { email: 'staff@panda.com' },
      update: {},
      create: {
        email: 'staff@panda.com',
        name: 'Staff Member',
        password: staffPassword,
        role: 'staff',
        phone: '+380501111111',
        emailVerified: new Date(),
      },
    })
    console.log('✅ Created staff user:', staffUser.email)
  } catch (e) {
    console.log('⚠️ Staff user already exists')
  }

  // Create events
  try {
    const eventCount = await prisma.event.count()
    if (eventCount === 0) {
      await prisma.event.create({
        data: {
          title: 'Halloween Party 🎃',
          description: 'Грандіозна вечірка на Хеллоуїн з конкурсами та призами!',
          poster_url: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e',
          starts_at: new Date('2024-10-31T20:00:00'),
          ends_at: new Date('2024-11-01T02:00:00'),
          is_active: true,
        },
      })

      await prisma.event.create({
        data: {
          title: 'Live Music Night 🎵',
          description: 'Живий виступ відомого гурту',
          poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
          starts_at: new Date('2024-11-15T21:00:00'),
          ends_at: new Date('2024-11-16T01:00:00'),
          is_active: true,
        },
      })
      console.log('✅ Created events')
    } else {
      console.log('⚠️ Events already exist')
    }
  } catch (e) {
    console.log('⚠️ Error creating events:', e)
  }

  // Create FAQ entries
  try {
    const faqCount = await prisma.faq.count()
    if (faqCount === 0) {
      await prisma.faq.create({
        data: {
          question: 'Як забронювати столик?',
          answer: 'Ви можете забронювати столик через наш сайт або зателефонувавши нам за номером телефону +380 50 123 45 67',
          order: 1,
        },
      })

      await prisma.faq.create({
        data: {
          question: 'Які види кальянів у вас є?',
          answer: 'У нас є класичні, фруктові та преміум кальяни з більш ніж 50 смаками тютюну.',
          order: 2,
        },
      })

      await prisma.faq.create({
        data: {
          question: 'Чи можна принести свій алкоголь?',
          answer: 'На жаль, це заборонено законодавством. Але у нас є широкий вибір напоїв за доступними цінами.',
          order: 3,
        },
      })
      console.log('✅ Created FAQ entries')
    } else {
      console.log('⚠️ FAQ entries already exist')
    }
  } catch (e) {
    console.log('⚠️ Error creating FAQ:', e)
  }

  // Create staff members
  try {
    const staffCount = await prisma.staff.count()
    if (staffCount === 0) {
      await prisma.staff.createMany({
        data: [
          {
            name: 'Олександр',
            instagram: '@alex_hookah',
            card_number: '5375414112347893',
            is_active: true,
          },
          {
            name: 'Марія',
            instagram: '@maria_lounge',
            card_number: '5168742312345678',
            is_active: true,
          },
          {
            name: 'Дмитро',
            instagram: '@dima_master',
            card_number: '4149439112345678',
            is_active: true,
          },
        ],
      })
      console.log('✅ Created staff members')
    } else {
      console.log('⚠️ Staff members already exist')
    }
  } catch (e) {
    console.log('⚠️ Error creating staff:', e)
  }

  // Create wheel prizes
  try {
    const prizeCount = await prisma.wheelPrize.count()
    if (prizeCount === 0) {
      await prisma.wheelPrize.createMany({
        data: [
          {
            name: '🎁 Безкоштовний кальян',
            description: 'Отримайте кальян в подарунок',
            type: 'free_item',
            probability: 5,
            color: '#10B981',
            is_active: true,
          },
          {
            name: '💰 Знижка 20%',
            description: 'Знижка 20% на весь рахунок',
            type: 'discount',
            value: 20,
            probability: 15,
            color: '#F59E0B',
            is_active: true,
          },
          {
            name: '💎 Бонус 50 балів',
            description: 'Отримайте 50 бонусних балів',
            type: 'points',
            value: 50,
            probability: 25,
            color: '#3B82F6',
            is_active: true,
          },
          {
            name: '🍹 Безкоштовний напій',
            description: 'Будь-який напій в подарунок',
            type: 'free_item',
            probability: 15,
            color: '#8B5CF6',
            is_active: true,
          },
          {
            name: '💰 Знижка 10%',
            description: 'Знижка 10% на весь рахунок',
            type: 'discount',
            value: 10,
            probability: 30,
            color: '#EC4899',
            is_active: true,
          },
          {
            name: '🎟️ Спробуй ще раз',
            description: 'Ще одна спроба сьогодні',
            type: 'points',
            value: 0,
            probability: 10,
            color: '#6B7280',
            is_active: true,
          },
        ],
      })
      console.log('✅ Created wheel prizes')
    } else {
      console.log('⚠️ Wheel prizes already exist')
    }
  } catch (e) {
    console.log('⚠️ Error creating wheel prizes:', e)
  }

  // Create menu items
  try {
    const menuCount = await prisma.menuItem.count()
    if (menuCount === 0) {
      await prisma.menuItem.createMany({
        data: [
          {
            category: 'hookah',
            name: 'Класичний кальян',
            description: 'Традиційний кальян з вашим улюбленим смаком',
            price: 250,
            is_available: true,
          },
          {
            category: 'hookah',
            name: 'Преміум кальян',
            description: 'Ексклюзивні смаки преміум класу',
            price: 350,
            is_available: true,
          },
          {
            category: 'hookah',
            name: 'Фруктовий кальян',
            description: 'Кальян на фруктовій чаші',
            price: 400,
            is_available: true,
          },
          {
            category: 'kitchen',
            name: 'Салат Цезар',
            description: 'Класичний салат з куркою та пармезаном',
            price: 180,
            is_available: true,
          },
          {
            category: 'kitchen',
            name: 'Піца Маргарита',
            description: 'Італійська піца з томатами та моцарелою',
            price: 220,
            is_available: true,
          },
          {
            category: 'cocktails',
            name: 'Мохіто',
            description: 'Освіжаючий коктейль з м\'ятою та лаймом',
            price: 120,
            is_available: true,
          },
          {
            category: 'cocktails',
            name: 'Піна Колада',
            description: 'Тропічний коктейль з ананасом та кокосом',
            price: 140,
            is_available: true,
          },
          {
            category: 'tea',
            name: 'Зелений чай',
            description: 'Ароматний зелений чай',
            price: 60,
            is_available: true,
          },
          {
            category: 'tea',
            name: 'Чай з м\'яти',
            description: 'Освіжаючий м\'ятний чай',
            price: 70,
            is_available: true,
          },
        ],
      })
      console.log('✅ Created menu items')
    } else {
      console.log('⚠️ Menu items already exist')
    }
  } catch (e) {
    console.log('⚠️ Error creating menu items:', e)
  }

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
