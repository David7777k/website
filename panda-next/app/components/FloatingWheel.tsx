"use client"
import React, { useState } from 'react'
import WheelModal from './WheelModal'

export default function FloatingWheel() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="fixed right-4 bottom-6">
        <button onClick={()=>setOpen(true)} className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--bamboo)] to-[var(--bamboo-2)] text-black text-2xl shadow-lg">🎡</button>
      </div>
      <WheelModal open={open} onClose={()=>setOpen(false)} />
    </>
  )
}
