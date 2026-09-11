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
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20',
    },
    {
      icon: ShieldCheck,
      label: 'VPN Aktif',
      value: data.vpn.active,
      total: data.vpn.total,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
      border: 'border-violet-400/20',
    },
    {
      icon: Database,
      label: 'Synology',
      value: data.synology.active,
      total: data.synology.total,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-400/20',
    },
    {
      icon: Globe,
      label: 'Ext. App',
      value: data.externalApp,
      total: null,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
    },
    {
      icon: LayoutGrid,
      label: 'Admin SW',
      value: data.adminSoftware,
      total: null,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
    },
    {
      icon: Server,
      label: 'Infrastruktur',
      value: data.infrastructure,
      total: null,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
      border: 'border-rose-400/20',
    },
    {
      icon: Phone,
      label: 'Office Phone',
      value: data.officePhone,
      total: null,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
      border: 'border-pink-400/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 h-full content-start">
      {items.map((item, i) => {
        const Icon = item.icon
        const pct = item.total && item.total > 0 ? Math.round((item.value / item.total) * 100) : null
        return (
          <div
            key={i}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${item.border} ${item.bg} transition-all duration-150 hover:scale-[1.02]`}
          >
            <div className={`w-7 h-7 rounded-lg ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold font-poppins ${item.color} leading-none`}>{item.value.toLocaleString()}</p>
              <p className="text-white/40 text-[10px] mt-0.5 truncate">{item.label}</p>
              {pct !== null && (
                <div className="mt-1 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.bg}`}
                    style={{ width: `${pct}%`, backgroundColor: item.color.replace('text-', '') }}
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
