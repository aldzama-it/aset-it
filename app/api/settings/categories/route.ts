import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'

export async function GET() {
  try {
    const data = await prisma.assetCategory.findMany({
      orderBy: { name: 'asc' }
    })
    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengambil data kategori') }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await prisma.assetCategory.create({
      data: { ...body }
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menyimpan kategori') }, { status: 500 })
  }
}
