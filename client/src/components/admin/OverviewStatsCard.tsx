import React from 'react';
import { Card } from '../common/Card.js';

export interface OverviewStatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: string;
  href?: string;
}

export const OverviewStatsCard: React.FC<OverviewStatsCardProps> = ({
  label,
  value,
  icon,
  subtitle,
}) => {
  return (
    <Card className="p-5 border-zinc-200/90 dark:border-zinc-800/90" hoverable>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</span>
        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
          {value}
        </p>
        {subtitle && <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{subtitle}</p>}
      </div>
    </Card>
  );
};
