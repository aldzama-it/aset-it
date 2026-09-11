'use client'

import {
  FilePlus, Edit3, Trash2, ArrowLeftRight, UserCheck, Undo2, AlertCircle, HelpCircle
} from 'lucide-react'

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Dibuat:          { icon: FilePlus,      color: 'text-blue-400',   bg: 'bg-blue-500/15',   label: 'Dibuat'        },
  Diperbarui:      { icon: Edit3,         color: 'text-amber-400',  bg: 'bg-amber-500/15',  label: 'Diperbarui'    },
  Dihapus:         { icon: Trash2,        color: 'text-red-400',    bg: 'bg-red-500/15',    label: 'Dihapus'       },
  Dipindah_Lokasi: { icon: ArrowLeftRight,color: 'text-violet-400', bg: 'bg-violet-500/15', label: 'Pindah Lokasi' },
  Diserahkan:      { icon: UserCheck,     color: 'text-emerald-400',bg: 'bg-emerald-500/15',label: 'Diserahkan'    },
  Dikembalikan:    { icon: Undo2,         color: 'text-cyan-400',   bg: 'bg-cyan-500/15',   label: 'Dikembalikan'  },
  Kondisi_Berubah: { icon: AlertCircle,   color: 'text-orange-400', bg: 'bg-orange-500/15', label: 'Kondisi Berubah'},
}

interface HistoryItem {
  id: number
  table_name: string
  asset_code: string | null
  action: string
  from_employee?: string | null
  to_employee?: string | null
  changed_by?: string | null
  notes?: string | null
  event_at: Date | string
}

interface Props {
  history: HistoryItem[]
}

function timeAgo(date: Date | string) {
  try {
    const diff = Date.now() - new Date(date).getTime()
    const s = Math.floor(diff / 1000)
    if (s < 60) return 'baru saja'
    const m = Math.floor(s / 60)
    if (m < 60) return `${m} menit yang lalu`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} jam yang lalu`
    const d = Math.floor(h / 24)
    if (d < 30) return `${d} hari yang lalu`
    const mo = Math.floor(d / 30)
    return `${mo} bulan yang lalu`
  } catch {
    return '-'
  }
}

const TABLE_LABELS: Record<string, string> = {
  laptop: 'Laptop', tablet: 'Tablet', printer: 'Printer', cctv: 'CCTV',
  camera: 'Kamera', ht: 'HT', dashcam: 'Dashcam', starlink: 'Starlink',
  network_device: 'Network', general_asset: 'General', generalasset: 'General'
}

export function LatestActivity({ history }: Props) {
  return (
    <div className="space-y-2 overflow-y-auto">
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-white/30 gap-2">
          <HelpCircle className="w-8 h-8" />
          <p className="text-xs">Belum ada aktivitas terbaru</p>
        </div>
      ) : (
        history.map((item, idx) => {
          const cfg = ACTION_CONFIG[item.action] ?? { icon: HelpCircle, color: 'text-white/40', bg: 'bg-white/5', label: item.action }
          const Icon = cfg.icon
          const isLast = idx === history.length - 1

          return (
            <div key={item.id} className="flex gap-3 items-start group">
              {/* Timeline line */}
              <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                <div className={`w-7 h-7 rounded-full ${cfg.bg} flex items-center justify-center border border-white/5 ring-1 ring-white/5`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                {!isLast && <div className="w-px flex-1 mt-1 mb-1 bg-white/5 min-h-[12px]" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white/85 text-xs font-medium leading-tight">
                      <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
                      {' · '}
                      <span className="text-white/50">{TABLE_LABELS[item.table_name] || item.table_name}</span>
                      {item.asset_code && (
                        <span className="text-white/70 font-mono ml-1">{item.asset_code}</span>
                      )}
                    </p>
                    {(item.from_employee || item.to_employee) && (
                      <p className="text-white/35 text-[10px] mt-0.5 truncate">
                        {item.from_employee && `${item.from_employee}`}
                        {item.from_employee && item.to_employee && ' → '}
                        {item.to_employee && item.to_employee}
                      </p>
                    )}
                    {item.changed_by && (
                      <p className="text-white/30 text-[10px] mt-0.5">oleh {item.changed_by}</p>
                    )}
                  </div>
                  <p className="text-white/25 text-[10px] flex-shrink-0 whitespace-nowrap">
                    {timeAgo(item.event_at)}
                  </p>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
