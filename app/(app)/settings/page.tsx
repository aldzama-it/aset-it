import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function SettingsPage() {
  const session = await getSession()
  const permissions = session?.permissions || []

  if (session?.roleName === 'SUPER_ADMIN' || permissions.includes('settings.categories')) {
    redirect('/settings/categories')
  } else if (permissions.includes('settings.roles')) {
    redirect('/settings/roles')
  } else if (permissions.includes('settings.users')) {
    redirect('/settings/users')
  } else {
    redirect('/dashboard')
  }
}

