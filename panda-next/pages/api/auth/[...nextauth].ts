import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user role to session
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      })
      
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: dbUser?.role || 'guest',
        },
      }
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Update user with Google profile info
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: profile?.name || user.name,
            image: profile?.image || user.image,
          },
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
}

export default NextAuth(authOptions)