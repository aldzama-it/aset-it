'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts'

interface Props {
  data: { branch: string; count: number }[]
}

const BAR_COLORS = [
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
  '#EC4899', '#F43F5E', '#F97316', '#F59E0B',
]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-slate-500 text-[10px] mb-0.5 font-medium">{payload[0].payload.branch}</p>
      <p className="text-slate-900 text-base font-bold font-poppins">
        {payload[0].value} <span className="text-slate-500 text-xs font-normal">unit</span>
      </p>
    </div>
  )
}

export function AssetByBranchChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 8)
  const max = sorted[0]?.count || 1

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
      <BarChart
        layout="vertical"
        data={sorted}
        margin={{ top: 5, right: 45, left: 10, bottom: 5 }}
        barCategoryGap="28%"
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
          domain={[0, max]}
        />
        <YAxis
          dataKey="branch"
          type="category"
          tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
          width={110}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {sorted.map((_, index) => (
            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} fillOpacity={0.9} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            style={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
