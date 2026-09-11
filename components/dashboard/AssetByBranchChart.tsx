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
    <div className="bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
      <p className="text-white/60 text-[10px] mb-1">{payload[0].payload.branch}</p>
      <p className="text-white text-lg font-bold font-poppins">
        {payload[0].value} <span className="text-white/40 text-xs font-normal">unit</span>
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
        margin={{ top: 5, right: 50, left: 8, bottom: 5 }}
        barCategoryGap="28%"
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
          axisLine={false}
          tickLine={false}
          domain={[0, max]}
        />
        <YAxis
          dataKey="branch"
          type="category"
          tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }}
          width={90}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {sorted.map((_, index) => (
            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} fillOpacity={0.85} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            style={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
