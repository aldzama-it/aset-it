import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const alerts: any[] = []
    const tables = [
      { name: 'Jaringan', model: prisma.networkDevice, labelField: 'name' },
      { name: 'Printer', model: prisma.printer, labelField: 'model' },
      { name: 'CCTV', model: prisma.cctv, labelField: 'model' },
      { name: 'Laptop', model: prisma.laptop, labelField: 'model' },
      { name: 'Aksesoris', model: prisma.laptopAccessory, labelField: 'item_name' },
      { name: 'HT', model: prisma.ht, labelField: 'model' },
      { name: 'Tablet', model: prisma.tablet, labelField: 'model' },
      { name: 'Kamera', model: prisma.camera, labelField: 'model' },
      { name: 'Starlink', model: prisma.starlink, labelField: 'serial_number' },
      { name: 'Dashcam', model: prisma.dashcam, labelField: 'vehicle_name' },
    ]

    for (const table of tables) {
      const items = await (table.model as any).findMany({
        where: {
          condition: { in: ['Rusak', 'Perlu_Servis'] }
        }
      })
      items.forEach((item: any) => {
        alerts.push({
          id: item.id,
          asset_code: item.asset_code || '-',
          name: item[table.labelField] || '-',
          category: table.name,
          condition: item.condition,
          location: item.location?.name || '-'
        })
      })
    }

    return Response.json({ success: true, data: alerts })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal mengambil alerts' }, { status: 500 })
  }
}
