'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AssetCategoryTable } from '@/components/tables/AssetCategoryTable'
import { AssetCategoryForm } from '@/components/forms/AssetCategoryForm'
import { SettingsNavigation } from '@/components/settings/SettingsNavigation'

export default function AssetCategoryPage() {
  const [data, setData] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const fetchData = () => {
    fetch('/api/settings/categories')
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data) })
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="space-y-4 p-6">
      <SettingsNavigation />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Kategori Aset Dinamis</h1>
          <p className="text-sm text-muted-foreground">Kelola kategori kustom untuk inventaris aset umum.</p>
        </div>
        <Button onClick={() => { setEditItem(null); setFormOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Kategori Baru
        </Button>
      </div>
      
      <AssetCategoryTable data={data} onEdit={(item: any) => { setEditItem(item); setFormOpen(true) }} onRefresh={fetchData} />
      <AssetCategoryForm open={formOpen} onOpenChange={setFormOpen} item={editItem} onSuccess={() => {
        fetchData()
        window.dispatchEvent(new Event('category-updated'))
      }} />
    </div>
  )
}
