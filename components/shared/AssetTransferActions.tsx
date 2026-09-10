'use client'

import { useState } from 'react'
import { ArrowRightLeft, History } from 'lucide-react'
import type { AssetTableName, AssetTransferItem } from '@/lib/asset-transfer'
import { AssetHistoryDialog } from '@/components/shared/AssetHistoryDialog'
import { AssetTransferDialog } from '@/components/shared/AssetTransferDialog'
import { LaptopTransferModal } from '@/components/forms/LaptopTransferModal'
import { LaptopHistoryDialog } from '@/components/shared/LaptopHistoryDialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type AssetTransferActionsProps = {
  item: AssetTransferItem
  tableName: AssetTableName
  onSuccess: () => void
}

export function AssetTransferActions({ item, tableName, onSuccess }: AssetTransferActionsProps) {
  const [transferOpen, setTransferOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation()
              setTransferOpen(true)
            }}
            aria-label="Pindahkan aset"
          >
            <ArrowRightLeft className="size-4 text-amber-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Pindahkan</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation()
              setHistoryOpen(true)
            }}
            aria-label="Lihat riwayat aset"
          >
            <History className="size-4 text-slate-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Riwayat</TooltipContent>
      </Tooltip>

      {transferOpen && tableName === 'laptops' && (
        <LaptopTransferModal
          open
          onOpenChange={setTransferOpen}
          assetCode={item.asset_code || ''}
          onSuccess={onSuccess}
        />
      )}
      {transferOpen && tableName !== 'laptops' && (
        <AssetTransferDialog
          open
          onOpenChange={setTransferOpen}
          item={item}
          tableName={tableName}
          onSuccess={onSuccess}
        />
      )}
      
      {historyOpen && tableName === 'laptops' && (
        <LaptopHistoryDialog
          open
          onOpenChange={setHistoryOpen}
          assetCode={item.asset_code || ''}
        />
      )}
      {historyOpen && tableName !== 'laptops' && (
        <AssetHistoryDialog
          open
          onOpenChange={setHistoryOpen}
          item={item}
          tableName={tableName}
        />
      )}
    </>
  )
}
