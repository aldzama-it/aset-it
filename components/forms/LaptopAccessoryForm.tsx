'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'



const conditions = ['Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif']

export function LaptopAccessoryForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: { condition: 'Baik' } })

  useEffect(() => {
    if (open) {
      if (item) {
        reset(item)
      } else {
        reset({ condition: 'Baik' })
      }
    }
  }, [open, item, reset])

  const onSubmit = async (data: any) => {
    const dateFields = ['handover_date', 'return_date', 'purchase_date', 'install_date', 'active_since']
    for (const field of dateFields) {
      if (data[field] !== undefined) {
        if (data[field]) {
          data[field] = new Date(data[field]).toISOString()
        } else {
          data[field] = null
        }
      }
    }
    if (data.quantity) data.quantity = parseInt(data.quantity)
    if (data.ram_gb) data.ram_gb = parseInt(data.ram_gb)
    if (data.storage_gb) data.storage_gb = parseInt(data.storage_gb)
    delete data.accessories; // prevent Prisma invalid argument errors

    if (data.quantity) data.quantity = parseInt(data.quantity)
    
    if (data.handover_date) {
      data.handover_date = new Date(data.handover_date).toISOString()
    } else {
      data.handover_date = null
    }

    if (data.return_date) {
      data.return_date = new Date(data.return_date).toISOString()
    } else {
      data.return_date = null
    }

    delete data.accessories;

    try {
      const url = item ? '/api/laptop-accessories/' + item.id : '/api/laptop-accessories'
      const res = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (json.success) {
        toast.success(item ? 'Data diupdate' : 'Data ditambahkan')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(json.error)
      }
    } catch {
      toast.error('Gagal menyimpan data')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit' : 'Tambah'} Aksesoris Laptop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label className="capitalize">item name</Label>
              <Input type="text" {...register('item_name')} required />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">model</Label>
              <Input type="text" {...register('model')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">quantity</Label>
              <Input type="number" min="1" {...register('quantity')} required />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">handover date</Label>
              <Input type="date" {...register('handover_date')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">return date</Label>
              <Input type="date" {...register('return_date')} />
            </div>

            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Input {...register('location')} />
            </div>

            
            <div className="space-y-2">
              <Label>Pemegang</Label>
              <Input {...register('pic')} />
            </div>

            <div className="space-y-2">
              <Label>Kondisi</Label>
              <Select value={watch('condition')} onValueChange={v => setValue('condition', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {conditions.map(c => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            
          </div>

          <div className="space-y-2">
            <Label>Catatan</Label>
            <Input {...register('notes')} />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
