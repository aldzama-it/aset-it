import 'server-only'

import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketPriority,
  type TicketingDashboard,
  type TicketingQuery,
  type TicketStatus,
} from './ticketing-shared'

export * from './ticketing-shared'

type TicketingEnvelope = { data: TicketingDashboard }

const BASE_URL = process.env.TICKETING_API_URL || 'https://ticketing.aldzama.com'
const TOKEN = process.env.TICKETING_API_TOKEN || ''

export function resolveTicketingQuery(searchParams: Record<string, string | string[] | undefined>): TicketingQuery {
  const one = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }
  const today = new Date()
  const dateFrom = one('date_from')
  const dateTo = one('date_to')
  const status = one('status')
  const priority = one('priority')
  const page = Number.parseInt(one('page') || '1', 10)

  return {
    dateFrom: isDate(dateFrom) ? dateFrom : toDateString(new Date(today.getFullYear(), today.getMonth(), 1)),
    dateTo: isDate(dateTo) ? dateTo : toDateString(today),
    status: TICKET_STATUSES.includes(status as TicketStatus) ? (status as TicketStatus) : null,
    priority: TICKET_PRIORITIES.includes(priority as TicketPriority) ? (priority as TicketPriority) : null,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

export async function fetchTicketingDashboard(query: TicketingQuery): Promise<TicketingDashboard> {
  if (!TOKEN) {
    throw new Error('TICKETING_API_TOKEN belum dikonfigurasi di aplikasi aset.')
  }

  const url = new URL('/integrations/assets/tickets', BASE_URL)
  url.searchParams.set('date_from', query.dateFrom)
  url.searchParams.set('date_to', query.dateTo)
  url.searchParams.set('page', String(query.page))
  url.searchParams.set('per_page', '20')
  if (query.status) url.searchParams.set('status', query.status)
  if (query.priority) url.searchParams.set('priority', query.priority)

  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'X-Integration-Token': TOKEN,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error(`Layanan Ticketing di ${url.origin} tidak menjawab dalam 8 detik.`)
    }
    throw new Error(`Tidak dapat terhubung ke layanan Ticketing di ${url.origin}.`)
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Layanan Ticketing menolak token integrasi. Periksa TICKETING_API_TOKEN.')
    }
    throw new Error(`Layanan Ticketing membalas status ${response.status}.`)
  }

  return (await response.json() as TicketingEnvelope).data
}

function isDate(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value))
}

function toDateString(value: Date): string {
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}
