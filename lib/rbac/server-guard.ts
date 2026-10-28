import { getSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function requirePermission(permissionKey: string) {
  const session = await getSession()
  if (!session?.userId) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Unauthorized: Harap login terlebih dahulu' },
        { status: 401 }
      ),
      session: null,
    }
  }

  if (session.roleName === 'SUPER_ADMIN') {
    return { error: null, session }
  }

  const permissions: string[] = session.permissions || []
  if (!permissions.includes(permissionKey)) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Forbidden: Anda tidak memiliki akses ke fitur ini' },
        { status: 403 }
      ),
      session,
    }
  }

  return { error: null, session }
}

