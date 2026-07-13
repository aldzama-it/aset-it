import { prisma } from '@/lib/prisma'
import { recordHistory } from '@/lib/history'
import { generateAssetCode } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  try {
    const data = await prisma.printer.findMany({
      where: search ? {
        OR: [
          { asset_code: { contains: search } },
          
          { brand: { contains: search } }, { model: { contains: search } }
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
      const last = await prisma.printer.findFirst({ orderBy: { id: 'desc' } })
      asset_code = generateAssetCode('PRN', last?.asset_code)
    }
    const data = await prisma.printer.create({
      data: { ...body, asset_code , updated_at: new Date() }
    })
    await recordHistory({
      table_name: 'printers', asset_id: data.id, asset_code,
      action: 'Dibuat', new_condition: data.condition,
      to_location: data.location
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e: any) {
    return Response.json({ success: false, error: 'Gagal menyimpan data', details: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
