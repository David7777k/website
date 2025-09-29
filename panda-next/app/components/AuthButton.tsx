"use client"
import React, { useState } from 'react'
import AuthModal from './AuthModal'

export default function AuthButton() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  // Mock session state - replace with real NextAuth
  const [session, setSession] = useState<any>(null)

  const handleSignOut = () => {
    setSession(null)
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
              className="w-8 h-8 rounded-full border-2 border-bamboo"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bamboo to-bamboo-light flex items-center justify-center text-black text-sm font-bold">
              {session.user?.name?.charAt(0) || '?'}
            </div>
          )}
          <div className="hidden lg:block">
            <div className="text-sm font-medium">{session.user?.name}</div>
            <div className="text-xs text-bamboo capitalize font-semibold">{session.user?.role || 'guest'}</div>
          </div>
        </a>

        {/* Role-based navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {session.user?.role === 'admin' && (
            <a href="/admin" className="btn btn-ghost text-xs">
              🛠️ Адмін
            </a>
          )}
          {(['staff', 'admin'] as string[]).includes(session.user?.role) && (
            <a href="/staff" className="btn btn-ghost text-xs">
              👷 Персонал
            </a>
          )}
        </div>

        {/* Sign out */}
        <button 
          onClick={handleSignOut}
          className="btn btn-ghost text-xs"
        >
          🚪 Вийти
        </button>
      </div>
    )
  }

  return (
    <>
      <button 
        onClick={() => setAuthModalOpen(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          🔑
        </div>
        Увійти
      </button>
      
      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setSession({ user })
          setAuthModalOpen(false)
        }}
      />
    </>
  )
}
