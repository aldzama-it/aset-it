import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'

const getModel = (type: string) => {
  const models: Record<string, any> = {
    'email': prisma.emailAccount,
    'vpn': prisma.vpnAccount,
    'synology': prisma.synologyAccount,
    'external-app': prisma.externalAppAccount,
    'admin-software': prisma.adminSoftwareAccount,
    'infrastructure': prisma.infrastructureAccount,
    'office-phone': prisma.officePhoneAccount,
  }
  return models[type]
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;
    const model = getModel(type)
    if (!model) return NextResponse.json({ success: false, error: 'Tipe aset tidak valid' }, { status: 400 })

    const data = await model.findMany({
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil data', details: getErrorMessage(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;
    const model = getModel(type)
    if (!model) return NextResponse.json({ success: false, error: 'Tipe aset tidak valid' }, { status: 400 })

    const body = await req.json()

    // For email type, auto-extract domain
    if (type === 'email' && body.email) {
      body.domain = body.email.split('@')[1] || ''
    }

    const newAsset = await model.create({
      data: body
    })

    return NextResponse.json({ success: true, data: newAsset })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Gagal menyimpan data', details: getErrorMessage(e) }, { status: 500 })
  }
}
