import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownToLine, ArrowUpFromLine, Activity, Globe, HelpCircle, Users, Gauge } from 'lucide-react'
import { formatBytes, formatNumber, type AnalyzerSummary } from '@/lib/network-analyzer-shared'

/**
 * `unmapped_bytes` selalu ikut ditampilkan.
 *
 * Analyzer sengaja tidak menebak trafik yang tidak bisa dikaitkan ke aplikasi
 * (DNS-over-HTTPS, koneksi langsung ke IP). Menyembunyikannya di sini akan
 * membuat total terlihat lebih "terjelaskan" daripada kenyataannya.
 */
export function AnalyzerSummaryCards({
  data,
  // Di halaman satu karyawan, "pengguna aktif" hanya bisa bernilai 0 atau 1
  // dan terbaca seperti kesalahan. Dihilangkan di sana, bukan dijelaskan.
  showActiveUsers = true,
}: {
  data: AnalyzerSummary | null
  showActiveUsers?: boolean
}) {
  if (!data) {
    return (
      <Card className="shadow-sm border-border/50">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Ringkasan tidak tersedia.
        </CardContent>
      </Card>
    )
  }

  const unmappedShare = data.bytes_total > 0 ? (data.unmapped_bytes / data.bytes_total) * 100 : 0

  const cards = [
    ...(showActiveUsers
      ? [{ label: 'Pengguna Aktif', value: formatNumber(data.active_users), icon: Users, color: 'text-blue-500' }]
      : []),
    { label: 'Total Trafik', value: formatBytes(data.bytes_total), icon: Activity, color: 'text-indigo-500' },
    { label: 'Download', value: formatBytes(data.bytes_down), icon: ArrowDownToLine, color: 'text-green-500' },
    { label: 'Upload', value: formatBytes(data.bytes_up), icon: ArrowUpFromLine, color: 'text-orange-500' },
    { label: 'Domain Unik', value: formatNumber(data.unique_domains), icon: Globe, color: 'text-purple-500' },
    { label: 'Jumlah Flow', value: formatNumber(data.flow_count), icon: Gauge, color: 'text-cyan-500' },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold font-poppins">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-3 py-4">
          <HelpCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1 min-w-[220px]">
            <div className="text-sm font-semibold text-amber-900">Trafik Tidak Teridentifikasi</div>
            <p className="text-xs text-amber-800/80">
              Trafik yang terhubung ke pengguna tapi tidak ke aplikasi mana pun — misalnya
              DNS-over-HTTPS atau koneksi langsung ke alamat IP. Angka ini tidak ditebak.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-amber-900 font-poppins">{formatBytes(data.unmapped_bytes)}</div>
            <div className="text-xs text-amber-800/80">
              {unmappedShare.toLocaleString('id-ID', { maximumFractionDigits: 1 })}% dari total
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
