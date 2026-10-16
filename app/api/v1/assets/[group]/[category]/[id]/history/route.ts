import { authorizeBearer } from '@/lib/api-v1/auth'
import { findAsset, getConfig } from '@/lib/api-v1/assets'
import { getAssetHistory } from '@/lib/api-v1/history'
import { errorResponse, paginationMeta, parseId, parsePagination } from '@/lib/api-v1/request'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ group: string; category: string; id: string }> }) {
  const unauthorized = authorizeBearer(request)
  if (unauthorized) return unauthorized
  const { group, category, id: rawId } = await params
  const config = getConfig(group, category)
  const id = parseId(rawId)
  if (!config || id === null) return errorResponse('Invalid asset identity', 400)
  const pagination = parsePagination(new URL(request.url))
  if (!pagination.success) return errorResponse('Invalid pagination', 400, pagination.error.flatten())

  try {
    const found = await findAsset(config, id)
    if (!found) return errorResponse('Asset not found', 404)
    const { page, limit } = pagination.data
    const { data, total } = await getAssetHistory(config, found.row, page, limit)
    return Response.json({ success: true, data, meta: paginationMeta(total, page, limit) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Unified asset history failed', error)
    return errorResponse('Failed to load asset history', 500)
  }
}
