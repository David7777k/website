import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { track_id, title, artist, amount, spotify_url, note } = await request.json()

    if (!track_id || !title || !artist || !amount) {
      return NextResponse.json({ 
        error: 'Missing required fields: track_id, title, artist, amount' 
      }, { status: 400 })
    }

    if (amount < 50) {
      return NextResponse.json({ 
        error: 'Minimum order amount is 50₴' 
      }, { status: 400 })
    }

    // Check user's recent orders (limit: 1 track per 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
    const recentOrder = await prisma.musicOrder.findFirst({
      where: {
        user_id: user.id,
        created_at: { gte: tenMinutesAgo }
      }
    })

    if (recentOrder) {
      const timeLeft = Math.ceil((recentOrder.created_at.getTime() + 10 * 60 * 1000 - Date.now()) / 60000)
      return NextResponse.json({ 
        error: `You can order another track in ${timeLeft} minutes` 
      }, { status: 429 })
    }

    // Generate unique order code
    const orderCode = uuidv4().slice(0, 8).toUpperCase()

    // Create music order
    const musicOrder = await prisma.musicOrder.create({
      data: {
        user_id: user.id,
        title,
        note: `${artist} | Spotify: ${track_id}${note ? ` | Note: ${note}` : ''}`,
        paid_amount: amount,
        order_code: orderCode,
        status: 'pending'
      }
    })

    // Log admin action for tracking
    await prisma.adminLog.create({
      data: {
        admin_id: user.id,
        admin_name: user.name || 'Unknown',
        action: 'order_music',
        target_type: 'music',
        target_id: musicOrder.id.toString(),
        details: `Ordered "${title}" by ${artist} for ${amount}₴`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      order: {
        id: musicOrder.id,
        code: orderCode,
        title,
        artist,
        amount,
        status: 'pending',
        created_at: musicOrder.created_at
      },
      message: `Track "${title}" by ${artist} has been ordered for ${amount}₴. Order code: ${orderCode}`
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating music order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
