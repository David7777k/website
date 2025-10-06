import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const userId = body.userId
  if (!userId) return NextResponse.json({ error: 'auth_required' }, { status: 401 })

  // Check last spin
  const last = await prisma.wheelSpin.findFirst({ where: { user_id: userId }, orderBy: { spun_at: 'desc' } })
  const now = new Date()
  if (last && last.next_allowed_at > now) {
    return NextResponse.json({ error: 'cooldown', next_allowed_at: last.next_allowed_at }, { status: 429 })
  }

  // Simple prize logic (demo)
  const prizes = [
    { prize: 'free_tea', weight: 35 },
    { prize: 'panda_5', weight: 30 },
    { prize: 'kitchen_5', weight: 20 },
    { prize: 'track_free', weight: 10 },
    { prize: 'cocktail_10', weight: 5 }
  ]
  const total = prizes.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  let chosen = prizes[0]
  for (const p of prizes) {
    if (r < p.weight) { chosen = p; break }
    r -= p.weight
  }

  const nextAllowed = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const spin = await prisma.wheelSpin.create({ data: { user_id: userId, prize: chosen.prize, next_allowed_at: nextAllowed } })

  // create coupon
  const coupon = await prisma.coupon.create({ data: { user_id: userId, type: 'wheel', value_pct: chosen.prize.includes('5') ? 5 : null, kind: chosen.prize, code: `W-${Date.now() % 100000}`, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } })

  return NextResponse.json({ prize: chosen.prize, coupon: { code: coupon.code, expires_at: coupon.expires_at } })
}
