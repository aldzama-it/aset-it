'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AssetGrowthChart({ data }: { data: { month: string; count: number }[] }) {
  // data format: [{ month: 'Jan 2024', count: 50 }, { month: 'Feb 2024', count: 120 }, ...]

  return (
    <Card className="col-span-1 md:col-span-2 shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Asset Growth Trend (Cumulative)</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="count" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
