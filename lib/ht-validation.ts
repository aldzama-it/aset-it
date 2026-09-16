import { z } from 'zod'

const htDetailFields = [
  'pic_name',
  'division',
  'branch',
  'handover_date',
  'return_date',
  'brand',
  'type',
  'accessories',
  'notes',
  'it_handover',
  'it_receiver',
] as const

export function hasHtDetails(record: Record<string, unknown>) {
  return htDetailFields.some((field) => {
    const value = record[field]
    return value !== null && value !== undefined && String(value).trim() !== ''
  })
}

export const htCreateSchema = z.object({
  brand: z.string({ error: 'Brand wajib diisi' }).trim().min(1, 'Brand wajib diisi'),
  pic_name: z.string({ error: 'Nama penerima wajib diisi' }).trim().min(1, 'Nama penerima wajib diisi'),
}).passthrough()
