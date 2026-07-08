'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { DigitalAssetConfig } from '@/lib/digital-assets-config'
import { Eye, EyeOff } from 'lucide-react'

export function DigitalAssetForm({ config, open, onOpenChange, item, onSuccess }: { config: DigitalAssetConfig, open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (open) {
      if (item) {
        reset(item)
      } else {
        // default status
        const defaultValues: any = {}
        const statusField = config.fields.find(f => f.name === 'status')
        if (statusField) defaultValues['status'] = 'Aktif'
        reset(defaultValues)
      }
    }
  }, [open, item, reset, config])

  const togglePassword = (fieldName: string) => {
    setShowPassword(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))
  }

  const executeSave = async (data: any) => {
    setIsSubmitting(true)
    try {
      const url = item ? `/api/digital-assets/${config.id}/${item.id}` : `/api/digital-assets/${config.id}`
      const res = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (json.success) {
        toast.success(item ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(json.error || 'Terjadi kesalahan pada server.')
      }
    } catch {
      toast.error('Gagal menghubungi server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full !max-w-[50vw] sm:max-w-[50vw] p-6 md:p-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">{item ? 'Edit' : 'Tambah'} {config.title}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(executeSave)} className="space-y-4">
          <div className="space-y-4">
            {config.fields.map(field => {
              if (field.name === 'status') {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Select value={watch(field.name)} onValueChange={v => setValue(field.name, v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Dihapus">Dihapus</SelectItem>
                        <SelectItem value="Kedaluwarsa">Kedaluwarsa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )
              }
              if (field.type === 'textarea') {
                return (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Textarea {...register(field.name, { required: field.required })} rows={3} />
                  </div>
                )
              }

              return (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                  <div className="relative">
                    <Input 
                      type={field.type === 'password' && showPassword[field.name] ? 'text' : field.type} 
                      {...register(field.name, { required: field.required })} 
                      className={field.type === 'password' ? 'pr-10' : ''}
                    />
                    {field.type === 'password' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                        onClick={() => togglePassword(field.name)}
                      >
                        {showPassword[field.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="bg-primary text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
