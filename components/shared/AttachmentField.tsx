'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, X, Upload } from 'lucide-react'
import { toast } from 'sonner'

export function AttachmentField({ 
  assetCode, attachmentName, attachmentPath, onUploadSuccess, onRemove 
}: { 
  assetCode: string, 
  attachmentName?: string | null, 
  attachmentPath?: string | null, 
  onUploadSuccess: (name: string, path: string) => void, 
  onRemove: () => void 
}) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    if (assetCode) formData.append('asset_code', assetCode)
    else formData.append('asset_code', 'temp')

    try {
      const res = await fetch('/api/upload/handover', { method: 'POST', body: formData })
      const json = await res.json()
      if (json.success) {
        onUploadSuccess(json.data.attachment_name, json.data.attachment_path)
      } else {
        toast.error(`Gagal upload: ${json.error || 'Terjadi kesalahan'}`)
      }
    } catch (err: any) {
      toast.error(`Terjadi kesalahan jaringan: ${err.message || ''}`)
    } finally {
      setUploading(false)
    }
  }

  if (attachmentName) {
    return (
      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
        <FileText className="w-5 h-5 text-muted-foreground" />
        <a href={attachmentPath ? `/api/files/handover/${attachmentPath.split('/').pop()}` : '#'} target="_blank" className="text-sm font-medium hover:underline flex-1 truncate">
          {attachmentName}
        </a>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-destructive">
          <X className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Input type="file" className="flex-1" onChange={handleUpload} disabled={uploading} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
      {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
    </div>
  )
}
