'use client'

import { MonitorSmartphone, Cloud, AlertTriangle, TrendingUp, ArrowUp } from 'lucide-react'

export interface ExecutiveKPIs {
  totalPhysical: number
  totalDigital: number
  totalDamaged: number
  totalNeedService: number
  thisMonthCount: number
  healthScore: number
}

interface KPICardProps {
  icon: React.ElementType
  label: string
  value: number | string
  sub?: string
  accentColor: string
  iconBg: string
  iconColor: string
  badge?: { text: string; color: string }
}

function KPICard({ icon: Icon, label, value, sub, accentColor, iconBg, iconColor, badge }: KPICardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor}`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {badge && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badge.color}`}>
            {badge.text}
          </span>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold font-poppins text-slate-900 tracking-tight leading-none mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">{label}</p>
        {sub && <p className="text-slate-400 text-xs mt-1 font-normal">{sub}</p>}
      </div>
    </div>
  )
}

export function DashboardCards({ data }: { data: ExecutiveKPIs }) {
  const totalAttention = data.totalDamaged + data.totalNeedService

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <KPICard
        icon={MonitorSmartphone}
        label="Aset Fisik"
        value={data.totalPhysical}
        sub="Unit hardware terdaftar"
        accentColor="bg-blue-500"
        iconBg="bg-blue-50 text-blue-600 border border-blue-100"
        iconColor="text-blue-600"
      />
      <KPICard
        icon={Cloud}
        label="Aset Digital"
        value={data.totalDigital}
        sub="Akun & lisensi aktif"
        accentColor="bg-violet-500"
        iconBg="bg-violet-50 text-violet-600 border border-violet-100"
        iconColor="text-violet-600"
      />
      <KPICard
        icon={AlertTriangle}
        label="Perlu Perhatian"
        value={totalAttention}
        sub={`${data.totalDamaged} rusak · ${data.totalNeedService} servis`}
        accentColor="bg-rose-500"
        iconBg="bg-rose-50 text-rose-600 border border-rose-100"
        iconColor="text-rose-600"
        badge={totalAttention > 0 ? { text: 'Tindakan', color: 'bg-rose-100 text-rose-700 font-semibold' } : undefined}
      />
      <KPICard
        icon={TrendingUp}
        label="Tambah Bulan Ini"
        value={`+${data.thisMonthCount}`}
        sub="Aset baru terdaftar"
        accentColor="bg-emerald-500"
        iconBg="bg-emerald-50 text-emerald-600 border border-emerald-100"
        iconColor="text-emerald-600"
      />
    </div>
  )
}
