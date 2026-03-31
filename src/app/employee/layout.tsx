'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { MessageCircle, BookOpen, Shield } from 'lucide-react';
import type { NavItem } from '@/components/layout/Sidebar';

const NAV: NavItem[] = [
  { label: 'Support',   href: '/employee/support',   icon: MessageCircle },
  { label: 'Resources', href: '/employee/resources',  icon: BookOpen },
  { label: 'Privacy',   href: '/employee/privacy',    icon: Shield },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('Employee');
  useEffect(() => { const s = getSession(); if (s.user?.name) setName(s.user.name); }, []);
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar navItems={NAV} userName={name} userRole="employee" />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-surface-glow">{children}</main>
    </div>
  );
}
