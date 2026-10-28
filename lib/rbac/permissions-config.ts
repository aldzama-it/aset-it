export interface MenuItemDefinition {
  key: string
  label: string
  path: string
  group: 'main' | 'digital_assets' | 'physical_assets' | 'history' | 'settings'
  description?: string
}

export interface MenuGroupDefinition {
  group: 'main' | 'digital_assets' | 'physical_assets' | 'history' | 'settings'
  title: string
  items: MenuItemDefinition[]
}

export const MENU_ITEMS: MenuItemDefinition[] = [
  // Utama
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    group: 'main',
    description: 'Ringkasan KPI, statistik aset, dan visualisasi kondisi',
  },
  {
    key: 'ticketing',
    label: 'Ticketing',
    path: '/ticketing',
    group: 'main',
    description: 'Layanan permintaan bantuan dan perbaikan IT',
  },
  {
    key: 'network_analyzer',
    label: 'Network Analyzer',
    path: '/network-analyzer',
    group: 'main',
    description: 'Monitoring telemetri jaringan, bandwidth, dan perangkat aktif',
  },

  // Aset Digital
  {
    key: 'digital_assets.email',
    label: 'Akun Email',
    path: '/digital-assets/email',
    group: 'digital_assets',
    description: 'Inventaris akun email perusahaan',
  },
  {
    key: 'digital_assets.vpn',
    label: 'Akun VPN',
    path: '/digital-assets/vpn',
    group: 'digital_assets',
    description: 'Daftar alokasi akun VPN',
  },
  {
    key: 'digital_assets.synology',
    label: 'Akun Synology',
    path: '/digital-assets/synology',
    group: 'digital_assets',
    description: 'Penyimpanan NAS dan hak akses Synology',
  },
  {
    key: 'digital_assets.external_app',
    label: 'Aplikasi Eksternal',
    path: '/digital-assets/external-app',
    group: 'digital_assets',
    description: 'Lisensi dan akun aplikasi pihak ketiga',
  },
  {
    key: 'digital_assets.admin_software',
    label: 'Admin Software Perusahaan',
    path: '/digital-assets/admin-software',
    group: 'digital_assets',
    description: 'Kredensial dashboard admin software internal',
  },
  {
    key: 'digital_assets.infrastructure',
    label: 'Akun Infrastruktur',
    path: '/digital-assets/infrastructure',
    group: 'digital_assets',
    description: 'Akses router, switch, server, dan gateway',
  },
  {
    key: 'digital_assets.office_phone',
    label: 'Telepon Kantor',
    path: '/digital-assets/office-phone',
    group: 'digital_assets',
    description: 'Akun SIP/VoIP telepon kantor',
  },

  // Aset Fisik
  {
    key: 'physical_assets.network',
    label: 'Jaringan',
    path: '/network',
    group: 'physical_assets',
    description: 'Hardware switch, router, access point',
  },
  {
    key: 'physical_assets.printers',
    label: 'Printer',
    path: '/printers',
    group: 'physical_assets',
    description: 'Inventaris printer kantor dan cabang',
  },
  {
    key: 'physical_assets.cctv',
    label: 'CCTV',
    path: '/cctv',
    group: 'physical_assets',
    description: 'Kamera pengawas dan IP CCTV',
  },
  {
    key: 'physical_assets.laptops',
    label: 'Laptop',
    path: '/laptops',
    group: 'physical_assets',
    description: 'Inventaris laptop karyawan & handover',
  },
  {
    key: 'physical_assets.general_inventory',
    label: 'Inventaris Umum',
    path: '/general-inventory',
    group: 'physical_assets',
    description: 'Peralatan kantor dan periferal pendukung',
  },
  {
    key: 'physical_assets.ht',
    label: 'HT (Handy Talky)',
    path: '/ht',
    group: 'physical_assets',
    description: 'Perangkat komunikasi HT operasional',
  },
  {
    key: 'physical_assets.tablets',
    label: 'Tablet',
    path: '/tablets',
    group: 'physical_assets',
    description: 'Perangkat tablet operasional lapangan',
  },
  {
    key: 'physical_assets.cameras',
    label: 'Kamera',
    path: '/cameras',
    group: 'physical_assets',
    description: 'Inventaris kamera DSLR/Mirrorless & aksesoris',
  },
  {
    key: 'physical_assets.starlinks',
    label: 'Starlink',
    path: '/starlinks',
    group: 'physical_assets',
    description: 'Perangkat terminal satelit Starlink',
  },
  {
    key: 'physical_assets.dashcams',
    label: 'Dashcam',
    path: '/dashcams',
    group: 'physical_assets',
    description: 'Kamera kendaraan operasional',
  },
  {
    key: 'physical_assets.dynamic',
    label: 'Kategori Dinamis',
    path: '/assets',
    group: 'physical_assets',
    description: 'Aset umum yang dikonfigurasi melalui Kategori Baru',
  },

  // Riwayat
  {
    key: 'history',
    label: 'Riwayat Aset',
    path: '/history',
    group: 'history',
    description: 'Audit log mutasi, perubahan kondisi, dan pergantian PIC aset',
  },

  // Pengaturan
  {
    key: 'settings.categories',
    label: 'Kategori Aset',
    path: '/settings/categories',
    group: 'settings',
    description: 'Kelola kategori dinamis aset umum',
  },
  {
    key: 'settings.roles',
    label: 'Role & Hak Akses',
    path: '/settings/roles',
    group: 'settings',
    description: 'Kelola peran pengguna dan visibilitas menu',
  },
  {
    key: 'settings.users',
    label: 'Manajemen Pengguna',
    path: '/settings/users',
    group: 'settings',
    description: 'Kelola akun user dan penugasan role',
  },
]

export const MENU_GROUPS: MenuGroupDefinition[] = [
  {
    group: 'main',
    title: 'Menu Utama',
    items: MENU_ITEMS.filter(item => item.group === 'main'),
  },
  {
    group: 'digital_assets',
    title: 'Aset Digital',
    items: MENU_ITEMS.filter(item => item.group === 'digital_assets'),
  },
  {
    group: 'physical_assets',
    title: 'Aset Fisik',
    items: MENU_ITEMS.filter(item => item.group === 'physical_assets'),
  },
  {
    group: 'history',
    title: 'Riwayat & Log',
    items: MENU_ITEMS.filter(item => item.group === 'history'),
  },
  {
    group: 'settings',
    title: 'Pengaturan Sistem',
    items: MENU_ITEMS.filter(item => item.group === 'settings'),
  },
]

export const ALL_MENU_KEYS = MENU_ITEMS.map(item => item.key)

export interface DefaultRolePreset {
  name: string
  label: string
  description: string
  is_system: boolean
  defaultPermissions: string[]
}

export const DEFAULT_ROLE_PRESETS: DefaultRolePreset[] = [
  {
    name: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Akses penuh ke seluruh menu dan pengaturan sistem',
    is_system: true,
    defaultPermissions: ALL_MENU_KEYS,
  },
  {
    name: 'DIREKTUR',
    label: 'Direktur',
    description: 'Akses eksekutif untuk monitoring dashboard, laporan, dan riwayat aset',
    is_system: false,
    defaultPermissions: [
      'dashboard',
      'ticketing',
      'network_analyzer',
      'history',
    ],
  },
  {
    name: 'MANAGER',
    label: 'Manager',
    description: 'Akses manajerial operasional aset digital dan fisik',
    is_system: false,
    defaultPermissions: [
      'dashboard',
      'ticketing',
      'network_analyzer',
      'physical_assets.network',
      'physical_assets.printers',
      'physical_assets.cctv',
      'physical_assets.laptops',
      'physical_assets.general_inventory',
      'physical_assets.ht',
      'history',
    ],
  },
  {
    name: 'SUPERVISOR',
    label: 'Supervisor',
    description: 'Akses supervisi lapangan dan pencatatan inventaris',
    is_system: false,
    defaultPermissions: [
      'dashboard',
      'ticketing',
      'physical_assets.network',
      'physical_assets.printers',
      'physical_assets.cctv',
      'physical_assets.laptops',
      'physical_assets.general_inventory',
      'history',
    ],
  },
  {
    name: 'IT_ADMIN',
    label: 'IT Administrator',
    description: 'Akses pengelolaan aset fisik, digital, telemetri, dan kategori',
    is_system: false,
    defaultPermissions: ALL_MENU_KEYS.filter(k => k !== 'settings.roles'),
  },
  {
    name: 'IT_SUPPORT',
    label: 'IT Support',
    description: 'Akses operasional lapangan, ticketing, fisik aset, dan riwayat',
    is_system: false,
    defaultPermissions: [
      'dashboard',
      'ticketing',
      'physical_assets.network',
      'physical_assets.printers',
      'physical_assets.cctv',
      'physical_assets.laptops',
      'physical_assets.general_inventory',
      'physical_assets.ht',
      'physical_assets.tablets',
      'physical_assets.cameras',
      'physical_assets.starlinks',
      'physical_assets.dashcams',
      'physical_assets.dynamic',
      'history',
    ],
  },
  {
    name: 'STAFF',
    label: 'Staff',
    description: 'Akses dasar untuk dashboard informasi dan pengajuan ticketing',
    is_system: false,
    defaultPermissions: [
      'dashboard',
      'ticketing',
    ],
  },
]

/**
 * Mencari menu key yang cocok berdasarkan URL path
 */
export function getMenuKeyByPath(pathname: string): string | null {
  if (pathname === '/dashboard') return 'dashboard'
  if (pathname.startsWith('/ticketing')) return 'ticketing'
  if (pathname.startsWith('/network-analyzer')) return 'network_analyzer'
  if (pathname.startsWith('/digital-assets/')) {
    const slug = pathname.replace('/digital-assets/', '').split('/')[0]
    const mapped = slug.replace('-', '_')
    const key = `digital_assets.${mapped}`
    const found = MENU_ITEMS.find(m => m.key === key)
    return found ? found.key : null
  }
  if (pathname.startsWith('/assets/')) return 'physical_assets.dynamic'
  if (pathname.startsWith('/network')) return 'physical_assets.network'
  if (pathname.startsWith('/printers')) return 'physical_assets.printers'
  if (pathname.startsWith('/cctv')) return 'physical_assets.cctv'
  if (pathname.startsWith('/laptops')) return 'physical_assets.laptops'
  if (pathname.startsWith('/general-inventory')) return 'physical_assets.general_inventory'
  if (pathname.startsWith('/ht')) return 'physical_assets.ht'
  if (pathname.startsWith('/tablets')) return 'physical_assets.tablets'
  if (pathname.startsWith('/cameras')) return 'physical_assets.cameras'
  if (pathname.startsWith('/starlinks')) return 'physical_assets.starlinks'
  if (pathname.startsWith('/dashcams')) return 'physical_assets.dashcams'
  if (pathname.startsWith('/history')) return 'history'
  if (pathname.startsWith('/settings/categories')) return 'settings.categories'
  if (pathname.startsWith('/settings/roles')) return 'settings.roles'
  if (pathname.startsWith('/settings/users')) return 'settings.users'
  if (pathname === '/settings') return 'settings.categories'
  return null
}
