import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { generateAssetCode } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  try {
    const data = await prisma.networkDevice.findMany({
      where: search ? {
        OR: [
          { asset_code: { contains: search } },
          
          { brand: { contains: search } }, { model: { contains: search } }
        ]
      } : undefined,
      orderBy: { created_at: 'desc' }
    })
    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const last = await prisma.networkDevice.findFirst({ orderBy: { id: 'desc' } })
    const asset_code = generateAssetCode('NET', last?.asset_code)
    const data = await prisma.networkDevice.create({
      data: { ...body, asset_code, updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'networkDevices', asset_id: data.id, asset_code,
      action: 'Dibuat', new_condition: data.condition,
      to_location: data.location
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
