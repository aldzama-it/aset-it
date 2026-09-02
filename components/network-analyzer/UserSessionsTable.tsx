import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { HotspotSessionRow } from '@/lib/network-analyzer-shared'

export function UserSessionsTable({ data }: { data: HotspotSessionRow[] | null }) {
  const rows = data ?? []

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Sesi Hotspot Terakhir</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
            Belum ada sesi tercatat
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mulai</TableHead>
                  <TableHead>Selesai</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>MAC</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap">{formatMoment(row.started_at)}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {row.ended_at ? formatMoment(row.ended_at) : 'Masih aktif'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.ip_address ?? '-'}</TableCell>
                    <TableCell className="font-mono text-xs">{row.mac_address ?? '-'}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>{row.status ?? '-'}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatMoment(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
