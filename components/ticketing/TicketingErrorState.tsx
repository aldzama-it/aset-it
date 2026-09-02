import { PlugZap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function TicketingErrorState({ message, url }: { message: string; url: string }) {
  return (
    <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <PlugZap className="h-10 w-10 text-destructive/70" />
        <div className="space-y-1"><h2 className="font-semibold">Data Ticketing belum tersedia</h2><p className="max-w-xl text-sm text-muted-foreground">{message}</p></div>
        <code className="rounded-md bg-background px-3 py-1.5 text-xs text-muted-foreground">{url}</code>
        <p className="max-w-xl text-xs text-muted-foreground">Periksa layanan Ticketing dan kecocokan token integrasi di kedua aplikasi.</p>
      </CardContent>
    </Card>
  )
}
