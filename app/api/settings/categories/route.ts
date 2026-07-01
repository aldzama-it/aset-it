import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.assetCategory.findMany({
      orderBy: { name: 'asc' }
    })
    return Response.json({ success: true, data })
  } catch (e: any) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await prisma.assetCategory.create({
      data: { ...body }
    })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e: any) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
