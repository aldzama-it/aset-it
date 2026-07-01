import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    const res = await prisma.assetCategory.update({
      where: { id: parseInt((await params).id) },
      data
    })
    return Response.json({ success: true, data: res })
  } catch (e: any) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const res = await prisma.assetCategory.delete({
      where: { id: parseInt((await params).id) }
    })
    return Response.json({ success: true, data: res })
  } catch (e: any) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
