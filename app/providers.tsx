'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { NotificationProvider } from './components/NotificationSystem'

export function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode
  session: any
}) {
  return (
    <SessionProvider session={session}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </SessionProvider>
  )
}