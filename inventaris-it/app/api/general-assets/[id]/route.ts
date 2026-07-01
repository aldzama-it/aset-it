import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()
    const { id, category, ...data } = body
    const res = await prisma.generalAsset.update({
      where: { id: parseInt((await params).id) },
      data: { ...data, updated_at: new Date() }
    })
    return Response.json({ success: true, data: res })
  } catch (e: any) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const res = await prisma.generalAsset.delete({
      where: { id: parseInt((await params).id) }
    })
    return Response.json({ success: true, data: res })
  } catch (e: any) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
