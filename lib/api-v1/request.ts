import { z } from 'zod'

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export function parsePagination(url: URL) {
  return paginationSchema.safeParse({
    page: url.searchParams.get('page') ?? undefined,
    limit: url.searchParams.get('limit') ?? undefined,
  })
}

export function parseId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) ? id : null
}

export function paginationMeta(total: number, page: number, limit: number) {
  return {
    total, page, limit, total_pages: Math.ceil(total / limit),
    has_next_page: page * limit < total, has_previous_page: page > 1,
  }
}

export function errorResponse(message: string, status: number, errors?: unknown) {
  return Response.json({ success: false, message, ...(errors ? { errors } : {}) }, { status, headers: { 'Cache-Control': 'no-store' } })
}
