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

type LaptopHistoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetCode: string
}

export function LaptopHistoryDialog({ open, onOpenChange, assetCode }: LaptopHistoryDialogProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    
    setLoading(true)
    fetch(`/api/laptops/history/${encodeURIComponent(assetCode)}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok || !result.success) throw new Error(result.error || 'Gagal mengambil riwayat laptop')
        setData(result.data)
      })
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
        setError(fetchError instanceof Error ? fetchError.message : 'Gagal mengambil riwayat laptop')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [assetCode, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Timeline Pemegang Laptop</DialogTitle>
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
            <p className="py-12 text-center text-sm text-muted-foreground">Belum ada riwayat pemegang.</p>
          )}
          {!loading && !error && data.length > 0 && (
            <div className="space-y-6 pt-4 pl-4 border-l-2 border-slate-200 ml-4 relative">
              {data.map((record, index) => (
                <HistoryItem key={record.id} record={record} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function HistoryItem({ record }: { record: any }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative">
      <div className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${record.return_date === null ? 'bg-green-500' : 'bg-slate-300'}`} />
      
      <div className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-base">{record.pic || 'Tidak Diketahui'}</h4>
            <div className="text-xs font-medium bg-slate-100 px-2 py-1 rounded inline-block mt-1 mb-2">
              {new Date(record.handover_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' - '}
              {record.return_date ? new Date(record.return_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : <span className="text-green-600 font-semibold">Sekarang</span>}
            </div>
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
            <p><span className="font-medium">Departemen:</span> {record.department || '-'}</p>
            <p><span className="font-medium">Cabang/Lokasi:</span> {record.branch || '-'}</p>
            {record.notes && <p><span className="font-medium">Catatan:</span> &quot;{record.notes}&quot;</p>}
          </div>
        )}
      </div>
    </div>
  )
}
