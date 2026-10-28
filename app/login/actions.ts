'use server'

import { createSession, deleteSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { ALL_MENU_KEYS } from '@/lib/rbac/permissions-config'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return {
      message: 'Email/Username dan Password wajib diisi',
    }
  }

  try {
    // 1. Cari user di database berdasarkan email atau nama
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username.trim().toLowerCase() },
          { name: username.trim() },
        ],
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    })

    // 2. Fallback: jika user belum ditemukan, periksa apakah cocok dengan kredensial .env
    const envAdminUser = (process.env.ADMIN_USERNAME || 'admin@aldzama.com').toLowerCase()
    const envAdminPass = process.env.ADMIN_PASSWORD || 'password'
    const isEnvAdminMatch = (username.trim().toLowerCase() === envAdminUser || username.trim() === 'admin') && password === envAdminPass

    if (!user && isEnvAdminMatch) {
      // Pastikan role SUPER_ADMIN ada
      let superRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } })
      if (!superRole) {
        superRole = await prisma.role.create({
          data: {
            name: 'SUPER_ADMIN',
            label: 'Super Admin',
            description: 'Akses penuh ke seluruh sistem',
            is_system: true,
          },
        })
      }

      // Buat user admin secara otomatis
      const hashedPassword = await bcrypt.hash(password, 10)
      user = await prisma.user.create({
        data: {
          name: 'Super Administrator',
          email: envAdminUser,
          password: hashedPassword,
          role_id: superRole.id,
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      })
    }

    if (!user) {
      return {
        message: 'Email atau password salah',
      }
    }

    // 3. Verifikasi password jika user ditemukan
    const isPasswordValid = await bcrypt.compare(password, user.password)
    // Beri toleransi jika password di database berupa plain text legacy atau env fallback
    const isPlainMatch = user.password === password
    if (!isPasswordValid && !isPlainMatch && !isEnvAdminMatch) {
      return {
        message: 'Email atau password salah',
      }
    }

    // Jika password masih plain text, rehash otomatis ke bcrypt
    if (isPlainMatch && !isPasswordValid) {
      const newHash = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash },
      })
    }

    // 4. Hitung daftar permissions
    let permissions: string[] = []
    const roleName = user.role?.name || 'STAFF'
    const roleLabel = user.role?.label || 'Staff'

    if (roleName === 'SUPER_ADMIN') {
      permissions = ALL_MENU_KEYS
    } else if (user.role?.permissions) {
      permissions = user.role.permissions.map(p => p.menu_key)
    }

    // 5. Buat session terenkripsi
    await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      roleId: user.role_id,
      roleName: roleName,
      roleLabel: roleLabel,
      permissions,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error saat login:', error)
    return {
      message: 'Terjadi kesalahan sistem saat memproses login',
    }
  }
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
