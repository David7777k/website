"use client"
import React, { useState } from 'react'
import VisitConfirmation from '../components/VisitConfirmation'
import WheelModal from '../components/WheelModal'

export default function VisitConfirmationPage() {
  const [showWheel, setShowWheel] = useState(false)

  const handleComplete = () => {
    setShowWheel(true)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <VisitConfirmation onComplete={handleComplete} />
      
      {showWheel && (
        <WheelModal
          open={showWheel}
          onClose={() => setShowWheel(false)}
        />
      )}
    </div>
  )
}