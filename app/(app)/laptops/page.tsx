'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Download, Laptop, Laptop2, MonitorX } from 'lucide-react'
import { exportToExcel } from '@/lib/excel'
import { ImportExcel } from '@/components/shared/ImportExcel'
import { LaptopTable } from '@/components/tables/LaptopTable'
import { LaptopForm } from '@/components/forms/LaptopForm'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Card, CardContent } from '@/components/ui/card'

export default function LaptopPage() {
  const [data, setData] = useState([])
  const [summary, setSummary] = useState({ total: 0, dipakai: 0, tersedia: 0 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'Aktif', 'Tersedia'
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const [exportOpen, setExportOpen] = useState(false)

  const fetchData = () => {
    fetch('/api/laptops?search=' + search)
      .then(r => r.json())
      .then(res => { 
        if (res.success) {
          setData(res.data)
          if (res.summary) setSummary(res.summary)
        } 
      })
  }

  useEffect(() => { fetchData() }, [search])

  const handleExport = () => {
    exportToExcel(data, 'Data_Laptop')
    setExportOpen(false)
  }

  const filteredData = data.filter(item => {
    if (statusFilter === 'all') return true
    return item.status_virtual === statusFilter
  })

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card
          className={`py-3 px-1 bg-card/80 backdrop-blur-sm border-border/60 cursor-pointer transition-all hover:border-primary/50 ${statusFilter === 'all' ? 'ring-2 ring-primary border-transparent' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          <CardContent className="p-0 flex items-center gap-3 px-4">
            <div className="p-2 bg-primary/10 rounded-lg"><Laptop className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xs font-medium text-muted-foreground">Total Laptop (Unik)</p><h3 className="text-xl font-bold font-poppins">{summary.total}</h3></div>
          </CardContent>
        </Card>
        
        <Card
          className={`py-3 px-1 bg-card/80 backdrop-blur-sm border-border/60 cursor-pointer transition-all hover:border-green-500/50 ${statusFilter === 'Aktif' ? 'ring-2 ring-green-500 border-transparent' : ''}`}
          onClick={() => setStatusFilter('Aktif')}
        >
          <CardContent className="p-0 flex items-center gap-3 px-4">
            <div className="p-2 bg-green-500/10 rounded-lg"><Laptop2 className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-xs font-medium text-muted-foreground">Laptop Dipakai</p><h3 className="text-xl font-bold font-poppins">{summary.dipakai}</h3></div>
          </CardContent>
        </Card>
        
        <Card
          className={`py-3 px-1 bg-card/80 backdrop-blur-sm border-border/60 cursor-pointer transition-all hover:border-amber-500/50 ${statusFilter === 'Tersedia' ? 'ring-2 ring-amber-500 border-transparent' : ''}`}
          onClick={() => setStatusFilter('Tersedia')}
        >
          <CardContent className="p-0 flex items-center gap-3 px-4">
            <div className="p-2 bg-amber-500/10 rounded-lg"><MonitorX className="w-5 h-5 text-amber-600" /></div>
            <div><p className="text-xs font-medium text-muted-foreground">Laptop Tidak Dipakai (Tersedia)</p><h3 className="text-xl font-bold font-poppins">{summary.tersedia}</h3></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:max-w-xs">
          <Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Button variant="outline" onClick={() => setExportOpen(true)} className="shrink-0">
            <Download className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Export</span>
          </Button>
          <div className="shrink-0">
            <ImportExcel apiUrl="/api/laptops" assetType="Laptop" onSuccess={fetchData} />
          </div>
          <Button onClick={() => { setEditItem(null); setFormOpen(true) }} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Tambah Data
          </Button>
        </div>
      </div>
      <LaptopTable data={filteredData} onEdit={(item) => { setEditItem(item); setFormOpen(true) }} onRefresh={fetchData} />
      <LaptopForm open={formOpen} onOpenChange={setFormOpen} item={editItem} onSuccess={fetchData} />

      {/* Export Confirmation */}
      <AlertDialog open={exportOpen} onOpenChange={setExportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Export</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan mengunduh file Excel yang berisi {filteredData.length} baris data Laptop. Lanjutkan?
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
