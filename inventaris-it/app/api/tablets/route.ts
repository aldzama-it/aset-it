import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { generateAssetCode } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  try {
    const data = await prisma.tablet.findMany({
      where: search ? {
        OR: [
          { asset_code: { contains: search } },
          { pic: { contains: search } },
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
    const last = await prisma.tablet.findFirst({ orderBy: { id: 'desc' } })
    const asset_code = generateAssetCode('TBL', last?.asset_code)
    const data = await prisma.tablet.create({
      data: { ...body, asset_code , updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'tablets', asset_id: data.id, asset_code,
      action: 'Dibuat', new_condition: data.condition,
      to_employee: data.pic, to_location: data.location
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
