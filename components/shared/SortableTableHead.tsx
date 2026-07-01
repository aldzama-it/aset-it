import { TableHead } from '@/components/ui/table'
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

interface SortableTableHeadProps {
  label: string
  sortKey: string
  currentSort: { key: any, direction: 'asc' | 'desc' } | null
  onRequestSort: (key: string) => void
  currentFilter?: string
  onFilterChange?: (key: string, value: string) => void
  data?: any[]
  className?: string
}

export function SortableTableHead({ 
  label, 
  sortKey, 
  currentSort, 
  onRequestSort, 
  currentFilter,
  onFilterChange,
  data = [],
  className 
}: SortableTableHeadProps) {
  const isActive = currentSort?.key === sortKey
  const hasFilter = currentFilter !== undefined && currentFilter.length > 0

  const uniqueValues = useMemo(() => {
    if (!data || data.length === 0) return []
    const keys = sortKey.split(',').map(k => k.trim())
    const values = new Set<string>()

    data.forEach(item => {
      keys.forEach(k => {
        const val = item[k]
        if (val !== null && val !== undefined && val !== '') {
          values.add(String(val))
        }
      })
    })
    
    return Array.from(values).sort()
  }, [data, sortKey])
  
  return (
    <TableHead className={`group select-none relative ${className || ''}`}>
      <div className="flex items-center justify-between w-full h-full gap-2 py-2">
        <div 
          className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors flex-1"
          onClick={() => onRequestSort(sortKey)}
        >
          <span>{label}</span>
          {isActive ? (
            currentSort.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-primary" /> : <ArrowDown className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/40 opacity-40 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        {onFilterChange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-6 w-6 rounded-full hover:bg-gray-200 transition-colors ${hasFilter ? 'bg-primary/10 text-primary' : 'text-muted-foreground/40 opacity-40 group-hover:opacity-100'}`}
                title={`Filter ${label}`}
              >
                <Filter className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="start">
              <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
                <button 
                  onClick={() => onFilterChange(sortKey, '')}
                  className={`flex items-center justify-between w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 transition-colors ${!hasFilter ? 'font-medium bg-slate-50' : ''}`}
                >
                  <span>Semua (All)</span>
                  {!hasFilter && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
                
                {uniqueValues.map(val => (
                  <button 
                    key={val} 
                    onClick={() => onFilterChange(sortKey, val)}
                    className={`flex items-center justify-between w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 transition-colors ${currentFilter === val ? 'font-medium bg-slate-50' : ''}`}
                  >
                    <span className="truncate pr-2">{val}</span>
                    {currentFilter === val && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                ))}
                
                {uniqueValues.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">Tidak ada data</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </TableHead>
  )
}
