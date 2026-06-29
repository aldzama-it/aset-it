'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

import { AttachmentField } from '@/components/shared/AttachmentField'

const conditions = ['Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif']

export function LaptopForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
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

    // Remove extra fields that are not in schema
    delete data.quantity
    delete data.storage_gb
    delete data.ram_gb
    delete data.accessories

    // Format dates to ISO String or null
    data.handover_date = data.handover_date ? new Date(data.handover_date).toISOString() : null
    data.return_date = data.return_date ? new Date(data.return_date).toISOString() : null

    try {
      const url = item ? '/api/laptops/' + item.id : '/api/laptops'
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
          <DialogTitle>{item ? 'Edit' : 'Tambah'} Laptop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label className="capitalize">brand</Label>
              <Input type="text" {...register('brand')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">model</Label>
              <Input type="text" {...register('model')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">mac address</Label>
              <Input type="text" {...register('mac_address')} />
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

          
          <div className="space-y-2">
            <Label>File Serah Terima (PDF/Word/Gambar)</Label>
            <AttachmentField 
              assetCode={item?.asset_code || ''}
              attachmentName={watch('attachment_name')}
              attachmentPath={watch('attachment_path')}
              onUploadSuccess={(name, path) => {
                setValue('attachment_name', name)
                setValue('attachment_path', path)
                // If editing, also save immediately? No, we can just let onSubmit handle it, but wait:
                // Previous code did onSubmit. We'll leave it out if we don't want to auto-save on upload.
                // Wait, if it auto-saves, it's bad for creation! Let's NOT auto-save.
              }}
              onRemove={() => {
                setValue('attachment_name', null)
                setValue('attachment_path', null)
              }}
            />
          </div>
          

          <div className="flex justify-end pt-4">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
