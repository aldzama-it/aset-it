'use client'
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TablePagination } from '@/components/shared/TablePagination'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { ViewField } from '@/components/shared/ViewDetailsDialog'
import { ExpandableDetails } from '@/components/shared/ExpandableDetails'

export function NetworkDeviceTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
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
    setColumnFilter 
  } = useTableLogic(data, 'id')
  const [delItem, setDelItem] = useState<any>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const handleDelete = async () => {
    if (!delItem) return
    try {
      const res = await fetch('/api/network/' + delItem.id, { method: 'DELETE' })
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
    { label: 'Nama Aset', key: 'name' },
    { label: 'Tipe Perangkat', key: 'device_type' },
    { label: 'MAC Address', key: 'mac_address' },
    { label: 'Lokasi', key: 'location' },
    { label: 'Tanggal Pembelian', key: 'purchase_date', isDate: true },
    { label: 'Keterangan', key: 'notes' }
  ]

  return (
    <div className="border rounded-md bg-white overflow-x-auto">
      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Nama Aset" sortKey="name" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['name']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tipe Perangkat" sortKey="device_type" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['device_type']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="MAC Address" sortKey="mac_address" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['mac_address']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Lokasi" sortKey="location" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['location']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Pembelian" sortKey="purchase_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['purchase_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Keterangan" sortKey="notes" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['notes']} onFilterChange={setColumnFilter} data={data} />
            <TableHead className="whitespace-nowrap w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item: any) => (
            <React.Fragment key={item.id}>
              <TableRow className="hover:bg-slate-50 transition-colors">
              <TableCell className="whitespace-nowrap">{item.asset_code || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.name || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.device_type || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.mac_address || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.location || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.purchase_date ? new Date(item.purchase_date).toLocaleDateString('id-ID') : '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.notes || "-"}</TableCell>
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
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={8} className="text-center py-6 text-muted-foreground">Tidak ada data</TableCell></TableRow>
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
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
      </div>
  )
}
