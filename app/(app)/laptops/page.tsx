'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Download } from 'lucide-react'
import { exportToExcel } from '@/lib/excel'
import { ImportExcel } from '@/components/shared/ImportExcel'
import { LaptopTable } from '@/components/tables/LaptopTable'
import { LaptopForm } from '@/components/forms/LaptopForm'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function LaptopPage() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const [exportOpen, setExportOpen] = useState(false)

  const fetchData = () => {
    fetch('/api/laptops?search=' + search)
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data) })
  }

  useEffect(() => { fetchData() }, [search])

  const handleExport = () => {
    exportToExcel(data, 'Data_Laptop')
    setExportOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2">
        <Button onClick={() => { setEditItem(null); setFormOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
        <ImportExcel apiUrl="/api/laptops" assetType="Laptop" onSuccess={fetchData} />
      </div>
      <div className="flex items-center gap-2 max-w-xl">
        <Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="outline" onClick={() => setExportOpen(true)}>
          <Download className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Export</span>
        </Button>
      </div>
      <LaptopTable data={data} onEdit={(item) => { setEditItem(item); setFormOpen(true) }} onRefresh={fetchData} />
      <LaptopForm open={formOpen} onOpenChange={setFormOpen} item={editItem} onSuccess={fetchData} />

      {/* Export Confirmation */}
      <AlertDialog open={exportOpen} onOpenChange={setExportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Export</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan mengunduh file Excel yang berisi {data.length} baris data Laptop. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleExport}>Ya, Export</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
