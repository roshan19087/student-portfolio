import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  description,
  align = 'left',
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'mb-10 sm:mb-12',
          align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl',
          className,
        ),
      )}
    >
      {badge && (
        <div className="mb-2">
          <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
