import { timingSafeEqual } from 'node:crypto'

export function authorizeBearer(request: Request): Response | null {
  const configured = process.env.ASSET_API_V1_TOKEN
  if (!configured) {
    console.error('ASSET_API_V1_TOKEN is not configured')
    return Response.json({ success: false, message: 'API integration is unavailable' }, { status: 503 })
  }

  const match = /^Bearer ([^\s]+)$/i.exec(request.headers.get('authorization') ?? '')
  const supplied = Buffer.from(match?.[1] ?? '')
  const expected = Buffer.from(configured)
  if (!match || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return Response.json(
      { success: false, message: 'Invalid or missing bearer token' },
      { status: 401, headers: { 'WWW-Authenticate': 'Bearer', 'Cache-Control': 'no-store' } },
    )
  }
  return null
}
