'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { BarChart2, Grid3X3, Bell, Settings, Users2, CreditCard, HeartHandshake } from 'lucide-react';
import { MOCK_ORG_ALERTS } from '@/lib/mock-data';
import { getLocalDistressRequests } from '@/lib/distress-store';
import type { NavItem } from '@/components/layout/Sidebar';

const UNREAD_ALERTS = MOCK_ORG_ALERTS.filter(a => !a.acknowledged).length;

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const [name,           setName]           = useState('HR Manager');
  const [distressBadge,  setDistressBadge]  = useState(0);

  useEffect(() => {
    const s = getSession();
    if (s.user?.name) setName(s.user.name);

    // Load initial distress badge count
    function updateBadge() {
      const live    = getLocalDistressRequests().filter(r => !r.acknowledged).length;
      const seedNew = 1; // dr1 from MOCK_DISTRESS_REQUESTS is pending & unacknowledged
      setDistressBadge(live + seedNew);
    }

    updateBadge();
    // Re-poll every 3s so badge updates when employee submits in another tab/window
    const interval = setInterval(updateBadge, 3000);
    return () => clearInterval(interval);
  }, []);

  const NAV: NavItem[] = [
    { label: 'Analytics',        href: '/hr/analytics', icon: BarChart2 },
    { label: 'Heatmap',          href: '/hr/heatmap',   icon: Grid3X3 },
    { label: 'Poles',            href: '/hr/poles',      icon: Users2 },
    { label: 'Support Requests', href: '/hr/distress',   icon: HeartHandshake, badge: distressBadge || undefined },
    { label: 'Alerts',           href: '/hr/alerts',     icon: Bell, badge: UNREAD_ALERTS },
    { label: 'Pricing',          href: '/hr/pricing',    icon: CreditCard },
    { label: 'Settings',         href: '/hr/settings',   icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar navItems={NAV} userName={name} userRole="hr" />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-surface-glow">{children}</main>
    </div>
  );
}
