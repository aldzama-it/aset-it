'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AssetByDepartmentChart({ data }: { data: { department: string; count: number }[] }) {
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 10)

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Top 10 Departments by Asset Volume</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        {sortedData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
