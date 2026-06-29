'use client'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash, Paperclip, XCircle } from 'lucide-react'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'

export function LaptopTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const [delItem, setDelItem] = useState<any>(null)

  const handleDelete = async () => {
    if (!delItem) return
    try {
      const res = await fetch('/api/laptops/' + delItem.id, { method: 'DELETE' })
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

  return (
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode Aset</TableHead>
            <TableHead>Pemegang</TableHead>
            <TableHead>Kondisi</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Form ST</TableHead>
            <TableHead className="w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.asset_code || item.vehicle_name || '-'}</TableCell>
              <TableCell>{item.pic || "-"}</TableCell>
              <TableCell><ConditionBadge condition={item.condition} /></TableCell>
              <TableCell>{item.location || '-'}</TableCell>
              <TableCell>{item.attachment_path ? <a href="#" onClick={(e) => {
                e.preventDefault();
                fetch('/api/files/handover/' + item.attachment_path.split('/').pop(), { headers: { 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'aldzama-it-secret-2024' }})
                .then(r => r.blob()).then(blob => window.open(URL.createObjectURL(blob), '_blank'))
              }} className="flex items-center text-blue-600 hover:underline"><Paperclip className="w-4 h-4 mr-1"/> File</a> : <XCircle className="w-4 h-4 text-red-500" />}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDelItem(item)}>
                    <Trash className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={10} className="text-center">Tidak ada data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
    </div>
  )
}
