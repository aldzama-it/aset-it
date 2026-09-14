'use client'

import {
  FilePlus, Edit3, Trash2, ArrowLeftRight, UserCheck, Undo2, AlertCircle, HelpCircle
} from 'lucide-react'

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  Dibuat:          { icon: FilePlus,      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   label: 'Dibuat'        },
  Diperbarui:      { icon: Edit3,         color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  label: 'Diperbarui'    },
  Dihapus:         { icon: Trash2,        color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    label: 'Dihapus'       },
  Dipindah_Lokasi: { icon: ArrowLeftRight,color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', label: 'Pindah Lokasi' },
  Diserahkan:      { icon: UserCheck,     color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200',label: 'Diserahkan'    },
  Dikembalikan:    { icon: Undo2,         color: 'text-cyan-600',   bg: 'bg-cyan-50',   border: 'border-cyan-200',   label: 'Dikembalikan'  },
  Kondisi_Berubah: { icon: AlertCircle,   color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Kondisi Berubah'},
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
    if (m < 60) return `${m}m yang lalu`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}j yang lalu`
    const d = Math.floor(h / 24)
    if (d < 30) return `${d}h yang lalu`
    const mo = Math.floor(d / 30)
    return `${mo}bln yang lalu`
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
    <div className="space-y-3 overflow-y-auto">
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
          <HelpCircle className="w-8 h-8 text-slate-300" />
          <p className="text-xs font-medium">Belum ada aktivitas terbaru</p>
        </div>
      ) : (
        history.map((item, idx) => {
          const cfg = ACTION_CONFIG[item.action] ?? { icon: HelpCircle, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', label: item.action }
          const Icon = cfg.icon
          const isLast = idx === history.length - 1

          return (
            <div key={item.id} className="flex gap-3 items-start group">
              {/* Timeline line */}
              <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                <div className={`w-7 h-7 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                {!isLast && <div className="w-px flex-1 mt-1 mb-1 bg-slate-200 min-h-[14px]" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-slate-800 text-xs font-semibold leading-tight">
                      <span className={cfg.color}>{cfg.label}</span>
                      <span className="text-slate-400 font-normal"> · </span>
                      <span className="text-slate-600 font-medium">{TABLE_LABELS[item.table_name] || item.table_name}</span>
                      {item.asset_code && (
                        <span className="text-slate-900 font-mono ml-1 font-bold">{item.asset_code}</span>
                      )}
                    </p>
                    {(item.from_employee || item.to_employee) && (
                      <p className="text-slate-600 text-[11px] mt-0.5 truncate font-medium">
                        {item.from_employee && `${item.from_employee}`}
                        {item.from_employee && item.to_employee && ' → '}
                        {item.to_employee && item.to_employee}
                      </p>
                    )}
                    {item.changed_by && (
                      <p className="text-slate-400 text-[10px] mt-0.5">oleh {item.changed_by}</p>
                    )}
                  </div>
                  <p className="text-slate-400 text-[10px] flex-shrink-0 whitespace-nowrap font-medium">
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
