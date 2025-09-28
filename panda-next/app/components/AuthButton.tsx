"use client"
import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <button disabled className="btn btn-ghost">
        <div className="w-4 h-4 border-2 border-bamboo border-t-transparent rounded-full animate-spin"></div>
      </button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {/* User Info */}
        <a href="/profile" className="flex items-center gap-2 hover:bg-glass rounded-xl p-2 transition-colors">
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-bamboo flex items-center justify-center text-black text-sm font-bold">
              {session.user?.name?.charAt(0) || '?'}
            </div>
          )}
          <div className="hidden lg:block">
            <div className="text-sm font-medium">{session.user?.name}</div>
            <div className="text-xs text-muted capitalize">{(session.user as any)?.role || 'guest'}</div>
          </div>
        </a>

        {/* Role-based navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {(session.user as any)?.role === 'admin' && (
            <a href="/admin" className="btn btn-ghost text-xs">
              🛠️ Адмін
            </a>
          )}
          {(['staff', 'admin'] as string[]).includes((session.user as any)?.role) && (
            <a href="/staff" className="btn btn-ghost text-xs">
              👷 Персонал
            </a>
          )}
        </div>

        {/* Sign out */}
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="btn btn-ghost text-xs"
        >
          Вийти
        </button>
      </div>
    )
  }

  return (
    <button 
      onClick={() => signIn('google')}
      className="btn btn-primary"
    >
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Увійти з Google
    </button>
  )
}
