'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: TablePaginationProps) {
  if (totalItems === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4 bg-white border-t rounded-b-md">
      <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
        Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} data
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap">Baris per halaman</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
          Halaman {currentPage} dari {Math.max(1, totalPages)}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Halaman pertama</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Halaman sebelumnya</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Halaman selanjutnya</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Halaman terakhir</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
