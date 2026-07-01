'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

export function StarlinkForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          ...item,
          install_date: item.install_date ? new Date(item.install_date).toISOString().split('T')[0] : '',
        })
      } else {
        reset({})
      }
    }
  }, [open, item, reset])

  const executeSave = async (data: any) => {
    setIsSubmitting(true)
    
    if (data.install_date) data.install_date = new Date(data.install_date).toISOString()
    else data.install_date = null

    try {
      const url = item ? '/api/starlinks/' + item.id : '/api/starlinks'
      const res = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (json.success) {
        toast.success(item ? 'Data diupdate!' : 'Data ditambahkan!')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(json.error)
      }
    } catch {
      toast.error('Gagal menghubungi server')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full !max-w-[500px] sm:max-w-[500px] p-6 md:p-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} Starlink</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(executeSave)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kode Aset</Label>
              <Input type="text" {...register('asset_code')} placeholder="Otomatis (Opsional)" />
            </div>
            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Input type="text" {...register('location')} required />
            </div>
            <div className="space-y-2">
              <Label>No Seri / SN</Label>
              <Input type="text" {...register('serial_number')} />
            </div>
            <div className="space-y-2">
              <Label>Akun Email</Label>
              <Input type="email" {...register('account_email')} />
            </div>
            
            <div className="space-y-2">
              <Label>Tanggal Pemasangan</Label>
              <Input type="date" {...register('install_date')} />
            </div>

            <div className="space-y-2">
              <Label>Keterangan Tambahan</Label>
              <Textarea {...register('notes')} rows={4} />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="bg-primary text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
