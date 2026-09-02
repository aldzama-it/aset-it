/**
 * Bentuk data Network Analyzer dan helper tampilannya.
 *
 * Terpisah dari `lib/network-analyzer.ts` dengan sengaja: file itu `server-only`
 * karena memegang token, sedangkan tabel dan grafik di sini adalah client
 * component. Menyatukan keduanya membuat guard `server-only` ikut terseret ke
 * bundle browser dan menggagalkan render.
 */

/** Analyzer memutuskan sendiri agregat mana yang menjawab, dan memberitahu lewat meta. */
export type AnalyzerMeta = {
  date_from: string
  date_to: string
  days: number
  resolution: 'hourly' | 'daily'
  timezone: string
}

export type AnalyzerEnvelope<T> = { data: T; meta: AnalyzerMeta }

export type AnalyzerSummary = {
  active_users: number
  bytes_up: number
  bytes_down: number
  bytes_total: number
  flow_count: number
  unique_domains: number
  /** Trafik yang cocok ke user tapi tidak ke aplikasi mana pun. Sengaja ditampilkan. */
  unmapped_bytes: number
}

export type TopUserRow = {
  employee_id: number | null
  employee_name: string | null
  hotspot_username: string | null
  bytes_up: number
  bytes_down: number
  bytes_total: number
}

export type TopApplicationRow = {
  application_id: number | null
  /** null berarti Unknown — jangan disembunyikan, beri label. */
  application_name: string | null
  category_name: string | null
  bytes_total: number
}

export type CategoryRow = {
  category_id: number | null
  category_name: string | null
  category_color: string | null
  bytes_total: number
}

export type TrendPoint = {
  bucket: string
  bytes_up: number
  bytes_down: number
  bytes_total: number
  bytes_unmapped: number
  bytes_attributed: number
}

export type DomainRow = {
  domain_name: string | null
  bytes_total: number
  event_count: number
}

export type ConfidenceRow = {
  confidence: string | null
  bytes_total: number
  event_count: number
}

export type UserDetail = {
  employee: { id: number; name: string; department: string | null; hotspot_username: string | null }
  summary: AnalyzerSummary
  applications: TopApplicationRow[]
  domains: DomainRow[]
  confidence: ConfidenceRow[]
}

export type HotspotSessionRow = {
  id: number
  ip_address: string | null
  mac_address: string | null
  started_at: string | null
  ended_at: string | null
  status: string | null
}

export type CollectorService = {
  service: string
  status: 'healthy' | 'stale' | 'error' | 'unknown'
  last_success_at: string | null
  last_error_at?: string | null
  last_error?: string | null
  records_processed: number
  metrics?: Record<string, unknown> | null
}

export type CollectorHealth = {
  status: 'healthy' | 'degraded'
  database: string
  services: CollectorService[]
  checked_at: string
}

export const ANALYZER_PRESETS = {
  today: 'Hari Ini',
  yesterday: 'Kemarin',
  '7d': '7 Hari',
  '30d': '30 Hari',
} as const

export type AnalyzerPreset = keyof typeof ANALYZER_PRESETS

export type AnalyzerRange = {
  preset: AnalyzerPreset | null
  date_from: string
  date_to: string
}

function toDateString(d: Date): string {
  // Format lokal, bukan toISOString(): yang terakhir menggeser ke UTC dan
  // membuat "hari ini" jadi kemarin setiap sore di Asia/Jakarta.
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Ubah pilihan filter menjadi rentang tanggal eksplisit.
 *
 * Endpoint `/dashboard/*` memakai DashboardQueryRequest, yang hanya membaca
 * `date_from`/`date_to` — parameter `preset` yang dipahami halaman Blade tidak
 * sampai ke sana. Jadi preset diterjemahkan di sini, sekali, dan seluruh
 * halaman memakai tanggal yang sama.
 */
export function resolveRange(searchParams: Record<string, string | string[] | undefined>): AnalyzerRange {
  const one = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const from = one('date_from')
  const to = one('date_to')
  const preset = one('preset') as AnalyzerPreset | undefined

  // Tanggal manual menang hanya kalau preset tidak diminta, supaya tombol yang
  // baru diklik tidak diam-diam dikalahkan oleh tanggal lama di URL.
  if (!preset && from && to) {
    return { preset: null, date_from: from, date_to: to }
  }

  const now = new Date()
  const startOfDay = (offsetDays: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - offsetDays)
    return toDateString(d)
  }

  switch (preset) {
    case 'yesterday':
      return { preset, date_from: startOfDay(1), date_to: startOfDay(1) }
    case '7d':
      return { preset, date_from: startOfDay(6), date_to: startOfDay(0) }
    case '30d':
      return { preset, date_from: startOfDay(29), date_to: startOfDay(0) }
    default:
      return { preset: 'today', date_from: startOfDay(0), date_to: startOfDay(0) }
  }
}

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return '0 B'

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1)
  const value = bytes / 1024 ** exponent

  return `${value.toLocaleString('id-ID', {
    maximumFractionDigits: exponent === 0 ? 0 : value >= 100 ? 0 : 1,
  })} ${BYTE_UNITS[exponent]}`
}

export function formatNumber(value: number | null | undefined): string {
  return (value ?? 0).toLocaleString('id-ID')
}

/** Label untuk baris yang analyzer sendiri tandai sebagai tidak teridentifikasi. */
export const UNKNOWN_LABEL = 'Tidak Teridentifikasi'
