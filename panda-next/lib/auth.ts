import { prisma } from './prisma'

// Very small stub for demo: in a real app configure NextAuth providers
export async function getUserFromRequest(req: Request) {
  // demo: accept header x-user-id
  const id = req.headers.get('x-user-id')
  if (!id) return null
  const user = await prisma.user.findUnique({ where: { id: Number(id) } })
  return user
}
