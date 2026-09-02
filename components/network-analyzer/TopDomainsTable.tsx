import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatBytes, formatNumber, UNKNOWN_LABEL, type DomainRow } from '@/lib/network-analyzer-shared'

export function TopDomainsTable({ data }: { data: DomainRow[] | null }) {
  const rows = data ?? []

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Domain Teratas</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
            Tidak ada domain tercatat pada periode ini
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Kejadian</TableHead>
                <TableHead className="text-right">Trafik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={`${row.domain_name ?? 'unknown'}-${i}`}>
                  <TableCell className="font-mono text-xs">{row.domain_name ?? UNKNOWN_LABEL}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatNumber(row.event_count)}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatBytes(row.bytes_total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
