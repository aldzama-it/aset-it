import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAssetCode(prefix: string, lastCode: string | null | undefined): string {
  if (!lastCode) return `${prefix}-001`
  const num = parseInt(lastCode.split('-')[1] || '0') + 1
  return `${prefix}-${String(num).padStart(3, '0')}`
}
