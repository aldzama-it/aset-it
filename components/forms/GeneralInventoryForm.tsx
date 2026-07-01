'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

const conditions = ['Baik', 'Rusak', 'Hilang']
const predefinedAssetTypes = ['Monitor', 'Keyboard', 'Mouse', 'Headset', 'Flashdisk', 'Docking Station', 'Stand Laptop', 'Tas Laptop']

export function GeneralInventoryForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { condition: 'Baik' } })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          ...item,
          handover_date: item.handover_date ? new Date(item.handover_date).toISOString().split('T')[0] : '',
          return_date: item.return_date ? new Date(item.return_date).toISOString().split('T')[0] : '',
        })
      } else {
        reset({ condition: 'Baik', quantity: 1 })
      }
    }
  }, [open, item, reset])

  const executeSave = async (data: any) => {
    setIsSubmitting(true)
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

    try {
      const url = item ? '/api/general-inventory/' + item.id : '/api/general-inventory'
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
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} Inventaris Umum</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(executeSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kode Aset</Label>
              <Input type="text" {...register('asset_code')} placeholder="Otomatis (Opsional)" />
            </div>
            <div className="space-y-2">
              <Label>Jenis Aset</Label>
              <Input type="text" list="asset-types" {...register('asset_type')} placeholder="Pilih atau ketik jenis aset" required />
              <datalist id="asset-types">
                {predefinedAssetTypes.map(t => <option key={t} value={t} />)}
              </datalist>
            </div>
            
            <div className="space-y-2">
              <Label>Nama Penanggung Jawab (PIC)</Label>
              <Input type="text" {...register('pic_name')} required />
            </div>
            <div className="space-y-2">
              <Label>Departemen</Label>
              <Input type="text" {...register('department')} />
            </div>
            <div className="space-y-2">
              <Label>Divisi</Label>
              <Input type="text" {...register('division')} />
            </div>
            <div className="space-y-2">
              <Label>Job Level</Label>
              <Input type="text" {...register('job_level')} />
            </div>
            <div className="space-y-2">
              <Label>Branch / Lokasi</Label>
              <Input type="text" {...register('branch')} />
            </div>
            
            <div className="space-y-2">
              <Label>Brand / Merk</Label>
              <Input type="text" {...register('brand')} />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min="1" {...register('quantity')} required />
            </div>
            <div className="space-y-2">
              <Label>Kondisi</Label>
              <Select value={watch('condition')} onValueChange={v => setValue('condition', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Serah Terima</Label>
              <Input type="date" {...register('handover_date')} />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Pengembalian</Label>
              <Input type="date" {...register('return_date')} />
            </div>

            <div className="space-y-2">
              <Label>Link Form Serah Terima</Label>
              <Input type="url" {...register('handover_form')} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Link Form Pengembalian</Label>
              <Input type="url" {...register('return_form')} placeholder="https://..." />
            </div>
            
            <div className="space-y-2">
              <Label>IT Penyerah</Label>
              <Input type="text" {...register('it_handover')} />
            </div>
            <div className="space-y-2">
              <Label>IT Penerima</Label>
              <Input type="text" {...register('it_receiver')} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Keterangan Tambahan</Label>
            <Textarea {...register('notes')} rows={3} />
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
