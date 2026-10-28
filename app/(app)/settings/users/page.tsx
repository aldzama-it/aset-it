'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Users, Search, Pencil, Trash2, Shield, Mail } from 'lucide-react'
import { SettingsNavigation } from '@/components/settings/SettingsNavigation'
import { UserFormDialog } from '@/components/settings/UserFormDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch('/api/settings/users'),
        fetch('/api/settings/roles'),
      ])

      const usersJson = await usersRes.json()
      const rolesJson = await rolesRes.json()

      if (usersJson.success) setUsers(usersJson.data)
      if (rolesJson.success) setRoles(rolesJson.data)
    } catch (error) {
      toast.error('Gagal memuat data pengguna dan role')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/settings/users/${userToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message || 'Pengguna berhasil dihapus')
        fetchData()
      } else {
        toast.error(data.message || 'Gagal menghapus pengguna')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus pengguna')
    } finally {
      setIsDeleting(false)
      setUserToDelete(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.role?.label && u.role.label.toLowerCase().includes(q)) ||
      (u.role?.name && u.role.name.toLowerCase().includes(q))
    )
  })

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'SUPER_ADMIN':
        return 'default'
      case 'IT_ADMIN':
        return 'secondary'
      case 'IT_SUPPORT':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <SettingsNavigation />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola akun staf dan tentukan peran (role) masing-masing untuk mengatur hak akses sistem.
          </p>
        </div>
        <Button onClick={() => { setSelectedUserForEdit(null); setIsFormOpen(true) }} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Tambah Pengguna
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border/60 p-4 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, atau role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="text-xs text-muted-foreground self-end sm:self-center">
          Menampilkan <strong>{filteredUsers.length}</strong> dari <strong>{users.length}</strong> pengguna
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[40px] text-center">#</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Peran (Role)</TableHead>
              <TableHead>Tanggal Terdaftar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Memuat data pengguna...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Tidak ada data pengguna yang cocok dengan pencarian.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, idx) => (
                <TableRow key={user.id} className="hover:bg-muted/20">
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{user.name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role ? (
                      <div className="flex items-center gap-1.5">
                        <Badge variant={getRoleBadgeVariant(user.role.name)} className="font-medium">
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role.label}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          ({user.role.name})
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Tanpa Role
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {user.created_at
                      ? format(new Date(user.created_at), 'dd MMM yyyy, HH:mm', { locale: localeId })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setSelectedUserForEdit(user)
                          setIsFormOpen(true)
                        }}
                        title="Edit Pengguna"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setUserToDelete(user)}
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Create / Edit Dialog */}
      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUserForEdit}
        roles={roles}
        onSuccess={() => {
          fetchData()
        }}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus akun <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
              Pengguna ini tidak akan dapat login lagi ke dalam sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

