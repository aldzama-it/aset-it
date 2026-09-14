import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { generateAssetCode } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  try {
    const allData = await prisma.starlink.findMany({
      orderBy: { created_at: 'desc' }
    })

    const grouped = new Map<string, any[]>()
    for (const item of allData) {
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
          (item.asset_code && String(item.asset_code).toLowerCase().includes(s))
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
    const body = await req.json()
    let asset_code = body.asset_code
    if (!asset_code) {
      const last = await prisma.starlink.findFirst({ orderBy: { id: 'desc' } })
      asset_code = generateAssetCode('STL', last?.asset_code)
    }
    const data = await prisma.starlink.create({
      data: { ...body, asset_code , updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'starlinks', asset_id: data.id, asset_code,
      action: 'Dibuat', new_condition: 'Baik',
      to_location: data.location
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e: any) {
    return Response.json({ success: false, error: 'Gagal menyimpan data', details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
