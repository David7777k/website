import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { prisma } from './prisma'
import type { User } from '@prisma/client'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession()
    if (!session?.user?.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    return user
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(requiredRole: string) {
  const user = await requireAuth()
  
  const roleHierarchy = ['guest', 'staff', 'admin']
  const userRoleIndex = roleHierarchy.indexOf(user.role)
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)
  
  if (userRoleIndex < requiredRoleIndex) {
    throw new Error('Insufficient permissions')
  }
  
  return user
}

// Helper to check if user can access admin panel
export function canAccessAdmin(role: string) {
  return role === 'admin'
}

// Helper to check if user can access staff panel
export function canAccessStaff(role: string) {
  return ['staff', 'admin'].includes(role)
}