'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { formatBytes, UNKNOWN_LABEL, type CategoryRow } from '@/lib/network-analyzer-shared'

const FALLBACK_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#64748b']

export function CategoryDonutChart({ data }: { data: CategoryRow[] | null }) {
  // Kategori punya warnanya sendiri di analyzer; memakainya membuat donat di
  // sini terbaca sama dengan grafik di dashboard aslinya.
  const rows = (data ?? [])
    .filter((row) => row.bytes_total > 0)
    .map((row, i) => ({
      name: row.category_name ?? UNKNOWN_LABEL,
      value: row.bytes_total,
      color: row.category_color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    }))

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Komposisi Kategori</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Tidak ada data pada periode ini
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie data={rows} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={2} dataKey="value" stroke="none">
                {rows.map((row) => (
                  <Cell key={row.name} fill={row.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatBytes(Number(value))}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1f2937', fontWeight: 500, fontSize: '14px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
