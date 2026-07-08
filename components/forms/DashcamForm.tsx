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

export function DashcamForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { install_status: 'Belum Terpasang' } })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          ...item,
          install_date: item.install_date ? new Date(item.install_date).toISOString().split('T')[0] : '',
        })
      } else {
        reset({ install_status: 'Belum Terpasang' })
      }
    }
  }, [open, item, reset])

  const executeSave = async (data: any) => {
    setIsSubmitting(true)
    
    if (data.install_date) {
      data.install_date = new Date(data.install_date).toISOString()
    } else {
      data.install_date = null
    }

    try {
      const url = item ? '/api/dashcams/' + item.id : '/api/dashcams'
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
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} Target / Aset Dashcam</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(executeSave)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kode Aset</Label>
              <Input type="text" {...register('asset_code')} placeholder="Otomatis (Opsional)" />
            </div>
            <div className="space-y-2">
              <Label>Nama Kendaraan</Label>
              <Input type="text" {...register('vehicle_name')} required />
            </div>
            
            <div className="space-y-2">
              <Label>Nomor Polisi (Nopol)</Label>
              <Input type="text" {...register('plate_number')} />
            </div>
            <div className="space-y-2">
              <Label>Lokasi</Label>
              <Input type="text" {...register('location')} />
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Input type="text" {...register('project')} />
            </div>
            
            <div className="space-y-2">
              <Label>Status Pemasangan</Label>
              <Select value={watch('install_status')} onValueChange={v => setValue('install_status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Terpasang">Sudah Terpasang</SelectItem>
                  <SelectItem value="Belum Terpasang">Belum Terpasang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Pemasangan</Label>
              <Input type="date" {...register('install_date')} />
              <p className="text-xs text-muted-foreground">Isi hanya jika dashcam sudah terpasang.</p>
            </div>

            <div className="space-y-2">
              <Label>Email Azdome</Label>
              <Input type="email" {...register('azdome_email')} />
            </div>
            <div className="space-y-2">
              <Label>Password Azdome</Label>
              <Input type="text" {...register('azdome_password')} />
            </div>
            <div className="space-y-2">
              <Label>Gmail</Label>
              <Input type="email" {...register('gmail')} />
            </div>
            <div className="space-y-2">
              <Label>Password Gmail</Label>
              <Input type="text" {...register('gmail_password')} />
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
