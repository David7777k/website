import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { SettingsManager } from '@/lib/settings'
import { prisma } from '@/lib/prisma'

// GET /api/admin/settings - получить все настройки
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const settings = await SettingsManager.getAllSettings()
    
    // Group settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    }, {} as Record<string, typeof settings>)

    return NextResponse.json({ settings: groupedSettings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/settings - обновить настройки
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true, id: true, name: true }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { settings } = await request.json()
    
    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 })
    }

    // Update settings
    await SettingsManager.updateSettings(settings)

    // Log admin action
    await prisma.adminLog.create({
      data: {
        admin_id: user.id,
        admin_name: user.name || 'Unknown',
        action: 'update_settings',
        details: `Updated ${settings.length} settings`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}