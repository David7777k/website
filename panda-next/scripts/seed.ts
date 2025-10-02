import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@panda.com' },
    update: {},
    create: {
      email: 'admin@panda.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+380501234567',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create demo users
  const demoPassword = await hash('demo123', 10)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@panda.com' },
    update: {},
    create: {
      email: 'demo@panda.com',
      name: 'Demo User',
      password: demoPassword,
      role: 'USER',
      phone: '+380509876543',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created demo user:', demoUser.email)

  // Create staff user
  const staffPassword = await hash('staff123', 10)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@panda.com' },
    update: {},
    create: {
      email: 'staff@panda.com',
      name: 'Staff Member',
      password: staffPassword,
      role: 'STAFF',
      phone: '+380501111111',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created staff user:', staff.email)

  // Create events
  const event1 = await prisma.event.upsert({
    where: { id: 'event_1' },
    update: {},
    create: {
      id: 'event_1',
      title: 'Halloween Party 🎃',
      description: 'Грандіозна вечірка на Хеллоуїн з конкурсами та призами!',
      date: new Date('2024-10-31'),
      price: 300,
      capacity: 100,
      imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e',
      category: 'PARTY',
    },
  })

  const event2 = await prisma.event.upsert({
    where: { id: 'event_2' },
    update: {},
    create: {
      id: 'event_2',
      title: 'Live Music Night 🎵',
      description: 'Живий виступ відомого гурту',
      date: new Date('2024-11-15'),
      price: 250,
      capacity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      category: 'MUSIC',
    },
  })

  console.log('✅ Created events:', event1.title, event2.title)

  // Create FAQ entries
  await prisma.fAQ.upsert({
    where: { id: 'faq_1' },
    update: {},
    create: {
      id: 'faq_1',
      question: 'Як забронювати столик?',
      answer: 'Ви можете забронювати столик через наш сайт або зателефонувавши нам за номером телефону.',
      category: 'BOOKING',
      order: 1,
    },
  })

  await prisma.fAQ.upsert({
    where: { id: 'faq_2' },
    update: {},
    create: {
      id: 'faq_2',
      question: 'Які види кальянів у вас є?',
      answer: 'У нас є класичні, фруктові та преміум кальяни з більш ніж 50 смаками тютюну.',
      category: 'HOOKAH',
      order: 2,
    },
  })

  console.log('✅ Created FAQ entries')

  // Create coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME2024',
      type: 'PERCENTAGE',
      value: 15,
      description: 'Знижка 15% для нових клієнтів',
      expiresAt: new Date('2024-12-31'),
      maxUses: 100,
      currentUses: 0,
      minAmount: 200,
    },
  })

  console.log('✅ Created coupons')

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
