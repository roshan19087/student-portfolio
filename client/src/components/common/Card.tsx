import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverable = false,
  bordered = true,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl bg-white dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 transition-all duration-200',
          bordered && 'border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs',
          hoverable &&
            'hover:-translate-y-1 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700',
          className,
        ),
      )}
      {...props}
    >
      {children}
    </div>
  );
};
