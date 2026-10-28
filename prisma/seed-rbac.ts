import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { DEFAULT_ROLE_PRESETS } from '../lib/rbac/permissions-config'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Memulai Seeding RBAC ---')

  // 1. Seed Roles & Permissions
  for (const preset of DEFAULT_ROLE_PRESETS) {
    const role = await prisma.role.upsert({
      where: { name: preset.name },
      update: {
        label: preset.label,
        description: preset.description,
        is_system: preset.is_system,
      },
      create: {
        name: preset.name,
        label: preset.label,
        description: preset.description,
        is_system: preset.is_system,
      },
    })

    console.log(`Role '${role.name}' siap (ID: ${role.id})`)

    // Bersihkan permission lama role ini lalu insert yang terbaru
    await prisma.rolePermission.deleteMany({
      where: { role_id: role.id },
    })

    if (preset.defaultPermissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: preset.defaultPermissions.map(key => ({
          role_id: role.id,
          menu_key: key,
        })),
        skipDuplicates: true,
      })
    }
  }

  // 2. Ambil Super Admin Role
  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  })
  const itSupportRole = await prisma.role.findUnique({
    where: { name: 'IT_SUPPORT' },
  })

  if (!superAdminRole) {
    throw new Error('Super Admin role tidak ditemukan!')
  }

  // 3. Upsert Super Admin User
  const defaultAdminEmail = process.env.ADMIN_USERNAME || 'admin@aldzama.com'
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'password'
  const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10)

  const adminUser = await prisma.user.upsert({
    where: { email: defaultAdminEmail },
    update: {
      role_id: superAdminRole.id,
      password: hashedPassword,
    },
    create: {
      name: 'Super Administrator',
      email: defaultAdminEmail,
      password: hashedPassword,
      role_id: superAdminRole.id,
    },
  })
  console.log(`Admin User siap: ${adminUser.email} (Role: Super Admin)`)

  // 4. Buat contoh User IT Support jika belum ada (berguna untuk testing RBAC)
  const supportEmail = 'support@aldzama.com'
  if (itSupportRole) {
    await prisma.user.upsert({
      where: { email: supportEmail },
      update: {
        role_id: itSupportRole.id,
      },
      create: {
        name: 'Staff IT Support',
        email: supportEmail,
        password: hashedPassword,
        role_id: itSupportRole.id,
      },
    })
    console.log(`Demo IT Support User siap: ${supportEmail} (Role: IT Support)`)
  }

  console.log('--- Seeding RBAC Selesai Berhasil ---')
}

main()
  .catch((e) => {
    console.error('Error saat seeding RBAC:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

