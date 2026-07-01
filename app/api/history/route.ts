import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = searchParams.get('limit')
  const take = limit ? parseInt(limit) : 20

  try {
    const data = await prisma.assetHistory.findMany({
      orderBy: { event_at: 'desc' },
      take
    })
    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal mengambil riwayat' }, { status: 500 })
  }
}
