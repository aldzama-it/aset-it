import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { getErrorMessage } from '@/lib/utils'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const body = await req.json()
    const before = await prisma.laptop.findUnique({ where: { id: +resolvedParams.id } })
    const data = await prisma.laptop.update({
      where: { id: +resolvedParams.id }, data: { ...body, updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'laptops', asset_id: data.id, asset_code: data.asset_code,
      action: before?.branch !== data.branch ? 'Dipindah_Lokasi'
            : before?.condition !== data.condition ? 'Kondisi_Berubah'
            : 'Diperbarui',
      old_condition: before?.condition, new_condition: data.condition,
      from_location: before?.branch, to_location: data.branch,
      from_employee: before?.pic, to_employee: data.pic
    })
    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengupdate data') }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const before = await prisma.laptop.findUnique({ where: { id: +resolvedParams.id } })
    await recordHistory({
      table_name: 'laptops', asset_id: +resolvedParams.id, asset_code: before?.asset_code,
      action: 'Dihapus', old_condition: before?.condition
    })
    await prisma.laptop.delete({ where: { id: +resolvedParams.id } })
    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menghapus data') }, { status: 500 })
  }
}
