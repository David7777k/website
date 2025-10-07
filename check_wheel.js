import { PrismaClient } from '@prisma/client'

async function checkWheelData() {
  const prisma = new PrismaClient()
  
  try {
    // Check wheel spins
    const spins = await prisma.wheelSpin.findMany({
      include: {
        user: {
          select: { email: true }
        }
      }
    })
    
    console.log('Wheel Spins:')
    spins.forEach(spin => {
      console.log(`- ${spin.user.email}: ${spin.prize_name} (Next allowed: ${spin.next_allowed_at})`)
    })
    
    // Check wheel prizes
    const prizes = await prisma.wheelPrize.findMany()
    console.log('\nWheel Prizes:')
    prizes.forEach(prize => {
      console.log(`- ${prize.name}: ${prize.probability}% (Active: ${prize.is_active})`)
    })
    
    // Check coupons
    const coupons = await prisma.coupon.findMany({
      include: {
        user: {
          select: { email: true }
        }
      }
    })
    
    console.log('\nCoupons:')
    coupons.forEach(coupon => {
      console.log(`- ${coupon.user.email}: ${coupon.code} (${coupon.type}, expires: ${coupon.expires_at})`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkWheelData()