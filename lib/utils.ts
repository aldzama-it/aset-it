import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown, fallback = "Terjadi kesalahan"): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (typeof error === "string" && error) {
    return error
  }

  try {
    const serialized = JSON.stringify(error)
    if (serialized && serialized !== "{}") {
      return serialized
    }
  } catch {}

  return fallback
}

export function generateAssetCode(prefix: string, lastCode: string | null | undefined): string {
  if (!lastCode) return `${prefix}-001`
  const num = parseInt(lastCode.split('-')[1] || '0') + 1
  return `${prefix}-${String(num).padStart(3, '0')}`
}
