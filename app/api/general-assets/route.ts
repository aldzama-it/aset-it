import { prisma } from '@/lib/prisma'
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

    const data = await prisma.generalAsset.create({
      data: { ...body, asset_code, updated_at: new Date() }
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menyimpan data') }, { status: 500 })
  }
}
