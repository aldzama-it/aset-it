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

export function TabletForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { condition: 'Baik' } })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customType, setCustomType] = useState('')

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          ...item,
          handover_date: item.handover_date ? new Date(item.handover_date).toISOString().split('T')[0] : '',
          return_date: item.return_date ? new Date(item.return_date).toISOString().split('T')[0] : '',
        })
        setCustomType(item.asset_type || '')
      } else {
        reset({ condition: 'Baik' })
        setCustomType('')
      }
    }
  }, [open, item, reset])

  const executeSave = async (data: any) => {
    setIsSubmitting(true)
    
    if (data.handover_date) data.handover_date = new Date(data.handover_date).toISOString()
    else data.handover_date = null
    
    if (data.return_date) data.return_date = new Date(data.return_date).toISOString()
    else data.return_date = null

    data.asset_type = customType

    try {
      const url = item ? '/api/tablets/' + item.id : '/api/tablets'
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

  const ASSET_TYPES = ['iPad', 'Galaxy Tab', 'Microsoft Surface', 'Tablet Android']

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full !max-w-[800px] sm:max-w-[800px] p-6 md:p-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} Tablet</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(executeSave)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama PIC</Label>
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
                <Label>Branch</Label>
                <Input type="text" {...register('branch')} />
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
                <Label>IT Penyerah</Label>
                <Input type="text" {...register('it_handover')} />
              </div>
              <div className="space-y-2">
                <Label>IT Penerima</Label>
                <Input type="text" {...register('it_receiver')} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Aset</Label>
                <Input 
                  list="asset_types" 
                  value={customType} 
                  onChange={e => setCustomType(e.target.value)} 
                  placeholder="Pilih atau ketik jenis..."
                />
                <datalist id="asset_types">
                  {ASSET_TYPES.map(t => <option key={t} value={t} />)}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label>Brand</Label>
                <Input type="text" {...register('brand')} />
              </div>
              <div className="space-y-2">
                <Label>Tipe / Model</Label>
                <Input type="text" {...register('type')} />
              </div>
              <div className="space-y-2">
                <Label>RAM (Contoh: 8 GB)</Label>
                <Input type="text" {...register('ram')} />
              </div>
              <div className="space-y-2">
                <Label>Storage (Contoh: 128 GB)</Label>
                <Input type="text" {...register('storage')} />
              </div>

              <div className="space-y-2">
                <Label>Kondisi</Label>
                <Select value={watch('condition')} onValueChange={v => setValue('condition', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baik">Baik</SelectItem>
                    <SelectItem value="Rusak">Rusak</SelectItem>
                    <SelectItem value="Hilang">Hilang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Link Form / PDF</Label>
                <Input type="url" {...register('form_path')} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Keterangan Tambahan</Label>
                <Textarea {...register('notes')} rows={3} />
              </div>
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
