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
  /** If true, only an exact pathname match marks this item active.
   *  Use for root/index routes that are a prefix of sibling routes. */
  exact?: boolean;
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
      className="relative flex flex-col h-screen bg-surface border-r border-border flex-shrink-0 overflow-visible"
    >
      {/* ── Floating reopen tab (visible only when collapsed) ── */}
      <AnimatePresence>
        {collapsed && (
          <motion.button
            key="reopen-tab"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => setCollapsed(false)}
            title="Ouvrir le menu"
            className="absolute top-1/2 -translate-y-1/2 -right-4 z-50 flex items-center justify-center w-4 h-12 rounded-r-full bg-brand shadow-brand text-white hover:w-6 hover:-right-6 transition-all duration-200 cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            <ChevronRight size={12} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-border overflow-hidden',
        collapsed && 'flex-col gap-2 px-0 py-4 items-center'
      )}>
        {/* Logo cliquable → accueil */}
        <Link href="/" title="Retour à l'accueil" className={cn('flex items-center gap-3 group', collapsed ? 'justify-center' : 'flex-1 min-w-0')}>
          <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
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
                className="font-bold font-serif text-text text-lg whitespace-nowrap overflow-hidden group-hover:text-brand transition-colors duration-200"
              >
                Confidentia
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Collapse toggle (always visible) */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex-shrink-0 w-7 h-7 rounded-full text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
          title={collapsed ? 'Déplier le menu' : 'Replier le menu'}
        >
          {collapsed ? <ChevronRight size={15}/> : <ChevronLeft size={15}/>}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto scrollbar-thin">
        {navItems.map(item => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
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
        <div className={cn('flex items-center gap-3', collapsed && 'flex-col gap-2')}>
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
                <p className="text-xs text-muted capitalize">{userRole === 'hr' ? 'RH' : userRole === 'consumer' ? 'Personnel' : userRole === 'employee' ? 'Employé' : userRole === 'therapist' ? 'Thérapeute' : 'Admin'}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={cn('flex items-center gap-1', collapsed && 'flex-col gap-1')}>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-muted hover:text-coral transition-colors flex-shrink-0"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
