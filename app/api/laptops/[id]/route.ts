import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { getErrorMessage } from '@/lib/utils'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const id = +resolvedParams.id
    if (isNaN(id)) {
      return Response.json({ success: false, error: 'ID tidak valid' }, { status: 400 })
    }

    const body = await req.json()
    if (!body.brand || !String(body.brand).trim()) {
      return Response.json({ success: false, error: 'Brand laptop wajib diisi' }, { status: 400 })
    }
    if (!body.model || !String(body.model).trim()) {
      return Response.json({ success: false, error: 'Model / Tipe laptop wajib diisi' }, { status: 400 })
    }

    const before = await prisma.laptop.findUnique({ where: { id } })
    if (!before) {
      return Response.json({ success: false, error: 'Data laptop tidak ditemukan' }, { status: 404 })
    }

    const sanitizedData = {
      asset_code: body.asset_code ? String(body.asset_code).trim() : before.asset_code,
      pic: body.pic ? String(body.pic).trim() : null,
      department: body.department ? String(body.department).trim() : null,
      division: body.division ? String(body.division).trim() : null,
      job_level: body.job_level ? String(body.job_level).trim() : null,
      branch: body.branch ? String(body.branch).trim() : null,
      brand: String(body.brand).trim(),
      model: String(body.model).trim(),
      ram: body.ram ? String(body.ram).trim() : null,
      storage: body.storage ? String(body.storage).trim() : null,
      processor: body.processor ? String(body.processor).trim() : null,
      screen_size: body.screen_size ? String(body.screen_size).trim() : null,
      mac_address: body.mac_address ? String(body.mac_address).trim().slice(0, 17) : null,
      handover_date: body.handover_date ? new Date(body.handover_date) : null,
      return_date: body.return_date ? new Date(body.return_date) : null,
      condition: body.condition || before.condition || 'Baik',
      attachment_name: body.attachment_name || null,
      attachment_path: body.attachment_path || null,
      notes: body.notes ? String(body.notes).trim() : null,
      it_handover: body.it_handover ? String(body.it_handover).trim() : null,
      it_receiver: body.it_receiver ? String(body.it_receiver).trim() : null,
      admin_password: body.admin_password ? String(body.admin_password).trim() : null,
      anydesk_code: body.anydesk_code ? String(body.anydesk_code).trim() : null,
      updated_at: new Date()
    }

    const data = await prisma.laptop.update({
      where: { id },
      data: sanitizedData
    })

    await recordHistory({
      table_name: 'laptops', asset_id: data.id, asset_code: data.asset_code,
      action: before?.pic !== data.pic ? 'Diserahkan'
            : before?.branch !== data.branch ? 'Dipindah_Lokasi'
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
  const { searchParams } = new URL(req.url)
  const cascade = searchParams.get('cascade') === 'true'

  try {
    const id = +resolvedParams.id
    if (isNaN(id)) {
      return Response.json({ success: false, error: 'ID tidak valid' }, { status: 400 })
    }

    const before = await prisma.laptop.findUnique({ where: { id } })
    if (!before) {
      return Response.json({ success: false, error: 'Data laptop tidak ditemukan' }, { status: 404 })
    }

    await recordHistory({
      table_name: 'laptops', asset_id: id, asset_code: before.asset_code,
      action: 'Dihapus', old_condition: before.condition,
      notes: cascade ? 'Aset laptop beserta seluruh riwayatnya dihapus' : 'Baris penugasan dihapus'
    })

    if (cascade && before.asset_code) {
      await prisma.laptop.deleteMany({ where: { asset_code: before.asset_code } })
    } else {
      await prisma.laptop.delete({ where: { id } })
    }

    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menghapus data') }, { status: 500 })
  }
}
