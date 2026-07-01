'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Download } from 'lucide-react'
import { exportToExcel } from '@/lib/excel'
import { ImportExcel } from '@/components/shared/ImportExcel'
import { GeneralAssetTable } from '@/components/tables/GeneralAssetTable'
import { GeneralAssetForm } from '@/components/forms/GeneralAssetForm'

export default function GenericAssetPage({ params }: { params: { categoryId: string } }) {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  
  // Category Details
  const [categoryName, setCategoryName] = useState('Memuat...')
  const categoryId = parseInt(params.categoryId)

  const fetchCategories = async () => {
    try {
      const r = await fetch('/api/settings/categories')
      const res = await r.json()
      if (res.success) {
        const cat = res.data.find((c: any) => c.id === categoryId)
        if (cat) setCategoryName(cat.name)
      }
    } catch (e) {}
  }

  const fetchData = () => {
    fetch(`/api/general-assets?category_id=${categoryId}&search=${search}`)
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data) })
  }

  useEffect(() => {
    fetchCategories()
  }, [categoryId])

  useEffect(() => { 
    fetchData() 
  }, [search, categoryId])

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2">
        <Button onClick={() => { setEditItem(null); setFormOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
        <ImportExcel apiUrl="/api/general-assets" assetType={categoryName} categoryId={categoryId} onSuccess={fetchData} />
      </div>
      <div className="flex items-center gap-2 max-w-xl">
        <Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="outline" onClick={() => exportToExcel(data, `Data_${categoryName}`)}>
          <Download className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Export</span>
        </Button>
      </div>
      
      <GeneralAssetTable data={data} onEdit={(item: any) => { setEditItem(item); setFormOpen(true) }} onRefresh={fetchData} />
      <GeneralAssetForm open={formOpen} onOpenChange={setFormOpen} item={editItem} categoryId={categoryId} categoryName={categoryName} onSuccess={fetchData} />
    </div>
  )
}
