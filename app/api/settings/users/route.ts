import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac/server-guard'
import bcrypt from 'bcryptjs'

// GET: Ambil daftar seluruh user beserta role
export async function GET() {
  const guard = await requirePermission('settings.users')
  if (guard.error) return guard.error

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role_id: true,
        role: {
          select: {
            id: true,
            name: true,
            label: true,
            is_system: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return NextResponse.json({ success: true, data: users })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data pengguna' }, { status: 500 })
  }
}

// POST: Buat user baru dan tetapkan rolenya
export async function POST(req: Request) {
  const guard = await requirePermission('settings.users')
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    const { name, email, password, role_id } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Nama, Email, dan Password wajib diisi' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email sudah terdaftar pada akun lain' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role_id: role_id ? parseInt(role_id, 10) : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role_id: true,
        role: {
          select: {
            id: true,
            name: true,
            label: true,
          },
        },
        created_at: true,
      },
    })

    return NextResponse.json({ success: true, data: user, message: 'Pengguna baru berhasil ditambahkan' })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json({ success: false, message: 'Gagal menambahkan pengguna baru' }, { status: 500 })
  }
}

