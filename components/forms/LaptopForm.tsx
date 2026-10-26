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
import { Info, Loader2 } from 'lucide-react'

const conditions = ['Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif']

export function LaptopForm({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { condition: 'Baik' } })
  const [confirmData, setConfirmData] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          ...item,
          handover_date: item.handover_date ? item.handover_date.split('T')[0] : '',
          return_date: item.return_date ? item.return_date.split('T')[0] : ''
        })
      } else {
        reset({ condition: 'Baik', brand: '', model: '', pic: '', handover_date: '' })
      }
    }
  }, [open, item, reset])

  const onFormSubmit = (data: any) => {
    // Validasi field wajib di sisi klien
    if (!data.brand || !String(data.brand).trim()) {
      toast.error('Brand laptop wajib diisi')
      return
    }
    if (!data.model || !String(data.model).trim()) {
      toast.error('Type / Model laptop wajib diisi')
      return
    }
    if (data.mac_address && String(data.mac_address).trim().length > 17) {
      toast.error('MAC Address maksimal 17 karakter (contoh: AA:BB:CC:DD:EE:FF)')
      return
    }

    setConfirmData(data)
  }

  const executeSave = async () => {
    if (!confirmData) return
    const data = { ...confirmData }
    setConfirmData(null)
    setSaving(true)

    // Format dates to ISO String or null
    data.handover_date = data.handover_date ? new Date(data.handover_date).toISOString() : null
    data.return_date = data.return_date ? new Date(data.return_date).toISOString() : null

    // Sanitasi MAC address
    if (data.mac_address) {
      data.mac_address = String(data.mac_address).trim().slice(0, 17)
    }

    toast.loading(item ? 'Memperbarui data laptop...' : 'Menyimpan data laptop baru...', { id: 'save-laptop' })

    try {
      const url = item ? '/api/laptops/' + item.id : '/api/laptops'
      const res = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (json.success) {
        toast.success(item ? 'Data laptop berhasil diperbarui!' : 'Data laptop berhasil ditambahkan!', { id: 'save-laptop' })
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(json.error || 'Terjadi kesalahan saat menyimpan data.', { id: 'save-laptop' })
      }
    } catch {
      toast.error('Gagal menghubungi server. Periksa koneksi jaringan Anda.', { id: 'save-laptop' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full !max-w-[50vw] sm:max-w-[50vw] p-6 md:p-8 overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} Laptop</SheetTitle>
        </SheetHeader>

        {item && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 text-sm text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-amber-950">Catatan Mutasi / Pindah Tangan:</p>
              <p className="text-amber-800 leading-relaxed">
                Jika laptop ini diserahterimakan ke karyawan lain, gunakan fitur <strong>Pindahkan (Transfer)</strong> melalui tombol aksi di tabel agar riwayat lama tersimpan rapi. Edit di sini ditujukan untuk pembaruan spesifikasi atau koreksi salah ketik.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Kode Aset <span className="text-xs text-muted-foreground font-normal">(Kosongkan untuk otomatis)</span></Label>
            <Input type="text" {...register('asset_code')} placeholder="Otomatis (contoh: LPT-001)" />
          </div>

          {/* Spesifikasi Perangkat */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground border-b pb-1">Spesifikasi Perangkat</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand <span className="text-red-500">*</span></Label>
                <Input type="text" {...register('brand')} placeholder="contoh: Lenovo, Dell, HP" />
              </div>
              <div className="space-y-2">
                <Label>Type / Model <span className="text-red-500">*</span></Label>
                <Input type="text" {...register('model')} placeholder="contoh: ThinkPad T14 Gen 2" />
              </div>
              <div className="space-y-2">
                <Label>Processor</Label>
                <Input type="text" {...register('processor')} placeholder="contoh: Intel Core i7-1185G7" />
              </div>
              <div className="space-y-2">
                <Label>RAM</Label>
                <Input type="text" {...register('ram')} placeholder="contoh: 16GB DDR4" />
              </div>
              <div className="space-y-2">
                <Label>Storage</Label>
                <Input type="text" {...register('storage')} placeholder="contoh: 512GB NVMe SSD" />
              </div>
              <div className="space-y-2">
                <Label>Ukuran Layar</Label>
                <Input type="text" {...register('screen_size')} placeholder="contoh: 14 inch" />
              </div>
              <div className="space-y-2">
                <Label>MAC Address <span className="text-xs text-muted-foreground font-normal">(Maks. 17 karakter)</span></Label>
                <Input type="text" maxLength={17} {...register('mac_address')} placeholder="00:1A:2B:3C:4D:5E" />
              </div>
              <div className="space-y-2">
                <Label>Kondisi <span className="text-red-500">*</span></Label>
                <Select value={watch('condition')} onValueChange={v => setValue('condition', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {conditions.map(c => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pengguna & Penugasan */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground border-b pb-1">Pemegang & Lokasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Pegawai (PIC)</Label>
                <Input type="text" {...register('pic')} placeholder="Nama karyawan pengguna" />
              </div>
              <div className="space-y-2">
                <Label>Departemen</Label>
                <Input type="text" {...register('department')} placeholder="contoh: Information Technology" />
              </div>
              <div className="space-y-2">
                <Label>Divisi</Label>
                <Input type="text" {...register('division')} placeholder="contoh: Infrastructure" />
              </div>
              <div className="space-y-2">
                <Label>Job Level / Jabatan</Label>
                <Input type="text" {...register('job_level')} placeholder="contoh: Staff, Supervisor, Manager" />
              </div>
              <div className="space-y-2">
                <Label>Branch / Lokasi</Label>
                <Input type="text" {...register('branch')} placeholder="contoh: Kantor Pusat, Pabrik A" />
              </div>
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
                <Input type="text" {...register('it_handover')} placeholder="Nama staf IT yang menyerahkan" />
              </div>
              <div className="space-y-2">
                <Label>IT Penerima</Label>
                <Input type="text" {...register('it_receiver')} placeholder="Nama staf IT yang menerima kembali" />
              </div>
            </div>
          </div>

          {/* Kredensial & Akses */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground border-b pb-1">Kredensial & Akses Remote</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Password Admin Lokal</Label>
                <Input type="text" {...register('admin_password')} placeholder="Password akun administrator" />
              </div>
              <div className="space-y-2">
                <Label>Kode Anydesk</Label>
                <Input type="text" {...register('anydesk_code')} placeholder="ID AnyDesk / Remote ID" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Keterangan Tambahan</Label>
            <Input {...register('notes')} placeholder="Catatan fisik, kelengkapan charger/tas, dll." />
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

          <div className="flex justify-end gap-3 pt-4 pb-12">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" size="lg" className="w-full md:w-auto px-10" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Simpan Data
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>

    {/* Confirmation Dialog */}
    <AlertDialog open={!!confirmData} onOpenChange={(o) => !o && setConfirmData(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Simpan Data</AlertDialogTitle>
          <AlertDialogDescription>
            Pastikan data spesifikasi dan penugasan sudah benar.
            {item ? ' Perubahan akan langsung disimpan ke sistem.' : ' Data laptop baru akan ditambahkan ke daftar inventaris.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving}>Periksa Kembali</AlertDialogCancel>
          <AlertDialogAction onClick={executeSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Ya, Simpan'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
