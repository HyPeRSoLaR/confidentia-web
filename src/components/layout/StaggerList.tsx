'use client';
/**
 * components/layout/StaggerList.tsx
 * Wraps children in a staggered Framer Motion list animation.
 * Just wrap any list with <StaggerList> to get stagger entrance for free.
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const container = (stagger: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function StaggerList({ children, className, staggerDelay = 0.06 }: StaggerListProps) {
  return (
    <motion.div
      variants={container(staggerDelay)}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
