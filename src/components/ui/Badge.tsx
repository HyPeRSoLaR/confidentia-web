/**
 * components/ui/Badge.tsx
 * Small pill labels for status, severity, categories, emotions.
 */

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-white/10 text-muted border-border',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger:  'bg-red-500/15 text-red-400 border-red-500/30',
  info:    'bg-cyan/15 text-cyan border-cyan/30',
  brand:   'bg-brand text-white border-transparent',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-medium',
      variants[variant], sizes[size], className
    )}>
      {children}
    </span>
  );
}

/** Map severity string to Badge variant */
export function SeverityBadge({ severity }: { severity: 'info' | 'warning' | 'critical' }) {
  const map = { info: 'info', warning: 'warning', critical: 'danger' } as const;
  return <Badge variant={map[severity]}>{severity}</Badge>;
}
