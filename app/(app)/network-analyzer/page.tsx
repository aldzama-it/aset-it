import {
  analyzerFetch,
  fetchCollectorHealth,
  resolveRange,
  type AnalyzerEnvelope,
  type AnalyzerSummary,
  type CategoryRow,
  type CollectorHealth,
  type TopApplicationRow,
  type TopUserRow,
  type TrendPoint,
} from '@/lib/network-analyzer'
import { getErrorMessage } from '@/lib/utils'
import { AnalyzerFilterBar } from '@/components/network-analyzer/AnalyzerFilterBar'
import { AnalyzerSummaryCards } from '@/components/network-analyzer/AnalyzerSummaryCards'
import { AnalyzerErrorState } from '@/components/network-analyzer/AnalyzerErrorState'
import { CategoryDonutChart } from '@/components/network-analyzer/CategoryDonutChart'
import { CollectorHealthPanel } from '@/components/network-analyzer/CollectorHealthPanel'
import { TopApplicationsChart } from '@/components/network-analyzer/TopApplicationsChart'
import { TopUsersTable } from '@/components/network-analyzer/TopUsersTable'
import { UsageTrendChart } from '@/components/network-analyzer/UsageTrendChart'

export const dynamic = 'force-dynamic'

const ANALYZER_URL = process.env.NETWORK_ANALYZER_URL || 'http://192.168.5.250:8092'

export default async function NetworkAnalyzerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const range = resolveRange(await searchParams)
  const period = { date_from: range.date_from, date_to: range.date_to }
  const query = new URLSearchParams(
    range.preset ? { preset: range.preset } : period,
  ).toString()

  /*
   * Setiap panel gagal sendiri-sendiri. Satu endpoint yang bermasalah tidak
   * boleh mengosongkan seluruh halaman -- tapi kalau ringkasannya sendiri
   * tidak bisa diambil, analyzer memang tidak terjangkau dan halaman jujur
   * mengatakan itu daripada menampilkan enam kartu nol.
   */
  const [summary, trend, topUsers, topApplications, categories, health] = await Promise.all([
    analyzerFetch<AnalyzerEnvelope<AnalyzerSummary>>('/dashboard/summary', period).catch((e) => e as Error),
    analyzerFetch<AnalyzerEnvelope<TrendPoint[]>>('/dashboard/trend', period).catch(() => null),
    analyzerFetch<AnalyzerEnvelope<TopUserRow[]>>('/dashboard/top-users', { ...period, limit: 10 }).catch(() => null),
    analyzerFetch<AnalyzerEnvelope<TopApplicationRow[]>>('/dashboard/top-applications', { ...period, limit: 10 }).catch(() => null),
    analyzerFetch<AnalyzerEnvelope<CategoryRow[]>>('/dashboard/categories', period).catch(() => null),
    fetchCollectorHealth().catch(() => null as CollectorHealth | null),
  ])

  if (summary instanceof Error) {
    return (
      <div className="flex-1 w-full p-4 md:p-6 pb-20 space-y-6">
        <AnalyzerFilterBar range={range} basePath="/network-analyzer" />
        <AnalyzerErrorState
          message={getErrorMessage(summary, 'Layanan tidak merespons.')}
          url={ANALYZER_URL}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 w-full p-4 md:p-6 pb-20 space-y-6 bg-slate-50/30 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="flex flex-col gap-2">
        <AnalyzerFilterBar range={range} basePath="/network-analyzer" />
        <p className="text-xs text-muted-foreground">
          Periode {formatPeriod(summary.meta.date_from)} &ndash; {formatPeriod(summary.meta.date_to)} &middot;{' '}
          zona waktu {summary.meta.timezone}
        </p>
      </div>

      <AnalyzerSummaryCards data={summary.data} />

      <UsageTrendChart data={trend?.data ?? null} meta={trend?.meta ?? summary.meta} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopApplicationsChart data={topApplications?.data ?? null} />
        <CategoryDonutChart data={categories?.data ?? null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopUsersTable data={topUsers?.data ?? null} query={query} />
        </div>
        <CollectorHealthPanel initial={health} />
      </div>
    </div>
  )
}

function formatPeriod(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
