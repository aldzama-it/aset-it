import { Card, CardContent } from '@/components/ui/card'
import { PlugZap } from 'lucide-react'

/**
 * Ditampilkan saat analyzer sama sekali tidak menjawab.
 *
 * Pesannya menyebut URL dan penyebab yang paling sering, karena kegagalan di
 * sini hampir selalu soal konfigurasi (token belum dipasang di server, atau
 * layanannya mati) dan bukan sesuatu yang bisa diperbaiki dengan me-reload.
 */
export function AnalyzerErrorState({ message, url }: { message: string; url: string }) {
  return (
    <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <PlugZap className="h-10 w-10 text-destructive/70" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Tidak bisa menghubungi Network Analyzer</h3>
          <p className="max-w-xl text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="rounded-md bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground">{url}</div>
        <p className="max-w-xl text-xs text-muted-foreground">
          Periksa layanan di alamat tersebut, lalu pastikan <code>NETWORK_ANALYZER_TOKEN</code> di
          aplikasi ini sama dengan <code>INTEGRATION_API_TOKEN</code> pada analyzer.
        </p>
      </CardContent>
    </Card>
  )
}
