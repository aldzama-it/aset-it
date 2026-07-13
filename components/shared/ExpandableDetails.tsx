import { ViewField } from './ViewDetailsDialog'

export function ExpandableDetails({ data, fields }: { data: any, fields: ViewField[] }) {
  if (!data) return null

  const renderValue = (field: ViewField) => {
    const val = data[field.key]
    if (val === null || val === undefined || val === '') return <span className="text-muted-foreground italic">Kosong</span>

    if (field.isDate) {
      return new Date(val).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    if (field.isUrl) {
      return <a href={val} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">Buka Tautan</a>
    }

    if (field.isBadge) {
      const isGood = val === 'Baik' || val === 'Terpasang'
      const isBad = val === 'Rusak' || val === 'Hilang'
      return (
        <Badge 
          variant={isGood ? 'default' : isBad ? 'destructive' : 'secondary'}
          className={isGood ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {val}
        </Badge>
      )
    }

    return <span className="break-words">{val}</span>
  }

  return (
    <div className="p-6 bg-slate-50/80 border-t border-slate-100 animate-in slide-in-from-top-2 fade-in duration-200">
      <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Detail Lengkap Aset</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fields.map((f, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase">{f.label}</span>
            <div className="text-sm font-medium text-slate-800">{renderValue(f)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
