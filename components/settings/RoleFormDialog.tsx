'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: {
    id: number
    name: string
    label: string
    description?: string | null
    is_system?: boolean
  } | null
  onSuccess: () => void
  onDelete?: (role: any) => void
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
  onDelete,
}: RoleFormDialogProps) {
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (role) {
      setName(role.name)
      setLabel(role.label)
      setDescription(role.description || '')
    } else {
      setName('')
      setLabel('')
      setDescription('')
    }
  }, [role, open])

  const isSuperAdmin = role?.name === 'SUPER_ADMIN'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !label) {
      toast.error('Kode Role dan Nama Role wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      const url = role ? `/api/settings/roles/${role.id}` : '/api/settings/roles'
      const method = role ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.toUpperCase().replace(/\s+/g, '_'),
          label: label.trim(),
          description: description?.trim() || null,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(data.message || (role ? 'Peran berhasil diperbarui' : 'Peran baru berhasil dibuat'))
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(data.message || 'Gagal menyimpan peran')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memproses data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Peran (Role)' : 'Tambah Peran Baru'}</DialogTitle>
          <DialogDescription>
            {role
              ? `Perbarui informasi dan wewenang untuk peran '${role.label}'.`
              : 'Tambahkan peran baru yang akan langsung muncul sebagai kolom pada Matriks Hak Akses.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="role-label">Nama Tampilan (Label)</Label>
            <Input
              id="role-label"
              placeholder="e.g. Direktur Operasional"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-name">Kode Identifier (Sistem)</Label>
            <Input
              id="role-name"
              placeholder="e.g. DIREKTUR atau SUPERVISOR"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSuperAdmin || isLoading}
              className="font-mono uppercase"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              {isSuperAdmin
                ? 'Kode identifier Super Admin dilindungi sistem dan tidak dapat diubah.'
                : 'Format huruf kapital unik, contoh: DIREKTUR_OPS.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-description">Deskripsi (Opsional)</Label>
            <Textarea
              id="role-description"
              placeholder="Jelaskan wewenang atau ruang lingkup peran ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2 flex items-center justify-between sm:justify-between">
            {role && !isSuperAdmin && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  onDelete(role)
                }}
                disabled={isLoading}
                className="gap-1.5 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Peran
              </Button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? 'Menyimpan...' : (role ? 'Simpan Perubahan' : 'Tambah Peran')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
