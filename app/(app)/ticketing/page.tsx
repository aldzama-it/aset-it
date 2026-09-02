import { TicketingCharts } from '@/components/ticketing/TicketingCharts'
import { TicketingErrorState } from '@/components/ticketing/TicketingErrorState'
import { TicketingFilterBar } from '@/components/ticketing/TicketingFilterBar'
import { TicketingSummary } from '@/components/ticketing/TicketingSummary'
import { TicketsTable } from '@/components/ticketing/TicketsTable'
import { getErrorMessage } from '@/lib/utils'
import { fetchTicketingDashboard, resolveTicketingQuery } from '@/lib/ticketing'

export const dynamic = 'force-dynamic'

const TICKETING_URL = process.env.TICKETING_API_URL || 'https://ticketing.aldzama.com'

export default async function TicketingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = resolveTicketingQuery(await searchParams)
  const queryString = new URLSearchParams({
    date_from: query.dateFrom,
    date_to: query.dateTo,
    ...(query.status ? { status: query.status } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
  }).toString()

  const result = await fetchTicketingDashboard(query).catch((error: unknown) => (
    error instanceof Error ? error : new Error('Layanan Ticketing tidak dapat dihubungi.')
  ))

  if (result instanceof Error) {
    return (
      <main className="flex-1 w-full space-y-6 p-4 pb-20 md:p-6">
        <header className="flex flex-col gap-1"><h1 className="font-poppins text-2xl font-semibold tracking-tight">Ticketing</h1><p className="text-sm text-muted-foreground">Ringkasan data dari aplikasi Ticketing.</p></header>
        <TicketingFilterBar key={queryString} query={query} />
        <TicketingErrorState message={getErrorMessage(result, 'Layanan Ticketing tidak dapat dihubungi.')} url={TICKETING_URL} />
      </main>
    )
  }

  return (
    <main className="flex-1 w-full space-y-6 bg-slate-50/30 p-4 pb-20 md:p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-poppins text-2xl font-semibold tracking-tight">Ticketing</h1>
        <p className="text-sm text-muted-foreground">Pantau antrean kerja IT dan buka detail tiket di aplikasi Ticketing.</p>
      </header>
      <TicketingFilterBar key={queryString} query={query} />
      <TicketingSummary data={result.summary} />
      <TicketingCharts status_breakdown={result.status_breakdown} trend={result.trend} />
      <TicketsTable tickets={result.tickets} query={queryString} />
    </main>
  )
}
