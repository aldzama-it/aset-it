'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { Textarea } from '@/components/ui/textarea'

type LaptopTransferModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetCode: string
  onSuccess: () => void
}

function today() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export function LaptopTransferModal({
  open,
  onOpenChange,
  assetCode,
  onSuccess,
}: LaptopTransferModalProps) {
  const [toEmployee, setToEmployee] = useState('')
  const [toDepartment, setToDepartment] = useState('')
  const [toDivision, setToDivision] = useState('')
  const [toJobLevel, setToJobLevel] = useState('')
  const [toBranch, setToBranch] = useState('')
  const [handoverDate, setHandoverDate] = useState(today())
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/laptops/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_code: assetCode,
          to_employee: toEmployee,
          to_department: toDepartment,
          to_division: toDivision,
          to_job_level: toJobLevel,
          to_branch: toBranch,
          handover_date: handoverDate,
          notes,
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal memindahkan aset')
      }

      toast.success('Aset berhasil dipindahkan')
      onOpenChange(false)
      // Reset form
      setToEmployee('')
      setToDepartment('')
      setToDivision('')
      setToJobLevel('')
      setToBranch('')
      setNotes('')
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memindahkan aset')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pindahkan Laptop</DialogTitle>
          <DialogDescription>
            Transfer kepemilikan laptop {assetCode} ke karyawan baru.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="to_employee">Nama Penerima Baru (PIC) *</Label>
              <Input
                id="to_employee"
                value={toEmployee}
                onChange={(event) => setToEmployee(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handover_date">Tanggal Penyerahan *</Label>
              <Input
                id="handover_date"
                type="date"
                value={handoverDate}
                onChange={(event) => setHandoverDate(event.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to_department">Departemen</Label>
              <Input
                id="to_department"
                value={toDepartment}
                onChange={(event) => setToDepartment(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to_division">Divisi</Label>
              <Input
                id="to_division"
                value={toDivision}
                onChange={(event) => setToDivision(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to_job_level">Jabatan / Job Level</Label>
              <Input
                id="to_job_level"
                value={toJobLevel}
                onChange={(event) => setToJobLevel(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to_branch">Cabang / Lokasi</Label>
              <Input
                id="to_branch"
                value={toBranch}
                onChange={(event) => setToBranch(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Transfer</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Alasan perpindahan, kondisi terkini, dll."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <LoadingButton type="submit" isLoading={submitting} className="bg-amber-600 hover:bg-amber-700">
              Proses Pindah Tangan
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
