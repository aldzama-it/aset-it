import { prisma } from './prisma'

export async function recordHistory(params: {
  table_name: string
  asset_id: number
  asset_code?: string | null
  action: any
  from_employee?: string | null
  to_employee?: string | null
  from_location?: string | null
  to_location?: string | null
  old_condition?: any
  new_condition?: any
  changed_by?: string
  notes?: string
}) {
  return prisma.assetHistory.create({ data: params })
}
