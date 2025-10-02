"use client"
import React, { useState } from 'react'

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="md:hidden flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-extrabold">🐼</div>
          <div className="text-sm font-semibold tracking-tight">PANDA</div>
        </div>
        <button onClick={()=>setOpen(!open)} className="px-3 py-2 rounded bg-white/6">{open ? '✕' : '☰'}</button>
      </div>
      {open && (
        <div className="md:hidden p-4 space-y-3 bg-[var(--panel)] rounded-b-2xl">
          <a href="/" className="block py-2 px-3 rounded hover:bg-white/2">Головна</a>
          <a href="/events" className="block py-2 px-3 rounded hover:bg-white/2">Події</a>
          <a href="/menu" className="block py-2 px-3 rounded hover:bg-white/2">Меню</a>
          <a href="/faq" className="block py-2 px-3 rounded hover:bg-white/2">FAQ</a>
        </div>
      )}
    </>
  )
}
