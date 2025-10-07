import { PrismaClient } from '@prisma/client'

async function checkUsers() {
  const prisma = new PrismaClient()
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        password: true
      }
    })
    
    console.log('Users in database:')
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Has password: ${!!user.password}`)
    })
    
    if (users.length === 0) {
      console.log('No users found in database')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()