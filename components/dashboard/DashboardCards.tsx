import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Server, MonitorSmartphone, AlertTriangle, Mail, ShieldAlert, Users } from 'lucide-react'

export interface DashboardKPIs {
  totalPhysical: number
  totalDigital: number
  totalDamaged: number
  totalActiveEmail: number
  totalVpn: number
  totalUsers: number
}

export function DashboardCards({ data }: { data: DashboardKPIs }) {
  const cards = [
    { label: 'Total Physical Asset', value: data.totalPhysical, icon: MonitorSmartphone, color: 'text-blue-500' },
    { label: 'Total Digital Asset', value: data.totalDigital, icon: Server, color: 'text-indigo-500' },
    { label: 'Damaged Asset', value: data.totalDamaged, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Active Emails', value: data.totalActiveEmail, icon: Mail, color: 'text-green-500' },
    { label: 'VPN Users', value: data.totalVpn, icon: ShieldAlert, color: 'text-purple-500' },
    { label: 'Admin Users', value: data.totalUsers, icon: Users, color: 'text-orange-500' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
      {cards.map((card, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-poppins">{card.value.toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
