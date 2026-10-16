import { authorizeBearer } from '@/lib/api-v1/auth'
import { findAsset, getConfig } from '@/lib/api-v1/assets'
import { errorResponse, parseId } from '@/lib/api-v1/request'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ group: string; category: string; id: string }> }) {
  const unauthorized = authorizeBearer(request)
  if (unauthorized) return unauthorized
  const { group, category, id: rawId } = await params
  const config = getConfig(group, category)
  const id = parseId(rawId)
  if (!config || id === null) return errorResponse('Invalid asset identity', 400)

  try {
    const found = await findAsset(config, id)
    if (!found) return errorResponse('Asset not found', 404)
    return Response.json({ success: true, data: found.asset }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Unified asset detail failed', error)
    return errorResponse('Failed to load asset', 500)
  }
}
