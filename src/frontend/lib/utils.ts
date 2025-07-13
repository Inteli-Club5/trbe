import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe number formatting utility
export function safeToLocaleString(value: number | undefined | null, options?: Intl.NumberFormatOptions): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString('en-US', options);
}

// Safe number formatting with fallback
export function formatNumber(value: number | undefined | null, fallback: string = '0'): string {
  if (value === undefined || value === null || isNaN(value)) {
    return fallback;
  }
  return safeToLocaleString(value);
}

// Safe array operations
export function safeSlice<T>(array: T[] | undefined | null, start?: number, end?: number): T[] {
  if (!array || !Array.isArray(array)) {
    return [];
  }
  return array.slice(start, end);
}

export function safeMap<T, U>(array: T[] | undefined | null, callback: (item: T, index: number) => U): U[] {
  if (!array || !Array.isArray(array)) {
    return [];
  }
  return array.map(callback);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(dateString)
}
