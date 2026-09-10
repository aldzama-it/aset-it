import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'

export async function GET(req: Request, { params }: { params: Promise<{ asset_code: string }> }) {
  const resolvedParams = await params;
  try {
    const data = await prisma.laptop.findMany({
      where: { asset_code: resolvedParams.asset_code },
      orderBy: { handover_date: 'desc' }
    })
    
    // Deduplicate by pic and handover_date
    const grouped = new Map()
    for (const item of data) {
      const key = `${item.pic}-${item.handover_date ? new Date(item.handover_date).toISOString() : ''}`
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key).push(item)
    }

    let deduplicated = Array.from(grouped.values()).map(group => {
      const active = group.find((g: any) => g.return_date === null)
      return active || group[0]
    })

    // Re-sort just in case
    deduplicated.sort((a, b) => {
      const dateA = a.handover_date ? new Date(a.handover_date).getTime() : 0;
      const dateB = b.handover_date ? new Date(b.handover_date).getTime() : 0;
      return dateB - dateA;
    });
    
    if (deduplicated.length === 0) {
      return Response.json({ success: false, error: 'Asset tidak ditemukan' }, { status: 404 })
    }

    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengambil data riwayat laptop') }, { status: 500 })
  }
}
