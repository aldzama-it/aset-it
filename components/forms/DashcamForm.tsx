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

export function DashcamForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
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
      const url = item ? '/api/dashcams/' + item.id : '/api/dashcams'
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
          <DialogTitle>{item ? 'Edit' : 'Tambah'} Dashcam</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label className="capitalize">vehicle name</Label>
              <Input type="text" {...register('vehicle_name')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">plate number</Label>
              <Input type="text" {...register('plate_number')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">project</Label>
              <Input type="text" {...register('project')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">dashcam brand</Label>
              <Input type="text" {...register('dashcam_brand')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">dashcam model</Label>
              <Input type="text" {...register('dashcam_model')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">install date</Label>
              <Input type="date" {...register('install_date')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">is installed</Label>
              <Input type="text" {...register('is_installed')} />
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
