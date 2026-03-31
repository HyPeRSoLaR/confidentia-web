'use client';
/**
 * components/ui/Button.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Variants: primary (brand gradient) | secondary (outline) | ghost | danger
 * Sizes: sm | md | lg
 */

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary:   'bg-brand text-white shadow-brand hover:opacity-90',
  secondary: 'bg-transparent border border-border text-text hover:border-violet hover:text-violet',
  ghost:     'bg-transparent text-muted hover:text-text hover:bg-white/5',
  danger:    'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
};

export function Button({
  variant = 'primary', size = 'md', loading = false,
  fullWidth = false, className, children, disabled, ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/50',
        variants[variant], sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...(props as never)}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
        </svg>
      )}
      {children}
    </motion.button>
  );
}
