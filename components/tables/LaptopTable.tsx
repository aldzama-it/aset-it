'use client'
import { useTableLogic } from '@/hooks/useTableLogic'
import { SortableTableHead } from '@/components/shared/SortableTableHead'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash, Paperclip, XCircle, ChevronDown, ChevronRight, Mail } from 'lucide-react'
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
            <SortableTableHead label="Kode Aset" sortKey="asset_code" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['asset_code']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Nama Pegawai" sortKey="pic" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['pic']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Departemen" sortKey="department" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['department']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Branch" sortKey="branch" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['branch']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Brand & Type" sortKey="brand,model" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['brand,model']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Spesifikasi" sortKey="processor,ram,storage" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['processor,ram,storage']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Kondisi" sortKey="condition" currentSort={sortConfig} onRequestSort={requestSort}  currentFilter={columnFilters['condition']} onFilterChange={setColumnFilter}  data={data} />
            <SortableTableHead label="Tgl Serah Terima" sortKey="handover_date" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['handover_date']} onFilterChange={setColumnFilter}  data={data} />
            <TableHead>Form ST</TableHead>
            <TableHead className="w-32">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.map((item: any) => (
            <React.Fragment key={item.id}>
              <TableRow className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {expandedRow === item.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span>{item.asset_code || '-'}</span>
                  </div>
                </TableCell>
              <TableCell>{item.pic || "-"}</TableCell>
              <TableCell>{item.department || "-"}</TableCell>
              <TableCell>{item.branch || '-'}</TableCell>
              <TableCell>{item.brand || '-'} {item.model || ''}</TableCell>
              <TableCell>{item.ram || '-'} / {item.storage || '-'} / {item.processor || '-'}</TableCell>
              <TableCell><ConditionBadge condition={item.condition} /></TableCell>
              <TableCell>{item.handover_date ? new Date(item.handover_date).toLocaleDateString('id-ID') : '-'}</TableCell>
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
            {expandedRow === item.id && (
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableCell colSpan={10} className="p-0 border-b">
                  <ExpandableDetails data={item} fields={viewFields} />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
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
