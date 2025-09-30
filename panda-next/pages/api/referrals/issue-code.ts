import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Check if user already has a referral code
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referral_code: true }
    })

    if (user?.referral_code) {
      return res.status(200).json({ 
        referralCode: user.referral_code 
      })
    }

    // Generate new referral code
    let referralCode: string
    let attempts = 0
    
    do {
      referralCode = `PANDA${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      attempts++
    } while (
      attempts < 10 && 
      await prisma.user.findUnique({ where: { referral_code: referralCode } })
    )

    // Update user with referral code
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referral_code: referralCode }
    })

    res.status(200).json({ referralCode })

  } catch (error) {
    console.error('Error issuing referral code:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}