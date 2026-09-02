import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatBytes } from '@/lib/network-analyzer-shared'
import type { ConfidenceRow } from '@/lib/network-analyzer-shared'
import { cn } from '@/lib/utils'

/**
 * Seberapa kuat bukti di balik angka di halaman ini.
 *
 * Analyzer selalu mengirim rincian ini bersama totalnya, dengan alasan yang
 * sama: pembaca harus bisa membedakan trafik yang terukur dari yang
 * disimpulkan sebelum memakainya untuk mengambil keputusan.
 */
const LEVELS: Record<string, { label: string; bar: string; text: string }> = {
  HIGH: { label: 'Tinggi', bar: 'bg-green-500', text: 'text-green-700' },
  MEDIUM: { label: 'Sedang', bar: 'bg-blue-500', text: 'text-blue-700' },
  LOW: { label: 'Rendah', bar: 'bg-amber-500', text: 'text-amber-700' },
  UNKNOWN: { label: 'Tidak Diketahui', bar: 'bg-slate-400', text: 'text-slate-600' },
}

export function ConfidenceBreakdown({ data }: { data: ConfidenceRow[] | null }) {
  const rows = data ?? []
  const total = rows.reduce((sum, row) => sum + row.bytes_total, 0)

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Tingkat Keyakinan Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Tidak ada data pada periode ini</div>
        ) : (
          rows.map((row) => {
            const level = LEVELS[row.confidence ?? 'UNKNOWN'] ?? LEVELS.UNKNOWN
            const share = total > 0 ? (row.bytes_total / total) * 100 : 0

            return (
              <div key={row.confidence ?? 'unknown'} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={cn('font-medium', level.text)}>{level.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatBytes(row.bytes_total)} &middot; {share.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn('h-full rounded-full', level.bar)} style={{ width: `${share}%` }} />
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
