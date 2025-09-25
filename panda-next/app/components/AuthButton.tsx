"use client"
import React from 'react'

export default function AuthButton() {
  const login = () => {
    // demo: set x-user-id header via cookie / client storage — for now just alert
    alert('Login stub: use x-user-id header in requests for demo')
  }
  return <button onClick={login} className="px-3 py-1 rounded-2xl bg-white text-black text-sm">Увійти</button>
}
