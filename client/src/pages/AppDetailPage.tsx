import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/layout/Container.js';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';
import { Button } from '../components/common/Button.js';
import { ArrowLeft, Download, Smartphone, Monitor, Globe, Calendar, FileText } from 'lucide-react';
import { PublicAppDetailDto, AppPlatformEnum } from '@portfolio/shared';
import { appService } from '../services/appService.js';
import { DetailPageSkeleton } from '../components/public/PublicPageSkeleton.js';

export const AppDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [app, setApp] = useState<PublicAppDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    appService
      .getAppBySlug(slug)
      .then((data) => {
        setApp(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'App not found');
        setApp(null);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPlatformIcon = (platform: AppPlatformEnum | string) => {
    switch (platform) {
      case 'WEB':
        return <Globe className="h-4 w-4" />;
      case 'ANDROID':
      case 'IOS':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (error || !app) {
    return (
      <main id="main-content" className="py-24 text-center">
        <Container size="sm">
          <Card className="p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Application Not Found
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The application you requested does not exist or may have been unlisted.
            </p>
            <Link to="/#apps">
              <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Applications
              </Button>
            </Link>
          </Card>
        </Container>
      </main>
    );
  }

  const releases =
    app.allReleases && app.allReleases.length > 0 ? app.allReleases : app.latestReleases || [];
  const uniquePlatforms = Array.from(new Set(releases.map((r) => r.platform)));

  return (
    <main id="main-content" className="py-12 sm:py-16">
      <Container size="md">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="mb-8 flex items-center gap-2 text-xs font-mono text-zinc-500"
        >
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/#apps"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Apps
          </Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-xs">
            {app.name}
          </span>
        </nav>

        {/* Back Link */}
        <Link
          to="/#apps"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all applications</span>
        </Link>

        {/* App Header Card */}
        <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="h-20 w-20 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 p-2 border border-zinc-200 dark:border-zinc-700/80 shadow-md shrink-0">
              {app.iconUrl ? (
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold font-mono text-blue-500">
                  {app.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {app.name}
                </h1>
                {app.currentVersion && (
                  <Badge variant="neutral" size="sm" className="font-mono">
                    v{app.currentVersion}
                  </Badge>
                )}
                {app.isFeatured && (
                  <Badge variant="accent" size="sm" className="font-mono">
                    Featured
                  </Badge>
                )}
              </div>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                {app.description || app.tagline}
              </p>

              {/* Supported Platforms */}
              {uniquePlatforms.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {uniquePlatforms.map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80"
                    >
                      {getPlatformIcon(platform)}
                      <span>{platform}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Releases & Download Hub */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Download Releases & Binaries
            </h2>
          </div>

          {releases.length > 0 ? (
            <div className="space-y-4">
              {releases.map((release) => (
                <Card
                  key={release.id}
                  className="p-5 border-zinc-200/90 dark:border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-mono">
                        Version {release.version}
                      </span>
                      <Badge variant="accent" size="sm" className="font-mono text-[10px]">
                        {release.platform}
                      </Badge>
                    </div>
                    {release.releaseNotes && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {release.releaseNotes}
                      </p>
                    )}
                    {release.releaseDate && (
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                        <Calendar className="h-3 w-3" />
                        <span>Released on {formatDate(release.releaseDate)}</span>
                      </div>
                    )}
                  </div>

                  <a href={release.downloadUrl} download className="shrink-0">
                    <Button variant="primary" size="md" leftIcon={<Download className="h-4 w-4" />}>
                      Download Package
                    </Button>
                  </a>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center">
              <FileText className="h-8 w-8 mx-auto text-zinc-400 dark:text-zinc-600 mb-2" />
              <p className="text-xs text-zinc-500">
                No downloadable binary released yet for this app.
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};
