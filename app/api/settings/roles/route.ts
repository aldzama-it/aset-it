import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac/server-guard'

// GET: Ambil daftar seluruh role beserta jumlah user dan izin menu
export async function GET() {
  const guard = await requirePermission('settings.roles')
  if (guard.error) return guard.error

  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          select: {
            menu_key: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    })

    const formatted = roles.map(role => ({
      id: role.id,
      name: role.name,
      label: role.label,
      description: role.description,
      is_system: role.is_system,
      user_count: role._count.users,
      permissions: role.permissions.map(p => p.menu_key),
      created_at: role.created_at,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error: any) {
    console.error('Error fetching roles:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data role' }, { status: 500 })
  }
}

// POST: Buat role baru
export async function POST(req: Request) {
  const guard = await requirePermission('settings.roles')
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    const { name, label, description, permissions } = body

    if (!name || !label) {
      return NextResponse.json(
        { success: false, message: 'Kode Role (name) dan Nama Role (label) wajib diisi' },
        { status: 400 }
      )
    }

    const sanitizedCode = name.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_')

    // Cek apakah kode sudah digunakan
    const existing = await prisma.role.findUnique({
      where: { name: sanitizedCode },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Kode role '${sanitizedCode}' sudah ada` },
        { status: 400 }
      )
    }

    const role = await prisma.role.create({
      data: {
        name: sanitizedCode,
        label: label.trim(),
        description: description?.trim() || null,
        is_system: false,
        permissions: Array.isArray(permissions) && permissions.length > 0 ? {
          create: permissions.map((key: string) => ({ menu_key: key })),
        } : undefined,
      },
      include: {
        permissions: true,
      },
    })

    return NextResponse.json({ success: true, data: role, message: 'Role baru berhasil dibuat' })
  } catch (error: any) {
    console.error('Error creating role:', error)
    return NextResponse.json({ success: false, message: 'Gagal membuat role baru' }, { status: 500 })
  }
}

