import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  className,
  size = 'lg',
  children,
  ...props
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={twMerge(clsx('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className))}
      {...props}
    >
      {children}
    </div>
  );
};
