'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Download } from 'lucide-react'
import { exportToExcel } from '@/lib/excel'
import { ImportExcel } from '@/components/shared/ImportExcel'
import { PrinterTable } from '@/components/tables/PrinterTable'
import { PrinterForm } from '@/components/forms/PrinterForm'

export default function PrinterPage() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const fetchData = () => {
    fetch('/api/printers?search=' + search)
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data) })
  }

  useEffect(() => { fetchData() }, [search])

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2">
        <Button onClick={() => { setEditItem(null); setFormOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
        <ImportExcel apiUrl="/api/printers" assetType="Printer" onSuccess={fetchData} />
      </div>
      <div className="flex items-center gap-2 max-w-xl">
        <Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="outline" onClick={() => exportToExcel(data, 'Data_Printer')}>
          <Download className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Export</span>
        </Button>
      </div>
      <PrinterTable data={data} onEdit={(item) => { setEditItem(item); setFormOpen(true) }} onRefresh={fetchData} />
      <PrinterForm open={formOpen} onOpenChange={setFormOpen} item={editItem} onSuccess={fetchData} />
    </div>
  )
}
