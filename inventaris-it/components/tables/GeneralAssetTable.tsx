import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'

import { ConditionBadge } from '@/components/shared/ConditionBadge'

export function GeneralAssetTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void,  }) {
  const { processedData, requestSort, sortConfig , columnFilters, setColumnFilter } = useTableLogic(data, 'id')
  const [delItem, setDelItem] = useState<any>(null)

  const handleDelete = async () => {
    if (!delItem) return
    try {
      const res = await fetch('/api/general-assets/' + delItem.id, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        toast.success('Aset dihapus')
        onRefresh()
      } else {
        toast.error(json.error)
      }
    } catch {
      toast.error('Gagal menghapus aset')
    }
    setDelItem(null)
  }

  return (
    <div className="border rounded-md bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Brand & Model" sortKey="brand,model" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['brand,model']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="PIC / Lokasi" sortKey="pic,location" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['pic,location']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Kondisi" sortKey="condition" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['condition']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Tanggal Beli / Serah Terima" sortKey="purchase_date,handover_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['purchase_date,handover_date']} onFilterChange={setColumnFilter}  data={data} />
            <TableHead className="w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.asset_code}</TableCell>
              <TableCell>{item.brand} {item.model}</TableCell>
              <TableCell>{item.pic || '-'} <br/><span className="text-xs text-muted-foreground">{item.location}</span></TableCell>
              <TableCell><ConditionBadge condition={item.condition} /></TableCell>
              <TableCell>
                <span className="text-xs">Beli: {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString('id-ID') : '-'}</span>
                <br/>
                <span className="text-xs">Serah Terima: {item.handover_date ? new Date(item.handover_date).toLocaleDateString('id-ID') : '-'}</span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => setDelItem(item)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Tidak ada data aset</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'aset ini'} />
    </div>
  )
}
