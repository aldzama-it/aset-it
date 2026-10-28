'use client'

import { useEffect, useState, Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Check, Loader2, SquarePen, Trash2 } from 'lucide-react'
import { SettingsNavigation } from '@/components/settings/SettingsNavigation'
import { RoleFormDialog } from '@/components/settings/RoleFormDialog'
import { MENU_GROUPS } from '@/lib/rbac/permissions-config'
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
import { cn } from '@/lib/utils'

interface RoleData {
  id: number
  name: string
  label: string
  description?: string | null
  is_system: boolean
  user_count: number
  permissions: string[]
}

const GROUP_THEMES: Record<string, { label: string; textClass: string }> = {
  main: {
    label: 'OPERASIONAL & MENU UTAMA',
    textClass: 'text-[#0ea5e9]', // Cyan style
  },
  digital_assets: {
    label: 'ASET DIGITAL & KREDENSIAL',
    textClass: 'text-[#10b981]', // Emerald style
  },
  physical_assets: {
    label: 'INVENTARIS ASET FISIK',
    textClass: 'text-[#6366f1]', // Indigo style
  },
  history: {
    label: 'AUDIT & RIWAYAT',
    textClass: 'text-[#f59e0b]', // Amber style
  },
  settings: {
    label: 'ADMIN SETTINGS & PENGATURAN',
    textClass: 'text-[#ef4444]', // Coral/Red style
  },
}

export default function RolesMatrixPage() {
  const [roles, setRoles] = useState<RoleData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<RoleData | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<RoleData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/settings/roles')
      const json = await res.json()
      if (json.success) {
        setRoles(json.data)
      } else {
        toast.error(json.message || 'Gagal memuat data role')
      }
    } catch (error) {
      toast.error('Gagal terhubung ke server')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  // Urutan hierarki tampilan role (Direktur, Manager, Staff, Super Admin, Supervisor, dst)
  const sortedRoles = [...roles].sort((a, b) => {
    const order = ['DIREKTUR', 'MANAGER', 'STAFF', 'SUPER_ADMIN', 'SUPERVISOR', 'IT_ADMIN', 'IT_SUPPORT']
    const idxA = order.indexOf(a.name)
    const idxB = order.indexOf(b.name)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.label.localeCompare(b.label)
  })

  // Toggle hak akses langsung dari matriks
  const handleToggle = async (role: RoleData, menuKey: string) => {
    if (role.name === 'SUPER_ADMIN') {
      toast.info('Super Admin selalu memiliki hak akses penuh ke seluruh sistem')
      return
    }

    const currentPerms = role.permissions || []
    const isCurrentlyChecked = currentPerms.includes(menuKey)
    const newPerms = isCurrentlyChecked
      ? currentPerms.filter(k => k !== menuKey)
      : [...currentPerms, menuKey]

    // Optimistic Update
    setRoles(prev =>
      prev.map(r => (r.id === role.id ? { ...r, permissions: newPerms } : r))
    )

    const cellId = `${role.id}-${menuKey}`
    setSavingKey(cellId)

    try {
      const res = await fetch(`/api/settings/roles/${role.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: newPerms }),
      })

      const data = await res.json()
      if (!data.success) {
        // Rollback jika gagal
        setRoles(prev =>
          prev.map(r => (r.id === role.id ? { ...r, permissions: currentPerms } : r))
        )
        toast.error(data.message || 'Gagal memperbarui izin')
      }
    } catch (error) {
      // Rollback
      setRoles(prev =>
        prev.map(r => (r.id === role.id ? { ...r, permissions: currentPerms } : r))
      )
      toast.error('Gagal menyimpan perubahan ke server')
    } finally {
      setSavingKey(null)
    }
  }

  const handleDeleteRole = async () => {
    if (!roleToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/settings/roles/${roleToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message || 'Role berhasil dihapus')
        fetchRoles()
      } else {
        toast.error(data.message || 'Gagal menghapus role')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus role')
    } finally {
      setIsDeleting(false)
      setRoleToDelete(null)
    }
  }

  return (
    <div className="space-y-6 p-6 font-sans">
      <SettingsNavigation />

      {/* Dark Navy Hero Banner */}
      <div className="bg-[#0b1324] text-white rounded-xl p-6 sm:p-7 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-white mb-1.5">
          Peran & Hak Akses
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal">
          Konfigurasi izin operasional dan administratif secara terperinci untuk setiap peran. Anda dapat menambah, mengubah, atau menghapus peran sesuai kebutuhan organisasi.
        </p>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Tip: Klik ikon pensil untuk <strong>mengedit nama peran</strong>, ikon tempat sampah untuk <strong>menghapus</strong>, dan klik kotak centang untuk <strong>mengatur izin</strong>.
        </div>
        <Button
          onClick={() => {
            setSelectedRoleForEdit(null)
            setIsFormOpen(true)
          }}
          className="bg-[#1d63ed] hover:bg-[#1855cd] text-white font-medium rounded-lg px-4 h-9 text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Peran</span>
        </Button>
      </div>

      {/* Matriks Hak Akses Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/90 bg-white">
                <th className="py-4 px-6 text-xs sm:text-sm font-semibold text-slate-900 w-[300px] min-w-[260px] sticky left-0 bg-white z-10 border-r border-slate-100">
                  Matriks Hak Akses
                </th>
                {sortedRoles.map((role) => {
                  const isSuperAdmin = role.name === 'SUPER_ADMIN'

                  return (
                    <th
                      key={role.id}
                      className="py-4 px-4 text-center text-xs sm:text-sm font-semibold text-slate-900 min-w-[140px]"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span
                          onClick={() => {
                            setSelectedRoleForEdit(role)
                            setIsFormOpen(true)
                          }}
                          className="whitespace-nowrap font-medium text-slate-900 cursor-pointer hover:text-[#1d63ed] transition-colors"
                          title="Klik untuk mengedit peran"
                        >
                          {role.label}
                        </span>

                        {/* Action buttons under role name */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedRoleForEdit(role)
                              setIsFormOpen(true)
                            }}
                            className="text-slate-400 hover:text-[#1d63ed] transition-colors p-1 rounded hover:bg-slate-100"
                            title={`Edit nama & detail ${role.label}`}
                          >
                            <SquarePen className="w-3.5 h-3.5" />
                          </button>

                          {!isSuperAdmin && (
                            <button
                              onClick={() => setRoleToDelete(role)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                              title={`Hapus peran ${role.label}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={sortedRoles.length + 1}
                    className="py-16 text-center text-slate-400 text-sm"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1d63ed]" />
                    Memuat matriks hak akses...
                  </td>
                </tr>
              ) : (
                MENU_GROUPS.map((group) => {
                  const theme = GROUP_THEMES[group.group] || {
                    label: group.title.toUpperCase(),
                    textClass: 'text-[#0ea5e9]',
                  }

                  return (
                    <Fragment key={group.group}>
                      {/* Section Header */}
                      <tr className="border-t border-b border-slate-100/90 bg-slate-50/40">
                        <td
                          colSpan={sortedRoles.length + 1}
                          className={cn(
                            "py-3 px-6 text-[11px] font-bold tracking-wider uppercase",
                            theme.textClass
                          )}
                        >
                          {theme.label}
                        </td>
                      </tr>

                      {/* Baris Permission / Menu */}
                      {group.items.map((item) => (
                        <tr
                          key={item.key}
                          className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Nama Menu */}
                          <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-700 font-normal sticky left-0 bg-white z-10 border-r border-slate-100">
                            {item.label}
                          </td>

                          {/* Kotak Centang Per Role */}
                          {sortedRoles.map((role) => {
                            const isSuperAdmin = role.name === 'SUPER_ADMIN'
                            const isChecked = isSuperAdmin || (role.permissions || []).includes(item.key)
                            const isCellSaving = savingKey === `${role.id}-${item.key}`

                            return (
                              <td
                                key={`${role.id}-${item.key}`}
                                className="py-3.5 px-4 text-center align-middle"
                              >
                                {isSuperAdmin ? (
                                  <div
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-[5px] bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed mx-auto"
                                    title="Super Admin memiliki izin permanen"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleToggle(role, item.key)}
                                    disabled={isCellSaving}
                                    className={cn(
                                      "inline-flex items-center justify-center w-5 h-5 rounded-[5px] transition-all cursor-pointer mx-auto",
                                      isChecked
                                        ? "bg-[#1d63ed] text-white shadow-xs hover:bg-[#1855cd]"
                                        : "border border-slate-300 bg-white hover:border-[#1d63ed]/60 hover:bg-blue-50/30"
                                    )}
                                  >
                                    {isChecked && (
                                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    )}
                                  </button>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Create / Edit Dialog */}
      <RoleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        role={selectedRoleForEdit}
        onSuccess={() => {
          fetchRoles()
        }}
        onDelete={(role) => {
          setRoleToDelete(role)
        }}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Peran Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus peran <strong>{roleToDelete?.label}</strong> ({roleToDelete?.name})?
              Semua pengaturan hak akses untuk peran ini akan dihapus dari sistem, dan pengguna yang terhubung akan dialihkan ke status tanpa peran.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
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
