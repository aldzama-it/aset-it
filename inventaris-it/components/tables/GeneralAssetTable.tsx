import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'

import { ConditionBadge } from '@/components/shared/ConditionBadge'

export function GeneralAssetTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void,  }) {
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
            <TableHead>Kode Aset</TableHead>
            <TableHead>Brand & Model</TableHead>
            <TableHead>PIC / Lokasi</TableHead>
            <TableHead>Kondisi</TableHead>
            <TableHead>Tanggal Beli / Serah Terima</TableHead>
            <TableHead className="w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
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
