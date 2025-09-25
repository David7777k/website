import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  // create staff
  const [s1, s2, s3] = await Promise.all([
    prisma.staff.create({ data: { name: 'Misha', instagram: 'misha_panda' } }),
    prisma.staff.create({ data: { name: 'Lena', instagram: 'lena_panda' } }),
    prisma.staff.create({ data: { name: 'Dmitry', instagram: 'dmitry_panda' } })
  ])

  // create an event
  await prisma.event.create({
    data: {
      title: 'Турнир UFC',
      description: 'Главное событие недели — смотреть вместе с друзьями',
      poster_url: '/poster-ufc.jpg',
      starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
      ends_at: new Date(Date.now() + 1000 * 60 * 60 * 26),
      is_active: true
    }
  })

  const faqs = [
    { question: 'Можно ли с животными?', answer: 'К сожалению, нет.' },
    { question: 'Есть ли парковка?', answer: 'Есть небольшая бесплатная парковка рядом.' }
  ]
  for (const f of faqs) await prisma.faq.create({ data: f })

  // demo user
  const user = await prisma.user.create({ data: { name: 'Demo User' } })

  // create wheel prizes as simple coupons for demo user
  const couponCodes = ['PANDA5', 'TEA_FREE']
  for (const code of couponCodes) {
    await prisma.coupon.create({
      data: {
        user_id: user.id,
        type: 'wheel_prize',
        value_pct: code === 'PANDA5' ? 5 : null,
        kind: code === 'TEA_FREE' ? 'free_tea' : null,
        code,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    })
  }

  // create a music order
  await prisma.musicOrder.create({
    data: {
      user_id: user.id,
      title: 'Smooth Jazz',
      note: 'Please play after 22:00',
      paid_amount: 100,
      status: 'approved',
      order_code: 'AB-1234'
    }
  })

  console.log('Seed finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
