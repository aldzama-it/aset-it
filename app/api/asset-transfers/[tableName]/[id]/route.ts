import type { Prisma } from '@prisma/client'
import { assetTransferConfigs, isAssetTableName, type AssetTableName } from '@/lib/asset-transfer'
import { getHistoryActor } from '@/lib/history'
import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'

type TransferAsset = {
  id: number
  asset_code: string | null
  pic?: string | null
  pic_name?: string | null
  branch?: string | null
  location?: string | null
  handover_date?: Date | null
}

type TransferBody = {
  to_employee?: unknown
  to_location?: unknown
  handover_date?: unknown
  notes?: unknown
}

function normalizeRequiredString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

async function findAsset(tx: Prisma.TransactionClient, tableName: AssetTableName, id: number) {
  switch (tableName) {
    case 'laptops': return tx.laptop.findUnique({ where: { id } })
    case 'tablets': return tx.tablet.findUnique({ where: { id } })
    case 'hts': return tx.ht.findUnique({ where: { id } })
    case 'generalInventories': return tx.generalInventory.findUnique({ where: { id } })
    case 'cameras': return tx.camera.findUnique({ where: { id } })
    case 'generalAssets': return tx.generalAsset.findUnique({ where: { id } })
    case 'printers': return tx.printer.findUnique({ where: { id } })
    case 'cctvs': return tx.cctv.findUnique({ where: { id } })
    case 'networkDevices': return tx.networkDevice.findUnique({ where: { id } })
    case 'starlinks': return tx.starlink.findUnique({ where: { id } })
    case 'dashcams': return tx.dashcam.findUnique({ where: { id } })
  }
}

async function updateAsset(
  tx: Prisma.TransactionClient,
  tableName: AssetTableName,
  id: number,
  data: Record<string, string | Date>,
) {
  switch (tableName) {
    case 'laptops': return tx.laptop.update({ where: { id }, data })
    case 'tablets': return tx.tablet.update({ where: { id }, data })
    case 'hts': return tx.ht.update({ where: { id }, data })
    case 'generalInventories': return tx.generalInventory.update({ where: { id }, data })
    case 'cameras': return tx.camera.update({ where: { id }, data })
    case 'generalAssets': return tx.generalAsset.update({ where: { id }, data })
    case 'printers': return tx.printer.update({ where: { id }, data: { ...data, updated_at: new Date() } })
    case 'cctvs': return tx.cctv.update({ where: { id }, data: { ...data, updated_at: new Date() } })
    case 'networkDevices': return tx.networkDevice.update({ where: { id }, data })
    case 'starlinks': return tx.starlink.update({ where: { id }, data })
    case 'dashcams': return tx.dashcam.update({ where: { id }, data })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tableName: string; id: string }> },
) {
  const { tableName: rawTableName, id: rawId } = await params
  const id = Number(rawId)

  if (!isAssetTableName(rawTableName) || !Number.isInteger(id) || id <= 0) {
    return Response.json({ success: false, error: 'Jenis aset atau ID tidak valid' }, { status: 400 })
  }

  try {
    const body = await req.json() as TransferBody
    const config = assetTransferConfigs[rawTableName]
    const notes = normalizeRequiredString(body.notes)
    const toEmployee = config.picField ? normalizeRequiredString(body.to_employee) : null
    const toLocation = normalizeRequiredString(body.to_location)

    if (!notes) {
      return Response.json({ success: false, error: 'Alasan perpindahan wajib diisi' }, { status: 400 })
    }
    if (config.picField && !toEmployee) {
      return Response.json({ success: false, error: 'PIC tujuan wajib diisi' }, { status: 400 })
    }
    if (!toLocation) {
      return Response.json({ success: false, error: 'Lokasi tujuan wajib diisi' }, { status: 400 })
    }

    let handoverDate: Date | null = null
    if (config.handoverDateField) {
      handoverDate = new Date(normalizeRequiredString(body.handover_date))
      if (Number.isNaN(handoverDate.getTime())) {
        return Response.json({ success: false, error: 'Tanggal perpindahan tidak valid' }, { status: 400 })
      }
    }

    const changedBy = await getHistoryActor()
    const result = await prisma.$transaction(async (tx) => {
      const before = await findAsset(tx, rawTableName, id) as TransferAsset | null
      if (!before) return null

      const fromEmployee = config.picField ? before[config.picField] ?? null : null
      const fromLocation = before[config.locationField] ?? null
      const employeeChanged = config.picField ? fromEmployee !== toEmployee : false
      const locationChanged = fromLocation !== toLocation

      if (!employeeChanged && !locationChanged) {
        return { unchanged: true as const }
      }

      const updateData: Record<string, string | Date> = {
        [config.locationField]: toLocation,
      }
      if (config.picField && toEmployee) updateData[config.picField] = toEmployee
      if (config.handoverDateField && handoverDate) updateData[config.handoverDateField] = handoverDate

      const data = await updateAsset(tx, rawTableName, id, updateData)
      await tx.assetHistory.create({
        data: {
          table_name: rawTableName,
          asset_id: id,
          asset_code: before.asset_code,
          action: employeeChanged ? 'Diserahkan' : 'Dipindah_Lokasi',
          from_employee: fromEmployee,
          to_employee: config.picField ? toEmployee : null,
          from_location: fromLocation,
          to_location: toLocation,
          changed_by: changedBy,
          notes,
          event_at: new Date(),
        },
      })

      return { unchanged: false as const, data }
    })

    if (!result) {
      return Response.json({ success: false, error: 'Aset tidak ditemukan' }, { status: 404 })
    }
    if (result.unchanged) {
      return Response.json({ success: false, error: 'PIC atau lokasi tujuan belum berubah' }, { status: 400 })
    }

    return Response.json({ success: true, data: result.data })
  } catch (error) {
    return Response.json(
      { success: false, error: getErrorMessage(error, 'Gagal memindahkan aset') },
      { status: 500 },
    )
  }
}
