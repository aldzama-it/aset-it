'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { Network, Printer, Camera, Laptop, Package, Radio, Tablet, Satellite, Car, Database, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const AnimatedIcon = () => {
  const [frame, setFrame] = useState(1)
  
  useEffect(() => {
    // Ambil frame terakhir dari sessionStorage (default ke 1 jika belum ada)
    const currentFrame = parseInt(sessionStorage.getItem('dashboard-icon-frame') || '1')
    setFrame(currentFrame)
    
    // Siapkan frame berikutnya untuk kunjungan dashboard selanjutnya
    const nextFrame = currentFrame < 4 ? currentFrame + 1 : 1
    sessionStorage.setItem('dashboard-icon-frame', nextFrame.toString())
  }, [])

  return (
    <img 
      src={`/animated-icon/frame-${frame}.png`} 
      alt="Animated Icon" 
      className="w-[350px] h-[350px] object-contain drop-shadow-2xl" 
    />
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [conditionData, setConditionData] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/dashboard/stats').then(r => r.json()).then(res => setStats(res.data))
    fetch('/api/dashboard/alerts').then(r => r.json()).then(res => setAlerts(res.data))
    fetch('/api/history?limit=10').then(r => r.json()).then(res => setHistory(res.data))
    
    fetch('/api/dashboard/condition-summary').then(r => r.json()).then(res => {
      if (res.success) {
        const data = Object.entries(res.data).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
        setConditionData(data.filter(d => (d as any).value > 0))
      }
    })
  }, [])

  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#f97316', '#9ca3af']

  const statCards = [
    { label: 'Jaringan', value: stats?.network, icon: Network },
    { label: 'Printer', value: stats?.printers, icon: Printer },
    { label: 'CCTV', value: stats?.cctv, icon: Camera },
    { label: 'Laptop', value: stats?.laptops, icon: Laptop },
    { label: 'HT', value: stats?.ht, icon: Radio },
    { label: 'Tablet', value: stats?.tablets, icon: Tablet },
    { label: 'Kamera', value: stats?.cameras, icon: Camera },
    { label: 'Starlink', value: stats?.starlinks, icon: Satellite },
    { label: 'Dashcam', value: stats?.dashcams, icon: Car },
    { label: 'Aksesoris', value: stats?.accessories, icon: Package },
  ]

  const total = statCards.reduce((acc, curr) => acc + (curr.value || 0), 0)

  return (
    <div className="space-y-8 pb-10">
      <Card className="bg-gradient-to-br from-[#334585] to-[#334585]/90 text-white border-transparent shadow-md overflow-hidden relative mb-6">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
        <CardContent className="p-5 md:p-6 h-full flex flex-col justify-end relative z-10">
          <p className="absolute top-5 left-5 md:top-6 md:left-6 text-white/80 text-sm md:text-base font-medium tracking-wide flex items-center gap-2" suppressHydrationWarning>
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <div className="relative z-10 mt-6 md:mt-8 w-2/3">
            <p className="text-white/90 text-lg md:text-xl font-medium mb-1">Total Aset Terdaftar</p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl md:text-6xl font-bold font-poppins tracking-tight">{total}</p>
              <p className="text-base text-white/80 font-medium">Unit</p>
            </div>
          </div>

          <div className="hidden sm:block pointer-events-none absolute right-[-40px] md:right-[-20px] top-1/2 -translate-y-1/2 z-0 opacity-100">
            <AnimatedIcon />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
        {statCards.map((s, i) => (
          <Card key={i} className="group hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/60">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted-foreground text-sm font-medium">{s.label}</p>
                <div className="p-2 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                  <s.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold font-poppins text-foreground">{s.value ?? '-'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <Card className="col-span-2 shadow-sm border-border/50 overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
            <CardTitle className="text-lg font-poppins">Aset Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(!alerts || alerts.length === 0) ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <p>Semua aset dalam kondisi baik</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">Kategori</TableHead>
                    <TableHead className="font-medium">Kode / Nama</TableHead>
                    <TableHead className="font-medium">Lokasi</TableHead>
                    <TableHead className="font-medium">Kondisi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(alerts || []).map((a: any, i: number) => (
                    <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{a.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-primary">{a.asset_code}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">{a.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{a.location}</TableCell>
                      <TableCell><ConditionBadge condition={a.condition} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 flex flex-col">
          <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
            <CardTitle className="text-lg font-poppins">Kondisi Keseluruhan</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-6 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={conditionData} 
                  cx="50%" cy="50%" 
                  innerRadius={70} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {conditionData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#1f2937', fontWeight: 500 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/50 overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
          <CardTitle className="text-lg font-poppins">Riwayat Aset Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Waktu</TableHead>
                <TableHead className="font-medium">Kategori</TableHead>
                <TableHead className="font-medium">Kode Aset</TableHead>
                <TableHead className="font-medium">Aksi</TableHead>
                <TableHead className="font-medium">Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(history || []).map(h => (
                <TableRow key={h.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(h.event_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="capitalize font-medium">{h.table_name.replace('s', '')}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground border">{h.asset_code || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal bg-background/50">
                      {h.action.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-sm truncate" title={h.notes}>
                    {h.action === 'Dipindah_Lokasi' ? `Dari ${h.from_location || '-'} ke ${h.to_location || '-'}`
                    : h.action === 'Diserahkan' ? `Dari ${h.from_employee || '-'} ke ${h.to_employee || '-'}`
                    : h.action === 'Kondisi_Berubah' ? `${h.old_condition || '-'} → ${h.new_condition}`
                    : h.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
              {(!history || history.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground bg-muted/10">
                    Belum ada riwayat aktivitas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
