'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { User, Calendar, Inbox, Clock, DollarSign } from 'lucide-react';
import type { NavItem } from '@/components/layout/Sidebar';

const NAV: NavItem[] = [
  { label: 'Profile',      href: '/therapist/profile',      icon: User },
  { label: 'Availability', href: '/therapist/availability',  icon: Calendar },
  { label: 'Requests',     href: '/therapist/requests',      icon: Inbox, badge: 3 },
  { label: 'Sessions',     href: '/therapist/sessions',      icon: Clock },
  { label: 'Earnings',     href: '/therapist/earnings',      icon: DollarSign },
];

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('Therapist');
  useEffect(() => { const s = getSession(); if (s.user?.name) setName(s.user.name); }, []);
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar navItems={NAV} userName={name} userRole="therapist" />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-surface-glow">{children}</main>
    </div>
  );
}
