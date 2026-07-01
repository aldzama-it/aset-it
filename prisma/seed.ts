import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const locations = await prisma.location.createMany({ data: [
    { name: 'Head Office', type: 'Head_Office' },
    { name: 'Ruang Server', type: 'Server_Room' },
    { name: 'Ruang Finance', type: 'Head_Office' },
    { name: 'Ruang Pak AJ', type: 'Head_Office' },
    { name: 'Ruang Pak Hendar', type: 'Head_Office' },
    { name: 'Cubical Electrical', type: 'Head_Office' },
    { name: 'Lime Package', type: 'Head_Office' },
    { name: 'Ruang Warehouse', type: 'Gudang' },
    { name: 'Dascoland 7D', type: 'Site' },
    { name: 'Dascoland 8I', type: 'Site' },
    { name: 'Refractory', type: 'Site' },
    { name: 'Papua', type: 'Site' },
  ]})

  await prisma.employee.createMany({ data: [
    { name: 'Samuel Frando' },
    { name: 'Mas Diva' },
    { name: 'Aiva' },
    { name: 'Fesy' },
    { name: 'Salma Maulida', division: 'HR' },
    { name: 'M. Ridho', division: 'IT' },
    { name: 'Benny Antares', division: 'Engineering', position: 'Supervisor' },
  ]})

  console.log('Seed berhasil')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
