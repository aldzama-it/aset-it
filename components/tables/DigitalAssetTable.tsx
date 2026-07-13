'use client'
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TablePagination } from '@/components/shared/TablePagination'
import { Button } from '@/components/ui/button'
import { Edit, Trash, Eye, EyeOff } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { TableSelectionBar } from '@/components/shared/TableSelectionBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { exportToExcel } from '@/lib/excel'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { DigitalAssetConfig } from '@/lib/digital-assets-config'

export function DigitalAssetTable({ config, data, onEdit, onRefresh }: { config: DigitalAssetConfig, data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const { 
    processedData, 
    paginatedData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    requestSort, 
    sortConfig, 
    columnFilters, 
    setColumnFilter,
    selectedIds,
    toggleSelection,
    toggleAllPageSelection,
    clearSelection
  } = useTableLogic(data, 'id')
  const [delItem, setDelItem] = useState<any>(null)
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({})

  
  const handleBatchDelete = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => fetch('/api/unknown/' + id, { method: 'DELETE' })))
      toast.success(`${selectedIds.size} data dihapus`)
      clearSelection()
      onRefresh()
    } catch {
      toast.error('Gagal menghapus data terpilih')
    }
  }

  const handleExportSelected = () => {
    const selectedData = data.filter(item => selectedIds.has(item.id))
    exportToExcel(selectedData, 'Data_Terpilih')
  }

  const handleDelete = async () => {
    if (!delItem) return
    try {
      const res = await fetch(`/api/digital-assets/${config.id}/${delItem.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        toast.success('Data dihapus')
        onRefresh()
      } else {
        toast.error(json.error)
      }
    } catch {
      toast.error('Gagal menghapus data')
    }
    setDelItem(null)
  }

  const togglePassword = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Show all columns directly
  const tableColumns = config.fields

  return (
    <div className="border rounded-md bg-white flex flex-col shadow-sm">
      <Table>
        <TableHeader className="sticky top-0 bg-white/95 backdrop-blur z-10 shadow-sm">
          <TableRow>
            {tableColumns.map(col => (
               <SortableTableHead 
                 key={col.name} 
                 label={col.label} 
                 sortKey={col.name} 
                 currentSort={sortConfig} 
                 onRequestSort={requestSort}  
                 currentFilter={columnFilters[col.name]} 
                 onFilterChange={setColumnFilter}  
                 data={data} 
               />
            ))}
            <TableHead className="w-[100px] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={tableColumns.length + 1} className="text-center py-8 text-muted-foreground">
                Tidak ada data.
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((item, i) => (
              <TableRow key={item.id || i} className="hover:bg-muted/50">
                {tableColumns.map(col => (
                  <TableCell key={col.name} className="whitespace-nowrap">
                    {col.type === 'password' ? (
                      <div className="flex items-center gap-2">
                         {showPasswords[item.id] ? item[col.name] : '••••••••'}
                         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePassword(item.id)}>
                           {showPasswords[item.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </Button>
                      </div>
                    ) : (
                      item[col.name] || '-'
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDelItem(item)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <DeleteConfirmDialog 
        open={!!delItem} 
        onOpenChange={(o) => !o && setDelItem(null)} 
        onConfirm={handleDelete}
        itemName={delItem ? (delItem.nama || delItem.nama_akun || delItem.app_name || delItem.email || 'Aset ini') : 'Aset ini'}
      />
    </div>
  )
}
