import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ExternalLink, Smartphone, Monitor, Globe, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card.js';
import { Badge } from '../common/Badge.js';
import { PublicAppListItemDto } from '@portfolio/shared';

export interface AppCardProps {
  app: PublicAppListItemDto;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'WEB':
        return <Globe className="h-3.5 w-3.5" />;
      case 'ANDROID':
      case 'IOS':
        return <Smartphone className="h-3.5 w-3.5" />;
      default:
        return <Monitor className="h-3.5 w-3.5" />;
    }
  };

  const primaryRelease = app.latestReleases?.[0];

  return (
    <Card
      className="p-6 flex flex-col justify-between border-zinc-200/90 dark:border-zinc-800/90"
      hoverable
    >
      <div className="space-y-4">
        {/* Header with App Icon and Version */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700/80 shadow-xs">
              {app.iconUrl ? (
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-blue-500 font-bold font-mono">
                  {app.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                <Link
                  to={`/apps/${app.slug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {app.name}
                </Link>
              </h3>
              {app.currentVersion && (
                <span className="font-mono text-xs text-zinc-500">v{app.currentVersion}</span>
              )}
            </div>
          </div>

          {app.isFeatured && (
            <Badge variant="accent" size="sm" className="font-mono">
              Featured App
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
          {app.tagline}
        </p>

        {/* Platforms */}
        {app.latestReleases && app.latestReleases.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {app.latestReleases.map((rel) => (
              <span
                key={rel.id}
                className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {getPlatformIcon(rel.platform)}
                <span>{rel.platform}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-6">
        <Link
          to={`/apps/${app.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>App Overview</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {primaryRelease?.downloadUrl ? (
          <a
            href={primaryRelease.downloadUrl}
            download
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </a>
        ) : (
          <Link
            to={`/apps/${app.slug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Details</span>
          </Link>
        )}
      </div>
    </Card>
  );
};
