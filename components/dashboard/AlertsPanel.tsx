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
  'Laptop': 'bg-blue-50 text-blue-700 border-blue-200',
  'Tablet': 'bg-violet-50 text-violet-700 border-violet-200',
  'Printer': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'CCTV': 'bg-amber-50 text-amber-700 border-amber-200',
  'Kamera': 'bg-pink-50 text-pink-700 border-pink-200',
  'HT': 'bg-cyan-50 text-cyan-700 border-cyan-200',
}

export function AlertsPanel({ alerts, totalDamaged, totalNeedService }: AlertsPanelProps) {
  const rusak = alerts.filter(a => a.condition === 'Rusak')
  const perluServis = alerts.filter(a => a.condition === 'Perlu_Servis')

  return (
    <div className="flex flex-col h-full">
      {/* Summary header */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200/80 rounded-xl px-3.5 py-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-700 text-xl font-bold font-poppins leading-none">{totalDamaged}</p>
            <p className="text-red-600/80 text-[11px] font-medium mt-0.5">Unit Rusak</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2.5">
          <Wrench className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-amber-700 text-xl font-bold font-poppins leading-none">{totalNeedService}</p>
            <p className="text-amber-600/80 text-[11px] font-medium mt-0.5">Perlu Servis</p>
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 py-8">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-xs font-medium">Semua aset dalam kondisi baik</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mr-1 pr-1">
          <div className="space-y-1.5">
            {rusak.length > 0 && (
              <>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider px-1 mb-1">
                  🔴 Rusak — Butuh Tindakan Segera
                </p>
                {rusak.map((alert, i) => (
                  <AlertRow key={`rusak-${i}`} alert={alert} />
                ))}
              </>
            )}
            {perluServis.length > 0 && (
              <>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider px-1 mb-1 mt-3">
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
  const catStyle = CATEGORY_COLORS[alert.category] || 'bg-slate-100 text-slate-700 border-slate-200'

  return (
    <Link
      href={alert.href}
      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100 border border-slate-200/80 transition-all duration-150 group"
    >
      <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${isRusak ? 'bg-red-500' : 'bg-amber-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-slate-900 text-xs font-bold truncate">
          {alert.asset_code || '-'}
        </p>
        <p className="text-slate-500 text-[11px] truncate">{alert.location}</p>
      </div>
      <Badge variant="outline" className={`text-[10px] font-semibold border ${catStyle} px-2 py-0.5 flex-shrink-0`}>
        {alert.category}
      </Badge>
      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
    </Link>
  )
}
