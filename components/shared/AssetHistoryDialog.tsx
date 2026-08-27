'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, Loader2 } from 'lucide-react'
import type { AssetTableName, AssetTransferItem } from '@/lib/asset-transfer'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type HistoryItem = {
  id: number
  action: string
  from_employee: string | null
  to_employee: string | null
  from_location: string | null
  to_location: string | null
  old_condition: string | null
  new_condition: string | null
  changed_by: string | null
  notes: string | null
  event_at: string
}

type AssetHistoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: AssetTransferItem
  tableName: AssetTableName
}

function ChangeValue({ from, to }: { from: string | null; to: string | null }) {
  if (!from && !to) return null

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-sm">
      <span className="truncate text-muted-foreground">{from || '-'}</span>
      <ArrowDown className="size-3 -rotate-90 text-muted-foreground" aria-hidden="true" />
      <span className="truncate font-medium">{to || '-'}</span>
    </div>
  )
}

export function AssetHistoryDialog({ open, onOpenChange, item, tableName }: AssetHistoryDialogProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    const params = new URLSearchParams({
      table_name: tableName,
      asset_id: String(item.id),
      limit: '100',
    })

    fetch(`/api/history?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok || !result.success) throw new Error(result.error || 'Gagal mengambil riwayat')
        setHistory(result.data)
      })
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
        setError(fetchError instanceof Error ? fetchError.message : 'Gagal mengambil riwayat')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [item.id, open, tableName])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Riwayat Aset</DialogTitle>
          <DialogDescription>{item.asset_code || `Aset #${item.id}`}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[min(65vh,520px)] pr-4">
          {loading && (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin" aria-label="Memuat riwayat" />
            </div>
          )}
          {!loading && error && <p className="py-12 text-center text-sm text-destructive">{error}</p>}
          {!loading && !error && history.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">Belum ada riwayat aset.</p>
          )}
          {!loading && !error && history.length > 0 && (
            <ol className="ml-2 border-l border-border pl-5">
              {history.map((event) => (
                <li key={event.id} className="relative pb-6 last:pb-0">
                  <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-background" />
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline">{event.action.replaceAll('_', ' ')}</Badge>
                      <time className="text-xs text-muted-foreground">
                        {new Date(event.event_at).toLocaleString('id-ID')}
                      </time>
                    </div>
                    {(event.from_employee || event.to_employee) && (
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">PIC</p>
                        <ChangeValue from={event.from_employee} to={event.to_employee} />
                      </div>
                    )}
                    {(event.from_location || event.to_location) && (
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Lokasi</p>
                        <ChangeValue from={event.from_location} to={event.to_location} />
                      </div>
                    )}
                    {(event.old_condition || event.new_condition) && (
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Kondisi</p>
                        <ChangeValue from={event.old_condition} to={event.new_condition} />
                      </div>
                    )}
                    {event.notes && <p className="text-sm leading-6">{event.notes}</p>}
                    <p className="text-xs text-muted-foreground">Oleh {event.changed_by || 'Sistem'}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
