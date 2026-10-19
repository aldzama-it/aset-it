import { z } from 'zod'
import { authorizeBearer } from '@/lib/api-v1/auth'
import { assetConfigs, listAssets } from '@/lib/api-v1/assets'
import { errorResponse, parsePagination } from '@/lib/api-v1/request'

export const dynamic = 'force-dynamic'

const filterSchema = z.object({
  group: z.enum(['physical', 'digital']).optional(),
  category: z.string().trim().min(1).optional(),
  search: z.string().trim().max(200).optional(),
})

export async function GET(request: Request) {
  const unauthorized = authorizeBearer(request)
  if (unauthorized) return unauthorized

  const url = new URL(request.url)
  const pagination = parsePagination(url)
  const filters = filterSchema.safeParse({
    group: url.searchParams.get('group') ?? undefined,
    category: url.searchParams.get('category') ?? undefined,
    search: url.searchParams.get('search') ?? undefined,
  })
  if (!pagination.success || !filters.success) {
    return errorResponse('Invalid query parameters', 400, {
      ...(!pagination.success ? { pagination: pagination.error.flatten() } : {}),
      ...(!filters.success ? { filters: filters.error.flatten() } : {}),
    })
  }
  if (filters.data.category && !assetConfigs.some(item => item.category === filters.data.category && (!filters.data.group || item.group === filters.data.group))) {
    return errorResponse('Unknown category for group', 400)
  }

  try {
    const result = await listAssets({ ...filters.data, ...pagination.data })
    return Response.json({ success: true, ...result }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Unified asset list failed', error)
    return errorResponse('Failed to load assets', 500)
  }
}
