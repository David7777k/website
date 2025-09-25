"use client"
import React from 'react'

export default function Modal({ open, onClose, children }: { open: boolean, onClose: ()=>void, children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full md:w-2/3 bg-[var(--bg-2)] rounded-2xl p-6 m-4">
        <button className="absolute right-4 top-4 text-gray-300" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  )
}
