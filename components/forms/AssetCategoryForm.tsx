'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { CheckCircle2, XCircle } from 'lucide-react'

export function AssetCategoryForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset } = useForm()
  const [confirmData, setConfirmData] = useState<any>(null)
  const [resultState, setResultState] = useState<{show: boolean, success: boolean, message: string}>({ show: false, success: false, message: '' })

  useEffect(() => {
    if (open) {
      if (item) reset(item)
      else reset({ name: '', prefix: '', icon: 'Box' })
    }
  }, [open, item, reset])

    const onFormSubmit = (data: any) => {
    setConfirmData(data)
  }

  const executeSave = async () => {
    if (!confirmData) return
    const data = { ...confirmData }
    setConfirmData(null)

    try {
      const url = item ? '/api/settings/categories/' + item.id : '/api/settings/categories'
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
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} Kategori Aset</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Kategori (Contoh: Monitor)</Label>
            <Input type="text" {...register('name', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Kode Awalan (Contoh: MNT)</Label>
            <Input type="text" {...register('prefix', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Nama Ikon Lucide (Contoh: Monitor, Mouse, Box)</Label>
            <Input type="text" {...register('icon')} />
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
