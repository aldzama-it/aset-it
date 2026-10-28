import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac/server-guard'
import bcrypt from 'bcryptjs'

// GET: Ambil detail user
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requirePermission('settings.users')
  if (guard.error) return guard.error

  const { id } = await params
  const userId = parseInt(id, 10)
  if (isNaN(userId)) {
    return NextResponse.json({ success: false, message: 'ID pengguna tidak valid' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil data pengguna' }, { status: 500 })
  }
}

// PUT: Perbarui data user (nama, email, role_id, opsional password baru)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requirePermission('settings.users')
  if (guard.error) return guard.error

  const { id } = await params
  const userId = parseInt(id, 10)
  if (isNaN(userId)) {
    return NextResponse.json({ success: false, message: 'ID pengguna tidak valid' }, { status: 400 })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan' }, { status: 404 })
    }

    const body = await req.json()
    const { name, email, password, role_id } = body

    const updateData: any = {}
    if (name) updateData.name = name.trim()
    if (email) {
      const cleanEmail = email.trim().toLowerCase()
      // Cek apakah email bentrok dengan akun lain
      const duplicate = await prisma.user.findFirst({
        where: {
          email: cleanEmail,
          NOT: { id: userId },
        },
      })
      if (duplicate) {
        return NextResponse.json(
          { success: false, message: 'Email sudah terdaftar pada pengguna lain' },
          { status: 400 }
        )
      }
      updateData.email = cleanEmail
    }

    if (password && password.trim().length > 0) {
      updateData.password = await bcrypt.hash(password.trim(), 10)
    }

    if (role_id !== undefined) {
      updateData.role_id = role_id ? parseInt(role_id, 10) : null
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
      },
    })

    return NextResponse.json({ success: true, data: updatedUser, message: 'Data pengguna berhasil diperbarui' })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui data pengguna' }, { status: 500 })
  }
}

// DELETE: Hapus akun pengguna
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requirePermission('settings.users')
  if (guard.error) return guard.error

  const { id } = await params
  const userId = parseInt(id, 10)
  if (isNaN(userId)) {
    return NextResponse.json({ success: false, message: 'ID pengguna tidak valid' }, { status: 400 })
  }

  // Cegah user menghapus dirinya sendiri saat login
  if (guard.session && guard.session.userId == userId) {
    return NextResponse.json(
      { success: false, message: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif' },
      { status: 400 }
    )
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan' }, { status: 404 })
    }

    // Pastikan tidak menghapus Super Admin terakhir
    if (existing.role?.name === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: {
          role: {
            name: 'SUPER_ADMIN',
          },
        },
      })
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { success: false, message: 'Tidak dapat menghapus satu-satunya akun Super Admin pada sistem' },
          { status: 400 }
        )
      }
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true, message: 'Pengguna berhasil dihapus' })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus pengguna' }, { status: 500 })
  }
}

