import { prisma } from '@/lib/prisma'
import { getHistoryActor } from '@/lib/history'
import { getErrorMessage } from '@/lib/utils'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()
    const data = { ...body }
    delete data.id
    delete data.category
    const assetId = parseInt((await params).id)
    const changedBy = await getHistoryActor()
    const res = await prisma.$transaction(async (tx) => {
      const before = await tx.generalAsset.findUniqueOrThrow({ where: { id: assetId } })
      const updated = await tx.generalAsset.update({
        where: { id: assetId },
        data: { ...data, updated_at: new Date() },
      })
      await tx.assetHistory.create({
        data: {
          table_name: 'generalAssets',
          asset_id: updated.id,
          asset_code: updated.asset_code,
          action: before.pic !== updated.pic
            ? 'Diserahkan'
            : before.location !== updated.location
              ? 'Dipindah_Lokasi'
              : before.condition !== updated.condition
                ? 'Kondisi_Berubah'
                : 'Diperbarui',
          from_employee: before.pic,
          to_employee: updated.pic,
          from_location: before.location,
          to_location: updated.location,
          old_condition: before.condition,
          new_condition: updated.condition,
          changed_by: changedBy,
        },
      })
      return updated
    })
    return Response.json({ success: true, data: res })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengupdate data') }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const assetId = parseInt((await params).id)
    const changedBy = await getHistoryActor()
    const res = await prisma.$transaction(async (tx) => {
      const before = await tx.generalAsset.findUniqueOrThrow({ where: { id: assetId } })
      await tx.assetHistory.create({
        data: {
          table_name: 'generalAssets',
          asset_id: before.id,
          asset_code: before.asset_code,
          action: 'Dihapus',
          from_employee: before.pic,
          from_location: before.location,
          old_condition: before.condition,
          changed_by: changedBy,
        },
      })
      return tx.generalAsset.delete({ where: { id: assetId } })
    })
    return Response.json({ success: true, data: res })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menghapus data') }, { status: 500 })
  }
}
