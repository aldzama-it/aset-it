'use client'

import { useEffect, useState } from 'react'
import { Calendar, MonitorSmartphone, Cloud, TrendingUp, Info } from 'lucide-react'
import { AssetHealthGauge } from './AssetHealthGauge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface HeroCardProps {
  totalPhysical: number
  totalDigital: number
  healthScore: number
  thisMonthCount: number
  totalGood?: number
  totalPhysicalWithCond?: number
}

export function HeroCard({ totalPhysical, totalDigital, healthScore, thisMonthCount, totalGood, totalPhysicalWithCond }: HeroCardProps) {
  const [dateStr, setDateStr] = useState('')
  const total = totalPhysical + totalDigital

  const goodCount = totalGood ?? Math.round((totalPhysical * healthScore) / 100)
  const totalCountWithCond = totalPhysicalWithCond ?? totalPhysical

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }))
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/95 via-primary to-blue-950 border border-white/10 shadow-xl">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8">
        {/* Top row: date */}
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <div>
            <p className="text-blue-200/90 text-xs font-semibold tracking-widest uppercase mb-1">IT Asset Intelligence Center</p>
            <p className="text-white/85 text-sm flex items-center gap-1.5 font-medium" suppressHydrationWarning>
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              {dateStr}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
          {/* Left: KPI */}
          <div>
            <p className="text-blue-100/90 text-sm font-medium mb-1">Total Portofolio Aset IT</p>
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-6xl md:text-7xl font-bold font-poppins text-white tracking-tight">
                {total.toLocaleString()}
              </span>
              <span className="text-blue-200/70 text-lg font-medium">Unit</span>
            </div>

            {/* Sub-metrics */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 rounded-xl px-3.5 py-2 backdrop-blur-md border border-white/15 transition-colors">
                <MonitorSmartphone className="w-4 h-4 text-blue-200" />
                <div>
                  <p className="text-white font-bold font-poppins text-base leading-none">{totalPhysical.toLocaleString()}</p>
                  <p className="text-blue-100/80 text-[10px] mt-0.5 font-medium">Aset Fisik</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 rounded-xl px-3.5 py-2 backdrop-blur-md border border-white/15 transition-colors">
                <Cloud className="w-4 h-4 text-violet-200" />
                <div>
                  <p className="text-white font-bold font-poppins text-base leading-none">{totalDigital.toLocaleString()}</p>
                  <p className="text-blue-100/80 text-[10px] mt-0.5 font-medium">Aset Digital</p>
                </div>
              </div>
              {thisMonthCount > 0 && (
                <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 rounded-xl px-3.5 py-2 backdrop-blur-md border border-white/15 transition-colors">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  <div>
                    <p className="text-white font-bold font-poppins text-base leading-none">+{thisMonthCount}</p>
                    <p className="text-blue-100/80 text-[10px] mt-0.5 font-medium">Bulan Ini</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Health Gauge with Calculation Tooltip */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1 cursor-pointer group rounded-xl p-2 hover:bg-white/10 transition-all border border-transparent hover:border-white/15">
                  <p className="text-blue-200/90 text-[10px] font-semibold tracking-widest uppercase mb-1 flex items-center gap-1">
                    Health Score <Info className="w-3 h-3 text-blue-300 group-hover:text-white transition-colors" />
                  </p>
                  <AssetHealthGauge score={healthScore} size={140} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="p-4 bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md w-72 rounded-xl">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <p className="font-bold text-xs text-indigo-200">Formula Perhitungan Health Score</p>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Persentase aset fisik dalam kondisi <span className="text-emerald-400 font-semibold">Baru</span> & <span className="text-emerald-400 font-semibold">Baik</span> dibandingkan total aset fisik terdaftar.
                  </p>
                  <div className="bg-white/10 rounded-lg p-2.5 text-[11px] font-mono space-y-1.5 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-sans">Aset Baru & Baik:</span>
                      <span className="text-emerald-400 font-bold">{goodCount.toLocaleString()} unit</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-sans">Total Aset Fisik:</span>
                      <span className="text-blue-300 font-bold">{totalCountWithCond.toLocaleString()} unit</span>
                    </div>
                    <div className="border-t border-white/15 pt-1.5 mt-1.5 flex justify-between items-center font-bold">
                      <span className="text-slate-200 font-sans">Rumus:</span>
                      <span className="text-white font-sans text-xs">
                        ({goodCount} ÷ {totalCountWithCond}) × 100 = <span className="text-emerald-400">{healthScore}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
