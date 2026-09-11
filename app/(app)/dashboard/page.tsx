import { prisma } from '@/lib/prisma'
import { HeroCard } from '@/components/dashboard/HeroCard'
import { DashboardCards, ExecutiveKPIs } from '@/components/dashboard/DashboardCards'
import { AssetCompositionChart, ConditionBreakdown } from '@/components/dashboard/AssetCompositionChart'
import { AssetConditionChart } from '@/components/dashboard/AssetConditionChart'
import { AssetByBranchChart } from '@/components/dashboard/AssetByBranchChart'
import { AssetGrowthChart } from '@/components/dashboard/AssetGrowthChart'
import { LatestActivity } from '@/components/dashboard/LatestActivity'
import { AlertsPanel, AlertItem } from '@/components/dashboard/AlertsPanel'
import { DigitalAssetSummary, DigitalData } from '@/components/dashboard/DigitalAssetSummary'

export const dynamic = 'force-dynamic'

// ─── Helper ──────────────────────────────────────────────────────────────────
function sumCondFromGroupBy(arr: { condition: string; _count: number }[]): Record<string, number> {
  const out: Record<string, number> = {}
  arr.forEach(c => { out[c.condition] = c._count })
  return out
}

function addToMap(target: Record<string, number>, source: Record<string, number>) {
  Object.entries(source).forEach(([k, v]) => { target[k] = (target[k] || 0) + v })
}

export default async function ExecutiveDashboardPage() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // ── Fetch all data ────────────────────────────────────────────────────────
  const [
    // Condition groupBy for physical assets
    laptopCond, tabletCond, printerCond, cctvCond, cameraCond, htCond, generalAssetCond,
    // Simple counts (no condition field for these)
    dashcamTotal, starlinkTotal, networkTotal,
    // Digital accounts
    emailActive, emailTotal, vpnActive, vpnTotal, synologyActive, synologyTotal,
    externalAppCount, adminSoftwareCount, infrastructureCount, officePhoneCount,
    // Branch/location distribution
    laptopBranch, tabletBranch, htBranch,
    printerLoc, cctvLoc, cameraLoc, starlinkLoc, networkLoc, generalAssetLoc,
    // Department
    laptopDept, tabletDept, htDept,
    // Growth (12 months)
    laptopGrowth, tabletGrowth, printerGrowth, cctvGrowth, cameraGrowth,
    htGrowth, dashcamGrowth, starlinkGrowth, networkGrowth, generalAssetGrowth,
    // This month
    thisMonthCounts,
    // Activity
    recentHistory,
    // Alerts
    alertLaptops, alertTablets, alertPrinters, alertCctvs, alertCameras, alertHts,
  ] = await Promise.all([
    // Conditions
    prisma.laptop.groupBy({ by: ['condition'], _count: true }),
    prisma.tablet.groupBy({ by: ['condition'], _count: true }),
    prisma.printer.groupBy({ by: ['condition'], _count: true }),
    prisma.cctv.groupBy({ by: ['condition'], _count: true }),
    prisma.camera.groupBy({ by: ['condition'], _count: true }),
    prisma.ht.groupBy({ by: ['condition'], _count: true }),
    prisma.generalAsset.groupBy({ by: ['condition'], _count: true }),
    // Simple
    prisma.dashcam.count(),
    prisma.starlink.count(),
    prisma.networkDevice.count(),
    // Digital
    prisma.emailAccount.count({ where: { status: 'Aktif' } }),
    prisma.emailAccount.count(),
    prisma.vpnAccount.count({ where: { status: 'Aktif' } }),
    prisma.vpnAccount.count(),
    prisma.synologyAccount.count({ where: { status: 'Aktif' } }),
    prisma.synologyAccount.count(),
    prisma.externalAppAccount.count(),
    prisma.adminSoftwareAccount.count(),
    prisma.infrastructureAccount.count(),
    prisma.officePhoneAccount.count(),
    // Branch/location
    prisma.laptop.groupBy({ by: ['branch'], _count: true, where: { branch: { not: null } } }),
    prisma.tablet.groupBy({ by: ['branch'], _count: true, where: { branch: { not: null } } }),
    prisma.ht.groupBy({ by: ['branch'], _count: true, where: { branch: { not: null } } }),
    prisma.printer.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
    prisma.cctv.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
    prisma.camera.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
    prisma.starlink.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
    prisma.networkDevice.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
    prisma.generalAsset.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
    // Department
    prisma.laptop.groupBy({ by: ['department'], _count: true, where: { department: { not: null } } }),
    prisma.tablet.groupBy({ by: ['department'], _count: true, where: { department: { not: null } } }),
    prisma.ht.groupBy({ by: ['department'], _count: true, where: { department: { not: null } } }),
    // Growth dates
    prisma.laptop.findMany({ select: { created_at: true } }),
    prisma.tablet.findMany({ select: { created_at: true } }),
    prisma.printer.findMany({ select: { created_at: true } }),
    prisma.cctv.findMany({ select: { created_at: true } }),
    prisma.camera.findMany({ select: { created_at: true } }),
    prisma.ht.findMany({ select: { created_at: true } }),
    prisma.dashcam.findMany({ select: { created_at: true } }),
    prisma.starlink.findMany({ select: { created_at: true } }),
    prisma.networkDevice.findMany({ select: { created_at: true } }),
    prisma.generalAsset.findMany({ select: { created_at: true } }),
    // This month
    Promise.all([
      prisma.laptop.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.tablet.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.printer.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.cctv.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.camera.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.ht.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.dashcam.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.starlink.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.networkDevice.count({ where: { created_at: { gte: startOfMonth } } }),
      prisma.generalAsset.count({ where: { created_at: { gte: startOfMonth } } }),
    ]),
    // Activity
    prisma.assetHistory.findMany({ take: 8, orderBy: { event_at: 'desc' } }),
    // Alerts
    prisma.laptop.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, branch: true, pic: true }, take: 8 }),
    prisma.tablet.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, branch: true, pic_name: true }, take: 8 }),
    prisma.printer.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, location: true }, take: 8 }),
    prisma.cctv.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, location: true }, take: 8 }),
    prisma.camera.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, location: true, pic: true }, take: 8 }),
    prisma.ht.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, branch: true, pic_name: true }, take: 8 }),
  ])

  // ── Compute condition breakdown ───────────────────────────────────────────
  const condMap: Record<string, number> = { Baru: 0, Baik: 0, Perlu_Servis: 0, Rusak: 0, Hilang: 0, Tidak_Aktif: 0 }
  for (const cond of [laptopCond, tabletCond, printerCond, cctvCond, cameraCond, htCond, generalAssetCond]) {
    addToMap(condMap, sumCondFromGroupBy(cond))
  }
  const conditionBreakdown: ConditionBreakdown = {
    Baru: condMap.Baru, Baik: condMap.Baik, Perlu_Servis: condMap.Perlu_Servis,
    Rusak: condMap.Rusak, Hilang: condMap.Hilang, Tidak_Aktif: condMap.Tidak_Aktif,
  }

  // ── Compute totals ────────────────────────────────────────────────────────
  const totalPhysicalWithCond = Object.values(condMap).reduce((a, b) => a + b, 0)
  const totalPhysical = totalPhysicalWithCond + dashcamTotal + starlinkTotal + networkTotal
  const totalDigital = emailTotal + vpnTotal + synologyTotal + externalAppCount + adminSoftwareCount + infrastructureCount + officePhoneCount
  const totalDamaged = condMap.Rusak
  const totalNeedService = condMap.Perlu_Servis
  const thisMonthCount = (await thisMonthCounts).reduce((a, b) => a + b, 0)

  // Health score (% of assets in Baru+Baik vs all assets with condition)
  const totalGood = condMap.Baru + condMap.Baik
  const healthScore = totalPhysicalWithCond > 0
    ? Math.min(Math.round((totalGood / totalPhysicalWithCond) * 100), 100)
    : 0

  // ── KPI data ──────────────────────────────────────────────────────────────
  const kpiData: ExecutiveKPIs = { totalPhysical, totalDigital, totalDamaged, totalNeedService, thisMonthCount, healthScore }

  // ── Per-category condition for stacked bar ────────────────────────────────
  const toMap = (arr: { condition: string; _count: number }[]) => {
    const m: Record<string, number> = {}
    arr.forEach(c => { m[c.condition] = c._count })
    return m
  }
  const perCategoryCondition = [
    { name: 'Laptop', ...toMap(laptopCond) },
    { name: 'Tablet', ...toMap(tabletCond) },
    { name: 'Printer', ...toMap(printerCond) },
    { name: 'CCTV', ...toMap(cctvCond) },
    { name: 'Kamera', ...toMap(cameraCond) },
    { name: 'HT', ...toMap(htCond) },
  ].filter(d => Object.values(d).some((v, i) => i > 0 && typeof v === 'number' && v > 0))

  // ── Branch distribution ───────────────────────────────────────────────────
  const branchMap: Record<string, number> = {}
  const mapToLoc = (arr: any[], field: string) => arr.forEach((r: any) => {
    const k = r[field]; if (k) branchMap[k] = (branchMap[k] || 0) + r._count
  })
  mapToLoc(laptopBranch, 'branch'); mapToLoc(tabletBranch, 'branch'); mapToLoc(htBranch, 'branch')
  mapToLoc(printerLoc, 'location'); mapToLoc(cctvLoc, 'location'); mapToLoc(cameraLoc, 'location')
  mapToLoc(starlinkLoc, 'location'); mapToLoc(networkLoc, 'location'); mapToLoc(generalAssetLoc, 'location')
  const branchData = Object.entries(branchMap).map(([branch, count]) => ({ branch, count }))
    .sort((a, b) => b.count - a.count).slice(0, 8)

  // ── Growth (last 12 months) ────────────────────────────────────────────────
  const allDates = [
    ...laptopGrowth, ...tabletGrowth, ...printerGrowth, ...cctvGrowth, ...cameraGrowth,
    ...htGrowth, ...dashcamGrowth, ...starlinkGrowth, ...networkGrowth, ...generalAssetGrowth,
  ].map(d => d.created_at)
  const twelveAgo = new Date(now); twelveAgo.setMonth(twelveAgo.getMonth() - 11); twelveAgo.setDate(1); twelveAgo.setHours(0,0,0,0)
  const gMap: Record<string, number> = {}
  allDates.forEach(d => {
    if (d >= twelveAgo) {
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
      gMap[key] = (gMap[key] || 0) + 1
    }
  })
  const growthData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const label = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' })
    return { month: key, label, count: gMap[key] || 0 }
  })

  // ── Alert items ───────────────────────────────────────────────────────────
  const alerts: AlertItem[] = [
    ...alertLaptops.map(a => ({ id: a.id, asset_code: a.asset_code, condition: a.condition as string, category: 'Laptop', location: a.branch || '-', name: a.pic || '-', href: '/laptops' })),
    ...alertTablets.map(a => ({ id: a.id, asset_code: a.asset_code, condition: a.condition as string, category: 'Tablet', location: (a as any).branch || '-', name: (a as any).pic_name || '-', href: '/tablets' })),
    ...alertPrinters.map(a => ({ id: a.id, asset_code: a.asset_code, condition: a.condition as string, category: 'Printer', location: (a as any).location || '-', name: a.asset_code || '-', href: '/printers' })),
    ...alertCctvs.map(a => ({ id: a.id, asset_code: a.asset_code, condition: a.condition as string, category: 'CCTV', location: (a as any).location || '-', name: a.asset_code || '-', href: '/cctv' })),
    ...alertCameras.map(a => ({ id: a.id, asset_code: a.asset_code, condition: a.condition as string, category: 'Kamera', location: (a as any).location || '-', name: (a as any).pic || '-', href: '/cameras' })),
    ...alertHts.map(a => ({ id: a.id, asset_code: a.asset_code, condition: a.condition as string, category: 'HT', location: (a as any).branch || '-', name: (a as any).pic_name || '-', href: '/ht' })),
  ].sort((a, b) => {
    if (a.condition === 'Rusak' && b.condition !== 'Rusak') return -1
    if (a.condition !== 'Rusak' && b.condition === 'Rusak') return 1
    return 0
  }).slice(0, 12)

  // ── Digital summary ───────────────────────────────────────────────────────
  const digitalData: DigitalData = {
    email: { active: emailActive, total: emailTotal },
    vpn: { active: vpnActive, total: vpnTotal },
    synology: { active: synologyActive, total: synologyTotal },
    externalApp: externalAppCount,
    adminSoftware: adminSoftwareCount,
    infrastructure: infrastructureCount,
    officePhone: officePhoneCount,
  }

  // ── Section wrapper (used multiple times) ─────────────────────────────────
  const Panel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-[#111827]/80 border border-white/[0.07] rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  )

  const SectionTitle = ({ title, sub }: { title: string; sub?: string }) => (
    <div className="mb-4">
      <h2 className="text-white/90 font-semibold text-sm tracking-wide">{title}</h2>
      {sub && <p className="text-white/35 text-[11px] mt-0.5">{sub}</p>}
    </div>
  )

  return (
    <div className="flex-1 w-full overflow-y-auto bg-[#0A0F1E] text-white">
      <div className="p-4 md:p-6 pb-20 space-y-4 max-w-[1600px] mx-auto">

        {/* ── ROW 1: Hero ─────────────────────────────────────────────────── */}
        <HeroCard
          totalPhysical={totalPhysical}
          totalDigital={totalDigital}
          healthScore={healthScore}
          thisMonthCount={thisMonthCount}
        />

        {/* ── ROW 2: KPI Cards ─────────────────────────────────────────────── */}
        <DashboardCards data={kpiData} />

        {/* ── ROW 3: Condition Donut | Digital Summary ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Condition breakdown donut */}
          <Panel className="p-5">
            <SectionTitle
              title="Kondisi Aset Fisik"
              sub="Distribusi status kondisi seluruh aset hardware"
            />
            <div className="h-[280px]">
              <AssetCompositionChart data={conditionBreakdown} />
            </div>
          </Panel>

          {/* Digital account summary */}
          <Panel className="p-5">
            <SectionTitle
              title="Ringkasan Aset Digital"
              sub="Jumlah akun & lisensi digital yang dikelola IT"
            />
            <DigitalAssetSummary data={digitalData} />
          </Panel>
        </div>

        {/* ── ROW 4: Per-Category Condition Stacked Bar (full width) ────────── */}
        <Panel className="p-5">
          <SectionTitle
            title="Kondisi per Kategori Aset"
            sub="Breakdown kondisi detail — identifikasi kategori mana yang paling bermasalah"
          />
          <div className="h-[280px]">
            <AssetConditionChart data={perCategoryCondition} />
          </div>
        </Panel>

        {/* ── ROW 5: Branch Distribution | Growth Chart ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel className="p-5">
            <SectionTitle
              title="Distribusi Aset per Cabang / Lokasi"
              sub="Top 8 lokasi berdasarkan volume aset"
            />
            <div className="h-[280px]">
              <AssetByBranchChart data={branchData} />
            </div>
          </Panel>

          <Panel className="p-5">
            <SectionTitle
              title="Tren Penambahan Aset"
              sub="Jumlah aset baru per bulan · 12 bulan terakhir"
            />
            <div className="h-[280px]">
              <AssetGrowthChart data={growthData} />
            </div>
          </Panel>
        </div>

        {/* ── ROW 6: Alerts | Activity ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Alerts */}
          <Panel className="p-5 flex flex-col">
            <SectionTitle
              title="⚠️ Aset yang Membutuhkan Perhatian"
              sub="Segera ditindaklanjuti oleh tim IT"
            />
            <div className="flex-1">
              <AlertsPanel alerts={alerts} totalDamaged={totalDamaged} totalNeedService={totalNeedService} />
            </div>
          </Panel>

          {/* Activity timeline */}
          <Panel className="p-5">
            <SectionTitle
              title="Aktivitas Aset Terbaru"
              sub="Log pergerakan & perubahan aset"
            />
            <LatestActivity history={recentHistory} />
          </Panel>
        </div>

      </div>
    </div>
  )
}
