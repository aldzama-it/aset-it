import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Helper to count conditions from a groupBy result
function sumConditions(counts: { condition: string; _count: number }[], target: string[]): number {
  return counts.filter(c => target.includes(c.condition)).reduce((a, c) => a + c._count, 0)
}

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // ── 1. Raw condition groupBy for all physical models ─────────────────────
    const [
      laptopCond, tabletCond, printerCond, cctvCond, cameraCond,
      htCond, generalAssetCond,
      // Simple counts (no condition enum)
      dashcamCount, starlinkCount, networkCount,
      // Digital accounts
      emailActive, emailTotal,
      vpnActive, vpnTotal,
      synologyActive, synologyTotal,
      externalAppCount, adminSoftwareCount, infrastructureCount, officePhoneCount,
      // Branch distribution
      laptopBranch, tabletBranch, htBranch,
      laptopLoc, printerLoc, cctvLoc, cameraLoc, starlinkLoc, networkLoc, generalAssetLoc,
      // Department distribution
      laptopDept, tabletDept, htDept,
      // Growth data
      laptopGrowth, tabletGrowth, printerGrowth, cctvGrowth, cameraGrowth,
      htGrowth, dashcamGrowth, starlinkGrowth, networkGrowth, generalAssetGrowth,
      // This month new assets
      thisMonthPhysical,
      // Recent activity
      recentActivity,
      // Alert items
      alertLaptops, alertTablets, alertPrinters, alertCctvs, alertCameras, alertHts,
    ] = await Promise.all([
      // Condition groupBy
      prisma.laptop.groupBy({ by: ['condition'], _count: true }),
      prisma.tablet.groupBy({ by: ['condition'], _count: true }),
      prisma.printer.groupBy({ by: ['condition'], _count: true }),
      prisma.cctv.groupBy({ by: ['condition'], _count: true }),
      prisma.camera.groupBy({ by: ['condition'], _count: true }),
      prisma.ht.groupBy({ by: ['condition'], _count: true }),
      prisma.generalAsset.groupBy({ by: ['condition'], _count: true }),
      // Simple counts
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
      // Branch (using branch field)
      prisma.laptop.groupBy({ by: ['branch'], _count: true, where: { branch: { not: null } } }),
      prisma.tablet.groupBy({ by: ['branch'], _count: true, where: { branch: { not: null } } }),
      prisma.ht.groupBy({ by: ['branch'], _count: true, where: { branch: { not: null } } }),
      // Branch (using location field)
      prisma.laptop.groupBy({ by: ['branch'], _count: true, where: { branch: { not: null } } }),
      prisma.printer.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
      prisma.cctv.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
      prisma.camera.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
      prisma.starlink.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
      prisma.networkDevice.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
      prisma.generalAsset.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
      // Department
      prisma.laptop.groupBy({ by: ['department'], _count: true, where: { department: { not: null } } }),
      prisma.tablet.groupBy({ by: ['department'], _count: true, where: { department: { not: null } } }),
      prisma.ht.groupBy({ by: ['division'], _count: true, where: { division: { not: null } } }),
      // Growth (created_at)
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
      // This month new physical assets
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
      // Recent activity
      prisma.assetHistory.findMany({ take: 8, orderBy: { event_at: 'desc' } }),
      // Alert items - assets needing attention
      prisma.laptop.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, branch: true, pic: true }, take: 10 }),
      prisma.tablet.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, branch: true, pic_name: true }, take: 10 }),
      prisma.printer.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, location: true }, take: 10 }),
      prisma.cctv.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, location: true }, take: 10 }),
      prisma.camera.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, location: true, pic: true }, take: 10 }),
      prisma.ht.findMany({ where: { condition: { in: ['Rusak', 'Perlu_Servis'] } }, select: { id: true, asset_code: true, condition: true, branch: true, pic_name: true }, take: 10 }),
    ])

    // ── 2. Compute condition totals ──────────────────────────────────────────
    const GOOD = ['Baru', 'Baik']
    const ATTENTION = ['Perlu_Servis']
    const BAD = ['Rusak', 'Hilang', 'Tidak_Aktif']

    const physicalConditions = [laptopCond, tabletCond, printerCond, cctvCond, cameraCond, htCond, generalAssetCond]

    const conditionBreakdown: Record<string, number> = {
      Baru: 0, Baik: 0, Perlu_Servis: 0, Rusak: 0, Hilang: 0, Tidak_Aktif: 0
    }

    for (const modelConds of physicalConditions) {
      for (const c of modelConds) {
        const key = c.condition as string
        if (key in conditionBreakdown) conditionBreakdown[key] += c._count
      }
    }

    const totalWithCondition = Object.values(conditionBreakdown).reduce((a, b) => a + b, 0)
      + dashcamCount + starlinkCount + networkCount
    const totalGoodCondition = conditionBreakdown.Baru + conditionBreakdown.Baik
    const healthScore = totalWithCondition > 0
      ? Math.round((totalGoodCondition / (totalWithCondition - dashcamCount - starlinkCount - networkCount)) * 100)
      : 0

    // ── 3. Per-category condition (for stacked bar chart) ────────────────────
    const toCondMap = (arr: { condition: string; _count: number }[]) => {
      const m: Record<string, number> = {}
      arr.forEach(c => { m[c.condition] = c._count })
      return m
    }
    const perCategoryCondition = [
      { name: 'Laptop', ...toCondMap(laptopCond) },
      { name: 'Tablet', ...toCondMap(tabletCond) },
      { name: 'Printer', ...toCondMap(printerCond) },
      { name: 'CCTV', ...toCondMap(cctvCond) },
      { name: 'Kamera', ...toCondMap(cameraCond) },
      { name: 'HT', ...toCondMap(htCond) },
    ]

    // ── 4. Compute totals ────────────────────────────────────────────────────
    const totalLaptops = laptopCond.reduce((a, c) => a + c._count, 0)
    const totalTablets = tabletCond.reduce((a, c) => a + c._count, 0)
    const totalPrinters = printerCond.reduce((a, c) => a + c._count, 0)
    const totalCctv = cctvCond.reduce((a, c) => a + c._count, 0)
    const totalCameras = cameraCond.reduce((a, c) => a + c._count, 0)
    const totalHt = htCond.reduce((a, c) => a + c._count, 0)
    const totalGeneralAsset = generalAssetCond.reduce((a, c) => a + c._count, 0)

    const totalPhysical = totalLaptops + totalTablets + totalPrinters + totalCctv +
      totalCameras + totalHt + dashcamCount + starlinkCount + networkCount + totalGeneralAsset

    const totalDigital = emailTotal + vpnTotal + synologyTotal + externalAppCount +
      adminSoftwareCount + infrastructureCount + officePhoneCount

    const totalDamaged = conditionBreakdown.Rusak
    const totalNeedService = conditionBreakdown.Perlu_Servis
    const thisMonthCount = (await thisMonthPhysical).reduce((a, b) => a + b, 0)

    // ── 5. Branch distribution ───────────────────────────────────────────────
    const branchMap: Record<string, number> = {}
    const addToMap = (arr: { branch?: string | null; location?: string | null; _count: number }[], field: 'branch' | 'location') => {
      arr.forEach(item => {
        const key = item[field]
        if (key) branchMap[key] = (branchMap[key] || 0) + item._count
      })
    }
    addToMap(laptopBranch as any, 'branch')
    addToMap(tabletBranch as any, 'branch')
    addToMap(htBranch as any, 'branch')
    addToMap(printerLoc as any, 'location')
    addToMap(cctvLoc as any, 'location')
    addToMap(cameraLoc as any, 'location')
    addToMap(starlinkLoc as any, 'location')
    addToMap(networkLoc as any, 'location')
    addToMap(generalAssetLoc as any, 'location')
    const branchData = Object.entries(branchMap)
      .map(([branch, count]) => ({ branch, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    // ── 6. Department distribution ───────────────────────────────────────────
    const deptMap: Record<string, number> = {}
    ;[laptopDept, tabletDept, htDept].forEach(arr => {
      arr.forEach((item: any) => {
        const key = item.department || item.division
        if (key) deptMap[key] = (deptMap[key] || 0) + item._count
      })
    })
    const deptData = Object.entries(deptMap)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    // ── 7. Growth trend (last 12 months) ────────────────────────────────────
    const allGrowthDates = [
      ...laptopGrowth, ...tabletGrowth, ...printerGrowth, ...cctvGrowth, ...cameraGrowth,
      ...htGrowth, ...dashcamGrowth, ...starlinkGrowth, ...networkGrowth, ...generalAssetGrowth
    ].map(d => d.created_at)

    const twelveMonthsAgo = new Date(now)
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1)
    twelveMonthsAgo.setHours(0, 0, 0, 0)

    const growthMap: Record<string, number> = {}
    allGrowthDates.forEach(date => {
      if (date >= twelveMonthsAgo) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        growthMap[key] = (growthMap[key] || 0) + 1
      }
    })

    // Fill missing months
    const growthData: { month: string; label: string; count: number }[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' })
      growthData.push({ month: key, label, count: growthMap[key] || 0 })
    }

    // ── 8. Alert items ───────────────────────────────────────────────────────
    const alerts = [
      ...alertLaptops.map(a => ({ ...a, category: 'Laptop', location: a.branch || '-', name: a.pic || a.asset_code || '-', href: '/laptops' })),
      ...alertTablets.map(a => ({ ...a, category: 'Tablet', location: a.branch || '-', name: (a as any).pic_name || a.asset_code || '-', href: '/tablets' })),
      ...alertPrinters.map(a => ({ ...a, category: 'Printer', location: (a as any).location || '-', name: a.asset_code || '-', href: '/printers' })),
      ...alertCctvs.map(a => ({ ...a, category: 'CCTV', location: (a as any).location || '-', name: a.asset_code || '-', href: '/cctv' })),
      ...alertCameras.map(a => ({ ...a, category: 'Kamera', location: (a as any).location || '-', name: (a as any).pic || a.asset_code || '-', href: '/cameras' })),
      ...alertHts.map(a => ({ ...a, category: 'HT', location: a.branch || '-', name: (a as any).pic_name || a.asset_code || '-', href: '/ht' })),
    ]
      .sort((a, b) => {
        if (a.condition === 'Rusak' && b.condition !== 'Rusak') return -1
        if (a.condition !== 'Rusak' && b.condition === 'Rusak') return 1
        return 0
      })
      .slice(0, 12)

    // ── 9. Asset composition for donut ──────────────────────────────────────
    const compositionData = [
      { name: 'Laptop', value: totalLaptops, color: '#3B82F6' },
      { name: 'Tablet', value: totalTablets, color: '#8B5CF6' },
      { name: 'Printer', value: totalPrinters, color: '#10B981' },
      { name: 'CCTV', value: totalCctv, color: '#F59E0B' },
      { name: 'Kamera', value: totalCameras, color: '#EF4444' },
      { name: 'HT', value: totalHt, color: '#06B6D4' },
      { name: 'Dashcam', value: dashcamCount, color: '#F97316' },
      { name: 'Starlink', value: starlinkCount, color: '#84CC16' },
      { name: 'Network', value: networkCount, color: '#64748B' },
      { name: 'General', value: totalGeneralAsset, color: '#EC4899' },
    ].filter(d => d.value > 0)

    return NextResponse.json({
      success: true,
      data: {
        // KPIs
        totalPhysical,
        totalDigital,
        totalDamaged,
        totalNeedService,
        thisMonthCount,
        healthScore: Math.min(healthScore, 100),
        // Condition
        conditionBreakdown,
        perCategoryCondition,
        compositionData,
        // Digital
        digital: {
          email: { active: emailActive, total: emailTotal },
          vpn: { active: vpnActive, total: vpnTotal },
          synology: { active: synologyActive, total: synologyTotal },
          externalApp: externalAppCount,
          adminSoftware: adminSoftwareCount,
          infrastructure: infrastructureCount,
          officePhone: officePhoneCount,
        },
        // Charts
        branchData,
        deptData,
        growthData,
        // Activity
        alerts,
        recentActivity,
      }
    })
  } catch (e) {
    console.error('[Executive Dashboard API]', e)
    return NextResponse.json({ success: false, error: 'Gagal mengambil data dashboard' }, { status: 500 })
  }
}
