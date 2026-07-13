'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, X, Upload, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

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
  const [errorState, setErrorState] = useState<{ show: boolean, message: string }>({ show: false, message: '' })

  const getFriendlyError = (err: any): string => {
    const msg = String(err?.message || err?.error || err || '').toLowerCase();
    
    if (msg.includes('size limit') || msg.includes('too large') || msg.includes('413')) {
      return 'Ukuran file terlalu besar. Mohon perkecil ukuran file (kompres) dan coba lagi.';
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
      return 'Koneksi terputus. Pastikan internet Anda stabil dan coba lagi.';
    }
    if (msg.includes('timeout')) {
      return 'Koneksi ke server terlalu lama (timeout). Silakan coba beberapa saat lagi.';
    }
    if (msg.includes('tidak ada file') || msg.includes('no file')) {
      return 'Tidak ada file yang dipilih atau format file tidak didukung.';
    }
    if (msg.includes('unauthorized') || msg.includes('401') || msg.includes('403')) {
      return 'Sesi Anda telah berakhir atau Anda tidak memiliki akses. Silakan muat ulang halaman.';
    }
    
    return 'Terjadi kendala saat memproses file Anda. Silakan coba unggah kembali.';
  }

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
        setErrorState({ show: true, message: getFriendlyError(json.error || json) })
      }
    } catch (err: any) {
      setErrorState({ show: true, message: getFriendlyError(err) })
    } finally {
      setUploading(false)
    }
  }

  const renderContent = () => {
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

  return (
    <>
      {renderContent()}

      <AlertDialog open={errorState.show} onOpenChange={(o) => !o && setErrorState({ show: false, message: '' })}>
        <AlertDialogContent className="flex flex-col items-center justify-center p-8 text-center sm:max-w-md">
          <XCircle className="w-20 h-20 text-red-500 mb-4" />
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">Gagal Mengunggah!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg mt-2">
              {errorState.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 w-full sm:justify-center">
            <AlertDialogAction onClick={() => setErrorState({ show: false, message: '' })} className="w-full sm:w-auto px-8">Mengerti</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
