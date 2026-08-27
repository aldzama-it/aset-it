'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { assetTransferConfigs, type AssetTableName, type AssetTransferItem } from '@/lib/asset-transfer'
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

type AssetTransferDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: AssetTransferItem
  tableName: AssetTableName
  onSuccess: () => void
}

function today() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export function AssetTransferDialog({
  open,
  onOpenChange,
  item,
  tableName,
  onSuccess,
}: AssetTransferDialogProps) {
  const config = assetTransferConfigs[tableName]
  const [toEmployee, setToEmployee] = useState(
    config.picField ? String(item[config.picField] ?? '') : '',
  )
  const [toLocation, setToLocation] = useState(String(item[config.locationField] ?? ''))
  const [handoverDate, setHandoverDate] = useState(today())
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`/api/asset-transfers/${tableName}/${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_employee: toEmployee,
          to_location: toLocation,
          handover_date: config.handoverDateField ? handoverDate : undefined,
          notes,
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal memindahkan aset')
      }

      toast.success('Aset berhasil dipindahkan')
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memindahkan aset')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pindahkan {config.label}</DialogTitle>
          <DialogDescription>
            {item.asset_code || `Aset #${item.id}`}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {config.picField && (
            <div className="space-y-2">
              <Label htmlFor={`transfer-pic-${tableName}-${item.id}`}>PIC tujuan</Label>
              <Input
                id={`transfer-pic-${tableName}-${item.id}`}
                value={toEmployee}
                onChange={(event) => setToEmployee(event.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`transfer-location-${tableName}-${item.id}`}>Lokasi tujuan</Label>
            <Input
              id={`transfer-location-${tableName}-${item.id}`}
              value={toLocation}
              onChange={(event) => setToLocation(event.target.value)}
              required
            />
          </div>

          {config.handoverDateField && (
            <div className="space-y-2">
              <Label htmlFor={`transfer-date-${tableName}-${item.id}`}>Tanggal perpindahan</Label>
              <Input
                id={`transfer-date-${tableName}-${item.id}`}
                type="date"
                value={handoverDate}
                onChange={(event) => setHandoverDate(event.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`transfer-notes-${tableName}-${item.id}`}>Alasan / keterangan</Label>
            <Textarea
              id={`transfer-notes-${tableName}-${item.id}`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <LoadingButton type="submit" isLoading={submitting}>
              Pindahkan
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
