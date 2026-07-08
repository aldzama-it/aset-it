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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ type: string, id: string }> }) {
  try {
    const { type, id } = await params;
    const model = getModel(type)
    if (!model) return NextResponse.json({ success: false, error: 'Tipe aset tidak valid' }, { status: 400 })

    const body = await req.json()

    if (type === 'email' && body.email) {
      body.domain = body.email.split('@')[1] || ''
    }

    const updatedAsset = await model.update({
      where: { id: parseInt(id) },
      data: body
    })

    return NextResponse.json({ success: true, data: updatedAsset })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Gagal memperbarui data', details: getErrorMessage(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ type: string, id: string }> }) {
  try {
    const { type, id } = await params;
    const model = getModel(type)
    if (!model) return NextResponse.json({ success: false, error: 'Tipe aset tidak valid' }, { status: 400 })

    await model.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true, message: 'Berhasil dihapus' })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Gagal menghapus data', details: getErrorMessage(e) }, { status: 500 })
  }
}
