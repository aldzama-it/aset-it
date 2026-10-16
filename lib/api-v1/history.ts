import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { findAssignmentRows } from './assets'

type HistoryConfig = Parameters<typeof findAssignmentRows>[0]
type SourceRow = Parameters<typeof findAssignmentRows>[1]

type HistoryEntry = {
  id: string
  source: 'asset_history' | 'assignment'
  action: string
  event_at: Date
  asset_id: number
  from_employee: string | null
  to_employee: string | null
  from_location: string | null
  to_location: string | null
  old_condition: string | null
  new_condition: string | null
  changed_by: string | null
}

function nullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

export async function getAssetHistory(config: HistoryConfig, row: SourceRow, page: number, limit: number) {
  if (config.group !== 'physical') return { data: [], total: 0 }

  const assignments = await findAssignmentRows(config, row)
  const code = nullableString(row.asset_code)
  const ids = assignments.map(item => Number(item.id))
  const where: Prisma.AssetHistoryWhereInput = {
    table_name: config.tableName,
    OR: config.repeated && code ? [{ asset_code: code }, { asset_id: { in: ids } }] : [{ asset_id: Number(row.id) }],
  }
  const [historyCount, historyRows] = await Promise.all([
    prisma.assetHistory.count({ where }),
    prisma.assetHistory.findMany({
      where,
      select: {
        id: true, asset_id: true, action: true, from_employee: true, to_employee: true,
        from_location: true, to_location: true, old_condition: true, new_condition: true,
        changed_by: true, event_at: true,
      },
      orderBy: [{ event_at: 'desc' }, { id: 'desc' }],
      take: page * limit,
    }),
  ])

  const events: HistoryEntry[] = historyRows.map(item => ({
    id: `history:${item.id}`, source: 'asset_history', action: item.action,
    event_at: item.event_at, asset_id: item.asset_id,
    from_employee: item.from_employee, to_employee: item.to_employee,
    from_location: item.from_location, to_location: item.to_location,
    old_condition: item.old_condition, new_condition: item.new_condition,
    changed_by: item.changed_by,
  }))
  if (config.repeated) {
    for (const assignment of assignments) {
      const at = assignment.handover_date instanceof Date ? assignment.handover_date : assignment.created_at
      if (!(at instanceof Date)) continue
      events.push({
        id: `assignment:${assignment.id}`, source: 'assignment', action: 'Diserahkan',
        event_at: at, asset_id: Number(assignment.id), from_employee: null,
        to_employee: nullableString(assignment.pic ?? assignment.pic_name),
        from_location: null, to_location: nullableString(assignment.branch ?? assignment.location),
        old_condition: null, new_condition: nullableString(assignment.condition), changed_by: null,
      })
    }
  }
  events.sort((a, b) => b.event_at.getTime() - a.event_at.getTime() || a.id.localeCompare(b.id))
  return {
    data: events.slice((page - 1) * limit, page * limit),
    total: historyCount + (config.repeated ? assignments.length : 0),
  }
}
