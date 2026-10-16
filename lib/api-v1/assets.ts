import { prisma } from '@/lib/prisma'

export type AssetGroup = 'physical' | 'digital'
type SourceRow = Record<string, unknown>
type AssetConfig = {
  group: AssetGroup
  category: string
  model: string
  tableName?: string
  fields: readonly string[]
  name: readonly string[]
  location?: string
  status?: string
  condition?: string
  receiver?: string
  department?: string
  division?: string
  handover?: string
  specification?: readonly string[]
  attributes: readonly string[]
  repeated?: boolean
}

const base = ['id', 'created_at', 'updated_at'] as const
const physical = (category: string, model: string, tableName: string, options: Omit<AssetConfig, 'group' | 'category' | 'model' | 'tableName' | 'fields'> & { fields: readonly string[] }): AssetConfig => ({
  group: 'physical', category, model, tableName, ...options,
})
const digital = (category: string, model: string, options: Omit<AssetConfig, 'group' | 'category' | 'model' | 'fields'> & { fields: readonly string[] }): AssetConfig => ({
  group: 'digital', category, model, ...options,
})

// Every selected field is explicit. Free text notes and all credential fields are intentionally absent.
export const assetConfigs: readonly AssetConfig[] = [
  physical('camera', 'camera', 'cameras', { fields: [...base, 'asset_code', 'pic', 'brand', 'model', 'location', 'handover_date', 'return_date', 'purchase_date', 'condition'], name: ['brand', 'model'], location: 'location', condition: 'condition', receiver: 'pic', handover: 'handover_date', specification: ['brand', 'model'], attributes: ['purchase_date', 'return_date'], repeated: true }),
  physical('cctv', 'cctv', 'cctvs', { fields: [...base, 'asset_code', 'brand', 'model', 'location', 'position_label', 'ip_address', 'mac_address', 'install_date', 'condition'], name: ['brand', 'model'], location: 'location', condition: 'condition', specification: ['brand', 'model'], attributes: ['position_label', 'ip_address', 'mac_address', 'install_date'] }),
  physical('dashcam', 'dashcam', 'dashcams', { fields: [...base, 'asset_code', 'vehicle_name', 'plate_number', 'location', 'project', 'install_status', 'install_date'], name: ['vehicle_name'], location: 'location', status: 'install_status', division: 'project', attributes: ['plate_number', 'install_date'] }),
  physical('ht', 'ht', 'hts', { fields: [...base, 'asset_code', 'pic_name', 'division', 'branch', 'handover_date', 'return_date', 'brand', 'type', 'condition'], name: ['brand', 'type'], location: 'branch', condition: 'condition', receiver: 'pic_name', division: 'division', handover: 'handover_date', specification: ['brand', 'type'], attributes: ['return_date'], repeated: true }),
  physical('laptop', 'laptop', 'laptops', { fields: [...base, 'asset_code', 'pic', 'department', 'division', 'job_level', 'branch', 'brand', 'model', 'ram', 'storage', 'processor', 'screen_size', 'mac_address', 'handover_date', 'return_date', 'condition'], name: ['brand', 'model'], location: 'branch', condition: 'condition', receiver: 'pic', department: 'department', division: 'division', handover: 'handover_date', specification: ['brand', 'model', 'processor', 'ram', 'storage'], attributes: ['job_level', 'screen_size', 'mac_address', 'return_date'], repeated: true }),
  physical('general-inventory', 'generalInventory', 'generalInventories', { fields: [...base, 'asset_code', 'pic_name', 'department', 'division', 'job_level', 'branch', 'asset_type', 'brand', 'quantity', 'handover_date', 'return_date', 'condition'], name: ['brand', 'asset_type'], location: 'branch', condition: 'condition', receiver: 'pic_name', department: 'department', division: 'division', handover: 'handover_date', specification: ['brand', 'asset_type'], attributes: ['job_level', 'quantity', 'return_date'], repeated: true }),
  physical('network-device', 'networkDevice', 'networkDevices', { fields: [...base, 'asset_code', 'name', 'device_type', 'mac_address', 'location', 'purchase_date'], name: ['name'], location: 'location', specification: ['device_type'], attributes: ['device_type', 'mac_address', 'purchase_date'] }),
  physical('printer', 'printer', 'printers', { fields: [...base, 'asset_code', 'brand', 'model', 'location', 'condition', 'ink_type', 'mac_address', 'ip_address', 'connection', 'purchase_date'], name: ['brand', 'model'], location: 'location', condition: 'condition', specification: ['brand', 'model'], attributes: ['ink_type', 'mac_address', 'ip_address', 'connection', 'purchase_date'] }),
  physical('starlink', 'starlink', 'starlinks', { fields: [...base, 'asset_code', 'location', 'serial_number', 'install_date'], name: ['serial_number'], location: 'location', attributes: ['serial_number', 'install_date'] }),
  physical('tablet', 'tablet', 'tablets', { fields: [...base, 'asset_code', 'pic_name', 'department', 'division', 'job_level', 'branch', 'handover_date', 'return_date', 'asset_type', 'brand', 'type', 'ram', 'storage', 'condition'], name: ['brand', 'type'], location: 'branch', condition: 'condition', receiver: 'pic_name', department: 'department', division: 'division', handover: 'handover_date', specification: ['brand', 'type', 'ram', 'storage'], attributes: ['job_level', 'asset_type', 'return_date'], repeated: true }),
  physical('general-asset', 'generalAsset', 'generalAssets', { fields: [...base, 'asset_code', 'category_id', 'pic', 'location', 'brand', 'model', 'handover_date', 'purchase_date', 'condition'], name: ['brand', 'model'], location: 'location', condition: 'condition', receiver: 'pic', handover: 'handover_date', specification: ['brand', 'model'], attributes: ['category_id', 'purchase_date'] }),
  digital('email', 'emailAccount', { fields: [...base, 'nama', 'divisi', 'department', 'job_level', 'branch', 'email', 'domain', 'status', 'deleted_at'], name: ['nama', 'email'], location: 'branch', status: 'status', receiver: 'nama', department: 'department', division: 'divisi', attributes: ['email', 'domain', 'job_level', 'deleted_at'] }),
  digital('vpn', 'vpnAccount', { fields: [...base, 'nama', 'divisi', 'department', 'job_level', 'branch', 'ip_address', 'status'], name: ['nama'], location: 'branch', status: 'status', receiver: 'nama', department: 'department', division: 'divisi', attributes: ['job_level', 'ip_address'] }),
  digital('synology', 'synologyAccount', { fields: [...base, 'nama', 'divisi', 'department', 'job_level', 'branch', 'email', 'name_synology', 'user_groups', 'quota_mb', 'app_priv_afp', 'app_priv_dsm', 'app_priv_ftp', 'app_priv_rsync', 'app_priv_sftp', 'app_priv_smb', 'app_priv_mail_server', 'app_priv_cloud_sync', 'app_priv_vmm', 'app_priv_active_backup', 'app_priv_universal_search', 'app_priv_file_station', 'app_priv_drive', 'app_priv_notification', 'app_priv_cms', 'two_fa_status', 'status'], name: ['nama', 'name_synology'], location: 'branch', status: 'status', receiver: 'nama', department: 'department', division: 'divisi', attributes: ['email', 'name_synology', 'job_level', 'user_groups', 'quota_mb', 'app_priv_afp', 'app_priv_dsm', 'app_priv_ftp', 'app_priv_rsync', 'app_priv_sftp', 'app_priv_smb', 'app_priv_mail_server', 'app_priv_cloud_sync', 'app_priv_vmm', 'app_priv_active_backup', 'app_priv_universal_search', 'app_priv_file_station', 'app_priv_drive', 'app_priv_notification', 'app_priv_cms', 'two_fa_status'] }),
  digital('external-app', 'externalAppAccount', { fields: [...base, 'app_name'], name: ['app_name'], attributes: [] }),
  digital('admin-software', 'adminSoftwareAccount', { fields: [...base, 'app_name'], name: ['app_name'], attributes: [] }),
  digital('infrastructure', 'infrastructureAccount', { fields: [...base, 'nama_akun', 'from_ip', 'to_ip', 'mac_address'], name: ['nama_akun'], attributes: ['from_ip', 'to_ip', 'mac_address'] }),
  digital('office-phone', 'officePhoneAccount', { fields: [...base, 'nama_akun', 'ip_address', 'mac_address'], name: ['nama_akun'], attributes: ['ip_address', 'mac_address'] }),
]

type ReadDelegate = {
  findMany(args: object): Promise<SourceRow[]>
  findUnique(args: object): Promise<SourceRow | null>
  count(args: object): Promise<number>
}

function modelFor(config: AssetConfig): ReadDelegate {
  return (prisma as unknown as Record<string, ReadDelegate>)[config.model]
}

function selectFor(config: AssetConfig): Record<string, unknown> {
  const select: Record<string, unknown> = Object.fromEntries(config.fields.map(field => [field, true]))
  if (config.category === 'general-asset') select.category = { select: { id: true, name: true, prefix: true } }
  return select
}

function string(row: SourceRow, field?: string): string | null {
  if (!field) return null
  const value = row[field]
  return typeof value === 'string' && value.trim() ? value : null
}

function date(row: SourceRow, field: string): Date {
  const value = row[field]
  return value instanceof Date ? value : new Date(0)
}

function joined(row: SourceRow, fields?: readonly string[]): string | null {
  const parts = fields?.map(field => string(row, field)).filter((part): part is string => part !== null) ?? []
  return parts.length ? parts.join(' ') : null
}

export type UnifiedAsset = {
  id: number
  group: AssetGroup
  category: string
  name: string | null
  asset_code: string | null
  location: string | null
  status: string | null
  condition: string | null
  receiver_name: string | null
  department: string | null
  division_project: string | null
  handover_date: Date | null
  specification: string | null
  attributes: Record<string, unknown>
  updated_at: Date
}

export function mapAsset(config: AssetConfig, row: SourceRow): UnifiedAsset {
  const attributes: Record<string, unknown> = {}
  for (const field of config.attributes) attributes[field] = row[field] ?? null
  if (config.category === 'general-asset') attributes.category = row.category ?? null
  const receiver = string(row, config.receiver)
  const returned = config.repeated && row.return_date !== null
  const status = config.status ? string(row, config.status) : config.repeated
    ? (returned || !receiver ? 'Tersedia' : config.category === 'laptop' ? 'Aktif' : 'Dipakai')
    : null
  return {
    id: Number(row.id), group: config.group, category: config.category,
    name: joined(row, config.name), asset_code: string(row, 'asset_code'),
    location: string(row, config.location), status, condition: string(row, config.condition),
    receiver_name: receiver, department: string(row, config.department),
    division_project: string(row, config.division),
    handover_date: config.handover && row[config.handover] instanceof Date ? row[config.handover] as Date : null,
    specification: joined(row, config.specification), attributes, updated_at: date(row, 'updated_at'),
  }
}

export function getConfig(group: string, category: string): AssetConfig | undefined {
  return assetConfigs.find(config => config.group === group && config.category === category)
}

function searchWhere(config: AssetConfig, search: string): object {
  const fields = searchableFields(config)
    .filter(field => config.fields.includes(field) && !['id', 'category_id', 'quantity', 'purchase_date', 'install_date', 'deleted_at', 'return_date', 'two_fa_status', 'accessories', 'connection'].includes(field))
  return { OR: [...new Set(fields)].map(field => ({ [field]: { contains: search } })) }
}

function searchableFields(config: AssetConfig): string[] {
  return [...config.name, config.location, config.receiver, config.department, config.division, 'asset_code', ...(config.specification ?? []), ...config.attributes]
    .filter((field): field is string => typeof field === 'string')
}

function matchesSearch(config: AssetConfig, row: SourceRow, search: string): boolean {
  return searchableFields(config).some(field => string(row, field)?.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
}

function compareRows(a: SourceRow, b: SourceRow): number {
  return date(b, 'updated_at').getTime() - date(a, 'updated_at').getTime() || Number(b.id) - Number(a.id)
}

function compareAssignments(a: SourceRow, b: SourceRow): number {
  const aDate = a.handover_date instanceof Date ? a.handover_date : date(a, 'created_at')
  const bDate = b.handover_date instanceof Date ? b.handover_date : date(b, 'created_at')
  return bDate.getTime() - aDate.getTime() || date(b, 'created_at').getTime() - date(a, 'created_at').getTime() || Number(b.id) - Number(a.id)
}

function currentRows(rows: SourceRow[]): SourceRow[] {
  const byCode = new Map<string, SourceRow>()
  for (const row of rows.sort(compareAssignments)) {
    const code = string(row, 'asset_code')
    const key = code ? `code:${code}` : `id:${row.id}`
    const previous = byCode.get(key)
    if (!previous || (previous.return_date !== null && row.return_date === null)) byCode.set(key, row)
  }
  return [...byCode.values()]
}

function compareAssets(a: UnifiedAsset, b: UnifiedAsset): number {
  return b.updated_at.getTime() - a.updated_at.getTime() || a.category.localeCompare(b.category) || a.id - b.id
}

export async function listAssets(options: { group?: AssetGroup; category?: string; search?: string; page: number; limit: number }) {
  const selected = assetConfigs.filter(config => (!options.group || config.group === options.group) && (!options.category || config.category === options.category))
  const take = options.page * options.limit
  const groups = await Promise.all(selected.map(async config => {
    const model = modelFor(config)
    if (config.repeated) {
      const rows = await model.findMany({ select: selectFor(config), orderBy: [{ updated_at: 'desc' }, { id: 'desc' }] })
      const current = currentRows(rows).filter(row => !options.search || matchesSearch(config, row, options.search))
      return { total: current.length, rows: current.sort(compareRows).slice(0, take).map(row => mapAsset(config, row)) }
    }
    const where = options.search ? searchWhere(config, options.search) : {}
    const [total, rows] = await Promise.all([
      model.count({ where }),
      model.findMany({ where, select: selectFor(config), orderBy: [{ updated_at: 'desc' }, { id: 'asc' }], take }),
    ])
    return { total, rows: rows.map(row => mapAsset(config, row)) }
  }))
  const total = groups.reduce((sum, group) => sum + group.total, 0)
  const data = groups.flatMap(group => group.rows).sort(compareAssets).slice((options.page - 1) * options.limit, take)
  return { data, meta: { total, page: options.page, limit: options.limit, total_pages: Math.ceil(total / options.limit), has_next_page: options.page * options.limit < total, has_previous_page: options.page > 1 } }
}

export async function findAsset(config: AssetConfig, id: number): Promise<{ row: SourceRow; asset: UnifiedAsset } | null> {
  const row = await modelFor(config).findUnique({ where: { id }, select: selectFor(config) })
  return row ? { row, asset: mapAsset(config, row) } : null
}

export async function findAssignmentRows(config: AssetConfig, row: SourceRow): Promise<SourceRow[]> {
  const code = string(row, 'asset_code')
  if (!config.repeated || !code) return [row]
  return modelFor(config).findMany({ where: { asset_code: code }, select: selectFor(config), orderBy: [{ handover_date: 'desc' }, { created_at: 'desc' }, { id: 'desc' }] })
}
