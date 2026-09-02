import { CircleCheckBig, Clock3, Inbox, Siren } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TicketingDashboard } from '@/lib/ticketing-shared'

export function TicketingSummary({ data }: { data: TicketingDashboard['summary'] }) {
  const items = [
    { label: 'Tiket pada periode ini', value: data.total_tickets, icon: Inbox, iconClass: 'text-blue-600' },
    { label: 'Masih aktif', value: data.active_tickets, icon: Clock3, iconClass: 'text-amber-600' },
    { label: 'Sudah selesai', value: data.completed_tickets, icon: CircleCheckBig, iconClass: 'text-emerald-600' },
    { label: 'Prioritas urgent', value: data.urgent_tickets, icon: Siren, iconClass: 'text-rose-600' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">{item.label}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.iconClass}`} />
          </CardHeader>
          <CardContent>
            <p className="font-poppins text-2xl font-semibold tabular-nums">{item.value.toLocaleString('id-ID')}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
