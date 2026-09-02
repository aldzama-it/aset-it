'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatBytes, type AnalyzerMeta, type TrendPoint } from '@/lib/network-analyzer-shared'

/**
 * Bertumpuk teridentifikasi vs tidak, bukan satu garis total.
 *
 * Kalau korelasi DNS berhenti bekerja, total tetap terlihat normal sementara
 * seluruh trafik diam-diam pindah ke bagian "tidak teridentifikasi". Bentuk
 * bertumpuk membuat kegagalan itu terlihat.
 */
export function UsageTrendChart({
  data,
  meta,
  title = 'Tren Pemakaian',
}: {
  data: TrendPoint[] | null
  meta: AnalyzerMeta | null
  title?: string
}) {
  /*
   * Endpoint tren per-user tidak mengirim meta, jadi resolusinya dibaca dari
   * bentuk bucket-nya: usage_daily menghasilkan tanggal polos, usage_hourly
   * menghasilkan timestamp. Menebak "harian" untuk keduanya akan menumpuk 24
   * batang pada label tanggal yang sama.
   */
  const hourly = meta
    ? meta.resolution === 'hourly'
    : (data?.[0]?.bucket?.length ?? 0) > 10

  const rows = (data ?? []).map((point) => ({
    label: formatBucket(point.bucket, hourly),
    Teridentifikasi: point.bytes_attributed,
    'Tidak Teridentifikasi': point.bytes_unmapped,
  }))

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {rows.length > 0 && (
          <span className="text-xs text-muted-foreground">
            Resolusi {hourly ? 'per jam' : 'per hari'}
          </span>
        )}
      </CardHeader>
      <CardContent className="h-[300px]">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Tidak ada data pada periode ini
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={rows} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={70}
                tickFormatter={(value: number) => formatBytes(value)}
              />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                formatter={(value) => formatBytes(Number(value))}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={30} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Teridentifikasi" stackId="usage" fill="#3b82f6" maxBarSize={40} />
              <Bar dataKey="Tidak Teridentifikasi" stackId="usage" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

function formatBucket(bucket: string, hourly: boolean): string {
  const date = new Date(bucket)
  if (Number.isNaN(date.getTime())) return bucket

  return hourly
    ? date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}
