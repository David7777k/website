import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '@/lib/prisma'

// GET /api/admin/promos - получить список промокодов
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const source = searchParams.get('source') || ''

    const skip = (page - 1) * limit
    const now = new Date()

    // Build filter conditions
    const where: any = {}
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      switch (status) {
        case 'active':
          where.is_active = true
          where.valid_until = { gte: now }
          break
        case 'expired':
          where.valid_until = { lt: now }
          break
        case 'disabled':
          where.is_active = false
          break
        case 'used_up':
          where.AND = [
            { max_uses: { not: null } },
            { uses_count: { gte: prisma.promoCode.fields.max_uses } }
          ]
          break
      }
    }
    
    if (source && source !== 'all') {
      where.source = source
    }

    const [promos, totalCount] = await Promise.all([
      prisma.promoCode.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          usage_logs: {
            take: 5,
            orderBy: { used_at: 'desc' },
            select: {
              user_id: true,
              order_amount: true,
              discount_amount: true,
              used_at: true
            }
          }
        }
      }),
      prisma.promoCode.count({ where })
    ])

    // Add status info to each promo
    const promosWithStatus = promos.map(promo => {
      let status = 'active'
      
      if (!promo.is_active) {
        status = 'disabled'
      } else if (promo.valid_until < now) {
        status = 'expired'
      } else if (promo.max_uses && promo.uses_count >= promo.max_uses) {
        status = 'used_up'
      }
      
      return {
        ...promo,
        computed_status: status,
        usage_rate: promo.max_uses ? (promo.uses_count / promo.max_uses) * 100 : null
      }
    })

    return NextResponse.json({
      promos: promosWithStatus,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching promos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/promos - создать промокод
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true, id: true, name: true }
    })

    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const promoData = await request.json()
    const {
      code,
      title,
      description,
      type,
      value,
      min_amount,
      max_uses,
      valid_from,
      valid_until,
      generate_multiple,
      count = 1
    } = promoData

    // For staff - check weekly limit
    if (user.role === 'staff') {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - 7)
      
      const weeklyPromosCount = await prisma.promoCode.count({
        where: {
          created_by: user.id,
          created_at: { gte: weekStart },
          source: 'staff'
        }
      })
      
      if (weeklyPromosCount >= 2) {
        return NextResponse.json({ 
          error: 'Недельный лимит создания промокодов исчерпан (2 промокода)' 
        }, { status: 403 })
      }
    }

    const promos = []
    const promosToCreate = generate_multiple ? count : 1

    for (let i = 0; i < promosToCreate; i++) {
      let promoCode = code
      
      // If generating multiple, append number
      if (generate_multiple && count > 1) {
        promoCode = `${code}_${String(i + 1).padStart(2, '0')}`
      }
      
      // Check if code already exists
      const existingPromo = await prisma.promoCode.findUnique({
        where: { code: promoCode }
      })
      
      if (existingPromo) {
        return NextResponse.json({ 
          error: `Промокод ${promoCode} уже существует` 
        }, { status: 400 })
      }

      const newPromo = await prisma.promoCode.create({
        data: {
          code: promoCode,
          title,
          description,
          type,
          value: parseInt(value),
          min_amount: min_amount ? parseInt(min_amount) : null,
          max_uses: max_uses ? parseInt(max_uses) : null,
          valid_from: new Date(valid_from),
          valid_until: new Date(valid_until),
          source: user.role === 'admin' ? 'admin' : 'staff',
          created_by: user.id
        }
      })

      promos.push(newPromo)
    }

    // Log admin action
    await prisma.adminLog.create({
      data: {
        admin_id: user.id,
        admin_name: user.name || 'Unknown',
        action: 'create_promo',
        target_type: 'promo',
        details: `Created ${promos.length} promo code(s): ${promos.map(p => p.code).join(', ')}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json({ 
      promos: promos.length === 1 ? promos[0] : promos,
      count: promos.length 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating promo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}