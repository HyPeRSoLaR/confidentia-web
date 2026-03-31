/**
 * lib/session.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight client-side session store using localStorage.
 * Swap this out for a real auth solution (NextAuth, Clerk, Supabase Auth, etc.)
 * without touching any other file — just replace the functions below.
 */

import type { AuthSession, UserRole, User } from '@/types';

const SESSION_KEY = 'confidentia_session';

// ─── Demo users — one per role ────────────────────────────────────────────────
export const DEMO_USERS: Record<UserRole, User> = {
  consumer: {
    id: 'demo-consumer',
    name: 'Alex Rivera',
    email: 'alex@demo.com',
    role: 'consumer',
    avatarUrl: '',
    createdAt: '2024-01-15T09:00:00Z',
  },
  employee: {
    id: 'demo-employee',
    name: 'Jordan Kim',
    email: 'jordan@techcorp.com',
    role: 'employee',
    companyId: 'company-1',
    createdAt: '2024-02-10T09:00:00Z',
  },
  hr: {
    id: 'demo-hr',
    name: 'Morgan Lee',
    email: 'morgan.hr@techcorp.com',
    role: 'hr',
    companyId: 'company-1',
    createdAt: '2024-01-20T09:00:00Z',
  },
  therapist: {
    id: 'demo-therapist',
    name: 'Dr. Sam Patel',
    email: 'sam.patel@therapists.com',
    role: 'therapist',
    avatarUrl: '',
    createdAt: '2023-11-01T09:00:00Z',
  },
  admin: {
    id: 'demo-admin',
    name: 'Admin User',
    email: 'admin@confidentia.ai',
    role: 'admin',
    createdAt: '2023-10-01T09:00:00Z',
  },
};

// ─── Read / write ─────────────────────────────────────────────────────────────

export function getSession(): AuthSession {
  if (typeof window === 'undefined') {
    return { user: null, role: null, isDemo: false };
  }
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { user: null, role: null, isDemo: false };
    return JSON.parse(raw) as AuthSession;
  } catch {
    return { user: null, role: null, isDemo: false };
  }
}

export function setSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

// ─── Demo login ───────────────────────────────────────────────────────────────

export function startDemoSession(role: UserRole): void {
  setSession({ user: DEMO_USERS[role], role, isDemo: true });
}

// ─── Role home page ───────────────────────────────────────────────────────────

export const ROLE_HOME: Record<UserRole, string> = {
  consumer:  '/consumer/chat',
  employee:  '/employee/support',
  hr:        '/hr/analytics',
  therapist: '/therapist/profile',
  admin:     '/admin/users',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  consumer:  'Personal',
  employee:  'Employee',
  hr:        'HR Dashboard',
  therapist: 'Therapist',
  admin:     'Admin',
};
