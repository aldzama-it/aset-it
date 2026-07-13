import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function LatestActivity({ history }: { history: any[] }) {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'Dibuat': return 'bg-blue-100 text-blue-800'
      case 'Diperbarui': return 'bg-yellow-100 text-yellow-800'
      case 'Dihapus': return 'bg-red-100 text-red-800'
      case 'Dipindah_Lokasi': return 'bg-purple-100 text-purple-800'
      case 'Diserahkan': return 'bg-green-100 text-green-800'
      case 'Dikembalikan': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2 shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Latest Asset Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No recent activity</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h, i) => (
                <TableRow key={i}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(h.event_at).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {h.asset_code || '-'} <span className="text-muted-foreground font-normal text-xs ml-1">({h.table_name})</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getActionColor(h.action)} border-0 font-medium`}>
                      {h.action.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{h.changed_by || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{h.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
