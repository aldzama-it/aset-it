'use client'
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TablePagination } from '@/components/shared/TablePagination'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { TableSelectionBar } from '@/components/shared/TableSelectionBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { exportToExcel } from '@/lib/excel'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { ViewField } from '@/components/shared/ViewDetailsDialog'

export function CameraTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
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

  
  const handleBatchDelete = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => fetch('/api/cameras/' + id, { method: 'DELETE' })))
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
      const res = await fetch('/api/cameras/' + delItem.id, { method: 'DELETE' })
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



  const getAccessoriesNames = (acc: any) => {
    if (!acc) return '-'
    if (typeof acc === 'string') {
      try {
        const parsed = JSON.parse(acc)
        return Array.isArray(parsed) ? parsed.map(p => p.name).join(', ') : acc
      } catch {
        return acc
      }
    }
    if (Array.isArray(acc)) return acc.map(p => p.name).join(', ')
    return '-'
  }

  return (
    <div className="border rounded-md bg-white flex flex-col shadow-sm">
      <TableSelectionBar selectedCount={selectedIds.size} onClear={clearSelection} onDelete={handleBatchDelete} onExport={handleExportSelected} />
      <div className="overflow-auto max-h-[calc(100vh-16rem)] relative">
        <Table className="whitespace-nowrap">
        <TableHeader className="sticky top-0 bg-white/95 backdrop-blur z-10 shadow-sm">
          <TableRow>
            <TableHead className="w-[50px]"><Checkbox checked={paginatedData.length > 0 && paginatedData.every((item: any) => selectedIds.has(item.id))} onCheckedChange={toggleAllPageSelection} aria-label="Select all" /></TableHead>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Nama Pegawai" sortKey="pic" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['pic']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Brand" sortKey="brand" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['brand']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tipe / Model" sortKey="model" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['model']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Lokasi" sortKey="location" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['location']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Pembelian" sortKey="purchase_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['purchase_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Serah Terima" sortKey="handover_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['handover_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Pengembalian" sortKey="return_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['return_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Kondisi" sortKey="condition" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['condition']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Aksesoris" sortKey="accessories" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['accessories']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Keterangan" sortKey="notes" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['notes']} onFilterChange={setColumnFilter} data={data} />
            <TableHead className="w-24 whitespace-nowrap">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item: any) => {
            const formattedItem = { ...item, accessories: getAccessoriesNames(item.accessories) }
            return (
              <React.Fragment key={item.id}>
              <TableRow className="hover:bg-slate-50 transition-colors">
              <TableCell><Checkbox checked={selectedIds.has(item.id)} onCheckedChange={() => toggleSelection(item.id)} aria-label="Select row" onClick={(e) => e.stopPropagation()} /></TableCell>
              <TableCell className="font-medium whitespace-nowrap">{formattedItem.asset_code || '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.pic || "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.brand || '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.model || '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.location || '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.purchase_date ? new Date(formattedItem.purchase_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.handover_date ? new Date(formattedItem.handover_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.return_date ? new Date(formattedItem.return_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                <TableCell className="whitespace-nowrap"><ConditionBadge condition={formattedItem.condition} /></TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.accessories}</TableCell>
                <TableCell className="whitespace-nowrap">{formattedItem.notes || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(item); }} title="Edit Data">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setDelItem(item); }} title="Hapus Data">
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
            )
          })}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={13} className="p-0"><EmptyState /></TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      
      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
    </div>
  )
}
