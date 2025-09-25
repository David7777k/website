"use client"
import React, { useState } from 'react'
import Modal from './Modal'

export default function WheelModal({ open, onClose }: { open: boolean, onClose: ()=>void }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const spin = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/wheel', { method: 'POST', headers: { 'x-user-id': '1' } })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setResult(json)
    } catch (e:any) {
      setResult({ error: e.message })
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-1">Колесо фортуни</h3>
          <p className="text-sm text-[var(--muted)] mb-4">Одна прокрутка кожні 7 днів. Авторизуйтесь для участі. Призи зберігаються у купонах.</p>
          <div className="flex gap-3">
            <button onClick={spin} disabled={loading} className="btn btn-primary">{loading ? 'Крутимо...' : 'Крутити'}</button>
            <button onClick={onClose} className="btn btn-ghost">Закрити</button>
          </div>
          <div className="mt-4">
            {result && result.error && <div className="text-red-400">{result.error}</div>}
            {result && result.prize && (
              <div className="mt-3 p-4 bg-[var(--glass)] rounded">
                <div className="text-lg font-semibold">Вітаємо!</div>
                <div className="mt-1">Приз: <strong>{result.prize}</strong></div>
                <div className="mt-2 text-sm text-[var(--muted)]">Код: <span className="font-mono ml-2">{result.coupon?.code}</span></div>
              </div>
            )}
          </div>
        </div>
        <div className="w-28 h-28 bg-white/5 rounded-xl flex items-center justify-center">🎁</div>
      </div>
    </Modal>
  )
}
