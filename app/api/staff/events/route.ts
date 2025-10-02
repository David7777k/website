import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'

export async function GET(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 })
  // in real app check staff role
  const events = await prisma.event.findMany({ orderBy: { starts_at: 'desc' } })
  return NextResponse.json(events)
}
