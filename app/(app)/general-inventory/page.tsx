'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Download, Box, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { exportToExcel } from '@/lib/excel'
import { ImportExcel } from '@/components/shared/ImportExcel'
import { GeneralInventoryTable } from '@/components/tables/GeneralInventoryTable'
import { GeneralInventoryForm } from '@/components/forms/GeneralInventoryForm'

export default function GeneralInventoryPage() {
  const [data, setData] = useState<any[]>([])
  const [summary, setSummary] = useState({ total: 0, rusak: 0, tersedia: 0, dipakai: 0 })
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const fetchData = () => {
    fetch('/api/general-inventory?search=' + search)
      .then(r => r.json())
      .then(res => { if (res.success) { setData(res.data); if (res.summary) setSummary(res.summary); } })
  }

  useEffect(() => { fetchData() }, [search])

  
  const filteredData = data.filter((item: any) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'Rusak') return item.condition === 'Rusak' || item.condition === 'Perlu_Servis'
    if (statusFilter === 'Tersedia') return item.status_virtual === 'Tersedia'
    if (statusFilter === 'Dipakai') return item.status_virtual === 'Dipakai' || item.status_virtual === 'Aktif'
    return true
  })

  return (
    <div className="space-y-4">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Card className={`py-3 px-1 bg-card/80 backdrop-blur-sm border-border/60 cursor-pointer transition-all hover:border-primary/50 ${statusFilter === 'all' ? 'ring-2 ring-primary border-transparent' : ''}`} onClick={() => setStatusFilter('all')}>
          <CardContent className="p-0 flex items-center gap-3 px-4">
            <div className="p-2 bg-primary/10 rounded-lg"><Box className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xs font-medium text-muted-foreground">Total Data</p><h3 className="text-xl font-bold font-poppins">{summary.total}</h3></div>
          </CardContent>
        </Card>
        <Card className={`py-3 px-1 bg-card/80 backdrop-blur-sm border-border/60 cursor-pointer transition-all hover:border-blue-500/50 ${statusFilter === 'Dipakai' ? 'ring-2 ring-blue-500 border-transparent' : ''}`} onClick={() => setStatusFilter('Dipakai')}>
          <CardContent className="p-0 flex items-center gap-3 px-4">
            <div className="p-2 bg-blue-500/10 rounded-lg"><CheckCircle2 className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-xs font-medium text-muted-foreground">Sedang Dipakai</p><h3 className="text-xl font-bold font-poppins">{summary.dipakai || 0}</h3></div>
          </CardContent>
        </Card>
        <Card className={`py-3 px-1 bg-card/80 backdrop-blur-sm border-border/60 cursor-pointer transition-all hover:border-red-500/50 ${statusFilter === 'Rusak' ? 'ring-2 ring-red-500 border-transparent' : ''}`} onClick={() => setStatusFilter('Rusak')}>
          <CardContent className="p-0 flex items-center gap-3 px-4">
            <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <div><p className="text-xs font-medium text-muted-foreground">Kondisi Rusak</p><h3 className="text-xl font-bold font-poppins">{summary.rusak}</h3></div>
          </CardContent>
        </Card>
        <Card className={`py-3 px-1 bg-card/80 backdrop-blur-sm border-border/60 cursor-pointer transition-all hover:border-green-500/50 ${statusFilter === 'Tersedia' ? 'ring-2 ring-green-500 border-transparent' : ''}`} onClick={() => setStatusFilter('Tersedia')}>
          <CardContent className="p-0 flex items-center gap-3 px-4">
            <div className="p-2 bg-green-500/10 rounded-lg"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-xs font-medium text-muted-foreground">Tidak Terpakai</p><h3 className="text-xl font-bold font-poppins">{summary.tersedia}</h3></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:max-w-xs">
          <Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Button variant="outline" onClick={() => exportToExcel(data, 'Data_Inventaris_Umum')} className="shrink-0">
            <Download className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Export</span>
          </Button>
          <div className="shrink-0">
            <ImportExcel apiUrl="/api/general-inventory" assetType="Inventaris_Umum" onSuccess={fetchData} />
          </div>
          <Button onClick={() => { setEditItem(null); setFormOpen(true) }} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Tambah Data
          </Button>
        </div>
      </div>
      <GeneralInventoryTable data={filteredData} onEdit={(item) => { setEditItem(item); setFormOpen(true) }} onRefresh={fetchData} />
      <GeneralInventoryForm open={formOpen} onOpenChange={setFormOpen} item={editItem} onSuccess={fetchData} />
    </div>
  )
}
