import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-system'

export { authOptions }
export default NextAuth(authOptions)