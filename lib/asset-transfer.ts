export const assetTransferConfigs = {
  laptops: {
    label: 'Laptop',
    apiBasePath: '/api/laptops',
    picField: 'pic',
    locationField: 'branch',
    handoverDateField: 'handover_date',
  },
  tablets: {
    label: 'Tablet',
    apiBasePath: '/api/tablets',
    picField: 'pic_name',
    locationField: 'branch',
    handoverDateField: 'handover_date',
  },
  hts: {
    label: 'HT',
    apiBasePath: '/api/ht',
    picField: 'pic_name',
    locationField: 'branch',
    handoverDateField: 'handover_date',
  },
  generalInventories: {
    label: 'Inventaris Umum',
    apiBasePath: '/api/general-inventory',
    picField: 'pic_name',
    locationField: 'branch',
    handoverDateField: 'handover_date',
  },
  cameras: {
    label: 'Kamera',
    apiBasePath: '/api/cameras',
    picField: 'pic',
    locationField: 'location',
    handoverDateField: 'handover_date',
  },
  generalAssets: {
    label: 'Aset',
    apiBasePath: '/api/general-assets',
    picField: 'pic',
    locationField: 'location',
    handoverDateField: 'handover_date',
  },
  printers: {
    label: 'Printer',
    apiBasePath: '/api/printers',
    picField: null,
    locationField: 'location',
    handoverDateField: null,
  },
  cctvs: {
    label: 'CCTV',
    apiBasePath: '/api/cctv',
    picField: null,
    locationField: 'location',
    handoverDateField: null,
  },
  networkDevices: {
    label: 'Perangkat Jaringan',
    apiBasePath: '/api/network',
    picField: null,
    locationField: 'location',
    handoverDateField: null,
  },
  starlinks: {
    label: 'Starlink',
    apiBasePath: '/api/starlinks',
    picField: null,
    locationField: 'location',
    handoverDateField: null,
  },
  dashcams: {
    label: 'Dashcam',
    apiBasePath: '/api/dashcams',
    picField: null,
    locationField: 'location',
    handoverDateField: null,
  },
} as const

export type AssetTableName = keyof typeof assetTransferConfigs
export type AssetTransferItem = {
  id: number
  asset_code?: string | null
} & Record<string, unknown>

export function isAssetTableName(value: string): value is AssetTableName {
  return value in assetTransferConfigs
}
