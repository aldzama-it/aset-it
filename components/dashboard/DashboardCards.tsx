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
  gradient: string
  iconBg: string
  iconColor: string
  badge?: { text: string; color: string }
}

function KPICard({ icon: Icon, label, value, sub, gradient, iconBg, iconColor, badge }: KPICardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} border border-white/[0.06] shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}>
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-20 h-20 opacity-10 rounded-full blur-xl bg-white translate-x-4 -translate-y-4" />

      <div className="p-4 md:p-5 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center border border-white/10`}>
            <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
          </div>
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold font-poppins text-white tracking-tight leading-none mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-white/60 text-xs font-medium">{label}</p>
        {sub && <p className="text-white/40 text-[10px] mt-1">{sub}</p>}
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
        gradient="from-[#1E3A8A]/80 via-[#1E40AF]/60 to-[#1E3A8A]/40"
        iconBg="bg-blue-500/20"
        iconColor="text-blue-300"
      />
      <KPICard
        icon={Cloud}
        label="Aset Digital"
        value={data.totalDigital}
        sub="Akun & lisensi aktif"
        gradient="from-[#4C1D95]/80 via-[#5B21B6]/60 to-[#4C1D95]/40"
        iconBg="bg-violet-500/20"
        iconColor="text-violet-300"
      />
      <KPICard
        icon={AlertTriangle}
        label="Perlu Perhatian"
        value={totalAttention}
        sub={`${data.totalDamaged} rusak · ${data.totalNeedService} servis`}
        gradient="from-[#7C1D1D]/80 via-[#991B1B]/60 to-[#7C1D1D]/40"
        iconBg="bg-red-500/20"
        iconColor="text-red-300"
        badge={totalAttention > 0 ? { text: 'Action', color: 'bg-red-500/30 text-red-300 border border-red-500/30' } : undefined}
      />
      <KPICard
        icon={TrendingUp}
        label="Tambah Bulan Ini"
        value={`+${data.thisMonthCount}`}
        sub="Aset baru terdaftar"
        gradient="from-[#064E3B]/80 via-[#065F46]/60 to-[#064E3B]/40"
        iconBg="bg-emerald-500/20"
        iconColor="text-emerald-300"
      />
    </div>
  )
}
