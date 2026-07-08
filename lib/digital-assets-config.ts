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
      { name: 'nama', label: 'Nama', type: 'text' },
      { name: 'divisi', label: 'Divisi', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'job_level', label: 'Job Level', type: 'text' },
      { name: 'branch', label: 'Branch', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'name_synology', label: 'Name-synology', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'user_groups', label: 'User groups', type: 'text' },
      { name: 'quota_mb', label: 'Quota(MB) - Volume 1', type: 'text' },
      { name: 'app_priv_afp', label: 'App Privileges - AFP', type: 'text' },
      { name: 'app_priv_dsm', label: 'App Privileges - DSM', type: 'text' },
      { name: 'app_priv_ftp', label: 'App Privileges - FTP', type: 'text' },
      { name: 'app_priv_rsync', label: 'App Privileges - rsync', type: 'text' },
      { name: 'app_priv_sftp', label: 'App Privileges - SFTP', type: 'text' },
      { name: 'app_priv_smb', label: 'App Privileges - SMB', type: 'text' },
      { name: 'app_priv_mail_server', label: 'App Privileges - Mail Server', type: 'text' },
      { name: 'app_priv_cloud_sync', label: 'App Privileges - Cloud Sync', type: 'text' },
      { name: 'app_priv_vmm', label: 'App Privileges - VMM', type: 'text' },
      { name: 'app_priv_active_backup', label: 'App Privileges - Active Backup', type: 'text' },
      { name: 'app_priv_universal_search', label: 'App Privileges - Universal Search', type: 'text' },
      { name: 'app_priv_file_station', label: 'App Privileges - File Station', type: 'text' },
      { name: 'app_priv_drive', label: 'App Privileges - Synology Drive', type: 'text' },
      { name: 'app_priv_notification', label: 'App Privileges - Notification Center', type: 'text' },
      { name: 'app_priv_cms', label: 'App Privileges - CMS', type: 'text' },
      { name: 'two_fa_status', label: '2FA Status', type: 'text' },
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
