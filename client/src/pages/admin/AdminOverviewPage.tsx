import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService.js';
import { AdminDashboardStatsDto } from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { OverviewStatsCard } from '../../components/admin/OverviewStatsCard.js';
import { AdminTable } from '../../components/admin/AdminTable.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import {
  Layers,
  Smartphone,
  Code2,
  BookOpen,
  Mail,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dashboardService
      .getStats()
      .then((data) => {
        if (mounted) setStats(data);
      })
      .catch(() => {
        // Fallback default numbers if fresh instance
        if (mounted) {
          setStats({
            counts: {
              totalProjects: 0,
              totalApps: 0,
              totalSkills: 0,
              totalBlogPosts: 0,
              unreadMessages: 0,
            },
            recentProjects: [],
            recentMessages: [],
          });
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading || !stats) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header with Quick Actions */}
      <AdminPageHeader
        title="Dashboard Overview"
        description="Welcome back. Here is a summary of your portfolio content and communication activity."
        action={
          <div className="flex items-center gap-2">
            <Link to="/admin/projects">
              <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                Add Project
              </Button>
            </Link>
            <Link to="/admin/blog/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                New Article
              </Button>
            </Link>
          </div>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <OverviewStatsCard
          label="Total Projects"
          value={stats.counts.totalProjects}
          icon={<Layers className="h-5 w-5" />}
          subtitle="Showcase items"
        />
        <OverviewStatsCard
          label="Applications"
          value={stats.counts.totalApps}
          icon={<Smartphone className="h-5 w-5" />}
          subtitle="Software releases"
        />
        <OverviewStatsCard
          label="Skills Catalog"
          value={stats.counts.totalSkills}
          icon={<Code2 className="h-5 w-5" />}
          subtitle="Technical skills"
        />
        <OverviewStatsCard
          label="Articles"
          value={stats.counts.totalBlogPosts}
          icon={<BookOpen className="h-5 w-5" />}
          subtitle="Published posts"
        />
        <OverviewStatsCard
          label="Unread Messages"
          value={stats.counts.unreadMessages}
          icon={<Mail className="h-5 w-5" />}
          subtitle="Awaiting response"
        />
      </div>

      {/* Two Column Layout: Recent Projects & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Projects Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Recent Projects
              </h2>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.recentProjects.length === 0 ? (
            <Card className="p-8 text-center border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">No projects added yet.</p>
            </Card>
          ) : (
            <AdminTable headers={['Title', 'Status', 'Featured', 'Created']}>
              {stats.recentProjects.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                  <td className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-xs">
                    {p.title}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={p.status === 'COMPLETED' ? 'success' : 'warning'}
                      size="sm"
                      className="font-mono text-[10px]"
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        <Sparkles className="h-3 w-3" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-zinc-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Recent Inquiries
              </h2>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View inbox</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.recentMessages.length === 0 ? (
            <Card className="p-8 text-center border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Inbox is empty.</p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {stats.recentMessages.map((m) => (
                <Card
                  key={m.id}
                  className={`p-4 border-zinc-200/90 dark:border-zinc-800/90 ${
                    !m.isRead
                      ? 'border-l-4 border-l-blue-600 bg-blue-50/20 dark:bg-blue-950/20'
                      : ''
                  }`}
                  hoverable
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                      {m.senderName}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium truncate mb-1">
                    {m.subject || 'No Subject'}
                  </p>
                  <p className="text-xs text-zinc-500 line-clamp-1">{m.message}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
