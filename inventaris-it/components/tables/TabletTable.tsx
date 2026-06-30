'use client'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash, ChevronDown, ChevronRight } from 'lucide-react'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { ViewField } from '@/components/shared/ViewDetailsDialog'
import { ExpandableDetails } from '@/components/shared/ExpandableDetails'

export function TabletTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const [delItem, setDelItem] = useState<any>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const handleDelete = async () => {
    if (!delItem) return
    try {
      const res = await fetch('/api/tablets/' + delItem.id, { method: 'DELETE' })
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

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID') : '-'

  const viewFields: ViewField[] = [
    { label: 'Kode Aset', key: 'asset_code' },
    { label: 'Nama PIC', key: 'pic_name' },
    { label: 'Departemen', key: 'department' },
    { label: 'Divisi', key: 'division' },
    { label: 'Job Level', key: 'job_level' },
    { label: 'Branch / Lokasi', key: 'branch' },
    { label: 'Jenis Aset', key: 'asset_type' },
    { label: 'Brand', key: 'brand' },
    { label: 'Tipe / Model', key: 'type' },
    { label: 'RAM', key: 'ram' },
    { label: 'Storage', key: 'storage' },
    { label: 'Kondisi', key: 'condition', isBadge: true },
    { label: 'Tanggal Serah Terima', key: 'handover_date', isDate: true },
    { label: 'Tanggal Pengembalian', key: 'return_date', isDate: true },
    { label: 'IT Penyerah', key: 'it_handover' },
    { label: 'IT Penerima', key: 'it_receiver' },
    { label: 'Form', key: 'form_path', isUrl: true },
    { label: 'Keterangan', key: 'notes' }
  ]

  return (
    <div className="border rounded-md bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Nama PIC</TableHead>
            <TableHead className="whitespace-nowrap">Departmen</TableHead>
            <TableHead className="whitespace-nowrap">Branch</TableHead>
            <TableHead className="whitespace-nowrap">Brand & Tipe</TableHead>
            <TableHead className="whitespace-nowrap">Kondisi</TableHead>
            <TableHead className="whitespace-nowrap">Tgl Serah Terima</TableHead>
            <TableHead className="whitespace-nowrap sticky right-0 bg-white/90 backdrop-blur z-10">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <React.Fragment key={item.id}>
              <TableRow className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                <TableCell className="font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {expandedRow === item.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span>{item.pic_name || '-'}</span>
                  </div>
                </TableCell>
              <TableCell className="whitespace-nowrap">{item.department || '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.branch || '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.brand || '-'} {item.type || ''}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={item.condition === 'Baik' ? 'default' : item.condition === 'Rusak' ? 'destructive' : 'secondary'}
                  className={item.condition === 'Baik' ? 'bg-green-600 hover:bg-green-700' : ''}>
                  {item.condition}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">{item.handover_date ? new Date(item.handover_date).toLocaleDateString('id-ID') : '-'}</TableCell>
              <TableCell className="sticky right-0 bg-white/90 backdrop-blur shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-10">
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
