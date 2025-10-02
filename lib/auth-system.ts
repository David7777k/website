// Enhanced Authentication System for PANDA
// Supports both email/password and OAuth

import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

export interface CreateUserData {
  name: string
  email: string
  password?: string
  phone?: string
  birthdate?: Date
  role?: 'guest' | 'staff' | 'admin'
}

export interface AuthUser {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  role: string
  is_blocked: boolean
  smoke_theme_enabled: boolean
  birthdate?: Date | null
  created_at: Date
}

export class AuthSystem {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Create user with email/password
  static async createUser(userData: CreateUserData): Promise<AuthUser> {
    const { email, password, name, phone, birthdate, role = 'guest' } = userData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('USER_ALREADY_EXISTS')
    }

    // Hash password if provided
    const hashedPassword = password ? await this.hashPassword(password) : null

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        birthdate,
        role,
        last_login: new Date()
      }
    })

    return user as AuthUser
  }

  // Authenticate user with email/password
  static async authenticateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return null
    }

    if (user.is_blocked) {
      throw new Error('USER_BLOCKED')
    }

    const isPasswordValid = await this.verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() }
    })

    return user as AuthUser
  }

  // Get user by ID
  static async getUserById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    return user as AuthUser | null
  }

  // Update user profile
  static async updateUserProfile(id: string, data: Partial<CreateUserData>): Promise<AuthUser> {
    const updateData: any = { ...data }
    
    // Hash password if updating
    if (data.password) {
      updateData.password = await this.hashPassword(data.password)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return user as AuthUser
  }

  // Check if user has role
  static hasRole(user: AuthUser, requiredRole: 'guest' | 'staff' | 'admin'): boolean {
    const roleHierarchy = { guest: 0, staff: 1, admin: 2 }
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole]
    
    return userLevel >= requiredLevel
  }

  // Generate referral code
  static async generateReferralCode(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('USER_NOT_FOUND')

    let referralCode: string
    let attempts = 0
    
    do {
      referralCode = `PANDA${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      attempts++
    } while (
      attempts < 10 && 
      await prisma.user.findUnique({ where: { referral_code: referralCode } })
    )

    await prisma.user.update({
      where: { id: userId },
      data: { referral_code: referralCode }
    })

    return referralCode
  }

  // Find user by referral code
  static async getUserByReferralCode(referralCode: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { referral_code: referralCode }
    })

    return user as AuthUser | null
  }

  // Update user risk score
  static async updateRiskScore(userId: string, increment: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        risk_score: {
          increment
        }
      }
    })
  }

  // Block/unblock user
  static async setUserBlocked(userId: string, blocked: boolean): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { is_blocked: blocked }
    })
  }
}

// NextAuth configuration with enhanced authentication
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await AuthSystem.authenticateUser(
            credentials.email,
            credentials.password
          )

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              is_blocked: user.is_blocked
            }
          }
        } catch (error) {
          console.error('Auth error:', error)
        }

        return null
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For OAuth users, ensure they exist in our database
        if (account.provider === 'google') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create user from OAuth
            const newUser = await prisma.user.create({
              data: {
                name: user.name,
                email: user.email!,
                image: user.image,
                oauth_id: account.providerAccountId,
                role: 'guest',
                last_login: new Date()
              }
            })
            token.role = 'guest'
            token.userId = newUser.id
          } else {
            // Update last login
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { last_login: new Date() }
            })
            token.role = existingUser.role
            token.userId = existingUser.id
          }
        } else {
          // For credentials login
          token.role = (user as any).role
          token.userId = user.id
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
      }

      return session
    }
  },

  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error'
  },

  events: {
    async signIn({ user, account, profile }) {
      // Log successful sign in
      console.log(`User ${user.email} signed in via ${account?.provider}`)
    }
  }
}