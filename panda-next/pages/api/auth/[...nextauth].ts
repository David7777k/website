import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '../../../lib/prisma'
import { compare } from 'bcryptjs'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      id: 'otp',
      name: 'OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        code: { label: 'Code', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const phone = credentials.phone
        const code = credentials.code
        const record = await prisma.oneTimeCode.findFirst({ where: { phone }, orderBy: { createdAt: 'desc' } })
        if (!record) return null
        if (record.expiresAt < new Date()) return null
        const hash = record.codeHash
        // bcrypt compare
        const ok = await compare(code, hash)
        if (!ok) return null

        // find or create user
        let user = await prisma.user.findFirst({ where: { phone } })
        if (!user) user = await prisma.user.create({ data: { phone, name: null } })
        // consume
        await prisma.oneTimeCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } })
        return { id: user.id.toString(), name: user.name || '', phone: user.phone }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) { if (user) token.user = user; return token },
    async session({ session, token }) { if ((token as any).user) session.user = (token as any).user; return session }
  },
  secret: process.env.NEXTAUTH_SECRET || 'devsecret'
})
