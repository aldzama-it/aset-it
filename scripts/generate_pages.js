const fs = require('fs');
const path = require('path');

const entities = [
  { 
    name: 'network', title: 'Jaringan', entityName: 'NetworkDevice', 
    fields: ['asset_code', 'name', 'device_type', 'brand', 'model', 'mac_address', 'ip_address', 'location_id', 'purchase_date', 'condition', 'notes'],
    hasAssignedTo: false, hasAccessories: false, hasFile: false 
  },
  { 
    name: 'printers', title: 'Printer', entityName: 'Printer', 
    fields: ['asset_code', 'brand', 'model', 'location_id', 'condition', 'ink_type', 'mac_address', 'ip_address', 'connection', 'purchase_date', 'notes'],
    hasAssignedTo: false, hasAccessories: false, hasFile: false 
  },
  { 
    name: 'cctv', title: 'CCTV', entityName: 'Cctv', 
    fields: ['asset_code', 'brand', 'model', 'location_id', 'position_label', 'ip_address', 'mac_address', 'install_date', 'condition', 'notes'],
    hasAssignedTo: false, hasAccessories: false, hasFile: false 
  },
  { 
    name: 'laptops', title: 'Laptop', entityName: 'Laptop', 
    fields: ['asset_code', 'assigned_to', 'location_id', 'brand', 'model', 'mac_address', 'handover_date', 'return_date', 'condition', 'notes'],
    hasAssignedTo: true, hasAccessories: false, hasFile: true 
  },
  { 
    name: 'laptop-accessories', title: 'Aksesoris Laptop', entityName: 'LaptopAccessory', 
    fields: ['asset_code', 'assigned_to', 'item_name', 'model', 'quantity', 'location_id', 'handover_date', 'return_date', 'condition', 'notes'],
    hasAssignedTo: true, hasAccessories: false, hasFile: false 
  },
  { 
    name: 'ht', title: 'HT (Handy Talky)', entityName: 'Ht', 
    fields: ['asset_code', 'assigned_to', 'brand', 'model', 'accessories', 'location_id', 'handover_date', 'return_date', 'condition', 'notes'],
    hasAssignedTo: true, hasAccessories: true, hasFile: false 
  },
  { 
    name: 'tablets', title: 'Tablet', entityName: 'Tablet', 
    fields: ['asset_code', 'assigned_to', 'brand', 'model', 'storage_gb', 'ram_gb', 'accessories', 'location_id', 'handover_date', 'return_date', 'condition', 'notes'],
    hasAssignedTo: true, hasAccessories: true, hasFile: false 
  },
  { 
    name: 'cameras', title: 'Kamera', entityName: 'Camera', 
    fields: ['asset_code', 'assigned_to', 'brand', 'model', 'accessories', 'location_id', 'handover_date', 'return_date', 'purchase_date', 'condition', 'notes'],
    hasAssignedTo: true, hasAccessories: true, hasFile: false 
  },
  { 
    name: 'starlinks', title: 'Starlink', entityName: 'Starlink', 
    fields: ['asset_code', 'serial_number', 'location_id', 'account_email', 'active_since', 'subscription_plan', 'ip_address', 'condition', 'notes'],
    hasAssignedTo: false, hasAccessories: false, hasFile: false 
  },
  { 
    name: 'dashcams', title: 'Dashcam', entityName: 'Dashcam', 
    fields: ['vehicle_name', 'plate_number', 'location_id', 'project', 'dashcam_brand', 'dashcam_model', 'install_date', 'is_installed', 'condition', 'notes'],
    hasAssignedTo: false, hasAccessories: false, hasFile: false 
  },
];

const appDir = path.join(__dirname, '../app/(app)');
const componentsDir = path.join(__dirname, '../components');
const tablesDir = path.join(componentsDir, 'tables');
const formsDir = path.join(componentsDir, 'forms');

fs.mkdirSync(tablesDir, { recursive: true });
fs.mkdirSync(formsDir, { recursive: true });

entities.forEach(ent => {
  const pageDir = path.join(appDir, ent.name);
  fs.mkdirSync(pageDir, { recursive: true });

  // 1. PAGE
  const pageContent = `'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { ${ent.entityName}Table } from '@/components/tables/${ent.entityName}Table'
import { ${ent.entityName}Form } from '@/components/forms/${ent.entityName}Form'

export default function ${ent.entityName}Page() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const fetchData = () => {
    fetch('/api/${ent.name}?search=' + search)
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data) })
  }

  useEffect(() => { fetchData() }, [search])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">${ent.title}</h1>
        <Button onClick={() => { setEditItem(null); setFormOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Data
        </Button>
      </div>
      <div className="flex items-center gap-2 max-w-sm">
        <Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <${ent.entityName}Table data={data} onEdit={(item) => { setEditItem(item); setFormOpen(true) }} onRefresh={fetchData} />
      <${ent.entityName}Form open={formOpen} onOpenChange={setFormOpen} item={editItem} onSuccess={fetchData} />
    </div>
  )
}
`;
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent);

  // 2. TABLE
  const tableContent = `'use client'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash, Paperclip, XCircle } from 'lucide-react'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import { toast } from 'sonner'

export function ${ent.entityName}Table({ data, onEdit, onRefresh }: { data: any[], onEdit: (item: any) => void, onRefresh: () => void }) {
  const [delItem, setDelItem] = useState<any>(null)

  const handleDelete = async () => {
    if (!delItem) return
    try {
      const res = await fetch('/api/${ent.name}/' + delItem.id, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        toast.success('Data dihapus')
        onRefresh()
      } else {
        toast.error(json.error)
      }
    } catch {
      toast.error('Gagal menghapus data')
    }
    setDelItem(null)
  }

  return (
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode Aset</TableHead>
            ${ent.hasAssignedTo ? '<TableHead>Pemegang</TableHead>' : ''}
            <TableHead>Kondisi</TableHead>
            <TableHead>Lokasi</TableHead>
            ${ent.hasFile ? '<TableHead>Form ST</TableHead>' : ''}
            <TableHead className="w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.asset_code || item.vehicle_name || '-'}</TableCell>
              ${ent.hasAssignedTo ? '<TableCell>{item.employee?.name || "-"}</TableCell>' : ''}
              <TableCell><ConditionBadge condition={item.condition} /></TableCell>
              <TableCell>{item.location?.name || '-'}</TableCell>
              ${ent.hasFile ? `<TableCell>{item.attachment_path ? <a href="#" onClick={(e) => {
                e.preventDefault();
                fetch('/api/files/handover/' + item.attachment_path.split('/').pop())
                .then(r => r.blob()).then(blob => window.open(URL.createObjectURL(blob), '_blank'))
              }} className="flex items-center text-blue-600 hover:underline"><Paperclip className="w-4 h-4 mr-1"/> File</a> : <XCircle className="w-4 h-4 text-red-500" />}</TableCell>` : ''}
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDelItem(item)}>
                    <Trash className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={10} className="text-center">Tidak ada data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirmDialog open={!!delItem} onOpenChange={(o) => !o && setDelItem(null)} onConfirm={handleDelete} itemName={delItem?.asset_code || 'data ini'} />
    </div>
  )
}
`;
  fs.writeFileSync(path.join(tablesDir, `${ent.entityName}Table.tsx`), tableContent);

  // 3. FORM
  const formContent = `'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { LocationSelect } from '@/components/shared/LocationSelect'
import { EmployeeSelect } from '@/components/shared/EmployeeSelect'
${ent.hasAccessories ? `import { AccessoriesInput } from '@/components/shared/AccessoriesInput'` : ''}
${ent.hasFile ? `import { AttachmentField } from '@/components/shared/AttachmentField'` : ''}

const conditions = ['Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif']

export function ${ent.entityName}Form({ open, onOpenChange, item, onSuccess }: { open: boolean, onOpenChange: (o: boolean) => void, item: any, onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: { condition: 'Baik', accessories: [] as string[] } })

  useEffect(() => {
    if (open) {
      if (item) {
        reset(item)
      } else {
        reset({ condition: 'Baik', accessories: [] })
      }
    }
  }, [open, item, reset])

  const onSubmit = async (data: any) => {
    if (data.quantity) data.quantity = parseInt(data.quantity)
    if (data.storage_gb) data.storage_gb = parseInt(data.storage_gb)
    if (data.ram_gb) data.ram_gb = parseInt(data.ram_gb)
    ${ent.hasAccessories ? `if (!data.accessories) data.accessories = []` : ''}

    try {
      const url = item ? '/api/${ent.name}/' + item.id : '/api/${ent.name}'
      const res = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (json.success) {
        toast.success(item ? 'Data diupdate' : 'Data ditambahkan')
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(json.error)
      }
    } catch {
      toast.error('Gagal menyimpan data')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit' : 'Tambah'} ${ent.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            ${ent.fields.filter(f => f !== 'asset_code' && f !== 'location_id' && f !== 'assigned_to' && f !== 'condition' && f !== 'accessories' && f !== 'notes' && f !== 'attachment_name' && f !== 'attachment_path').map(f => `
            <div className="space-y-2">
              <Label className="capitalize">${f.replace(/_/g, ' ')}</Label>
              <Input type={f.includes('date') ? 'date' : 'text'} {...register('${f}')} />
            </div>`).join('')}

            <div className="space-y-2">
              <Label>Lokasi</Label>
              <LocationSelect value={watch('location_id')} onChange={(v) => setValue('location_id', v)} />
            </div>

            ${ent.hasAssignedTo ? `
            <div className="space-y-2">
              <Label>Pemegang</Label>
              <EmployeeSelect value={watch('assigned_to')} onChange={(v) => setValue('assigned_to', v)} />
            </div>` : ''}

            <div className="space-y-2">
              <Label>Kondisi</Label>
              <Select value={watch('condition')} onValueChange={v => setValue('condition', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {conditions.map(c => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            ${ent.hasAccessories ? `
            <div className="col-span-2 space-y-2">
              <Label>Aksesoris/Kelengkapan</Label>
              <AccessoriesInput value={watch('accessories')} onChange={(v) => setValue('accessories', v)} />
            </div>` : ''}
          </div>

          <div className="space-y-2">
            <Label>Catatan</Label>
            <Input {...register('notes')} />
          </div>

          ${ent.hasFile && `
          {item && (
            <div className="space-y-2">
              <Label>File Serah Terima</Label>
              <AttachmentField 
                assetCode={item.asset_code}
                attachmentName={watch('attachment_name')}
                attachmentPath={watch('attachment_path')}
                onUploadSuccess={(name, path) => {
                  setValue('attachment_name', name)
                  setValue('attachment_path', path)
                  onSubmit({ ...watch(), attachment_name: name, attachment_path: path })
                }}
                onRemove={() => {
                  setValue('attachment_name', null)
                  setValue('attachment_path', null)
                  onSubmit({ ...watch(), attachment_name: null, attachment_path: null })
                }}
              />
            </div>
          )}
          `}

          <div className="flex justify-end pt-4">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
`;
  fs.writeFileSync(path.join(formsDir, `${ent.entityName}Form.tsx`), formContent);
});

console.log('Pages generated');
