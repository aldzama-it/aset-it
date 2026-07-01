import { readFile } from 'fs/promises'
import path from 'path'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const resolvedParams = await params;
  try {
    const filePath = path.join(process.cwd(), 'private-uploads', 'handover', resolvedParams.filename)
    const file = await readFile(filePath)
    const ext = resolvedParams.filename.split('.').pop()?.toLowerCase()
    const contentType = ext === 'pdf' ? 'application/pdf'
      : ext === 'png' ? 'image/png'
      : 'image/jpeg'
    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${resolvedParams.filename}"`
      }
    })
  } catch (e) {
    return new Response('File tidak ditemukan', { status: 404 })
  }
}
