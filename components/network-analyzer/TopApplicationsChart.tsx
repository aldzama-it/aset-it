'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatBytes, UNKNOWN_LABEL, type TopApplicationRow } from '@/lib/network-analyzer-shared'

export function TopApplicationsChart({ data }: { data: TopApplicationRow[] | null }) {
  // application_name null adalah kategori Unknown milik analyzer, bukan baris
  // rusak -- diberi label, bukan dibuang.
  const rows = (data ?? [])
    .map((row) => ({ name: row.application_name ?? UNKNOWN_LABEL, bytes: row.bytes_total }))
    .filter((row) => row.bytes > 0)

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Aplikasi Teratas</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Tidak ada data pada periode ini
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart layout="vertical" data={rows} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => formatBytes(value)}
              />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                formatter={(value) => [formatBytes(Number(value)), 'Trafik']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="bytes" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
