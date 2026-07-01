import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingCategoryCount = await prisma.assetCategory.count()

  if (existingCategoryCount > 0) {
    console.log('Seed dilewati: kategori aset sudah tersedia')
    return
  }

  await prisma.assetCategory.createMany({
    data: [
      { name: 'Monitor', prefix: 'MNT', icon: 'Monitor' },
      { name: 'Mouse', prefix: 'MSE', icon: 'Mouse' },
      { name: 'Keyboard', prefix: 'KBD', icon: 'Keyboard' },
      { name: 'UPS', prefix: 'UPS', icon: 'BatteryCharging' },
    ],
  })

  console.log('Seed berhasil: kategori aset default ditambahkan')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
