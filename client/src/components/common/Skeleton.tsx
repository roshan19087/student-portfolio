import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        clsx(
          'animate-pulse bg-zinc-200 dark:bg-zinc-800',
          variant === 'circular' && 'rounded-full',
          variant === 'text' && 'h-4 rounded-md',
          variant === 'rectangular' && 'rounded-xl',
          className,
        ),
      )}
      {...props}
    />
  );
};
