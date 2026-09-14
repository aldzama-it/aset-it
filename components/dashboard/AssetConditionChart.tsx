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
    <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-xl min-w-[140px]">
      <p className="text-slate-900 font-bold text-xs mb-2 border-b border-slate-100 pb-1">{label}</p>
      {payload.map((p: any) => p.value > 0 && (
        <div key={p.dataKey} className="flex items-center justify-between gap-3 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
            <span className="text-slate-600 text-xs font-medium">{p.name}</span>
          </div>
          <span className="text-slate-900 text-xs font-bold font-poppins">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
    {payload?.map((entry: any) => (
      <div key={entry.value} className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-slate-600 text-[11px] font-medium">{entry.value}</span>
      </div>
    ))}
  </div>
)

export function AssetConditionChart({ data }: Props) {
  // Filter out categories with no data
  const filtered = data.filter(d => BARS.some(b => (d as any)[b.key] > 0))

  if (filtered.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">Belum ada data</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
      <BarChart
        data={filtered}
        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
        barCategoryGap="25%"
        barGap={1}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#64748B' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
        <Legend content={<CustomLegend />} />
        {BARS.map(bar => (
          <Bar key={bar.key} dataKey={bar.key} name={bar.label} stackId="a" fill={bar.color} maxBarSize={48} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
