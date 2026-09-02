import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { TicketingDashboard, TicketingTicket } from '@/lib/ticketing-shared'

const STATUS_STYLE: Record<TicketingTicket['status'], string> = {
  NEW: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  WAITING_USER: 'bg-amber-100 text-amber-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-slate-200 text-slate-600',
}

const STATUS_LABEL: Record<TicketingTicket['status'], string> = {
  NEW: 'Baru', IN_PROGRESS: 'Diproses', WAITING_USER: 'Menunggu pengguna', RESOLVED: 'Selesai', CLOSED: 'Ditutup',
}

const PRIORITY_STYLE: Record<TicketingTicket['priority'], string> = {
  Low: 'bg-slate-100 text-slate-600', Medium: 'bg-blue-50 text-blue-700', High: 'bg-orange-100 text-orange-700', Urgent: 'bg-rose-100 text-rose-700',
}

export function TicketsTable({ tickets, query }: { tickets: TicketingDashboard['tickets']; query: string }) {
  const { data: rows, pagination } = tickets
  const pageUrl = (page: number) => `/ticketing?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(query)), page: String(page) }).toString()}`

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Daftar tiket</CardTitle>
        <span className="text-xs text-muted-foreground">{pagination.total.toLocaleString('id-ID')} tiket</span>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="flex h-44 items-center justify-center text-sm text-muted-foreground">Tidak ada tiket pada filter ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Ticket</TableHead><TableHead>Subjek</TableHead><TableHead>Pelapor</TableHead><TableHead>Status</TableHead><TableHead>Prioritas</TableHead><TableHead>Teknisi</TableHead><TableHead>Dibuat</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">
                      <a href={ticket.detail_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                        {ticket.ticket_number}<ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell><div className="max-w-64 truncate font-medium" title={ticket.subject}>{ticket.subject}</div><div className="text-xs text-muted-foreground">{ticket.category ?? '-'}</div></TableCell>
                    <TableCell><div>{ticket.reporter_name}</div><div className="text-xs text-muted-foreground">{ticket.department ?? ticket.location ?? '-'}</div></TableCell>
                    <TableCell><Badge className={STATUS_STYLE[ticket.status]}>{STATUS_LABEL[ticket.status]}</Badge></TableCell>
                    <TableCell><Badge className={PRIORITY_STYLE[ticket.priority]}>{ticket.priority}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{ticket.assigned_to ?? 'Belum ditugaskan'}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(ticket.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {pagination.last_page > 1 && (
          <Pagination className="mt-5">
            <PaginationContent>
              {pagination.current_page > 1 && <PaginationItem><PaginationPrevious href={pageUrl(pagination.current_page - 1)} text="Sebelumnya" /></PaginationItem>}
              <PaginationItem><span className="px-3 text-sm text-muted-foreground">Halaman {pagination.current_page} dari {pagination.last_page}</span></PaginationItem>
              {pagination.current_page < pagination.last_page && <PaginationItem><PaginationNext href={pageUrl(pagination.current_page + 1)} text="Berikutnya" /></PaginationItem>}
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  )
}

function formatDate(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
