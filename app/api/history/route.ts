import { prisma } from '@/lib/prisma'
import type { Prisma, assethistory_action } from '@prisma/client'

const historyActions: assethistory_action[] = [
  'Dibuat',
  'Diperbarui',
  'Dipindah_Lokasi',
  'Diserahkan',
  'Dikembalikan',
  'Kondisi_Berubah',
  'Dihapus',
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const rawLimit = searchParams.get('limit')
  const rawAssetId = searchParams.get('asset_id')
  const tableName = searchParams.get('table_name')?.trim()
  const assetCode = searchParams.get('asset_code')?.trim()
  const rawAction = searchParams.get('action')
  const parsedLimit = rawLimit ? Number(rawLimit) : 20
  const assetId = rawAssetId ? Number(rawAssetId) : undefined

  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
    return Response.json({ success: false, error: 'Limit tidak valid' }, { status: 400 })
  }
  if (rawAssetId && (!Number.isInteger(assetId) || (assetId ?? 0) <= 0)) {
    return Response.json({ success: false, error: 'Asset ID tidak valid' }, { status: 400 })
  }
  if (rawAction && !historyActions.includes(rawAction as assethistory_action)) {
    return Response.json({ success: false, error: 'Aksi history tidak valid' }, { status: 400 })
  }

  const where: Prisma.AssetHistoryWhereInput = {
    table_name: tableName || undefined,
    asset_id: assetId,
    asset_code: assetCode || undefined,
    action: rawAction ? rawAction as assethistory_action : undefined,
  }

  try {
    const data = await prisma.assetHistory.findMany({
      where,
      orderBy: { id: 'desc' },
      take: Math.min(parsedLimit, 200),
    })
    return Response.json({ success: true, data })
  } catch (error) {
    console.error('HISTORY API ERROR:', error)
    return Response.json({ success: false, error: 'Gagal mengambil riwayat' }, { status: 500 })
  }
}
