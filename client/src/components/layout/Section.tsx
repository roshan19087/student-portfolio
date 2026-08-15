import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  alternate?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  id,
  className,
  alternate = false,
  children,
  ...props
}) => {
  return (
    <section
      id={id}
      className={twMerge(
        clsx(
          'py-16 sm:py-24 transition-colors',
          alternate ? 'bg-zinc-50/70 dark:bg-zinc-900/30' : 'bg-transparent',
          className,
        ),
      )}
      {...props}
    >
      {children}
    </section>
  );
};
