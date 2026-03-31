'use client';
/**
 * Consumer layout — sidebar with 5 nav items.
 * To add a new consumer page: add an item here + create the page file.
 */
import { Sidebar } from '@/components/layout/Sidebar';
import { getSession } from '@/lib/session';
import { useEffect, useState } from 'react';
import { MessageCircle, BookOpen, Lightbulb, Smile, CreditCard } from 'lucide-react';
import type { NavItem } from '@/components/layout/Sidebar';

const NAV: NavItem[] = [
  { label: 'AI Chat',    href: '/consumer/chat',     icon: MessageCircle },
  { label: 'Journal',   href: '/consumer/journal',  icon: BookOpen },
  { label: 'Insights',  href: '/consumer/insights', icon: Lightbulb },
  { label: 'Check-in',  href: '/consumer/checkin',  icon: Smile },
  { label: 'Plans',     href: '/consumer/pricing',  icon: CreditCard },
];

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('User');
  useEffect(() => {
    const s = getSession();
    if (s.user?.name) setName(s.user.name);
  }, []);

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar navItems={NAV} userName={name} userRole="consumer" />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-surface-glow">
        {children}
      </main>
    </div>
  );
}
