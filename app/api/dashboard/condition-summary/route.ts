import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const summary: Record<string, number> = {
      Baru: 0,
      Baik: 0,
      Perlu_Servis: 0,
      Rusak: 0,
      Hilang: 0,
      Tidak_Aktif: 0
    }

    const tables = [
      prisma.printer, prisma.cctv,
      prisma.laptop, prisma.ht,
      prisma.tablet, prisma.camera, prisma.generalInventory
    ]

    for (const table of tables) {
      const counts = await (table as any).groupBy({
        by: ['condition'],
        _count: true
      })
      counts.forEach((c: any) => {
        if (summary[c.condition] !== undefined) {
          summary[c.condition] += c._count
        }
      })
    }

    return Response.json({ success: true, data: summary })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal mengambil condition summary' }, { status: 500 })
  }
}
