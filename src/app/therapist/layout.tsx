'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { User, Calendar, Inbox, Clock, DollarSign, Bell } from 'lucide-react';
import { MOCK_THERAPIST_NOTIFICATIONS } from '@/lib/mock-data';
import type { NavItem } from '@/components/layout/Sidebar';

const UNREAD_NOTIFS = MOCK_THERAPIST_NOTIFICATIONS.filter(n => !n.read).length;

const NAV: NavItem[] = [
  { label: 'Profil',          href: '/therapist/profile',        icon: User },
  { label: 'Disponibilités',  href: '/therapist/availability',   icon: Calendar },
  { label: 'Demandes',        href: '/therapist/requests',       icon: Inbox, badge: 3 },
  { label: 'Sessions',        href: '/therapist/sessions',       icon: Clock },
  { label: 'Revenus',         href: '/therapist/earnings',       icon: DollarSign },
  { label: 'Notifications',   href: '/therapist/notifications',  icon: Bell, badge: UNREAD_NOTIFS },
];

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('Thérapeute');
  useEffect(() => { const s = getSession(); if (s.user?.name) setName(s.user.name); }, []);
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar navItems={NAV} userName={name} userRole="therapist" />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-surface-glow">{children}</main>
    </div>
  );
}
