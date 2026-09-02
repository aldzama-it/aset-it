import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  analyzerFetch,
  resolveRange,
  type HotspotSessionRow,
  type TrendPoint,
  type UserDetail,
} from '@/lib/network-analyzer'
import { getErrorMessage } from '@/lib/utils'
import { AnalyzerErrorState } from '@/components/network-analyzer/AnalyzerErrorState'
import { AnalyzerFilterBar } from '@/components/network-analyzer/AnalyzerFilterBar'
import { AnalyzerSummaryCards } from '@/components/network-analyzer/AnalyzerSummaryCards'
import { ConfidenceBreakdown } from '@/components/network-analyzer/ConfidenceBreakdown'
import { TopApplicationsChart } from '@/components/network-analyzer/TopApplicationsChart'
import { TopDomainsTable } from '@/components/network-analyzer/TopDomainsTable'
import { UsageTrendChart } from '@/components/network-analyzer/UsageTrendChart'
import { UserSessionsTable } from '@/components/network-analyzer/UserSessionsTable'

export const dynamic = 'force-dynamic'

const ANALYZER_URL = process.env.NETWORK_ANALYZER_URL || 'http://192.168.5.250:8092'

export default async function NetworkAnalyzerUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const range = resolveRange(await searchParams)
  const period = { date_from: range.date_from, date_to: range.date_to }
  const query = new URLSearchParams(range.preset ? { preset: range.preset } : period).toString()
  const basePath = `/network-analyzer/users/${id}`

  const [detail, trend, sessions] = await Promise.all([
    analyzerFetch<{ data: UserDetail }>(`/users/${id}`, period).catch((e) => e as Error),
    analyzerFetch<{ data: TrendPoint[] }>(`/users/${id}/usage`, period).catch(() => null),
    // Sesi tidak menerima filter periode di analyzer -- selalu 100 terakhir.
    analyzerFetch<{ data: HotspotSessionRow[] }>(`/users/${id}/sessions`).catch(() => null),
  ])

  const backButton = (
    <Button asChild variant="outline" size="sm" className="h-8 w-fit">
      <Link href={`/network-analyzer?${query}`}>
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>
    </Button>
  )

  if (detail instanceof Error) {
    return (
      <div className="flex-1 w-full p-4 md:p-6 pb-20 space-y-6">
        {backButton}
        <AnalyzerErrorState message={getErrorMessage(detail, 'Layanan tidak merespons.')} url={ANALYZER_URL} />
      </div>
    )
  }

  const { employee } = detail.data

  return (
    <div className="flex-1 w-full p-4 md:p-6 pb-20 space-y-6 bg-slate-50/30 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="flex flex-col gap-3">
        {backButton}
        <div>
          <h2 className="text-xl font-bold font-poppins">{employee.name}</h2>
          <p className="text-sm text-muted-foreground">
            {employee.department || 'Tanpa departemen'}
            {employee.hotspot_username && ` · ${employee.hotspot_username}`}
          </p>
        </div>
        <AnalyzerFilterBar range={range} basePath={basePath} />
      </div>

      <AnalyzerSummaryCards data={detail.data.summary} showActiveUsers={false} />

      <UsageTrendChart data={trend?.data ?? null} meta={null} title="Tren Pemakaian Pengguna" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopApplicationsChart data={detail.data.applications} />
        </div>
        <ConfidenceBreakdown data={detail.data.confidence} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopDomainsTable data={detail.data.domains} />
        <UserSessionsTable data={sessions?.data ?? null} />
      </div>
    </div>
  )
}
