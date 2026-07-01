import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const assetCode = formData.get('asset_code') as string
    if (!file) return Response.json({ success: false, error: 'Tidak ada file' }, { status: 400 })

    const ext = file.name.split('.').pop()
    const filename = `${assetCode}-${Date.now()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'private-uploads', 'handover')
    await mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

    return Response.json({
      success: true,
      data: {
        attachment_name: file.name,
        attachment_path: `private-uploads/handover/${filename}`
      }
    })
  } catch (e) {
    return Response.json({ success: false, error: 'Gagal upload file' }, { status: 500 })
  }
}
