'use client';
/**
 * components/ui/Avatar.tsx
 * User avatar with gradient fallback showing initials.
 */

import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const indicatorSizes = {
  xs: 'w-1.5 h-1.5', sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3', xl: 'w-3.5 h-3.5',
};

export function Avatar({ name, src, size = 'md', online, className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white overflow-hidden',
        sizes[size],
        !src && 'bg-brand',
      )}>
        {src
          ? <img src={src} alt={name} className="w-full h-full object-cover" />
          : <span>{initials}</span>
        }
      </div>
      {online !== undefined && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-bg',
          indicatorSizes[size],
          online ? 'bg-emerald-400' : 'bg-muted'
        )} />
      )}
    </div>
  );
}
