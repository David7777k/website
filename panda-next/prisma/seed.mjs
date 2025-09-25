import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // wipe some tables for a clean demo
  await prisma.musicOrder.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.wheelSpin.deleteMany()
  await prisma.referralCheckin ? prisma.referralCheckin.deleteMany() : null
  await prisma.referral.deleteMany()
  await prisma.faq.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()

  // demo user
  const user = await prisma.user.create({ data: { name: 'Demo User', phone: '380000000000' } })

  // staff
  const staff = [
    { name: 'Misha', instagram: 'misha_panda' },
    { name: 'Lena', instagram: 'lena_panda' },
    { name: 'Dmitry', instagram: 'dmitry_panda' }
  ]
  for (const s of staff) await prisma.staff.create({ data: s })

  // event
  await prisma.event.create({ data: {
    title: 'Турнір UFC',
    description: 'Главное событие недели — смотреть вместе с друзьями',
    poster_url: '/poster-ufc.jpg',
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 26),
    is_active: true
  }})

  // faq
  const faqs = [
    { question: 'Можно ли с животными?', answer: 'К сожалению, нет.' },
    { question: 'Есть ли парковка?', answer: 'Есть небольшая бесплатная парковка рядом.' }
  ]
  for (const f of faqs) await prisma.faq.create({ data: f })

  // sample coupons
  await prisma.coupon.create({ data: {
    user_id: user.id,
    type: 'wheel_prize',
    value_pct: 5,
    kind: 'PANDA5',
    code: `PANDA5-${Date.now()}`,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  }})

  console.log('Seed finished')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
