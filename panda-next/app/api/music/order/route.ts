import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { userId, title, paid_amount } = body
  if (!userId) return NextResponse.json({ error: 'auth_required' }, { status: 401 })
  // basic validation
  if (!title || title.length > 200) return NextResponse.json({ error: 'bad_title' }, { status: 400 })

  const code = `AB-${Math.floor(1000 + Math.random() * 9000)}`
  const order = await prisma.musicOrder.create({ data: { user_id: userId, title, paid_amount: paid_amount || 0, status: 'pending', order_code: code } })

  return NextResponse.json({ ok: true, order_code: code })
}
