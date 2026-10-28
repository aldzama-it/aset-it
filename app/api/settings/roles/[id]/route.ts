import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac/server-guard'

// GET: Ambil detail satu role
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requirePermission('settings.roles')
  if (guard.error) return guard.error

  const { id } = await params
  const roleId = parseInt(id, 10)
  if (isNaN(roleId)) {
    return NextResponse.json({ success: false, message: 'ID role tidak valid' }, { status: 400 })
  }

  try {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: true,
        _count: { select: { users: true } },
      },
    })

    if (!role) {
      return NextResponse.json({ success: false, message: 'Role tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: role.id,
        name: role.name,
        label: role.label,
        description: role.description,
        is_system: role.is_system,
        user_count: role._count.users,
        permissions: role.permissions.map(p => p.menu_key),
      },
    })
  } catch (error: any) {
    console.error('Error fetching role:', error)
    return NextResponse.json({ success: false, message: 'Gagal mengambil detail role' }, { status: 500 })
  }
}

// PUT: Perbarui nama, label, deskripsi, dan permissions role
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requirePermission('settings.roles')
  if (guard.error) return guard.error

  const { id } = await params
  const roleId = parseInt(id, 10)
  if (isNaN(roleId)) {
    return NextResponse.json({ success: false, message: 'ID role tidak valid' }, { status: 400 })
  }

  try {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    })

    if (!role) {
      return NextResponse.json({ success: false, message: 'Role tidak ditemukan' }, { status: 404 })
    }

    const body = await req.json()
    const { name, label, description, permissions } = body

    const updateRoleData: any = {}

    // Update label & description jika diberikan
    if (label !== undefined) updateRoleData.label = label.trim()
    if (description !== undefined) updateRoleData.description = description?.trim() || null

    // Update kode role (name) jika bukan SUPER_ADMIN
    if (name && role.name !== 'SUPER_ADMIN') {
      const sanitizedName = name.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_')
      // Cek apakah nama baru bentrok dengan role lain
      const existing = await prisma.role.findFirst({
        where: {
          name: sanitizedName,
          NOT: { id: roleId },
        },
      })
      if (existing) {
        return NextResponse.json(
          { success: false, message: `Kode role '${sanitizedName}' sudah digunakan oleh role lain` },
          { status: 400 }
        )
      }
      updateRoleData.name = sanitizedName
    }

    // Jika role adalah SUPER_ADMIN, pastikan settings.roles dan dashboard selalu diizinkan
    let validPermissions: string[] = Array.isArray(permissions) ? permissions : []
    if (role.name === 'SUPER_ADMIN' && Array.isArray(permissions)) {
      if (!validPermissions.includes('settings.roles')) {
        validPermissions.push('settings.roles')
      }
      if (!validPermissions.includes('dashboard')) {
        validPermissions.push('dashboard')
      }
    }

    // Jalankan update role dan permission secara transaction
    await prisma.$transaction(async (tx) => {
      if (Object.keys(updateRoleData).length > 0) {
        await tx.role.update({
          where: { id: roleId },
          data: updateRoleData,
        })
      }

      if (Array.isArray(permissions)) {
        // Hapus izin lama
        await tx.rolePermission.deleteMany({
          where: { role_id: roleId },
        })

        // Simpan izin baru
        if (validPermissions.length > 0) {
          await tx.rolePermission.createMany({
            data: validPermissions.map(key => ({
              role_id: roleId,
              menu_key: key,
            })),
            skipDuplicates: true,
          })
        }
      }
    })

    return NextResponse.json({ success: true, message: 'Peran (Role) berhasil diperbarui' })
  } catch (error: any) {
    console.error('Error updating role:', error)
    return NextResponse.json({ success: false, message: 'Gagal memperbarui role' }, { status: 500 })
  }
}

// DELETE: Hapus role (semua role dapat dihapus KECUALI Super Admin)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requirePermission('settings.roles')
  if (guard.error) return guard.error

  const { id } = await params
  const roleId = parseInt(id, 10)
  if (isNaN(roleId)) {
    return NextResponse.json({ success: false, message: 'ID role tidak valid' }, { status: 400 })
  }

  try {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        _count: { select: { users: true } },
      },
    })

    if (!role) {
      return NextResponse.json({ success: false, message: 'Role tidak ditemukan' }, { status: 404 })
    }

    // Hanya Super Admin yang mutlak tidak boleh dihapus agar sistem tidak terkunci
    if (role.name === 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Role Super Admin dilindungi sistem dan tidak dapat dihapus' },
        { status: 400 }
      )
    }

    // Jalankan transaksi: lepaskan user dari role ini terlebih dahulu, lalu hapus role
    await prisma.$transaction(async (tx) => {
      if (role._count.users > 0) {
        await tx.user.updateMany({
          where: { role_id: roleId },
          data: { role_id: null },
        })
      }

      await tx.role.delete({
        where: { id: roleId },
      })
    })

    return NextResponse.json({
      success: true,
      message: `Role '${role.label}' berhasil dihapus${role._count.users > 0 ? ` (${role._count.users} pengguna dialihkan ke tanpa role)` : ''}`,
    })
  } catch (error: any) {
    console.error('Error deleting role:', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus role' }, { status: 500 })
  }
}
