import { Badge } from "@/components/ui/badge"

export function ConditionBadge({ condition }: { condition: string }) {
  if (!condition) return <Badge variant="outline">-</Badge>
  
  let color = "bg-slate-100 text-slate-800"
  
  if (condition === 'Baik' || condition === 'Baru') {
    color = "bg-green-100 text-green-800 border-green-200"
  } else if (condition === 'Perlu_Servis') {
    color = "bg-yellow-100 text-yellow-800 border-yellow-200"
  } else if (condition === 'Rusak' || condition === 'Hilang') {
    color = "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <Badge variant="outline" className={`${color} px-3 py-1 font-medium rounded-full shadow-sm border-opacity-50`}>
      {condition.replace('_', ' ')}
    </Badge>
  )
}
