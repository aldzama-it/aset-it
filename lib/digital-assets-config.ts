export type DigitalAssetType = 'email' | 'vpn' | 'synology' | 'external-app' | 'admin-software' | 'infrastructure' | 'office-phone'

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea'
  required?: boolean
}

export interface DigitalAssetConfig {
  id: DigitalAssetType
  title: string
  fields: FieldConfig[]
}

export const digitalAssetsConfig: DigitalAssetConfig[] = [
  {
    id: 'email',
    title: 'Akun Email',
    fields: [
      { name: 'nama', label: 'Nama', type: 'text' },
      { name: 'divisi', label: 'Divisi', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'job_level', label: 'Job Level', type: 'text' },
      { name: 'branch', label: 'Branch', type: 'text' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'status', label: 'Status (Aktif/Dihapus)', type: 'text' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ]
  },
  {
    id: 'vpn',
    title: 'Akun VPN',
    fields: [
      { name: 'nama', label: 'Nama', type: 'text', required: true },
      { name: 'divisi', label: 'Divisi', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'job_level', label: 'Job Level', type: 'text' },
      { name: 'branch', label: 'Branch', type: 'text' },
      { name: 'ip_address', label: 'IP Address', type: 'text' },
      { name: 'status', label: 'Status', type: 'text' },
    ]
  },
  {
    id: 'synology',
    title: 'Akun Synology',
    fields: [
      { name: 'nama', label: 'Nama', type: 'text', required: true },
      { name: 'divisi', label: 'Divisi', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'job_level', label: 'Job Level', type: 'text' },
      { name: 'branch', label: 'Branch', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'status', label: 'Status', type: 'text' },
    ]
  },
  {
    id: 'external-app',
    title: 'Aplikasi Eksternal',
    fields: [
      { name: 'app_name', label: 'Nama Aplikasi', type: 'text', required: true },
      { name: 'app_link', label: 'Link Aplikasi', type: 'text' },
      { name: 'email_username', label: 'Email / Username', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' },
    ]
  },
  {
    id: 'admin-software',
    title: 'Admin Software Perusahaan',
    fields: [
      { name: 'app_name', label: 'Nama Aplikasi', type: 'text', required: true },
      { name: 'app_link', label: 'Link Aplikasi', type: 'text' },
      { name: 'email_username', label: 'Email / Username', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' },
    ]
  },
  {
    id: 'infrastructure',
    title: 'Akun Infrastruktur',
    fields: [
      { name: 'nama_akun', label: 'Nama Akun', type: 'text', required: true },
      { name: 'email_username', label: 'Email / Username', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'from_ip', label: 'From IP Address', type: 'text' },
      { name: 'to_ip', label: 'To IP Address', type: 'text' },
      { name: 'mac_address', label: 'MAC Address', type: 'text' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ]
  },
  {
    id: 'office-phone',
    title: 'Telepon Kantor',
    fields: [
      { name: 'nama_akun', label: 'Nama Akun', type: 'text', required: true },
      { name: 'username', label: 'Username', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'reg_sip_account', label: 'Reg SIP Account', type: 'text' },
      { name: 'reg_sip_password', label: 'Reg SIP Password', type: 'password' },
      { name: 'ip_address', label: 'IP Address', type: 'text' },
      { name: 'mac_address', label: 'MAC Address', type: 'text' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
    ]
  }
]
