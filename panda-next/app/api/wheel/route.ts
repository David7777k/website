import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getUserFromRequest } from '../../../lib/auth'

export async function POST(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  // check cooldown
  const now = new Date()
  const last = await prisma.wheelSpin.findFirst({ where: { user_id: user.id }, orderBy: { spun_at: 'desc' } })
  if (last && last.next_allowed_at > now) {
    return NextResponse.json({ error: 'Cooldown', next_allowed_at: last.next_allowed_at }, { status: 429 })
  }

  // prize probabilities (server-side)
  const prizes = [
    { key: 'tea', label: 'Безкоштовний чай', weight: 35 },
    { key: 'hookah5', label: '-5% на кальян', weight: 30 },
    { key: 'kitchen5', label: '-5% на кухню', weight: 20 },
    { key: 'track', label: 'Платний трек безкоштовно', weight: 10 },
    { key: 'cocktail', label: '-10% коктейль', weight: 5 }
  ]

  const total = prizes.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  let chosen = prizes[prizes.length - 1]
  for (const p of prizes) {
    if (r < p.weight) { chosen = p; break }
    r -= p.weight
  }

  // create coupon
  const code = 'PN' + Math.random().toString(36).slice(2, 8).toUpperCase()
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)

  const coupon = await prisma.coupon.create({ data: {
    user_id: user.id,
    type: chosen.key,
    value_pct: chosen.key.includes('5') ? 5 : (chosen.key === 'cocktail' ? 10 : null),
    kind: chosen.key,
    code,
    expires_at: expires
  }})

  const nextAllowed = new Date()
  nextAllowed.setDate(nextAllowed.getDate() + 7)

  await prisma.wheelSpin.create({ data: {
    user_id: user.id,
    prize: chosen.label,
    next_allowed_at: nextAllowed,
    client_fp: req.headers.get('x-client-fp') ?? undefined,
    ip: req.headers.get('x-forwarded-for') ?? undefined
  }})

  return NextResponse.json({ prize: chosen.label, coupon: { code: coupon.code, expires_at: coupon.expires_at } })
}
