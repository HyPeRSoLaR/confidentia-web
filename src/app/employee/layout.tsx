'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { LayoutDashboard, MessageCircle, BookOpen, Shield, Headphones, Store } from 'lucide-react';
import type { NavItem } from '@/components/layout/Sidebar';

const NAV: NavItem[] = [
  { label: 'Tableau de bord', href: '/employee',           icon: LayoutDashboard, exact: true },
  { label: 'Chat IA',         href: '/employee/chat',      icon: Headphones },
  { label: 'Soutien',         href: '/employee/support',   icon: MessageCircle },
  { label: 'Ressources',      href: '/employee/resources', icon: BookOpen },
  { label: 'Marketplace',     href: '/marketplace',        icon: Store },
  { label: 'Confidentialité', href: '/employee/privacy',   icon: Shield },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('Employé');
  useEffect(() => { const s = getSession(); if (s.user?.name) setName(s.user.name); }, []);
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar navItems={NAV} userName={name} userRole="employee" />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-surface-glow">{children}</main>
    </div>
  );
}
