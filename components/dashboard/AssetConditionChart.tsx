'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts'

interface CategoryCondition {
  name: string
  Baru?: number
  Baik?: number
  Perlu_Servis?: number
  Rusak?: number
  Hilang?: number
  Tidak_Aktif?: number
}

interface Props {
  data: CategoryCondition[]
}

const BARS = [
  { key: 'Baru',         label: 'Baru',         color: '#3B82F6' },
  { key: 'Baik',         label: 'Baik',         color: '#10B981' },
  { key: 'Perlu_Servis', label: 'Perlu Servis', color: '#F59E0B' },
  { key: 'Rusak',        label: 'Rusak',        color: '#EF4444' },
  { key: 'Tidak_Aktif',  label: 'Tidak Aktif',  color: '#64748B' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2.5 shadow-2xl min-w-[140px]">
      <p className="text-white font-semibold text-xs mb-2">{label}</p>
      {payload.map((p: any) => p.value > 0 && (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
            <span className="text-white/60 text-[10px]">{p.name}</span>
          </div>
          <span className="text-white text-xs font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
    {payload?.map((entry: any) => (
      <div key={entry.value} className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-white/50 text-[10px]">{entry.value}</span>
      </div>
    ))}
  </div>
)

export function AssetConditionChart({ data }: Props) {
  // Filter out categories with no data
  const filtered = data.filter(d => BARS.some(b => (d as any)[b.key] > 0))

  if (filtered.length === 0) {
    return <div className="h-full flex items-center justify-center text-white/30 text-sm">Belum ada data</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
      <BarChart
        data={filtered}
        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
        barCategoryGap="25%"
        barGap={1}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Legend content={<CustomLegend />} />
        {BARS.map(bar => (
          <Bar key={bar.key} dataKey={bar.key} name={bar.label} stackId="a" fill={bar.color} maxBarSize={48} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
