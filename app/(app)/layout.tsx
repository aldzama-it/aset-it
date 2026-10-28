import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { TransitionProvider } from '@/components/transition/TransitionProvider'
import { AuthProvider } from '@/context/AuthContext'
import { getSession } from '@/lib/session'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  const initialUser = session ? {
    id: session.userId,
    name: session.name || 'User',
    email: session.email || '',
    roleId: session.roleId ?? null,
    roleName: session.roleName || 'STAFF',
    roleLabel: session.roleLabel || 'Staff',
    permissions: session.permissions || [],
  } : null

  return (
    <AuthProvider initialUser={initialUser}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <TopBar />
          <TransitionProvider>
            {children}
          </TransitionProvider>
        </div>
      </div>
    </AuthProvider>
  )
}
