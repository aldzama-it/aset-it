import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { generateAssetCode, getErrorMessage } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = (searchParams.get('search') || '').toLowerCase()
  try {
    const allLaptops = await prisma.laptop.findMany({
      orderBy: [
        { handover_date: 'desc' },
        { created_at: 'desc' }
      ]
    })

    // Group by asset_code
    const grouped = new Map<string, any[]>()
    for (const laptop of allLaptops) {
      if (!laptop.asset_code) continue
      if (!grouped.has(laptop.asset_code)) {
        grouped.set(laptop.asset_code, [])
      }
      grouped.get(laptop.asset_code)!.push(laptop)
    }

    // Determine active holder
    let processedData = []
    let totalLaptop = 0
    let laptopDipakai = 0
    let laptopTersedia = 0
    let laptopRusak = 0

    for (const [asset_code, group] of grouped.entries()) {
      totalLaptop++
      let active = group.find(g => g.return_date === null)
      
      if (!active) {
        laptopTersedia++
        const unassigned = { 
          ...group[0], 
          status_virtual: 'Tersedia'
        }
        if (unassigned.condition === 'Rusak' || unassigned.condition === 'Perlu_Servis') {
          laptopRusak++
        }
        processedData.push(unassigned)
      } else {
        const pic = active.pic_name || active.pic
        // 1. Kondisi (independen)
        if (active.condition === 'Rusak' || active.condition === 'Perlu_Servis') {
          laptopRusak++
        }
        // 2. Status Pakai (independen)
        if (!pic) {
          laptopTersedia++
          active.status_virtual = 'Tersedia'
        } else {
          laptopDipakai++
          active.status_virtual = 'Aktif'
        }
        processedData.push(active)
      }
    }

    // Apply search filter after grouping
    if (search) {
      processedData = processedData.filter(item => {
        return (
          (item.asset_code && item.asset_code.toLowerCase().includes(search)) ||
          (item.pic && item.pic.toLowerCase().includes(search)) ||
          (item.brand && item.brand.toLowerCase().includes(search)) ||
          (item.model && item.model.toLowerCase().includes(search)) ||
          (item.department && item.department.toLowerCase().includes(search)) ||
          (item.branch && item.branch.toLowerCase().includes(search))
        )
      })
    }

    return Response.json({ 
      success: true, 
      data: processedData,
      summary: {
        total: totalLaptop,
        dipakai: laptopDipakai,
        tersedia: laptopTersedia,
        rusak: laptopRusak
      }
    })
  } catch (e) {
    console.error(e)
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengambil data') }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let asset_code = body.asset_code
    if (!asset_code) {
      const last = await prisma.laptop.findFirst({ orderBy: { id: 'desc' } })
      asset_code = generateAssetCode('LPT', last?.asset_code)
    }
    const data = await prisma.laptop.create({
      data: { ...body, asset_code , updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'laptops', asset_id: data.id, asset_code,
      action: 'Dibuat', new_condition: data.condition,
      to_employee: data.pic, to_location: data.branch
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menyimpan data') }, { status: 500 })
  }
}
