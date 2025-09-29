import { NextRequest, NextResponse } from 'next/server'
import { initializeApp } from '@/lib/init'

export async function POST(request: NextRequest) {
  try {
    await initializeApp()
    return NextResponse.json({ success: true, message: 'App initialized successfully' })
  } catch (error) {
    console.error('Error initializing app:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to initialize app',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to initialize the app',
    endpoints: {
      'POST /api/init': 'Initialize the PANDA app with default data'
    }
  })
}