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
import { toast } from 'sonner'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: number
    name: string
    email: string
    role_id: number | null
  } | null
  roles: Array<{ id: number; name: string; label: string }>
  onSuccess: () => void
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  roles,
  onSuccess,
}: UserFormDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPassword('')
      setRoleId(user.role_id ? user.role_id.toString() : '')
    } else {
      setName('')
      setEmail('')
      setPassword('')
      setRoleId(roles.length > 0 ? roles[0].id.toString() : '')
    }
  }, [user, open, roles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      toast.error('Nama dan Email wajib diisi')
      return
    }

    if (!user && !password) {
      toast.error('Password wajib diisi untuk pengguna baru')
      return
    }

    setIsLoading(true)
    try {
      const url = user ? `/api/settings/users/${user.id}` : '/api/settings/users'
      const method = user ? 'PUT' : 'POST'

      const payload: any = {
        name,
        email,
        role_id: roleId ? parseInt(roleId, 10) : null,
      }

      if (password.trim().length > 0) {
        payload.password = password.trim()
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(data.message || (user ? 'Data pengguna berhasil diperbarui' : 'Pengguna baru berhasil dibuat'))
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(data.message || 'Gagal menyimpan data pengguna')
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
          <DialogTitle>{user ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Perbarui informasi akun dan penugasan peran (role).'
              : 'Daftarkan akun pengguna baru dan tetapkan peran (role) untuk mengatur hak aksesnya.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="user-name">Nama Lengkap</Label>
            <Input
              id="user-name"
              placeholder="e.g. Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-email">Alamat Email</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="budi@aldzama.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-password">
              Password {user && <span className="text-muted-foreground font-normal text-xs">(Kosongkan jika tidak diubah)</span>}
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required={!user}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-role">Peran (Role & Hak Akses)</Label>
            <select
              id="user-role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              disabled={isLoading}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">-- Tanpa Role (Akses Minimal) --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id.toString()}>
                  {r.label} ({r.name})
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? 'Menyimpan...' : (user ? 'Perbarui' : 'Tambah Pengguna')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

