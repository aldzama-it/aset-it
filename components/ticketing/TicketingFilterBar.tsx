'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TICKET_PRIORITIES, TICKET_STATUSES, type TicketingQuery } from '@/lib/ticketing-shared'

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Baru',
  IN_PROGRESS: 'Diproses',
  WAITING_USER: 'Menunggu pengguna',
  RESOLVED: 'Selesai',
  CLOSED: 'Ditutup',
}

export function TicketingFilterBar({ query }: { query: TicketingQuery }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [from, setFrom] = useState(query.dateFrom)
  const [to, setTo] = useState(query.dateTo)
  const [status, setStatus] = useState(query.status ?? '')
  const [priority, setPriority] = useState(query.priority ?? '')

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString())
    for (const key of ['date_from', 'date_to', 'status', 'priority', 'page']) params.delete(key)
    params.set('date_from', from)
    params.set('date_to', to)
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)
    router.push(`/ticketing?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-xl border border-border/70 bg-background p-3 shadow-sm">
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Dari
        <Input aria-label="Tanggal mulai" type="date" value={from} max={to} onChange={(event) => setFrom(event.target.value)} className="h-8 w-[146px]" />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Sampai
        <Input aria-label="Tanggal akhir" type="date" value={to} min={from} onChange={(event) => setTo(event.target.value)} className="h-8 w-[146px]" />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Status
        <select aria-label="Filter status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-8 min-w-36 rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <option value="">Semua status</option>
          {TICKET_STATUSES.map((item) => <option key={item} value={item}>{STATUS_LABELS[item]}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Prioritas
        <select aria-label="Filter prioritas" value={priority} onChange={(event) => setPriority(event.target.value)} className="h-8 min-w-32 rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <option value="">Semua prioritas</option>
          {TICKET_PRIORITIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <div className="flex gap-2">
        <Button size="sm" className="h-8" disabled={!from || !to || from > to} onClick={apply}>Terapkan</Button>
        <Button size="sm" variant="ghost" className="h-8" onClick={() => router.push('/ticketing')}>Bulan ini</Button>
      </div>
    </div>
  )
}
