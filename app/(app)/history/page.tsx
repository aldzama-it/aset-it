'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type HistoryItem = {
  id: number
  table_name: string
  asset_code: string | null
  action: string
  from_employee: string | null
  to_employee: string | null
  from_location: string | null
  to_location: string | null
  old_condition: string | null
  new_condition: string | null
  changed_by: string | null
  notes: string | null
  event_at: string
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryItem[]>([])

  useEffect(() => {
    fetch('/api/history?limit=50').then(r => r.json()).then(res => {
      if (res.success) setData(res.data)
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Tabel / Kategori</TableHead>
              <TableHead>Kode Aset</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Dari → Ke (Karyawan)</TableHead>
              <TableHead>Dari → Ke (Lokasi)</TableHead>
              <TableHead>Kondisi (Lama → Baru)</TableHead>
              <TableHead>Alasan / Keterangan</TableHead>
              <TableHead>Oleh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell className="whitespace-nowrap">{new Date(item.event_at).toLocaleString('id-ID')}</TableCell>
                <TableCell className="capitalize">{item.table_name.replace('s', '')}</TableCell>
                <TableCell className="font-medium">{item.asset_code || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.action.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>
                  {(item.from_employee || item.to_employee) ? (
                    <span className="text-xs">
                      {item.from_employee || '-'} <br/>&darr;<br/> {item.to_employee || '-'}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {(item.from_location || item.to_location) ? (
                    <span className="text-xs">
                      {item.from_location || '-'} <br/>&darr;<br/> {item.to_location || '-'}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {(item.old_condition || item.new_condition) ? (
                    <span className="text-xs">
                      {item.old_condition || '-'} <br/>&darr;<br/> {item.new_condition || '-'}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell className="min-w-48 whitespace-normal">{item.notes || '-'}</TableCell>
                <TableCell>{item.changed_by || 'Sistem'}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && <TableRow><TableCell colSpan={9} className="text-center">Belum ada riwayat</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
