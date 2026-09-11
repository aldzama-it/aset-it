'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface GrowthData {
  month: string
  label: string
  count: number
}

interface Props {
  data: GrowthData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.[0]) return null
  const item = payload[0].payload as GrowthData
  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2.5 shadow-2xl">
      <p className="text-white/50 text-[10px] mb-1">{item.label}</p>
      <p className="text-white text-lg font-bold font-poppins">
        {payload[0].value} <span className="text-white/40 text-xs font-normal">aset baru</span>
      </p>
    </div>
  )
}

export function AssetGrowthChart({ data }: Props) {
  const maxVal = Math.max(...data.map(d => d.count), 1)

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          domain={[0, maxVal + Math.ceil(maxVal * 0.1)]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          strokeWidth={2.5}
          fill="url(#growthGradient)"
          dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#3B82F6', stroke: 'rgba(59,130,246,0.4)', strokeWidth: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
