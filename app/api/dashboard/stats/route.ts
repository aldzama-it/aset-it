import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [network, printers, cctv, laptops, accessories, ht, tablets, cameras, starlinks, dashcams] = await Promise.all([
      prisma.networkDevice.count(),
      prisma.printer.count(),
      prisma.cctv.count(),
      prisma.laptop.count(),
      prisma.laptopAccessory.count(),
      prisma.ht.count(),
      prisma.tablet.count(),
      prisma.camera.count(),
      prisma.starlink.count(),
      prisma.dashcam.count(),
    ])
    return Response.json({ success: true, data: { network, printers, cctv, laptops, accessories, ht, tablets, cameras, starlinks, dashcams } })
  } catch (e: any) {
    console.error("STATS API ERROR:", e)
    return Response.json({ success: false, error: 'Gagal mengambil stats', details: e.message }, { status: 500 })
  }
}
