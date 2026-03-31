'use client';
/**
 * components/layout/Sidebar.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Role-aware collapsible sidebar. Pass `navItems` per-role from each layout.
 * Adding a new nav item = add one object to the array in the role's layout.tsx.
 */

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { clearSession } from '@/lib/session';
import { Avatar } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { UserRole } from '@/types';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface SidebarProps {
  navItems: NavItem[];
  userName: string;
  userRole: UserRole;
  userAvatarUrl?: string;
}

const ROLE_COLORS: Record<UserRole, string> = {
  consumer:  'from-cyan/20 to-violet/20',
  employee:  'from-violet/20 to-pink/20',
  hr:        'from-pink/20 to-coral/20',
  therapist: 'from-coral/20 to-violet/20',
  admin:     'from-cyan/20 to-coral/20',
};

export function Sidebar({ navItems, userName, userRole, userAvatarUrl }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col h-screen bg-surface border-r border-border flex-shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center flex-shrink-0">
          {/* Shield-heart logo mark */}
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M12 2L4 5.5V11c0 4.5 3.4 8.7 8 9.9 4.6-1.2 8-5.4 8-9.9V5.5L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M9 12c0-1.1.9-2 2-2s2 .9 2 2-2 3-2 3-2-1.9-2-3z" fill="white"/>
          </svg>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold font-serif text-text text-lg whitespace-nowrap overflow-hidden"
            >
              Confidentia
            </motion.span>
          )}
        </AnimatePresence>
        
        <div className={cn("ml-auto flex items-center gap-2", collapsed && "mx-auto flex-col-reverse mt-2")}>
          <ThemeToggle />
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-8 h-8 rounded-full text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center flex-shrink-0"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
          </button>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto scrollbar-thin">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                  active
                    ? 'bg-brand text-white shadow-brand'
                    : 'text-muted hover:text-text hover:bg-white/5',
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && item.badge !== undefined && (
                  <span className="ml-auto text-xs bg-coral/20 text-coral rounded-full px-1.5 py-0.5 font-semibold">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className={cn(
        'border-t border-border p-3',
        `bg-gradient-to-br ${ROLE_COLORS[userRole]}`
      )}>
        <div className="flex items-center gap-3">
          <Avatar name={userName} src={userAvatarUrl} size="sm" online />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-xs font-semibold text-text truncate">{userName}</p>
                <p className="text-xs text-muted capitalize">{userRole}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleLogout}
            className={cn(
              'text-muted hover:text-coral transition-colors flex-shrink-0',
              collapsed && 'mx-auto'
            )}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
