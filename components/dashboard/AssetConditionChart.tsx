'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CONDITION_COLORS = {
  Baru: '#3b82f6',
  Baik: '#22c55e',
  Perlu_Servis: '#eab308',
  Rusak: '#ef4444',
  Hilang: '#f97316',
  Tidak_Aktif: '#9ca3af'
}

export function AssetConditionChart({ data }: { data: any[] }) {
  // data format: [{ name: 'Laptop', Baru: 10, Baik: 20, Rusak: 2 }, ...]

  return (
    <Card className="col-span-1 shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Asset Condition by Type</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {Object.entries(CONDITION_COLORS).map(([key, color]) => (
                <Bar key={key} dataKey={key} stackId="a" fill={color} maxBarSize={50} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
