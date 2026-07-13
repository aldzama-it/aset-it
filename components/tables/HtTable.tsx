'use client'
import { Badge } from "@/components/ui/badge";
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
import { ExpandableDetails } from '@/components/shared/ExpandableDetails'

export function HtTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
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
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  
  const handleBatchDelete = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => fetch('/api/ht/' + id, { method: 'DELETE' })))
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
      const res = await fetch('/api/ht/' + delItem.id, { method: 'DELETE' })
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

  const formatDate = (d: string) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('id-ID')
  }

  const viewFields: ViewField[] = [
    { label: 'Kode Aset', key: 'asset_code' },
    { label: 'Nama PIC', key: 'pic_name' },
    { label: 'Departemen', key: 'department' },
    { label: 'Divisi', key: 'division' },
    { label: 'Job Level', key: 'job_level' },
    { label: 'Branch / Lokasi', key: 'branch' },
    { label: 'Brand', key: 'brand' },
    { label: 'Tipe / Model', key: 'type' },
    { label: 'Kelengkapan', key: 'accessories' },
    { label: 'Kondisi', key: 'condition', isBadge: true },
    { label: 'Tanggal Serah Terima', key: 'handover_date', isDate: true },
    { label: 'Tanggal Pengembalian', key: 'return_date', isDate: true },
    { label: 'IT Penyerah', key: 'it_handover' },
    { label: 'IT Penerima', key: 'it_receiver' },
    { label: 'Form Serah Terima', key: 'form_path', isUrl: true },
    { label: 'Keterangan', key: 'notes' }
  ]

  return (
    <div className="border rounded-md bg-white flex flex-col shadow-sm">
      <TableSelectionBar selectedCount={selectedIds.size} onClear={clearSelection} onDelete={handleBatchDelete} onExport={handleExportSelected} />
      <div className="overflow-auto max-h-[calc(100vh-16rem)] relative">
        <Table className="whitespace-nowrap">
        <TableHeader className="sticky top-0 bg-white/95 backdrop-blur z-10 shadow-sm">
          <TableRow>
            <TableHead className="w-[50px]"><Checkbox checked={paginatedData.length > 0 && paginatedData.every((item: any) => selectedIds.has(item.id))} onCheckedChange={toggleAllPageSelection} aria-label="Select all" /></TableHead>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Nama PIC" sortKey="pic_name" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['pic_name']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Departemen" sortKey="department" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['department']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Divisi" sortKey="division" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['division']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Job Level" sortKey="job_level" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['job_level']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Branch / Lokasi" sortKey="branch" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['branch']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Brand" sortKey="brand" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['brand']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tipe / Model" sortKey="type" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['type']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Kelengkapan" sortKey="accessories" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['accessories']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Kondisi" sortKey="condition" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['condition']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Serah Terima" sortKey="handover_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['handover_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Pengembalian" sortKey="return_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['return_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="IT Penyerah" sortKey="it_handover" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['it_handover']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="IT Penerima" sortKey="it_receiver" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['it_receiver']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Form Serah Terima" sortKey="form_path" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['form_path']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Keterangan" sortKey="notes" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['notes']} onFilterChange={setColumnFilter} data={data} />
            <TableHead className="whitespace-nowrap sticky right-0 bg-white/90 backdrop-blur z-10">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item: any) => (
            <React.Fragment key={item.id}>
              <TableRow className="hover:bg-slate-50 transition-colors">
              <TableCell><Checkbox checked={selectedIds.has(item.id)} onCheckedChange={() => toggleSelection(item.id)} aria-label="Select row" onClick={(e) => e.stopPropagation()} /></TableCell>
              <TableCell className="whitespace-nowrap">{item.asset_code || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.pic_name || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.department || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.division || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.job_level || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.branch || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.brand || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.type || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.accessories || "-"}</TableCell>
              <TableCell className="whitespace-nowrap"><Badge variant={item.condition === 'Baik' || item.condition === 'Terpasang' || item.condition === 'Active' ? 'default' : 'secondary'} className={item.condition === 'Baik' || item.condition === 'Terpasang' ? 'bg-green-600 hover:bg-green-700' : ''}>{item.condition}</Badge></TableCell>
              <TableCell className="whitespace-nowrap">{item.handover_date ? new Date(item.handover_date).toLocaleDateString('id-ID') : '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.return_date ? new Date(item.return_date).toLocaleDateString('id-ID') : '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.it_handover || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.it_receiver || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.form_path ? <a href={item.form_path} target="_blank" className="text-blue-600 hover:underline">Link</a> : '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.notes || "-"}</TableCell>
  <TableCell className="sticky right-0 bg-white/90 backdrop-blur shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-10">
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
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={18} className="p-0"><EmptyState /></TableCell></TableRow>
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
