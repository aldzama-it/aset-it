import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { fetchCollectorHealth } from '@/lib/network-analyzer'
import { getErrorMessage } from '@/lib/utils'

/**
 * Status collector, untuk panel yang menyegarkan diri di client.
 *
 * Sesi dicek di sini, bukan di middleware: matcher `middleware.ts` mengecualikan
 * `/api`, jadi route ini tidak terlindungi apa pun kalau tidak memeriksa sendiri.
 */
export async function GET() {
  const session = await decrypt((await cookies()).get('session')?.value)
  if (!session?.userId) {
    return Response.json({ success: false, error: 'Tidak terautentikasi' }, { status: 401 })
  }

  try {
    const data = await fetchCollectorHealth()
    return Response.json({ success: true, data })
  } catch (e) {
    return Response.json(
      { success: false, error: getErrorMessage(e, 'Gagal menghubungi layanan Network Analyzer') },
      { status: 502 },
    )
  }
}
