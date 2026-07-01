'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'



import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { CheckCircle2, XCircle } from 'lucide-react'

const conditions = ['Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif']

export function CctvForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { condition: 'Baik', accessories: [] as string[] } })
  const [confirmData, setConfirmData] = useState<any>(null)
  const [resultState, setResultState] = useState<{show: boolean, success: boolean, message: string}>({ show: false, success: false, message: '' })

  useEffect(() => {
    if (open) {
      if (item) {
        reset(item)
      } else {
        reset({ condition: 'Baik', accessories: [] })
      }
    }
  }, [open, item, reset])

    const onFormSubmit = (data: any) => {
    setConfirmData(data)
  }

  const executeSave = async () => {
    if (!confirmData) return
    const data = { ...confirmData }
    setConfirmData(null)

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
      const url = item ? '/api/cctv/' + item.id : '/api/cctv'
      const res = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (json.success) {
        setResultState({ show: true, success: true, message: item ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!' })
        onSuccess()
      } else {
        setResultState({ show: true, success: false, message: json.error || 'Terjadi kesalahan pada server.' })
      }
    } catch {
      setResultState({ show: true, success: false, message: 'Gagal menghubungi server. Periksa koneksi Anda.' })
    }
  }

  const closeResult = () => {
    if (resultState.success) {
      onOpenChange(false)
    }
    setResultState({ show: false, success: false, message: '' })
  }

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full !max-w-[50vw] sm:max-w-[50vw] p-6 md:p-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} CCTV</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Kode Aset</Label>
            <Input type="text" {...register('asset_code')} placeholder="Kosongkan untuk otomatis" />
          </div>
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
              <Label className="capitalize">position label</Label>
              <Input type="text" {...register('position_label')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">ip address</Label>
              <Input type="text" {...register('ip_address')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">mac address</Label>
              <Input type="text" {...register('mac_address')} />
            </div>
            <div className="space-y-2">
              <Label className="capitalize">install date</Label>
              <Input type="date" {...register('install_date')} />
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
      </SheetContent>
    </Sheet>

    {/* Confirmation Dialog */}
    <AlertDialog open={!!confirmData} onOpenChange={(o) => !o && setConfirmData(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Simpan</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin semua data yang diisi sudah benar? 
            {item ? ' Data lama akan diperbarui dengan data baru ini.' : ' Data baru akan ditambahkan ke sistem.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={executeSave}>Ya, Simpan</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Result Status Dialog */}
    <AlertDialog open={resultState.show} onOpenChange={closeResult}>
      <AlertDialogContent className="flex flex-col items-center justify-center p-8 text-center sm:max-w-md">
        {resultState.success ? (
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
        ) : (
          <XCircle className="w-20 h-20 text-red-500 mb-4" />
        )}
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">
            {resultState.success ? 'Berhasil!' : 'Gagal!'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg mt-2">
            {resultState.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 w-full sm:justify-center">
          <AlertDialogAction onClick={closeResult} className="w-full sm:w-auto px-8">OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
