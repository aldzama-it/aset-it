'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ANALYZER_PRESETS, type AnalyzerPreset, type AnalyzerRange } from '@/lib/network-analyzer-shared'

const PRESETS = Object.entries(ANALYZER_PRESETS) as [AnalyzerPreset, string][]

/**
 * Periode ditulis ke URL, bukan ke state lokal: halaman ini server component,
 * jadi query string yang berubah adalah satu-satunya hal yang membuatnya
 * mengambil angka baru. Efek sampingnya rentang bisa di-bookmark dan dibagikan.
 */
export function AnalyzerFilterBar({ range, basePath }: { range: AnalyzerRange; basePath: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [from, setFrom] = useState(range.date_from)
  const [to, setTo] = useState(range.date_to)

  const push = (params: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString())
    for (const key of ['preset', 'date_from', 'date_to']) next.delete(key)
    for (const [key, value] of Object.entries(params)) next.set(key, value)
    router.push(`${basePath}?${next.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {PRESETS.map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={range.preset === key ? 'default' : 'outline'}
            onClick={() => push({ preset: key })}
            className={cn('h-8', range.preset === key && 'shadow-sm')}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <Input
          type="date"
          value={from}
          max={to}
          onChange={(e) => setFrom(e.target.value)}
          className="h-8 w-[150px]"
          aria-label="Tanggal mulai"
        />
        <span className="text-muted-foreground text-sm">s/d</span>
        <Input
          type="date"
          value={to}
          min={from}
          onChange={(e) => setTo(e.target.value)}
          className="h-8 w-[150px]"
          aria-label="Tanggal akhir"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          disabled={!from || !to || from > to}
          onClick={() => push({ date_from: from, date_to: to })}
        >
          Terapkan
        </Button>
      </div>
    </div>
  )
}
