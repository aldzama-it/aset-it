import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { generateAssetCode } from '@/lib/utils'
import { hasHtDetails, htCreateSchema } from '@/lib/ht-validation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  try {
    const allData = await prisma.ht.findMany({
      orderBy: { created_at: 'desc' }
    })
    const validData = allData.filter((item) => hasHtDetails(item as Record<string, unknown>))

    const grouped = new Map<string, any[]>()
    for (const item of validData) {
      if (!item.asset_code) {
        grouped.set('no-code-' + item.id, [item])
        continue
      }
      if (!grouped.has(item.asset_code)) {
        grouped.set(item.asset_code, [])
      }
      grouped.get(item.asset_code)!.push(item)
    }

    let processedData: any[] = []
    let total = 0
    let rusak = 0
    let tersedia = 0
    let dipakai = 0

    for (const group of Array.from(grouped.values())) {
      total++
      // Urutkan berdasarkan timeline secara descending
      group.sort((a: any, b: any) => {
        const dateA = new Date(a.handover_date || a.install_date || a.created_at).getTime()
        const dateB = new Date(b.handover_date || b.install_date || b.created_at).getTime()
        return dateB - dateA
      })

      const active = group.find((g: any) => g.return_date === null)

      if (!active) {
        // Aset ini sudah dikembalikan -> Tidak Terpakai
        tersedia++
        const unassigned = {
          ...group[0],
          status_virtual: 'Tersedia'
        }
        if (unassigned.condition === 'Rusak' || unassigned.condition === 'Perlu_Servis') {
          rusak++
        }
        processedData.push(unassigned)
      } else {
        const pic = active.pic_name || active.pic
        // 1. Kondisi (independen)
        if (active.condition === 'Rusak' || active.condition === 'Perlu_Servis') {
          rusak++
        }
        // 2. Status Pakai (independen)
        if (!pic) {
          tersedia++
          active.status_virtual = 'Tersedia'
        } else {
          dipakai++
          active.status_virtual = 'Dipakai'
        }
        processedData.push(active)
      }
    }

    if (search) {
      const s = search.toLowerCase()
      processedData = processedData.filter((item: any) => {
        return (
          (item.asset_code && String(item.asset_code).toLowerCase().includes(s)) ||
          (item.pic_name && String(item.pic_name).toLowerCase().includes(s)) ||
          (item.brand && String(item.brand).toLowerCase().includes(s)) ||
          (item.type && String(item.type).toLowerCase().includes(s)) ||
          (item.division && String(item.division).toLowerCase().includes(s))
        )
      })
    }

    return Response.json({ success: true, data: processedData, summary: { total, rusak, tersedia, dipakai } })
  } catch (e: any) {
    console.error(e)
    return Response.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json()
    // Sanitize old fields
    const body = rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody)
      ? { ...(rawBody as Record<string, unknown>) }
      : rawBody

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ success: false, error: 'Payload data HT tidak valid', message: 'Payload data HT tidak valid' }, { status: 400 })
    }

    delete body.department
    delete body.job_level
    delete body.form_path

    const validation = htCreateSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      return Response.json({
        success: false,
        error: 'Data HT belum lengkap',
        message: 'Brand dan nama penerima wajib diisi',
        errors,
      }, { status: 400 })
    }

    let asset_code = body.asset_code
    if (!asset_code) {
      const last = await prisma.ht.findFirst({ orderBy: { id: 'desc' } })
      asset_code = generateAssetCode('HT', last?.asset_code)
    }
    const data = await prisma.ht.create({
      data: { ...body, asset_code , updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'hts', asset_id: data.id, asset_code,
      action: 'Dibuat', new_condition: data.condition,
      to_employee: data.pic_name, to_location: data.branch
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e: any) {
    console.error(e)
    return Response.json({ success: false, error: 'Gagal menyimpan data', details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
