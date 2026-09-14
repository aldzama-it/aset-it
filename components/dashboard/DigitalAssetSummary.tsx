'use client'

import { Mail, ShieldCheck, Database, Globe, LayoutGrid, Server, Phone } from 'lucide-react'

export interface DigitalData {
  email: { active: number; total: number }
  vpn: { active: number; total: number }
  synology: { active: number; total: number }
  externalApp: number
  adminSoftware: number
  infrastructure: number
  officePhone: number
}

interface DigitalAssetSummaryProps {
  data: DigitalData
}

export function DigitalAssetSummary({ data }: DigitalAssetSummaryProps) {
  const items = [
    {
      icon: Mail,
      label: 'Email Aktif',
      value: data.email.active,
      total: data.email.total,
      color: 'text-blue-600',
      bg: 'bg-blue-50/80',
      border: 'border-blue-200/80',
      progressBg: 'bg-blue-600',
    },
    {
      icon: ShieldCheck,
      label: 'VPN Aktif',
      value: data.vpn.active,
      total: data.vpn.total,
      color: 'text-violet-600',
      bg: 'bg-violet-50/80',
      border: 'border-violet-200/80',
      progressBg: 'bg-violet-600',
    },
    {
      icon: Database,
      label: 'Synology',
      value: data.synology.active,
      total: data.synology.total,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50/80',
      border: 'border-cyan-200/80',
      progressBg: 'bg-cyan-600',
    },
    {
      icon: Globe,
      label: 'Ext. App',
      value: data.externalApp,
      total: null,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200/80',
      progressBg: 'bg-emerald-600',
    },
    {
      icon: LayoutGrid,
      label: 'Admin SW',
      value: data.adminSoftware,
      total: null,
      color: 'text-amber-600',
      bg: 'bg-amber-50/80',
      border: 'border-amber-200/80',
      progressBg: 'bg-amber-600',
    },
    {
      icon: Server,
      label: 'Infrastruktur',
      value: data.infrastructure,
      total: null,
      color: 'text-rose-600',
      bg: 'bg-rose-50/80',
      border: 'border-rose-200/80',
      progressBg: 'bg-rose-600',
    },
    {
      icon: Phone,
      label: 'Office Phone',
      value: data.officePhone,
      total: null,
      color: 'text-pink-600',
      bg: 'bg-pink-50/80',
      border: 'border-pink-200/80',
      progressBg: 'bg-pink-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2.5 h-full content-start">
      {items.map((item, i) => {
        const Icon = item.icon
        const pct = item.total && item.total > 0 ? Math.round((item.value / item.total) * 100) : null
        return (
          <div
            key={i}
            className={`flex items-center gap-2.5 p-3 rounded-xl border ${item.border} ${item.bg} transition-all duration-150 hover:shadow-sm`}
          >
            <div className={`w-8 h-8 rounded-lg bg-white border ${item.border} flex items-center justify-center flex-shrink-0 shadow-xs`}>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold font-poppins text-slate-900 leading-none">{item.value.toLocaleString()}</p>
              <p className="text-slate-600 text-[11px] font-medium mt-0.5 truncate">{item.label}</p>
              {pct !== null && (
                <div className="mt-1.5 h-1 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.progressBg}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
