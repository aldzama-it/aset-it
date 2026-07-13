'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

import { AttachmentField } from '@/components/shared/AttachmentField'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { CheckCircle2, XCircle } from 'lucide-react'

const conditions = ['Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif']

export function LaptopForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { condition: 'Baik' } })
  const [confirmData, setConfirmData] = useState<any>(null)
  const [resultState, setResultState] = useState<{show: boolean, success: boolean, message: string}>({ show: false, success: false, message: '' })

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          ...item,
          handover_date: item.handover_date ? item.handover_date.split('T')[0] : '',
          return_date: item.return_date ? item.return_date.split('T')[0] : ''
        })
      } else {
        reset({ condition: 'Baik' })
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
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} Laptop</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Kode Aset</Label>
            <Input type="text" {...register('asset_code')} placeholder="Kosongkan untuk otomatis" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Info */}
            <div className="space-y-2">
              <Label>Nama Pegawai</Label>
              <Input type="text" {...register('pic')} />
            </div>
            <div className="space-y-2">
              <Label>Departmen</Label>
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

            {/* Credentials */}
            <div className="space-y-2">
              <Label>Password Admin</Label>
              <Input type="text" {...register('admin_password')} />
            </div>
            <div className="space-y-2">
              <Label>Kode Anydesk</Label>
              <Input type="text" {...register('anydesk_code')} />
            </div>

            {/* Handover Info */}
            <div className="space-y-2">
              <Label>Tgl Serah Terima</Label>
              <Input type="date" {...register('handover_date')} />
            </div>
            <div className="space-y-2">
              <Label>Tgl Pengembalian</Label>
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
            
            {/* Spec Info */}
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input type="text" {...register('brand')} />
            </div>
            <div className="space-y-2">
              <Label>Type/Model</Label>
              <Input type="text" {...register('model')} />
            </div>
            <div className="space-y-2">
              <Label>RAM</Label>
              <Input type="text" {...register('ram')} placeholder="e.g. 16GB" />
            </div>
            <div className="space-y-2">
              <Label>Storage</Label>
              <Input type="text" {...register('storage')} placeholder="e.g. 512GB SSD" />
            </div>
            <div className="space-y-2">
              <Label>Processor</Label>
              <Input type="text" {...register('processor')} />
            </div>
            <div className="space-y-2">
              <Label>Layar</Label>
              <Input type="text" {...register('screen_size')} placeholder="e.g. 14 inch" />
            </div>
            <div className="space-y-2">
              <Label>MAC Address</Label>
              <Input type="text" {...register('mac_address')} />
            </div>

            {/* Status */}
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
            <Label>Keterangan</Label>
            <Input {...register('notes')} />
          </div>

          <div className="space-y-2">
            <Label>Form (PDF Bukti Serah Terima)</Label>
            <AttachmentField 
              assetCode={item?.asset_code || ''}
              attachmentName={watch('attachment_name')}
              attachmentPath={watch('attachment_path')}
              onUploadSuccess={(name, path) => {
                setValue('attachment_name', name)
                setValue('attachment_path', path)
              }}
              onRemove={() => {
                setValue('attachment_name', null)
                setValue('attachment_path', null)
              }}
            />
          </div>

          <div className="flex justify-end pt-4 pb-12">
            <Button type="submit" size="lg" className="w-full md:w-auto px-12">Simpan Data</Button>
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
