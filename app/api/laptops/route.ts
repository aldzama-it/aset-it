import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { generateAssetCode, getErrorMessage } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = (searchParams.get('search') || '').toLowerCase()
  try {
    const [allLaptops, laptopHistories] = await Promise.all([
      prisma.laptop.findMany({
        orderBy: [
          { handover_date: 'desc' },
          { created_at: 'desc' }
        ]
      }),
      prisma.assetHistory.findMany({
        where: {
          table_name: 'laptops',
          OR: [
            { from_employee: { not: null } },
            { to_employee: { not: null } }
          ]
        },
        select: {
          asset_code: true,
          from_employee: true,
          to_employee: true
        }
      })
    ])

    const historyMap = new Map<string, Set<string>>()
    for (const h of laptopHistories) {
      if (!h.asset_code) continue
      if (!historyMap.has(h.asset_code)) {
        historyMap.set(h.asset_code, new Set())
      }
      const set = historyMap.get(h.asset_code)!
      if (h.from_employee?.trim()) set.add(h.from_employee.trim())
      if (h.to_employee?.trim()) set.add(h.to_employee.trim())
    }

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

      const currentPic = active ? (active.pic_name || active.pic || '') : (group[0]?.pic_name || group[0]?.pic || '')
      const currentPicNorm = currentPic.toLowerCase().trim()

      const previousPics: string[] = []
      const seenPics = new Set<string>()
      if (currentPicNorm) seenPics.add(currentPicNorm)

      // 1. Kumpulkan pemegang dari riwayat Laptop di grup
      for (const item of group) {
        const p = (item.pic_name || item.pic || '').trim()
        if (p && !seenPics.has(p.toLowerCase())) {
          seenPics.add(p.toLowerCase())
          previousPics.push(p)
        }
      }

      // 2. Kumpulkan pemegang dari log AssetHistory
      const fromHistory = historyMap.get(asset_code)
      if (fromHistory) {
        for (const p of fromHistory) {
          const trimmed = p.trim()
          if (trimmed && !seenPics.has(trimmed.toLowerCase())) {
            seenPics.add(trimmed.toLowerCase())
            previousPics.push(trimmed)
          }
        }
      }

      const previousPicsText = previousPics.join(', ')
      
      if (!active) {
        laptopTersedia++
        const unassigned = { 
          ...group[0], 
          status_virtual: 'Tersedia',
          previous_pics: previousPics,
          previous_pics_text: previousPicsText
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
        active.previous_pics = previousPics
        active.previous_pics_text = previousPicsText
        processedData.push(active)
      }
    }

    // Apply search filter after grouping
    if (search) {
      processedData = processedData
        .map(item => {
          const matchedPast = item.previous_pics?.find((p: string) =>
            p.toLowerCase().includes(search)
          )
          if (matchedPast) {
            return {
              ...item,
              matched_past_holder: matchedPast
            }
          }
          return item
        })
        .filter(item => {
          return (
            (item.asset_code && item.asset_code.toLowerCase().includes(search)) ||
            (item.pic && item.pic.toLowerCase().includes(search)) ||
            (item.brand && item.brand.toLowerCase().includes(search)) ||
            (item.model && item.model.toLowerCase().includes(search)) ||
            (item.department && item.department.toLowerCase().includes(search)) ||
            (item.branch && item.branch.toLowerCase().includes(search)) ||
            Boolean(item.matched_past_holder)
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

    // Validasi field krusial
    if (!body.brand || !String(body.brand).trim()) {
      return Response.json({ success: false, error: 'Brand laptop wajib diisi' }, { status: 400 })
    }
    if (!body.model || !String(body.model).trim()) {
      return Response.json({ success: false, error: 'Model / Tipe laptop wajib diisi' }, { status: 400 })
    }

    let asset_code = body.asset_code?.trim()
    if (!asset_code) {
      const last = await prisma.laptop.findFirst({ orderBy: { id: 'desc' } })
      asset_code = generateAssetCode('LPT', last?.asset_code)
    }

    // Sanitasi payload dengan whitelist field resmi
    const sanitizedData = {
      asset_code,
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
      condition: body.condition || 'Baik',
      attachment_name: body.attachment_name || null,
      attachment_path: body.attachment_path || null,
      notes: body.notes ? String(body.notes).trim() : null,
      it_handover: body.it_handover ? String(body.it_handover).trim() : null,
      it_receiver: body.it_receiver ? String(body.it_receiver).trim() : null,
      admin_password: body.admin_password ? String(body.admin_password).trim() : null,
      anydesk_code: body.anydesk_code ? String(body.anydesk_code).trim() : null,
      updated_at: new Date()
    }

    const data = await prisma.laptop.create({
      data: sanitizedData
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
