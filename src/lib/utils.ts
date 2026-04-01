/**
 * lib/utils.ts
 * Shared utilities — formatting, class merging, etc.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to a human-readable label */
export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    ...options,
  });
}

/** Format a date-time string */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/** Format a dollar amount (e.g. 120 → '$120.00'). Pass dollars, not cents. */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

/** Relative time (e.g. "3 days ago") */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/** Truncate text */
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Emotion → color mapping (stays in sync with design tokens) */
export const EMOTION_COLORS: Record<string, string> = {
  calm:      '#45D8D4',
  happy:     '#9B6FE8',
  anxious:   '#E879BC',
  stressed:  '#FF8C6B',
  angry:     '#FF5757',
  sad:       '#6B94E8',
  energized: '#7AE868',
  neutral:   '#8A8FAD',
};

/** Emotion → emoji */
export const EMOTION_EMOJI: Record<string, string> = {
  calm: '😌', happy: '😊', anxious: '😰', stressed: '😤',
  angry: '😠', sad: '😢', energized: '⚡', neutral: '😐',
};
