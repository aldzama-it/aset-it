'use client'

import { useEffect, useState } from 'react'
import { Calendar, MonitorSmartphone, Cloud, TrendingUp } from 'lucide-react'
import { AssetHealthGauge } from './AssetHealthGauge'

interface HeroCardProps {
  totalPhysical: number
  totalDigital: number
  healthScore: number
  thisMonthCount: number
}

export function HeroCard({ totalPhysical, totalDigital, healthScore, thisMonthCount }: HeroCardProps) {
  const [dateStr, setDateStr] = useState('')
  const total = totalPhysical + totalDigital

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }))
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#1D4ED8] shadow-2xl">
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8">
        {/* Top row: date + badge */}
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <div>
            <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-1">IT Asset Intelligence Center</p>
            <p className="text-white/70 text-sm flex items-center gap-1.5" suppressHydrationWarning>
              <Calendar className="w-3.5 h-3.5" />
              {dateStr}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 text-xs font-medium">Live</span>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
          {/* Left: KPI */}
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Total Portofolio Aset IT</p>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-6xl md:text-7xl font-bold font-poppins text-white tracking-tight">
                {total.toLocaleString()}
              </span>
              <span className="text-white/50 text-lg font-medium">Unit</span>
            </div>

            {/* Sub-metrics */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm border border-white/10">
                <MonitorSmartphone className="w-4 h-4 text-blue-300" />
                <div>
                  <p className="text-white font-bold font-poppins text-base leading-none">{totalPhysical.toLocaleString()}</p>
                  <p className="text-white/50 text-[10px] mt-0.5">Aset Fisik</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm border border-white/10">
                <Cloud className="w-4 h-4 text-violet-300" />
                <div>
                  <p className="text-white font-bold font-poppins text-base leading-none">{totalDigital.toLocaleString()}</p>
                  <p className="text-white/50 text-[10px] mt-0.5">Aset Digital</p>
                </div>
              </div>
              {thisMonthCount > 0 && (
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm border border-white/10">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  <div>
                    <p className="text-white font-bold font-poppins text-base leading-none">+{thisMonthCount}</p>
                    <p className="text-white/50 text-[10px] mt-0.5">Bulan Ini</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Health Gauge */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase mb-2">Health Score</p>
            <AssetHealthGauge score={healthScore} size={150} />
          </div>
        </div>
      </div>
    </div>
  )
}
