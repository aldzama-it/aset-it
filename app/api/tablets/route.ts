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
          { pic_name: { contains: search } },
          { brand: { contains: search } },
          { type: { contains: search } },
          { department: { contains: search } }
        ]
      } : undefined,
      orderBy: { created_at: 'desc' }
    })
    return Response.json({ success: true, data })
  } catch (e: any) {
    return Response.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let asset_code = body.asset_code
    if (!asset_code) {
      const last = await prisma.tablet.findFirst({ orderBy: { id: 'desc' } })
      asset_code = generateAssetCode('TBL', last?.asset_code)
    }
    const data = await prisma.tablet.create({
      data: { ...body, asset_code , updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'tablets', asset_id: data.id, asset_code,
      action: 'Dibuat', new_condition: data.condition,
      to_employee: data.pic_name, to_location: data.branch
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e: any) {
    console.error(e)
    return Response.json({ success: false, error: 'Gagal menyimpan data', details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
