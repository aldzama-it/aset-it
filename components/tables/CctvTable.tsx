'use client'
import { Badge } from "@/components/ui/badge";
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { ViewField } from '@/components/shared/ViewDetailsDialog'
import { ExpandableDetails } from '@/components/shared/ExpandableDetails'
import { Badge } from '@/components/ui/badge'

export function CctvTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const { processedData, requestSort, sortConfig, columnFilters, setColumnFilter } = useTableLogic(data, 'id')
  const [delItem, setDelItem] = useState<any>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const handleDelete = async () => {
    if (!delItem) return
    try {
      const res = await fetch('/api/cctv/' + delItem.id, { method: 'DELETE' })
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

  const viewFields: ViewField[] = [
    { label: 'Kode Aset', key: 'asset_code' },
    { label: 'Brand', key: 'brand' },
    { label: 'Tipe / Model', key: 'model' },
    { label: 'Lokasi', key: 'location' },
    { label: 'Label Posisi', key: 'position_label' },
    { label: 'IP Address', key: 'ip_address' },
    { label: 'MAC Address', key: 'mac_address' },
    { label: 'Tanggal Pemasangan', key: 'install_date', isDate: true },
    { label: 'Kondisi', key: 'condition', isBadge: true },
    { label: 'Keterangan', key: 'notes' }
  ]

  return (
    <div className="border rounded-md bg-white">
      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Brand" sortKey="brand" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['brand']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tipe / Model" sortKey="model" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['model']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Lokasi" sortKey="location" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['location']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Label Posisi" sortKey="position_label" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['position_label']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="IP Address" sortKey="ip_address" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['ip_address']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="MAC Address" sortKey="mac_address" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['mac_address']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Pemasangan" sortKey="install_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['install_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Kondisi" sortKey="condition" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['condition']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Keterangan" sortKey="notes" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['notes']} onFilterChange={setColumnFilter} data={data} />
            <TableHead className="w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.map((item: any) => (
            <React.Fragment key={item.id}>
              <TableRow className="hover:bg-slate-50 transition-colors">
                <TableCell className="whitespace-nowrap">{item.asset_code || "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{item.brand || "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{item.model || "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{item.location || "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{item.position_label || "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{item.ip_address || "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{item.mac_address || "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{item.install_date ? new Date(item.install_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                <TableCell className="whitespace-nowrap"><Badge variant={item.condition === 'Baik' || item.condition === 'Terpasang' || item.condition === 'Active' ? 'default' : 'secondary'} className={item.condition === 'Baik' || item.condition === 'Terpasang' ? 'bg-green-600 hover:bg-green-700' : ''}>{item.condition}</Badge></TableCell>
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
            <TableRow><TableCell colSpan={11} className="text-center py-6 text-muted-foreground">Tidak ada data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
    </div>
  )
}
