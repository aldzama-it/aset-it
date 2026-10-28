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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { MENU_GROUPS, ALL_MENU_KEYS, DEFAULT_ROLE_PRESETS } from '@/lib/rbac/permissions-config'
import { Check, ShieldAlert, RotateCcw, CheckSquare, Square } from 'lucide-react'

interface RolePermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: {
    id: number
    name: string
    label: string
    description?: string | null
    is_system?: boolean
    permissions: string[]
  } | null
  onSuccess: () => void
}

export function RolePermissionDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: RolePermissionDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions || [])
    }
  }, [role])

  if (!role) return null

  const isSuperAdmin = role.name === 'SUPER_ADMIN'

  const togglePermission = (key: string) => {
    if (isSuperAdmin && key === 'settings.roles') {
      toast.warning('Pengaturan Role tidak dapat dinonaktifkan untuk Super Admin')
      return
    }

    setSelectedPermissions(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const toggleGroup = (groupKeys: string[], enable: boolean) => {
    setSelectedPermissions(prev => {
      const set = new Set(prev)
      groupKeys.forEach(k => {
        if (enable) {
          set.add(k)
        } else {
          if (!(isSuperAdmin && k === 'settings.roles')) {
            set.delete(k)
          }
        }
      })
      return Array.from(set)
    })
  }

  const selectAll = () => {
    setSelectedPermissions(ALL_MENU_KEYS)
  }

  const deselectAll = () => {
    if (isSuperAdmin) {
      setSelectedPermissions(['dashboard', 'settings.roles'])
    } else {
      setSelectedPermissions([])
    }
  }

  const resetToPreset = () => {
    const preset = DEFAULT_ROLE_PRESETS.find(p => p.name === role.name)
    if (preset) {
      setSelectedPermissions(preset.defaultPermissions)
      toast.info(`Hak akses direset sesuai default '${preset.label}'`)
    } else {
      setSelectedPermissions([])
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/settings/roles/${role.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: selectedPermissions }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(data.message || 'Hak akses berhasil diperbarui!')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(data.message || 'Gagal memperbarui hak akses')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi saat menyimpan hak akses')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold">
                  Konfigurasi Visibilitas Menu
                </DialogTitle>
                <Badge variant={role.is_system ? 'default' : 'secondary'} className="font-mono text-xs">
                  {role.name}
                </Badge>
              </div>
              <DialogDescription>
                Tentukan menu apa saja yang dapat dilihat dan diakses oleh pengguna dengan role{' '}
                <strong className="text-foreground">{role.label}</strong>.
              </DialogDescription>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Menu Aktif</span>
              <span className="text-2xl font-bold text-primary font-mono">
                {selectedPermissions.length}/{ALL_MENU_KEYS.length}
              </span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-border/40">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={selectAll} className="h-8 text-xs">
                <CheckSquare className="w-3.5 h-3.5 mr-1.5" /> Pilih Semua
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll} className="h-8 text-xs">
                <Square className="w-3.5 h-3.5 mr-1.5" /> Kosongkan
              </Button>
              <Button variant="ghost" size="sm" onClick={resetToPreset} className="h-8 text-xs text-muted-foreground">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset Default
              </Button>
            </div>
            {isSuperAdmin && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Super Admin selalu memiliki akses keamanan penuh</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Scrollable Permissions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {MENU_GROUPS.map((group) => {
            const groupKeys = group.items.map(i => i.key)
            const activeInGroup = groupKeys.filter(k => selectedPermissions.includes(k)).length
            const isAllGroupActive = activeInGroup === groupKeys.length

            return (
              <div key={group.group} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">{group.title}</h3>
                    <Badge variant="outline" className="text-xs font-normal">
                      {activeInGroup} / {groupKeys.length} aktif
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => toggleGroup(groupKeys, !isAllGroupActive)}
                  >
                    {isAllGroupActive ? 'Matikan Semua' : 'Nyalakan Semua'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {group.items.map((item) => {
                    const isChecked = selectedPermissions.includes(item.key)
                    const isLocked = isSuperAdmin && item.key === 'settings.roles'

                    return (
                      <div
                        key={item.key}
                        onClick={() => !isLocked && togglePermission(item.key)}
                        className={`flex items-start justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-primary/5 border-primary/40 shadow-xs'
                            : 'bg-background hover:bg-muted/40 border-border/60 opacity-75'
                        } ${isLocked ? 'cursor-not-allowed opacity-90' : ''}`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">
                              {item.label}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {item.path}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <Switch
                          checked={isChecked}
                          disabled={isLocked}
                          onCheckedChange={() => togglePermission(item.key)}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? 'Menyimpan...' : (
              <>
                <Check className="w-4 h-4 mr-1.5" /> Simpan Hak Akses
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

