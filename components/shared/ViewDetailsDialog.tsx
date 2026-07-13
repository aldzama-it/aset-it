'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export type ViewField = {
  label: string
  key: string
  isDate?: boolean
  isUrl?: boolean
  isBadge?: boolean
}

export function ViewDetailsDialog({
  open,
  onOpenChange,
  title,
  data,
  fields
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  data: any
  fields: ViewField[]
}) {
  if (!data) return null

  const renderValue = (field: ViewField) => {
    const val = data[field.key]
    if (val === null || val === undefined || val === '') return <span className="text-muted-foreground italic">Kosong</span>

    if (field.isDate) {
      return new Date(val).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    if (field.isUrl) {
      return <a href={val} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{val}</a>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold border-b pb-2">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col gap-1 bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-sm font-semibold text-slate-500">{f.label}</span>
              <div className="text-base font-medium">{renderValue(f)}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
