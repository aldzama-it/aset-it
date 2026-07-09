'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileDown, Loader2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { downloadTemplate, readExcelFile } from '@/lib/excel'
import { toast } from 'sonner'

const HEADER_MAP: Record<string, string[]> = {
  'Laptop': ['asset_code', 'pic', 'department', 'division', 'job_level', 'branch', 'handover_date', 'return_date', 'brand', 'model', 'ram', 'storage', 'processor', 'screen_size', 'mac_address', 'condition', 'notes', 'it_handover', 'it_receiver'],
  'Printer': ['asset_code', 'brand', 'model', 'location', 'condition', 'notes', 'ink_type', 'mac_address', 'ip_address', 'purchase_date', 'connection'],
  'Kamera': ['asset_code', 'pic', 'brand', 'model', 'location', 'handover_date', 'return_date', 'purchase_date', 'condition', 'notes'],
  'CCTV': ['asset_code', 'brand', 'model', 'location', 'position_label', 'ip_address', 'mac_address', 'install_date', 'condition', 'notes'],
  'Dashcam': ['asset_code', 'vehicle_name', 'plate_number', 'location', 'project', 'install_status', 'install_date', 'notes'],
  'HT': ['asset_code', 'pic_name', 'department', 'division', 'job_level', 'branch', 'handover_date', 'return_date', 'brand', 'type', 'accessories', 'condition', 'notes', 'form_path', 'it_handover', 'it_receiver'],
  'Inventaris_Umum': ['asset_code', 'pic_name', 'department', 'division', 'job_level', 'branch', 'handover_date', 'return_date', 'asset_type', 'brand', 'condition', 'notes', 'handover_form', 'return_form', 'it_handover', 'it_receiver'],
  'Network_Device': ['asset_code', 'name', 'device_type', 'mac_address', 'location', 'purchase_date', 'notes'],
  'Starlink': ['asset_code', 'location', 'serial_number', 'account_email', 'install_date', 'notes'],
  'Tablet': ['asset_code', 'pic_name', 'department', 'division', 'job_level', 'branch', 'handover_date', 'return_date', 'asset_type', 'brand', 'type', 'ram', 'storage', 'condition', 'notes', 'form_path', 'it_handover', 'it_receiver']
}

const DEFAULT_HEADERS = ['asset_code', 'brand', 'model', 'location', 'pic', 'purchase_date', 'handover_date', 'condition', 'notes']

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react'

export function ImportExcel({ 
  apiUrl, 
  assetType, 
  onSuccess,
  categoryId,
  customHeaders
}: { 
  apiUrl: string, 
  assetType: string, 
  onSuccess: () => void,
  categoryId?: number,
  customHeaders?: string[]
}) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [resultState, setResultState] = useState<{show: boolean, success: boolean, message: string, errors?: string[]}>({ show: false, success: false, message: '' })

  const headers = customHeaders || HEADER_MAP[assetType] || DEFAULT_HEADERS

  const handleDownloadTemplate = () => {
    downloadTemplate(headers, assetType)
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
  }

  const executeImport = async () => {
    if (!pendingFile) return
    const file = pendingFile
    setPendingFile(null)

    setLoading(true)
    try {
      const data = await readExcelFile(file)
      if (data.length === 0) {
        setResultState({ show: true, success: false, message: 'File Excel kosong atau format tidak sesuai.' })
        setLoading(false)
        return
      }

      let successCount = 0
      let errorCount = 0
      const errorDetails: string[] = []

      for (let i = 1; i < data.length; i++) {
        const row = data[i]
        const payload: Record<string, any> = {}
        headers.forEach((h, index) => {
          if (row[index] !== undefined && row[index] !== null) {
            if (h === 'quantity') {
              payload[h] = parseInt(row[index], 10)
            } else if (typeof row[index] === 'number') {
              // Convert numbers to string to avoid Prisma type errors (e.g. phone numbers, serials)
              payload[h] = String(row[index])
            } else {
              payload[h] = row[index]
            }
          }
        })

        if (categoryId) payload.category_id = categoryId

        const dateFields = ['purchase_date', 'handover_date', 'install_date', 'return_date']
        for (const field of dateFields) {
          if (payload[field]) {
             const parsed = new Date(payload[field])
             if (!isNaN(parsed.getTime())) {
               payload[field] = parsed.toISOString()
             }
          }
        }
        
        if (payload.condition) {
          payload.condition = payload.condition.replace(/ /g, '_')
        }

        try {
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          const json = await res.json()
          if (json.success) {
            successCount++
          } else {
            errorCount++
            const detailMsg = json.details ? ` (${json.details.split('\\n').pop()})` : ''
            errorDetails.push(`Baris ${i + 1}: ${json.error || 'Gagal menyimpan data'}${detailMsg}`)
          }
        } catch (e: any) {
          errorCount++
          errorDetails.push(`Baris ${i + 1}: ${e.message || 'Error jaringan'}`)
        }
      }

      setResultState({ 
        show: true, 
        success: errorCount === 0, 
        message: `Import selesai: ${successCount} berhasil, ${errorCount} gagal.`,
        errors: errorDetails
      })
      onSuccess()
    } catch (error) {
      setResultState({ show: true, success: false, message: 'Gagal membaca file Excel' })
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const closeResult = () => {
    setResultState({ show: false, success: false, message: '' })
  }

  return (
    <>
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={onFileSelect} 
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 md:mr-2" />}
            <span className="hidden md:inline">{loading ? 'Memproses...' : 'Import'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDownloadTemplate} className="cursor-pointer">
            <FileDown className="w-4 h-4 mr-2" /> Unduh Template Kosong
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" /> Unggah File Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!pendingFile} onOpenChange={(o) => {
        if (!o) {
          setPendingFile(null)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Import Data</AlertDialogTitle>
            <AlertDialogDescription>
              File "{pendingFile?.name}" akan diproses ke dalam sistem. Pastikan Anda telah menggunakan template yang benar. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeImport}>Ya, Proses Import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Result Status Dialog */}
      <AlertDialog open={resultState.show} onOpenChange={closeResult}>
        <AlertDialogContent className="flex flex-col items-center justify-center p-8 text-center sm:max-w-md">
          {resultState.success ? (
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
          ) : (
            <FileSpreadsheet className="w-20 h-20 text-blue-500 mb-4" />
          )}
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              {resultState.success ? 'Selesai!' : 'Laporan Import'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg mt-2">
              {resultState.message}
            </AlertDialogDescription>
            {resultState.errors && resultState.errors.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto text-left text-sm text-red-600 border p-2 rounded bg-red-50">
                <ul className="list-disc pl-4 space-y-1">
                  {resultState.errors.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 w-full sm:justify-center">
            <AlertDialogAction onClick={closeResult} className="w-full sm:w-auto px-8">Tutup</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
