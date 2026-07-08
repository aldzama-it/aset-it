'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Download } from 'lucide-react'
import { exportToExcel } from '@/lib/excel'
import { ImportExcel } from '@/components/shared/ImportExcel'
import { DigitalAssetTable } from '@/components/tables/DigitalAssetTable'
import { DigitalAssetForm } from '@/components/forms/DigitalAssetForm'
import { digitalAssetsConfig } from '@/lib/digital-assets-config'

export default function DigitalAssetPage() {
  const params = useParams()
  const router = useRouter()
  const type = params.type as string
  const config = digitalAssetsConfig.find(c => c.id === type)

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    if (!config) {
      router.push('/dashboard')
    }
  }, [config, router])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/digital-assets/${type}`)
      const json = await res.json()
      if (json.success) {
        // filter data client-side if server doesn't support ?search=
        const filtered = search ? json.data.filter((item: any) => 
          Object.values(item).some(val => 
            String(val).toLowerCase().includes(search.toLowerCase())
          )
        ) : json.data;
        setData(filtered)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (config) {
      fetchData()
    }
  }, [config, search])

  if (!config) return null

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2">
        <Button onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
        <ImportExcel 
          apiUrl={`/api/digital-assets/${type}`} 
          assetType={config.id} 
          onSuccess={fetchData} 
          customHeaders={config.fields.map(f => f.name)}
        />
      </div>
      
      <div className="flex items-center gap-2 max-w-xl">
        <Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="outline" onClick={() => exportToExcel(data, `Data_${config.title.replace(/\s+/g, '_')}`)}>
          <Download className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Export</span>
        </Button>
      </div>

      <DigitalAssetTable 
        config={config} 
        data={data} 
        onEdit={(item) => { setSelectedItem(item); setIsFormOpen(true); }} 
        onRefresh={fetchData} 
      />

      <DigitalAssetForm 
        config={config} 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        item={selectedItem} 
        onSuccess={fetchData} 
      />
    </div>
  )
}
