'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatNumber, type CollectorHealth } from '@/lib/network-analyzer-shared'

const SERVICE_LABELS: Record<string, string> = {
  'mikrotik-collector': 'MikroTik Collector',
  'flow-collector': 'Flow Collector',
  'dns-import': 'DNS Import',
  correlator: 'Correlator',
}

const STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
  healthy: { dot: 'bg-green-500', text: 'text-green-700', label: 'Sehat' },
  stale: { dot: 'bg-amber-500', text: 'text-amber-700', label: 'Tertinggal' },
  error: { dot: 'bg-red-500', text: 'text-red-700', label: 'Error' },
  unknown: { dot: 'bg-slate-400', text: 'text-slate-600', label: 'Belum Melapor' },
}

/**
 * Satu-satunya bagian halaman yang menyegarkan diri sendiri.
 *
 * Angka pemakaian dibaca sekali per kunjungan, tapi status collector adalah
 * jawaban atas "apakah angka di atas masih diperbarui?" -- itu kehilangan
 * gunanya kalau ikut membeku sampai halaman di-reload.
 */
export function CollectorHealthPanel({ initial }: { initial: CollectorHealth | null }) {
  const [health, setHealth] = useState<CollectorHealth | null>(initial)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = () => {
      fetch('/api/network-analyzer/health')
        .then((r) => r.json())
        .then((res) => {
          if (cancelled) return
          if (res.success) {
            setHealth(res.data)
            setFailed(false)
          } else {
            setFailed(true)
          }
        })
        .catch(() => {
          if (!cancelled) setFailed(true)
        })
    }

    const timer = setInterval(load, 60_000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  const degraded = health?.status !== 'healthy'

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Status Collector</CardTitle>
        {health && (
          <span className={cn('text-xs font-semibold', degraded ? 'text-amber-700' : 'text-green-700')}>
            {degraded ? 'Terdegradasi' : 'Sehat'}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {!health ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Status collector tidak tersedia.
          </div>
        ) : (
          <>
            {health.services.map((service) => {
              const style = STATUS_STYLES[service.status] ?? STATUS_STYLES.unknown

              return (
                <div
                  key={service.service}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', style.dot)} />
                    <span className="truncate text-sm font-medium">
                      {SERVICE_LABELS[service.service] ?? service.service}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn('text-xs font-semibold', style.text)}>{style.label}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {formatNumber(service.records_processed)} rekaman
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="pt-1 text-[11px] text-muted-foreground">
              Basis data: {health.database} &middot; diperiksa {formatCheckedAt(health.checked_at)}
              {failed && ' · pembaruan terakhir gagal'}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function formatCheckedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
