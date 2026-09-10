import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'
import { getHistoryActor } from '@/lib/history'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { asset_code, to_employee, to_department, to_division, to_job_level, to_branch, handover_date, notes } = body

    if (!asset_code || !to_employee || !handover_date) {
      return Response.json({ success: false, error: 'Data tidak lengkap (asset_code, to_employee, handover_date wajib diisi)' }, { status: 400 })
    }

    const changedBy = await getHistoryActor()
    
    const result = await prisma.$transaction(async (tx) => {
      // Find the active record for this asset_code (return_date is null)
      const activeRecord = await tx.laptop.findFirst({
        where: {
          asset_code,
          return_date: null
        }
      })

      // If there is an active record, we "close" it by setting return_date to handover_date
      if (activeRecord) {
        await tx.laptop.update({
          where: { id: activeRecord.id },
          data: {
            return_date: new Date(handover_date),
            updated_at: new Date()
          }
        })

        // Record history for closing the old assignment
        await tx.assetHistory.create({
          data: {
            table_name: 'laptops',
            asset_id: activeRecord.id,
            asset_code: activeRecord.asset_code,
            action: 'Dikembalikan',
            from_employee: activeRecord.pic,
            from_location: activeRecord.branch,
            changed_by: changedBy,
            notes: 'Dikembalikan sebelum ditransfer ke ' + to_employee,
            event_at: new Date(),
          }
        })
      }

      // To copy hardware specs, we need the latest record (whether it's active or not)
      const latestRecord = await tx.laptop.findFirst({
        where: { asset_code },
        orderBy: { id: 'desc' } // Or handover_date desc
      })

      if (!latestRecord) {
        throw new Error('Asset tidak ditemukan di database')
      }

      // Create new record with copied specs
      const newRecord = await tx.laptop.create({
        data: {
          asset_code: latestRecord.asset_code,
          pic: to_employee,
          department: to_department || null,
          division: to_division || null,
          job_level: to_job_level || null,
          branch: to_branch || null,
          handover_date: new Date(handover_date),
          return_date: null, // this makes it the new active record
          brand: latestRecord.brand,
          model: latestRecord.model,
          ram: latestRecord.ram,
          storage: latestRecord.storage,
          processor: latestRecord.processor,
          screen_size: latestRecord.screen_size,
          mac_address: latestRecord.mac_address,
          condition: latestRecord.condition,
          admin_password: latestRecord.admin_password,
          anydesk_code: latestRecord.anydesk_code,
          notes: notes || null,
          updated_at: new Date()
        }
      })

      // Record history for new assignment
      await tx.assetHistory.create({
        data: {
          table_name: 'laptops',
          asset_id: newRecord.id,
          asset_code: newRecord.asset_code,
          action: 'Diserahkan',
          from_employee: activeRecord ? activeRecord.pic : null,
          to_employee: to_employee,
          from_location: activeRecord ? activeRecord.branch : null,
          to_location: to_branch || null,
          changed_by: changedBy,
          notes,
          event_at: new Date(),
        }
      })

      return newRecord
    })

    return Response.json({ success: true, data: result }, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ success: false, error: getErrorMessage(e, 'Gagal memindahkan aset') }, { status: 500 })
  }
}
