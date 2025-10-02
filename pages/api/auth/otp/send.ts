import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Basic OTP implementation for development
  // In production, integrate with SMS gateway
  const { phone } = req.body
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone number required' })
  }

  // Generate OTP for development
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  // In development, return OTP in response
  // In production, send via SMS and return success only
  res.status(200).json({ 
    success: true, 
    message: 'OTP sent successfully',
    // Remove this in production
    otp: process.env.NODE_ENV === 'development' ? otp : undefined 
  })
}