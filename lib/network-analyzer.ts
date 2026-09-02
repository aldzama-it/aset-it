import 'server-only'

/**
 * Klien HTTP untuk MikroTik Web Usage Dashboard (repo azm-web-usage-analyzer).
 *
 * `server-only`: token di sini adalah kredensial mesin. Kalau file ini pernah
 * ikut ter-bundle ke client, tokennya ikut terkirim ke browser — import guard
 * ini yang membuat kesalahan itu gagal saat build, bukan saat produksi.
 *
 * Bentuk data dan helper formatnya ada di `lib/network-analyzer-shared.ts`,
 * dan di-ekspor ulang di bawah supaya server component cukup mengimpor satu
 * modul.
 */

import type { CollectorHealth } from './network-analyzer-shared'

const BASE_URL = process.env.NETWORK_ANALYZER_URL || 'http://192.168.5.250:8092'
const TOKEN = process.env.NETWORK_ANALYZER_TOKEN || ''

/**
 * Satu titik keluar ke jaringan.
 *
 * `fetch` bawaan Node melempar `TypeError: fetch failed` untuk host mati,
 * DNS gagal, dan timeout tanpa membedakannya — pesan itu muncul apa adanya di
 * layar dan tidak memberitahu siapa pun apa yang harus diperiksa. Di sini
 * penyebabnya diterjemahkan sekali, dengan menyebut alamat yang dituju.
 */
async function request(url: URL, headers: Record<string, string> = {}): Promise<Response> {
  try {
    return await fetch(url, {
      headers: { Accept: 'application/json', ...headers },
      cache: 'no-store',
      // Analyzer ada di LAN yang sama; kalau tidak menjawab dalam 8 detik ia
      // memang sedang bermasalah, dan halaman lebih baik menampilkan itu
      // daripada menggantung sampai Next menyerah sendiri.
      signal: AbortSignal.timeout(8000),
    })
  } catch (e) {
    if (e instanceof Error && e.name === 'TimeoutError') {
      throw new Error(`Layanan di ${url.origin} tidak menjawab dalam 8 detik.`)
    }
    throw new Error(`Tidak dapat terhubung ke ${url.origin}. Pastikan layanan berjalan dan alamatnya dapat dijangkau dari server ini.`)
  }
}

/**
 * Panggilan mentah ke analyzer.
 *
 * Selalu `no-store`: halaman ini dibaca untuk mengambil keputusan operasional,
 * dan angka yang di-cache diam-diam lebih buruk daripada halaman yang lambat.
 */
export async function analyzerFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const url = new URL(`/api/v1${path}`, BASE_URL)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  const res = await request(url, { 'X-Api-Token': TOKEN })

  if (!res.ok) {
    // 401 hampir selalu berarti hal yang sama dan sulit ditebak dari pesan
    // Laravel, jadi disebut eksplisit di sini.
    if (res.status === 401) {
      throw new Error(
        'Network Analyzer menolak token (401). Periksa NETWORK_ANALYZER_TOKEN dan INTEGRATION_API_TOKEN di sisi analyzer.',
      )
    }
    throw new Error(`Network Analyzer membalas ${res.status} untuk ${path}`)
  }

  return (await res.json()) as T
}

/** Endpoint publik — tidak butuh token, dan sengaja membalas 503 saat degraded. */
export async function fetchCollectorHealth(): Promise<CollectorHealth> {
  const url = new URL('/api/v1/collectors/health', BASE_URL)
  const res = await request(url)

  // 503 adalah jawaban yang sah di sini: itu justru isi panelnya. Hanya
  // status di luar 200/503 yang berarti kita gagal bertanya.
  if (!res.ok && res.status !== 503) {
    throw new Error(`Network Analyzer membalas ${res.status} untuk /collectors/health`)
  }

  return (await res.json()) as CollectorHealth
}

export * from './network-analyzer-shared'
