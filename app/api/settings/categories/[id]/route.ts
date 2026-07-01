import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    const res = await prisma.assetCategory.update({
      where: { id: parseInt((await params).id) },
      data
    })
    return Response.json({ success: true, data: res })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengupdate kategori') }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const res = await prisma.assetCategory.delete({
      where: { id: parseInt((await params).id) }
    })
    return Response.json({ success: true, data: res })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menghapus kategori') }, { status: 500 })
  }
}
