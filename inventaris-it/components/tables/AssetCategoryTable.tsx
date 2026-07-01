import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'

export function AssetCategoryTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const { processedData, requestSort, sortConfig , columnFilters, setColumnFilter } = useTableLogic(data, 'id')
  const [delItem, setDelItem] = useState<any>(null)

  const handleDelete = async () => {
    if (!delItem) return
    try {
      const res = await fetch('/api/settings/categories/' + delItem.id, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        toast.success('Kategori dihapus')
        onRefresh()
      } else {
        toast.error(json.error)
      }
    } catch {
      toast.error('Gagal menghapus kategori')
    }
    setDelItem(null)
  }

  return (
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Nama Kategori" sortKey="name" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['name']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Slug" sortKey="slug" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['slug']} onFilterChange={setColumnFilter}  data={data} />
            <TableHead className="w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => setDelItem(item)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Tidak ada kategori data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.name || 'kategori ini'} />
    </div>
  )
}
