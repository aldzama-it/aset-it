'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AssetCategoryTable } from '@/components/tables/AssetCategoryTable'
import { AssetCategoryForm } from '@/components/forms/AssetCategoryForm'

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
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <div>
          <p className="text-muted-foreground mt-1">Tambahkan jenis aset kustom yang belum ada di sistem (Opsi 1).</p>
        </div>
        <Button onClick={() => { setEditItem(null); setFormOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Kategori Baru
        </Button>
      </div>
      
      <AssetCategoryTable data={data} onEdit={(item: any) => { setEditItem(item); setFormOpen(true) }} onRefresh={fetchData} />
      <AssetCategoryForm open={formOpen} onOpenChange={setFormOpen} item={editItem} onSuccess={() => {
        fetchData()
        // dispatch event to tell sidebar to re-fetch
        window.dispatchEvent(new Event('category-updated'))
      }} />
    </div>
  )
}
