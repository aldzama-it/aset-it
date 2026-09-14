'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

type PhysicalAssetHistoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetCode: string
  tableName: string
}

export function PhysicalAssetHistoryDialog({ open, onOpenChange, assetCode, tableName }: PhysicalAssetHistoryDialogProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !assetCode) return
    const controller = new AbortController()
    
    setLoading(true)
    fetch(`/api/asset-history/${encodeURIComponent(tableName)}/${encodeURIComponent(assetCode)}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok || !result.success) throw new Error(result.error || 'Gagal mengambil riwayat aset')
        setData(result.data)
      })
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
        setError(fetchError instanceof Error ? fetchError.message : 'Gagal mengambil riwayat aset')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [assetCode, tableName, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Timeline Mutasi Aset</DialogTitle>
          <DialogDescription>{assetCode}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[min(65vh,520px)] pr-4">
          {loading && (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin" aria-label="Memuat riwayat" />
            </div>
          )}
          {!loading && error && <p className="py-12 text-center text-sm text-destructive">{error}</p>}
          {!loading && !error && data.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">Belum ada riwayat mutasi.</p>
          )}
          {!loading && !error && data.length > 0 && (
            <div className="space-y-6 pt-4 pl-4 border-l-2 border-slate-200 ml-4 relative">
              {data.map((record, index) => (
                <HistoryItem key={record.id || index} record={record} isLatest={index === 0} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function HistoryItem({ record, isLatest }: { record: any, isLatest: boolean }) {
  const [expanded, setExpanded] = useState(false)

  // Dynamic field resolution
  const holder = record.pic || record.pic_name || record.account_email || 'Tidak Diketahui'
  const dateField = record.handover_date || record.install_date || record.created_at
  const dateStr = dateField ? new Date(dateField).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
  
  const returnStr = record.return_date 
    ? new Date(record.return_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : (isLatest ? <span className="text-green-600 font-semibold">Sekarang</span> : 'Dipindahkan')

  const isReturned = record.return_date !== undefined && record.return_date !== null;
  const dotColor = isLatest && !isReturned ? 'bg-green-500' : 'bg-slate-300';

  return (
    <div className="relative">
      <div className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${dotColor}`} />
      
      <div className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-base">{holder}</h4>
            <div className="text-xs font-medium bg-slate-100 px-2 py-1 rounded inline-block mt-1 mb-2">
              {dateStr}
              {' - '}
              {returnStr}
            </div>
            {record.condition && (
               <span className="ml-2 text-xs font-medium bg-slate-50 px-2 py-1 rounded border">Kondisi: {record.condition}</span>
            )}
          </div>
          
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs text-blue-600 hover:underline px-2 py-1"
          >
            {expanded ? 'Tutup Detail' : 'Lihat Detail'}
          </button>
        </div>

        {expanded && (
          <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-md space-y-1">
            {(record.department || record.division) && (
              <p><span className="font-medium">Departemen / Divisi:</span> {record.department || record.division || '-'}</p>
            )}
            {(record.branch || record.location) && (
              <p><span className="font-medium">Cabang / Lokasi:</span> {record.branch || record.location || '-'}</p>
            )}
            {record.it_handover && <p><span className="font-medium">Diserahkan oleh:</span> {record.it_handover}</p>}
            {record.it_receiver && <p><span className="font-medium">Diterima oleh:</span> {record.it_receiver}</p>}
            {record.notes && <p><span className="font-medium">Catatan:</span> &quot;{record.notes}&quot;</p>}
          </div>
        )}
      </div>
    </div>
  )
}
