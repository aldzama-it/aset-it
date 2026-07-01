'use client'
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash, ChevronDown, ChevronRight } from 'lucide-react'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { ViewField } from '@/components/shared/ViewDetailsDialog'
import { ExpandableDetails } from '@/components/shared/ExpandableDetails'

export function DashcamTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const { processedData, requestSort, sortConfig , columnFilters, setColumnFilter } = useTableLogic(data, 'id')
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
    { label: 'Tanggal Pemasangan', key: 'install_date', isDate: true },
    { label: 'Keterangan', key: 'notes' }
  ]

  return (
    <div className="border rounded-md bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Nama Kendaraan" sortKey="vehicle_name" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['vehicle_name']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Nopol" sortKey="vehicle_number" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['vehicle_number']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Lokasi" sortKey="location" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['location']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Project" sortKey="project_name" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['project_name']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Status Pemasangan" sortKey="status" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['status']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Tgl Pemasangan" sortKey="installation_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['installation_date']} onFilterChange={setColumnFilter}  data={data} />
            <TableHead className="whitespace-nowrap w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.map((item: any) => (
            <React.Fragment key={item.id}>
              <TableRow className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                <TableCell className="font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {expandedRow === item.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span>{item.asset_code || '-'}</span>
                  </div>
                </TableCell>
              <TableCell className="whitespace-nowrap">{item.vehicle_name || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.plate_number || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.location || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.project || "-"}</TableCell>
              <TableCell className="whitespace-nowrap text-center">
                <Badge variant={item.install_status === 'Terpasang' ? 'default' : 'secondary'} className={item.install_status === 'Terpasang' ? 'bg-green-600 hover:bg-green-700' : ''}>
                  {item.install_status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(item.install_date)}</TableCell>
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
            {expandedRow === item.id && (
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableCell colSpan={8} className="p-0 border-b">
                  <ExpandableDetails data={item} fields={viewFields} />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={8} className="text-center py-6 text-muted-foreground">Tidak ada data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
      </div>
  )
}
