'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { Users, Building2, MessageSquare, CreditCard } from 'lucide-react';
import type { NavItem } from '@/components/layout/Sidebar';

const NAV: NavItem[] = [
  { label: 'Users',          href: '/admin/users',          icon: Users },
  { label: 'Companies',      href: '/admin/companies',      icon: Building2 },
  { label: 'Conversations',  href: '/admin/conversations',  icon: MessageSquare },
  { label: 'Plans',          href: '/admin/plans',          icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('Admin');
  useEffect(() => { const s = getSession(); if (s.user?.name) setName(s.user.name); }, []);
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar navItems={NAV} userName={name} userRole="admin" />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-surface-glow">{children}</main>
    </div>
  );
}
