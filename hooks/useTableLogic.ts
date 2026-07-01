import { useState, useMemo } from 'react'

export function useTableLogic<T>(data: T[], initialSortKey: string | null = null) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    initialSortKey ? { key: initialSortKey, direction: 'asc' } : null
  )
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})

  const requestSort = (key: string) => {
    // If it's a combined key like 'brand,model', use the first one for sorting
    const primaryKey = key.split(',')[0].trim()
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === primaryKey && sortConfig.direction === 'asc') {
      direction = 'desc'
    } else if (sortConfig && sortConfig.key === primaryKey && sortConfig.direction === 'desc') {
      setSortConfig(null)
      return
    }
    setSortConfig({ key: primaryKey, direction })
  }

  const setColumnFilter = (key: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const processedData = useMemo(() => {
    let resultItems = [...data]

    // Apply column filters
    const filterKeys = Object.keys(columnFilters)
    if (filterKeys.length > 0) {
      resultItems = resultItems.filter(item => {
        return filterKeys.every(key => {
          const filterVal = columnFilters[key]
          if (!filterVal) return true // empty filter means pass
          
          // Support multiple keys separated by comma
          const subKeys = key.split(',').map(k => k.trim())
          
          return subKeys.some(subKey => {
            const itemVal = (item as any)[subKey]
            if (itemVal === null || itemVal === undefined) return false
            return String(itemVal).toLowerCase().includes(filterVal.toLowerCase())
          })
        })
      })
    }

    // Apply sorting
    if (sortConfig !== null) {
      resultItems.sort((a: any, b: any) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        
        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return resultItems
  }, [data, sortConfig, columnFilters])

  return { 
    processedData, 
    requestSort, 
    sortConfig, 
    columnFilters, 
    setColumnFilter 
  }
}
