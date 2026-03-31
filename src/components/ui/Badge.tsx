/**
 * components/ui/Badge.tsx
 * Small pill labels for status, severity, categories, emotions.
 */

import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  size?: 'sm' | 'md';
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

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm', 
  className,
  ...props 
}: BadgeProps) {
  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-all',
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Map severity string to Badge variant */
export function SeverityBadge({ severity }: { severity: 'info' | 'warning' | 'critical' }) {
  const map = { info: 'info', warning: 'warning', critical: 'danger' } as const;
  return <Badge variant={map[severity]}>{severity}</Badge>;
}
