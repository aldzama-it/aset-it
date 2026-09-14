import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'

export async function GET(req: Request, { params }: { params: Promise<{ tableName: string, assetCode: string }> }) {
  const resolvedParams = await params;
  const { tableName, assetCode } = resolvedParams;

  try {
    // Map table names to Prisma models
    const modelMap: Record<string, any> = {
      laptops: prisma.laptop,
      tablets: prisma.tablet,
      hts: prisma.ht,
      cctvs: prisma.cctv,
      cameras: prisma.camera,
      dashcams: prisma.dashcam,
      printers: prisma.printer,
      starlinks: prisma.starlink,
      networkDevices: prisma.networkDevice,
      generalInventories: prisma.generalInventory,
      generalAssets: prisma.generalAsset
    }

    const model = modelMap[tableName]
    if (!model) {
      return Response.json({ success: false, error: 'Tabel tidak ditemukan' }, { status: 400 })
    }

    const data = await model.findMany({
      where: { asset_code: assetCode }
    })
    
    // Urutkan berdasarkan timeline (handover_date / install_date) alih-alih waktu input (created_at)
    data.sort((a: any, b: any) => {
      const dateA = new Date(a.handover_date || a.install_date || a.created_at).getTime()
      const dateB = new Date(b.handover_date || b.install_date || b.created_at).getTime()
      return dateB - dateA
    })
    
    // For deduplication, we check if there are duplicate records for the same PIC in the same day? 
    // Usually, the raw list ordered by created_at desc is the history itself!
    // But let's just return the raw data and let the frontend format it into a timeline.
    if (data.length === 0) {
      return Response.json({ success: false, error: 'Riwayat tidak ditemukan' }, { status: 404 })
    }

    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal mengambil data riwayat aset') }, { status: 500 })
  }
}
