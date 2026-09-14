'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export interface ConditionBreakdown {
  Baru: number
  Baik: number
  Perlu_Servis: number
  Rusak: number
  Hilang: number
  Tidak_Aktif: number
}

const CONDITION_CONFIG: Record<string, { color: string; label: string; order: number }> = {
  Baru:        { color: '#3B82F6', label: 'Baru',        order: 0 },
  Baik:        { color: '#10B981', label: 'Baik',        order: 1 },
  Perlu_Servis:{ color: '#F59E0B', label: 'Perlu Servis',order: 2 },
  Rusak:       { color: '#EF4444', label: 'Rusak',       order: 3 },
  Tidak_Aktif: { color: '#64748B', label: 'Tidak Aktif', order: 4 },
  Hilang:      { color: '#EC4899', label: 'Hilang',      order: 5 },
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null
  const { name, value } = payload[0]
  const cfg = CONDITION_CONFIG[name]
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg?.color || '#94A3B8' }} />
        <p className="text-slate-600 text-xs font-semibold">{cfg?.label || name}</p>
      </div>
      <p className="text-slate-900 text-base font-bold font-poppins mt-0.5">{value.toLocaleString()} unit</p>
    </div>
  )
}

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2">
    {payload?.map((entry: any) => {
      const cfg = CONDITION_CONFIG[entry.value]
      return (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg?.color || entry.color }} />
          <span className="text-slate-600 text-[11px] font-medium">{cfg?.label || entry.value}</span>
        </div>
      )
    })}
  </div>
)

interface Props {
  data: ConditionBreakdown
}

export function AssetCompositionChart({ data }: Props) {
  const chartData = Object.entries(data)
    .filter(([, v]) => v > 0)
    .sort((a, b) => (CONDITION_CONFIG[a[0]]?.order ?? 9) - (CONDITION_CONFIG[b[0]]?.order ?? 9))
    .map(([key, value]) => ({ name: key, value }))

  const total = chartData.reduce((a, b) => a + b.value, 0)
  const goodPct = total > 0 ? Math.round(((data.Baru + data.Baik) / total) * 100) : 0

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="48%"
              innerRadius="52%"
              outerRadius="75%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={CONDITION_CONFIG[entry.name]?.color || '#64748B'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ bottom: '12%' }}>
          <p className="text-3xl font-bold font-poppins text-slate-900">{goodPct}%</p>
          <p className="text-slate-500 text-[11px] font-semibold tracking-wide">Kondisi Baik</p>
        </div>
      </div>
    </div>
  )
}
