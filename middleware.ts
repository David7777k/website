import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/login?error=unauthorized', req.url))
      }
    }

    // Staff routes protection (staff and admin can access)
    if (pathname.startsWith('/staff')) {
      if (!token || !['staff', 'admin'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/auth/login?error=unauthorized', req.url))
      }
    }

    // Profile routes protection (authenticated users only)
    if (pathname.startsWith('/profile')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    // API routes protection
    if (pathname.startsWith('/api/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    if (pathname.startsWith('/api/staff')) {
      if (!token || !['staff', 'admin'].includes(token.role as string)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow public routes
        if (
          pathname === '/' ||
          pathname.startsWith('/menu') ||
          pathname.startsWith('/events') ||
          pathname.startsWith('/music') ||
          pathname.startsWith('/auth') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/music/trending') ||
          pathname.startsWith('/api/music/search') ||
          pathname.startsWith('/api/qr/generate') ||
          pathname.startsWith('/api/init') ||
          pathname.startsWith('/_next') ||
          pathname.includes('.')
        ) {
          return true
        }

        // Protected routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}