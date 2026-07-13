'use client'
import { Badge } from "@/components/ui/badge";
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

export function DashcamTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
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
      const res = await fetch('/api/dashcams/' + delItem.id, { method: 'DELETE' })
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
    { label: 'Nama Kendaraan', key: 'vehicle_name' },
    { label: 'Nomor Polisi (Nopol)', key: 'plate_number' },
    { label: 'Lokasi', key: 'location' },
    { label: 'Project', key: 'project' },
    { label: 'Status Pemasangan', key: 'install_status', isBadge: true },
    { label: 'Email Azdome', key: 'azdome_email' },
    { label: 'Password Azdome', key: 'azdome_password' },
    { label: 'Gmail', key: 'gmail' },
    { label: 'Password Gmail', key: 'gmail_password' },
    { label: 'Tanggal Pemasangan', key: 'install_date', isDate: true },
    { label: 'Keterangan', key: 'notes' }
  ]

  return (
    <div className="border rounded-md bg-white overflow-x-auto">
      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Nama Kendaraan" sortKey="vehicle_name" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['vehicle_name']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Nomor Polisi (Nopol)" sortKey="plate_number" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['plate_number']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Lokasi" sortKey="location" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['location']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Project" sortKey="project" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['project']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Status Pemasangan" sortKey="install_status" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['install_status']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Email Azdome" sortKey="azdome_email" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['azdome_email']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Password Azdome" sortKey="azdome_password" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['azdome_password']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Gmail" sortKey="gmail" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['gmail']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Password Gmail" sortKey="gmail_password" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['gmail_password']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Pemasangan" sortKey="install_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['install_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Keterangan" sortKey="notes" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['notes']} onFilterChange={setColumnFilter} data={data} />
            <TableHead className="whitespace-nowrap w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item: any) => (
            <React.Fragment key={item.id}>
              <TableRow className="hover:bg-slate-50 transition-colors">
              <TableCell className="whitespace-nowrap">{item.asset_code || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.vehicle_name || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.plate_number || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.location || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.project || "-"}</TableCell>
              <TableCell className="whitespace-nowrap"><Badge variant={item.install_status === 'Baik' || item.install_status === 'Terpasang' || item.install_status === 'Active' ? 'default' : 'secondary'} className={item.install_status === 'Baik' || item.install_status === 'Terpasang' ? 'bg-green-600 hover:bg-green-700' : ''}>{item.install_status}</Badge></TableCell>
              <TableCell className="whitespace-nowrap">{item.azdome_email || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.azdome_password || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.gmail || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.gmail_password || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.install_date ? new Date(item.install_date).toLocaleDateString('id-ID') : '-'}</TableCell>
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
            <TableRow><TableCell colSpan={13} className="text-center py-6 text-muted-foreground">Tidak ada data</TableCell></TableRow>
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
