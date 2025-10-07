import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { confirmPassword, reason } = body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Soft delete: block the user account instead of deleting
    // This preserves data integrity and allows for account recovery
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        is_blocked: true,
        email: `deleted_${user.id}_${user.email}`, // Anonymize email
        name: 'Видалений користувач',
        phone: null,
        image: null,
        password: null
      }
    })

    // Log the deletion
    await prisma.adminLog.create({
      data: {
        admin_id: user.id,
        admin_name: user.name || 'Unknown',
        action: 'account_deletion',
        target_type: 'user',
        target_id: user.id,
        details: reason ? `Reason: ${reason}` : 'Self-deleted account',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      }
    })

    return NextResponse.json({
      message: 'Account deleted successfully',
      success: true
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
