'use client'

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TicketingDashboard } from '@/lib/ticketing-shared'

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Baru',
  IN_PROGRESS: 'Diproses',
  WAITING_USER: 'Menunggu pengguna',
  RESOLVED: 'Selesai',
  CLOSED: 'Ditutup',
}

export function TicketingCharts({ status_breakdown: statusBreakdown, trend }: Pick<TicketingDashboard, 'status_breakdown' | 'trend'>) {
  const statusRows = statusBreakdown.map((item) => ({ name: STATUS_LABELS[item.status], total: item.total }))
  const trendRows = trend.map((item) => ({
    ...item,
    label: new Date(`${item.date}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
  }))

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-2 border-border/70 shadow-sm">
        <CardHeader><CardTitle className="text-sm font-medium">Status antrean</CardTitle></CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={statusRows} layout="vertical" margin={{ top: 0, right: 18, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#e5e7eb" />
              <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={112} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8 }} formatter={(value) => [value, 'Tiket']} />
              <Bar dataKey="total" name="Tiket" fill="#2563eb" radius={[0, 4, 4, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="xl:col-span-3 border-border/70 shadow-sm">
        <CardHeader><CardTitle className="text-sm font-medium">Tiket dibuat dan diselesaikan</CardTitle></CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={trendRows} margin={{ top: 0, right: 10, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="created" name="Dibuat" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar dataKey="completed" name="Diselesaikan" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
