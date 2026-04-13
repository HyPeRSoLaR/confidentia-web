/**
 * lib/distress-store.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side distress request store backed by localStorage.
 * Bridges the DistressRequestModal (Employee) → HR Support Requests page.
 * Replace with a real API (Supabase / REST) when the backend is wired.
 */

import type { DistressRequest, DistressCategory } from '@/types';

const STORE_KEY = 'confidentia_distress_requests';

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getLocalDistressRequests(): DistressRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as DistressRequest[]) : [];
  } catch {
    return [];
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export interface NewDistressRequest {
  employeeId:    string;
  employeeName:  string;
  employeeEmail: string;
  category:      DistressCategory;
  note?:         string;
}

export function submitDistressRequest(payload: NewDistressRequest): DistressRequest {
  const existing = getLocalDistressRequests();

  const newReq: DistressRequest = {
    id:            `dr-${Date.now()}`,
    employeeId:    payload.employeeId,
    employeeName:  payload.employeeName,
    employeeEmail: payload.employeeEmail,
    category:      payload.category,
    note:          payload.note,
    submittedAt:   new Date().toISOString(),
    status:        'pending',
    acknowledged:  false,
  };

  localStorage.setItem(STORE_KEY, JSON.stringify([newReq, ...existing]));
  return newReq;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function updateDistressRequest(
  id:      string,
  updates: Partial<Pick<DistressRequest, 'status' | 'acknowledged'>>,
): void {
  const requests = getLocalDistressRequests();
  const updated  = requests.map(r => (r.id === id ? { ...r, ...updates } : r));
  localStorage.setItem(STORE_KEY, JSON.stringify(updated));
}

// ─── Unread count (for HR badge) ──────────────────────────────────────────────

export function getUnreadDistressCount(): number {
  return getLocalDistressRequests().filter(r => !r.acknowledged).length;
}
