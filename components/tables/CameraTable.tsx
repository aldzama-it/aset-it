'use client'
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash, ChevronDown, ChevronRight } from 'lucide-react'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { ViewField } from '@/components/shared/ViewDetailsDialog'
import { ExpandableDetails } from '@/components/shared/ExpandableDetails'

export function CameraTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const { processedData, requestSort, sortConfig , columnFilters, setColumnFilter } = useTableLogic(data, 'id')
  const [delItem, setDelItem] = useState<any>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

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

  const viewFields: ViewField[] = [
    { label: 'Kode Aset', key: 'asset_code' },
    { label: 'Nama Pegawai', key: 'pic' },
    { label: 'Brand', key: 'brand' },
    { label: 'Tipe / Model', key: 'model' },
    { label: 'Lokasi', key: 'location' },
    { label: 'Tanggal Pembelian', key: 'purchase_date', isDate: true },
    { label: 'Tanggal Serah Terima', key: 'handover_date', isDate: true },
    { label: 'Tanggal Pengembalian', key: 'return_date', isDate: true },
    { label: 'Kondisi', key: 'condition', isBadge: true },
    { label: 'Aksesoris', key: 'accessories' },
    { label: 'Keterangan', key: 'notes' }
  ]

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
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Nama Pegawai" sortKey="pic" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['pic']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Brand & Tipe" sortKey="brand,model" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['brand,model']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Lokasi" sortKey="location" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['location']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Kondisi" sortKey="condition" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['condition']} onFilterChange={setColumnFilter}  data={data} />
            <TableHead className="w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.map((item: any) => {
            const formattedItem = { ...item, accessories: getAccessoriesNames(item.accessories) }
            return (
              <React.Fragment key={item.id}>
              <TableRow className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {expandedRow === item.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span>{item.asset_code || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>{item.pic || "-"}</TableCell>
                <TableCell>{item.brand || '-'} {item.model || ''}</TableCell>
                <TableCell>{item.location || '-'}</TableCell>
                <TableCell><ConditionBadge condition={item.condition} /></TableCell>
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
                  <TableCell colSpan={6} className="p-0 border-b">
                    <ExpandableDetails data={formattedItem} fields={viewFields} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
            )
          })}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center">Tidak ada data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
    </div>
  )
}
