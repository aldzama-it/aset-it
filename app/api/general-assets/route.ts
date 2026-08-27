import { prisma } from '@/lib/prisma'
import { getHistoryActor } from '@/lib/history'
import { generateAssetCode, getErrorMessage } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category_id = searchParams.get('category_id')
  const search = searchParams.get('search') || ''
  
  try {
    const data = await prisma.generalAsset.findMany({
      where: {
        category_id: category_id ? parseInt(category_id) : undefined,
        OR: search ? [
          { asset_code: { contains: search } },
          { brand: { contains: search } },
          { model: { contains: search } },
          { pic: { contains: search } },
        ] : undefined
      },
      orderBy: { created_at: 'desc' },
      include: { category: true }
    })
    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengambil data') }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let asset_code = body.asset_code

    if (!asset_code) {
      const category = await prisma.assetCategory.findUnique({ where: { id: parseInt(body.category_id) } })
      if (!category) throw new Error('Category not found')
      
      const last = await prisma.generalAsset.findFirst({ 
        where: { category_id: category.id },
        orderBy: { id: 'desc' } 
      })
      asset_code = generateAssetCode(category.prefix, last?.asset_code)
    }

    const changedBy = await getHistoryActor()
    const data = await prisma.$transaction(async (tx) => {
      const created = await tx.generalAsset.create({
        data: { ...body, asset_code, updated_at: new Date() },
      })
      await tx.assetHistory.create({
        data: {
          table_name: 'generalAssets',
          asset_id: created.id,
          asset_code: created.asset_code,
          action: 'Dibuat',
          to_employee: created.pic,
          to_location: created.location,
          new_condition: created.condition,
          changed_by: changedBy,
        },
      })
      return created
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menyimpan data') }, { status: 500 })
  }
}
