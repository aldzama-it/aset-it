'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

export function NetworkDeviceForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          ...item,
          purchase_date: item.purchase_date ? new Date(item.purchase_date).toISOString().split('T')[0] : '',
        })
      } else {
        reset({})
      }
    }
  }, [open, item, reset])

  const executeSave = async (data: any) => {
    setIsSubmitting(true)
    
    if (data.purchase_date) {
      data.purchase_date = new Date(data.purchase_date).toISOString()
    } else {
      data.purchase_date = null
    }

    try {
      const url = item ? '/api/network/' + item.id : '/api/network'
      const res = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (json.success) {
        toast.success(item ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(json.error || 'Terjadi kesalahan pada server.')
      }
    } catch {
      toast.error('Gagal menghubungi server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full !max-w-[50vw] sm:max-w-[50vw] p-6 md:p-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} Inventaris Jaringan</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(executeSave)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kode Aset</Label>
              <Input type="text" {...register('asset_code')} placeholder="Otomatis (Opsional)" />
            </div>
            <div className="space-y-2">
              <Label>Nama Aset</Label>
              <Input type="text" {...register('name')} required />
            </div>
            
            <div className="space-y-2">
              <Label>Tipe</Label>
              <Input type="text" {...register('device_type')} />
            </div>
            <div className="space-y-2">
              <Label>MacAddr</Label>
              <Input type="text" {...register('mac_address')} />
            </div>
            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Input type="text" {...register('location')} />
            </div>
            
            <div className="space-y-2">
              <Label>Tanggal Pembelian</Label>
              <Input type="date" {...register('purchase_date')} />
            </div>

            <div className="space-y-2">
              <Label>Keterangan Tambahan</Label>
              <Textarea {...register('notes')} rows={3} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="bg-primary text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
