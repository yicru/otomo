import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const secondsToDuration = (value: number) => {
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)

  const zeroPad = (value: number | undefined) => {
    if (value === undefined) return ''
    return value.toString().padStart(2, '0')
  }

  return `${zeroPad(minutes)}:${zeroPad(seconds)}`
}
