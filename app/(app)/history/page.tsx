'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function HistoryPage() {
  const [data, setData] = useState<any[]>([])

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
                  {(item.from_employee?.name || item.to_employee?.name) ? (
                    <span className="text-xs">
                      {item.from_employee?.name || '-'} <br/>&darr;<br/> {item.to_employee?.name || '-'}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {(item.from_location?.name || item.to_location?.name) ? (
                    <span className="text-xs">
                      {item.from_location?.name || '-'} <br/>&darr;<br/> {item.to_location?.name || '-'}
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
                <TableCell>{item.changed_by || 'Sistem'}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && <TableRow><TableCell colSpan={8} className="text-center">Belum ada riwayat</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
