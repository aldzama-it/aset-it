'use client'
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash, Paperclip, XCircle, Mail } from 'lucide-react'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'
import { ViewField } from '@/components/shared/ViewDetailsDialog'
import { ExpandableDetails } from '@/components/shared/ExpandableDetails'

export function LaptopTable({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const { processedData, requestSort, sortConfig , columnFilters, setColumnFilter } = useTableLogic(data, 'id')
  const [delItem, setDelItem] = useState<any>(null)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

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

  const handleEmail = (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    const subject = encodeURIComponent(`Serah Terima Laptop - ${item.pic || '-'}`)
    
    const formattedDate = item.handover_date 
      ? new Date(item.handover_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
      : '-'

    const body = encodeURIComponent(`Kepada Yth.,
${item.pic || '-'}

Dengan hormat,

Sehubungan dengan kegiatan operasional perusahaan, bersama ini kami sampaikan bahwa telah dilakukan serah terima laptop dengan rincian sebagai berikut:

Data Penerima:
- Nama           : ${item.pic || '-'}
- Jabatan        : ${item.job_level || '-'}
- Divisi         : ${item.division || '-'}
- Lokasi Kerja   : ${item.branch || '-'}

Data Laptop:
- Nomor Asset    : ${item.asset_code || '-'}
- Brand/Type     : ${item.brand || '-'} ${item.model ? '/ ' + item.model : ''}

Tanggal Serah Terima: ${formattedDate}

Perangkat tersebut telah diterima dalam kondisi baik dan siap digunakan untuk menunjang aktivitas pekerjaan.

IT yang Menyerahkan: ${item.it_handover || '-'}

Demikian disampaikan, mohon untuk dapat digunakan sebagaimana mestinya dan menjaga perangkat yang telah diberikan.

Atas perhatian dan kerja samanya, kami ucapkan terima kasih.

Hormat kami,
Tim IT`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const viewFields: ViewField[] = [
    { label: 'Kode Aset', key: 'asset_code' },
    { label: 'Nama Pegawai', key: 'pic' },
    { label: 'Departemen', key: 'department' },
    { label: 'Divisi', key: 'division' },
    { label: 'Job Level', key: 'job_level' },
    { label: 'Branch / Lokasi', key: 'branch' },
    { label: 'Tanggal Serah Terima', key: 'handover_date', isDate: true },
    { label: 'Tanggal Pengembalian', key: 'return_date', isDate: true },
    { label: 'Brand', key: 'brand' },
    { label: 'Model / Tipe', key: 'model' },
    { label: 'Processor', key: 'processor' },
    { label: 'RAM', key: 'ram' },
    { label: 'Storage', key: 'storage' },
    { label: 'Ukuran Layar', key: 'screen_size' },
    { label: 'MAC Address', key: 'mac_address' },
    { label: 'Kondisi', key: 'condition', isBadge: true },
    { label: 'IT Penyerah', key: 'it_handover' },
    { label: 'IT Penerima', key: 'it_receiver' },
    { label: 'Keterangan', key: 'notes' }
  ]

  return (
    <div className="border rounded-md bg-white overflow-x-auto">
      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Nama Pegawai" sortKey="pic" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['pic']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Departemen" sortKey="department" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['department']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Divisi" sortKey="division" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['division']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Job Level" sortKey="job_level" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['job_level']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Branch / Lokasi" sortKey="branch" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['branch']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Serah Terima" sortKey="handover_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['handover_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Tanggal Pengembalian" sortKey="return_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['return_date']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Brand" sortKey="brand" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['brand']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Model / Tipe" sortKey="model" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['model']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Processor" sortKey="processor" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['processor']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="RAM" sortKey="ram" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['ram']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Storage" sortKey="storage" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['storage']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Ukuran Layar" sortKey="screen_size" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['screen_size']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="MAC Address" sortKey="mac_address" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['mac_address']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Kondisi" sortKey="condition" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['condition']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="IT Penyerah" sortKey="it_handover" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['it_handover']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="IT Penerima" sortKey="it_receiver" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['it_receiver']} onFilterChange={setColumnFilter} data={data} />
            <SortableTableHead label="Keterangan" sortKey="notes" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['notes']} onFilterChange={setColumnFilter} data={data} />
            <TableHead>Form ST</TableHead>
            <TableHead className="w-32">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.map((item: any) => (
            <React.Fragment key={item.id}>
              <TableRow className="hover:bg-slate-50 transition-colors">
              <TableCell className="whitespace-nowrap">{item.asset_code || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.pic || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.department || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.division || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.job_level || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.branch || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.handover_date ? new Date(item.handover_date).toLocaleDateString('id-ID') : '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.return_date ? new Date(item.return_date).toLocaleDateString('id-ID') : '-'}</TableCell>
              <TableCell className="whitespace-nowrap">{item.brand || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.model || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.processor || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.ram || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.storage || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.screen_size || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.mac_address || "-"}</TableCell>
              <TableCell className="whitespace-nowrap"><Badge variant={item.condition === 'Baik' || item.condition === 'Terpasang' || item.condition === 'Active' ? 'default' : 'secondary'} className={item.condition === 'Baik' || item.condition === 'Terpasang' ? 'bg-green-600 hover:bg-green-700' : ''}>{item.condition}</Badge></TableCell>
              <TableCell className="whitespace-nowrap">{item.it_handover || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.it_receiver || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.notes || "-"}</TableCell>
                <TableCell>{item.attachment_path ? <a href="#" onClick={(e) => {
                e.preventDefault();
                fetch('/api/files/handover/' + item.attachment_path.split('/').pop())
                .then(r => r.blob()).then(blob => window.open(URL.createObjectURL(blob), '_blank'))
              }} className="flex items-center text-blue-600 hover:underline"><Paperclip className="w-4 h-4 mr-1"/> File</a> : <XCircle className="w-4 h-4 text-red-500" />}</TableCell>
  <TableCell>
                <div className="flex gap-1 justify-center">
                  <Button variant="ghost" size="icon" onClick={(e) => handleEmail(e, item)} title="Kirim Email">
                    <Mail className="w-4 h-4 text-emerald-600" />
                  </Button>
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
            <TableRow><TableCell colSpan={21} className="text-center py-6 text-muted-foreground">Tidak ada data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
      </div>
  )
}
