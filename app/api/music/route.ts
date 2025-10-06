import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUserFromRequest } from '../../../lib/auth'

export async function POST(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const title = String(body.title || '').slice(0, 200)
  const note = String(body.note || '').slice(0, 500)
  const paid = Number(body.paid_amount || 0)

  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })
  if (paid <= 0) return NextResponse.json({ error: 'Payment required' }, { status: 400 })

  // simplistic order code
  const code = 'MO' + Math.floor(1000 + Math.random() * 9000)

  const order = await prisma.musicOrder.create({ data: {
    user_id: user.id,
    title,
    note,
    paid_amount: Math.round(paid),
    status: 'pending',
    order_code: code
  }})

  return NextResponse.json({ order_code: order.order_code, status: order.status })
}
