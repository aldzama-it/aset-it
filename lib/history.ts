import type { Prisma } from '@prisma/client'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { decrypt } from './session'

export async function recordHistory(params: Prisma.AssetHistoryUncheckedCreateInput) {
  return prisma.assetHistory.create({ data: params })
}

export async function getHistoryActor() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (payload?.userId === 'admin_env_user_id') {
    return process.env.ADMIN_USERNAME || 'Admin'
  }

  const userId = Number(payload?.userId)

  if (!Number.isInteger(userId)) return 'Sistem'

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })

  return user?.name || 'Sistem'
}
