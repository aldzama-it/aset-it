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

export function StarlinkForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: { condition: 'Baik', accessories: [] as string[] } })

  useEffect(() => {
    if (open) {
      if (item) {
        reset(item)
      } else {
        reset({ condition: 'Baik', accessories: [] })
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
    if (data.storage_gb) data.storage_gb = parseInt(data.storage_gb)
    if (data.ram_gb) data.ram_gb = parseInt(data.ram_gb)
    

    try {
      const url = item ? '/api/starlinks/' + item.id : '/api/starlinks'
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
          <DialogTitle>{item ? 'Edit' : 'Tambah'} Starlink</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label className="capitalize">serial number</Label>
              <Input type="text" {...register('serial_number')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">account email</Label>
              <Input type="text" {...register('account_email')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">active since</Label>
              <Input type="text" {...register('active_since')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">subscription plan</Label>
              <Input type="text" {...register('subscription_plan')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">ip address</Label>
              <Input type="text" {...register('ip_address')} />
            </div>

            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Input {...register('location')} />
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
