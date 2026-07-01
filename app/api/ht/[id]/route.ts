import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const body = await req.json()
    const before = await prisma.ht.findUnique({ where: { id: +resolvedParams.id } })
    const data = await prisma.ht.update({
      where: { id: +resolvedParams.id }, data: { ...body, updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'hts', asset_id: data.id, asset_code: data.asset_code,
      action: before?.branch !== data.branch ? 'Dipindah_Lokasi'
            : before?.pic_name !== data.pic_name ? 'Diserahkan'
            : before?.condition !== data.condition ? 'Kondisi_Berubah'
            : 'Diperbarui',
      old_condition: before?.condition, new_condition: data.condition,
      from_location: before?.branch, to_location: data.branch,
      from_employee: before?.pic_name, to_employee: data.pic_name
    })
    return Response.json({ success: true, data })
  } catch (e) {
    console.error("Update error:", e)
    return Response.json({ success: false, error: 'Gagal mengupdate data' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const before = await prisma.ht.findUnique({ where: { id: +resolvedParams.id } })
    await recordHistory({
      table_name: 'hts', asset_id: +resolvedParams.id, asset_code: before?.asset_code,
      action: 'Dihapus', old_condition: before?.condition
    })
    await prisma.ht.delete({ where: { id: +resolvedParams.id } })
    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal menghapus data' }, { status: 500 })
  }
}
