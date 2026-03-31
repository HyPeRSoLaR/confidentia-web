'use client';
/**
 * components/ui/Card.tsx
 * Glass card and plain surface card variants.
 */

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'surface' | 'brand-border';
  hover?: boolean;
  children: ReactNode;
  animate?: boolean;
}

export function Card({
  variant = 'glass', hover = false, animate = false,
  className, children, ...props
}: CardProps) {
  const base = cn(
    'rounded-2xl p-5 transition-all duration-300',
    variant === 'glass'        && 'glass',
    variant === 'surface'      && 'surface',
    variant === 'brand-border' && 'glass border-brand',
    hover && 'hover:border-violet/40 hover:shadow-brand cursor-pointer',
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={base}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base} {...props}>{children}</div>;
}
