import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()
    const { id, category, ...data } = body
    const res = await prisma.generalAsset.update({
      where: { id: parseInt((await params).id) },
      data: { ...data, updated_at: new Date() }
    })
    return Response.json({ success: true, data: res })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengupdate data') }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const res = await prisma.generalAsset.delete({
      where: { id: parseInt((await params).id) }
    })
    return Response.json({ success: true, data: res })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal menghapus data') }, { status: 500 })
  }
}
