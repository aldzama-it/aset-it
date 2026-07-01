'use client'
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash, ChevronDown, ChevronRight } from 'lucide-react'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { ViewField } from '@/components/shared/ViewDetailsDialog'
import { ExpandableDetails } from '@/components/shared/ExpandableDetails'

export function NetworkDeviceTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const { processedData, requestSort, sortConfig , columnFilters, setColumnFilter } = useTableLogic(data, 'id')
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
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Nama Aset" sortKey="name" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['name']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Tipe" sortKey="type" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['type']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="MacAddr" sortKey="mac_address" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['mac_address']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Lokasi" sortKey="location" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['location']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Tgl Pembelian" sortKey="purchase_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['purchase_date']} onFilterChange={setColumnFilter}  data={data} />
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
              <TableCell className="whitespace-nowrap">{item.name || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.device_type || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.mac_address || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.location || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(item.purchase_date)}</TableCell>
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
                <TableCell colSpan={7} className="p-0 border-b">
                  <ExpandableDetails data={item} fields={viewFields} />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={7} className="text-center py-6 text-muted-foreground">Tidak ada data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
      </div>
  )
}
