'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { BarChart2, Grid3X3, Bell, Settings, Users2 } from 'lucide-react';
import { MOCK_ORG_ALERTS } from '@/lib/mock-data';
import type { NavItem } from '@/components/layout/Sidebar';

const UNREAD_ALERTS = MOCK_ORG_ALERTS.filter(a => !a.acknowledged).length;

const NAV: NavItem[] = [
  { label: 'Analytics', href: '/hr/analytics', icon: BarChart2 },
  { label: 'Heatmap',   href: '/hr/heatmap',   icon: Grid3X3 },
  { label: 'Poles',     href: '/hr/poles',      icon: Users2 },
  { label: 'Alerts',    href: '/hr/alerts',     icon: Bell, badge: UNREAD_ALERTS },
  { label: 'Settings',  href: '/hr/settings',   icon: Settings },
];

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('HR Manager');
  useEffect(() => { const s = getSession(); if (s.user?.name) setName(s.user.name); }, []);
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar navItems={NAV} userName={name} userRole="hr" />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-surface-glow">{children}</main>
    </div>
  );
}
