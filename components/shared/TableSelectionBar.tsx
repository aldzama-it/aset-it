import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, X, Download } from 'lucide-react'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { motion, AnimatePresence } from 'framer-motion'

interface TableSelectionBarProps {
  selectedCount: number
  onClear: () => void
  onDelete: () => void
  onExport: () => void
}

export function TableSelectionBar({ selectedCount, onClear, onDelete, onExport }: TableSelectionBarProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-t-md p-3 flex items-center justify-between border-b-0">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-blue-100">
                  <X className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-blue-900">
                  {selectedCount} data dipilih
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onExport} className="h-8 text-blue-700 border-blue-300 hover:bg-blue-100">
                  <Download className="w-4 h-4 mr-2" />
                  Export Terpilih
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="h-8">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Terpilih
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <DeleteConfirmDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        onConfirm={() => {
          onDelete()
          setDeleteOpen(false)
        }} 
        itemName={`${selectedCount} data yang dipilih`} 
      />
    </>
  )
}

