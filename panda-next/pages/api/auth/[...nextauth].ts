import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-system'

export default NextAuth(authOptions)