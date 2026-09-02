import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatBytes, UNKNOWN_LABEL, type TopUserRow } from '@/lib/network-analyzer-shared'

export function TopUsersTable({ data, query }: { data: TopUserRow[] | null; query: string }) {
  const rows = data ?? []

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Pengguna dengan Pemakaian Tertinggi</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
            Tidak ada data pada periode ini
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Download</TableHead>
                <TableHead className="text-right">Upload</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => {
                const name = row.employee_name ?? UNKNOWN_LABEL

                return (
                  <TableRow key={`${row.employee_id ?? 'unknown'}-${i}`}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      {/*
                        employee_id null artinya trafik itu tidak terkait ke
                        karyawan mana pun -- tidak ada halaman untuk dituju.
                      */}
                      {row.employee_id === null ? (
                        <span className="text-muted-foreground">{name}</span>
                      ) : (
                        <Link
                          href={`/network-analyzer/users/${row.employee_id}?${query}`}
                          className="text-primary hover:underline"
                        >
                          {name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.hotspot_username ?? '-'}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatBytes(row.bytes_down)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatBytes(row.bytes_up)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatBytes(row.bytes_total)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
