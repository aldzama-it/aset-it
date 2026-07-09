import { prisma } from '@/lib/prisma'
import { HeroCard } from '@/components/dashboard/HeroCard'
import { DashboardCards } from '@/components/dashboard/DashboardCards'
import { AssetCompositionChart } from '@/components/dashboard/AssetCompositionChart'
import { AssetConditionChart } from '@/components/dashboard/AssetConditionChart'
import { AssetByBranchChart } from '@/components/dashboard/AssetByBranchChart'
import { AssetByDepartmentChart } from '@/components/dashboard/AssetByDepartmentChart'
import { DetailedPhysicalCards } from '@/components/dashboard/DetailedPhysicalCards'
import { AssetGrowthChart } from '@/components/dashboard/AssetGrowthChart'
import { LatestActivity } from '@/components/dashboard/LatestActivity'

export const dynamic = 'force-dynamic' // Ensure fresh data on every load

export default async function ExecutiveDashboardPage() {
  // Execute all Prisma queries concurrently
  const [
    laptops, tablets, printers, cctvs, cameras, hts, dashcams, starlinks, networks, generalAssets,
    emails, vpns, synologys, extApps, adminSoftwares, infrastructures, officePhones,
    users,
    recentHistory
  ] = await Promise.all([
    // Physical Assets
    prisma.laptop.findMany({ select: { branch: true, department: true, condition: true, created_at: true, pic: true } }),
    prisma.tablet.findMany({ select: { branch: true, department: true, condition: true, created_at: true, pic_name: true } }),
    prisma.printer.findMany({ select: { location: true, condition: true, created_at: true } }),
    prisma.cctv.findMany({ select: { location: true, condition: true, created_at: true } }),
    prisma.camera.findMany({ select: { location: true, condition: true, created_at: true, pic: true } }),
    prisma.ht.findMany({ select: { branch: true, department: true, condition: true, created_at: true, pic_name: true } }),
    prisma.dashcam.findMany({ select: { location: true, created_at: true } }),
    prisma.starlink.findMany({ select: { location: true, created_at: true } }),
    prisma.networkDevice.findMany({ select: { location: true, created_at: true } }),
    prisma.generalAsset.findMany({ select: { location: true, condition: true, created_at: true, pic: true } }),
    
    // Digital Assets (Counts only for performance)
    prisma.emailAccount.count({ where: { status: 'Aktif' } }),
    prisma.vpnAccount.count(),
    prisma.synologyAccount.count(),
    prisma.externalAppAccount.count(),
    prisma.adminSoftwareAccount.count(),
    prisma.infrastructureAccount.count(),
    prisma.officePhoneAccount.count(),

    // Core
    prisma.user.count(),
    prisma.assetHistory.findMany({ take: 10, orderBy: { event_at: 'desc' } })
  ])

  // 1. Group Physical Data for Aggregation
  const physicalData = [
    { type: 'Laptop', data: laptops },
    { type: 'Tablet', data: tablets },
    { type: 'Printer', data: printers },
    { type: 'CCTV', data: cctvs },
    { type: 'Camera', data: cameras },
    { type: 'HT', data: hts },
    { type: 'Dashcam', data: dashcams },
    { type: 'Starlink', data: starlinks },
    { type: 'Network Device', data: networks },
    { type: 'General Asset', data: generalAssets }
  ]

  // 2. Compute KPIs
  const totalPhysical = physicalData.reduce((acc, curr) => acc + curr.data.length, 0)
  const totalDigital = emails + vpns + synologys + extApps + adminSoftwares + infrastructures + officePhones
  let totalDamaged = 0
  physicalData.forEach(p => {
    totalDamaged += p.data.filter((d: any) => d.condition === 'Rusak').length
  })

  const kpiData = {
    totalPhysical,
    totalDigital,
    totalDamaged,
    totalActiveEmail: emails,
    totalVpn: vpns,
    totalSoftware: adminSoftwares
  }

  // 3. Asset Composition
  const compositionData = physicalData.map(p => ({
    name: p.type,
    value: p.data.length
  }))

  // 4. Asset Condition
  const conditionDataMap: any = {}
  physicalData.forEach(p => {
    const counts = { Baru: 0, Baik: 0, Perlu_Servis: 0, Rusak: 0, Hilang: 0, Tidak_Aktif: 0 }
    p.data.forEach((d: any) => {
      if (d.condition && counts[d.condition as keyof typeof counts] !== undefined) {
        counts[d.condition as keyof typeof counts]++
      }
    })
    conditionDataMap[p.type] = { name: p.type, ...counts }
  })
  const conditionData = Object.values(conditionDataMap)

  // 5. Asset By Branch / Location
  const branchMap: Record<string, number> = {}
  physicalData.forEach(p => {
    p.data.forEach((d: any) => {
      const loc = d.branch || d.location
      if (loc) branchMap[loc] = (branchMap[loc] || 0) + 1
    })
  })
  const branchData = Object.entries(branchMap).map(([branch, count]) => ({ branch, count }))

  // 6. Asset By Department
  const deptMap: Record<string, number> = {}
  physicalData.forEach(p => {
    p.data.forEach((d: any) => {
      if (d.department) deptMap[d.department] = (deptMap[d.department] || 0) + 1
    })
  })
  const deptData = Object.entries(deptMap).map(([department, count]) => ({ department, count }))

  // 7. Detailed Physical Asset Stats
  const detailedStats = {
    network: networks.length,
    printers: printers.length,
    cctv: cctvs.length,
    laptops: laptops.length,
    ht: hts.length,
    tablets: tablets.length,
    cameras: cameras.length,
    starlinks: starlinks.length,
    dashcams: dashcams.length,
    general: generalAssets.length
  }

  // 8. Asset Growth Trend (Cumulative)
  const growthMap: Record<string, number> = {}
  physicalData.forEach(p => {
    p.data.forEach((d: any) => {
      if (d.created_at) {
        const date = new Date(d.created_at)
        const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
        growthMap[monthYear] = (growthMap[monthYear] || 0) + 1
      }
    })
  })

  const sortedMonths = Object.keys(growthMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  let cumulative = 0
  const growthData = sortedMonths.map(month => {
    cumulative += growthMap[month]
    return { month, count: cumulative }
  })

  return (
    <div className="flex-1 w-full p-4 md:p-6 pb-20 space-y-6 bg-slate-50/30 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <HeroCard total={totalPhysical + totalDigital} />
      <DashboardCards data={kpiData} />
      <DetailedPhysicalCards stats={detailedStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetCompositionChart data={compositionData} />
        <AssetConditionChart data={conditionData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AssetByBranchChart data={branchData} />
        <AssetByDepartmentChart data={deptData} />
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        <AssetGrowthChart data={growthData} />
      </div>

      <div className="mt-6">
        <LatestActivity history={recentHistory} />
      </div>
    </div>
  )
}
