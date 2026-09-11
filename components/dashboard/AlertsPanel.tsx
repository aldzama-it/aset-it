'use client'

import Link from 'next/link'
import { AlertTriangle, Wrench, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface AlertItem {
  id: number
  asset_code: string | null
  condition: string
  category: string
  location: string
  name: string
  href: string
}

interface AlertsPanelProps {
  alerts: AlertItem[]
  totalDamaged: number
  totalNeedService: number
}

const CATEGORY_COLORS: Record<string, string> = {
  'Laptop': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'Tablet': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'Printer': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'CCTV': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'Kamera': 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  'HT': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
}

export function AlertsPanel({ alerts, totalDamaged, totalNeedService }: AlertsPanelProps) {
  const rusak = alerts.filter(a => a.condition === 'Rusak')
  const perluServis = alerts.filter(a => a.condition === 'Perlu_Servis')

  return (
    <div className="flex flex-col h-full">
      {/* Summary header */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 text-lg font-bold font-poppins leading-none">{totalDamaged}</p>
            <p className="text-red-400/70 text-[10px] mt-0.5">Unit Rusak</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <Wrench className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-amber-400 text-lg font-bold font-poppins leading-none">{totalNeedService}</p>
            <p className="text-amber-400/70 text-[10px] mt-0.5">Perlu Servis</p>
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-white/30 py-8">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-xs">Semua aset dalam kondisi baik</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mr-1 pr-1">
          <div className="space-y-1.5">
            {rusak.length > 0 && (
              <>
                <p className="text-[10px] text-red-400/70 font-semibold uppercase tracking-wider px-1 mb-1">
                  🔴 Rusak — Butuh Tindakan Segera
                </p>
                {rusak.map((alert, i) => (
                  <AlertRow key={`rusak-${i}`} alert={alert} />
                ))}
              </>
            )}
            {perluServis.length > 0 && (
              <>
                <p className="text-[10px] text-amber-400/70 font-semibold uppercase tracking-wider px-1 mb-1 mt-3">
                  🟡 Perlu Servis
                </p>
                {perluServis.map((alert, i) => (
                  <AlertRow key={`servis-${i}`} alert={alert} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

function AlertRow({ alert }: { alert: AlertItem }) {
  const isRusak = alert.condition === 'Rusak'
  const catStyle = CATEGORY_COLORS[alert.category] || 'bg-white/10 text-white/60 border-white/20'

  return (
    <Link
      href={alert.href}
      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 transition-all duration-150 group"
    >
      <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${isRusak ? 'bg-red-500' : 'bg-amber-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-white/90 text-xs font-medium truncate">
          {alert.asset_code || '-'}
        </p>
        <p className="text-white/40 text-[10px] truncate">{alert.location}</p>
      </div>
      <Badge variant="outline" className={`text-[9px] font-semibold border ${catStyle} px-1.5 py-0 flex-shrink-0`}>
        {alert.category}
      </Badge>
      <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
    </Link>
  )
}
