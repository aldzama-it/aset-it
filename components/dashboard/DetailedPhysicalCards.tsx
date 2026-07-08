import { Card, CardContent } from '@/components/ui/card'
import { Network, Printer, Camera, Laptop, Package, Radio, Tablet, Satellite, Car } from 'lucide-react'

export function DetailedPhysicalCards({ stats }: { stats: Record<string, number> }) {
  const statCards = [
    { label: 'Jaringan', value: stats.network, icon: Network },
    { label: 'Printer', value: stats.printers, icon: Printer },
    { label: 'CCTV', value: stats.cctv, icon: Camera },
    { label: 'Laptop', value: stats.laptops, icon: Laptop },
    { label: 'HT', value: stats.ht, icon: Radio },
    { label: 'Tablet', value: stats.tablets, icon: Tablet },
    { label: 'Kamera', value: stats.cameras, icon: Camera },
    { label: 'Starlink', value: stats.starlinks, icon: Satellite },
    { label: 'Dashcam', value: stats.dashcams, icon: Car },
    { label: 'Aset Umum', value: stats.general, icon: Package },
  ]

  return (
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
              <p className="text-2xl font-bold font-poppins text-foreground">{s.value ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
