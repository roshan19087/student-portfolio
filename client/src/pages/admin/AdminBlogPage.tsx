import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/blogService.js';
import { PublicBlogPostDetailDto } from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminTable } from '../../components/admin/AdminTable.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { EmptyState } from '../../components/admin/EmptyState.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { Card } from '../../components/common/Card.js';
import {
  Plus,
  BookOpen,
  Search,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Globe,
  FileEdit,
} from 'lucide-react';
export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<PublicBlogPostDetailDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PublicBlogPostDetailDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadData = async () => {
    try {
      const data = await blogService.getAdminPosts();
      setPosts(data);
    } catch {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = async (post: PublicBlogPostDetailDto) => {
    const newStatus = post.publishedAt ? 'DRAFT' : 'PUBLISHED';
    try {
      await blogService.updatePost(post.id, {
        status: newStatus,
        publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString() : null,
      });
      setNotification({
        type: 'success',
        message: `Article "${post.title}" is now ${newStatus.toLowerCase()}.`,
      });
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update article status.',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);

    try {
      await blogService.deletePost(deleteTarget.id);
      setNotification({ type: 'success', message: `Article "${deleteTarget.title}" deleted.` });
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete article.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Technical Blog Articles"
        description="Write and publish engineering notes, architecture breakdowns, and development learnings."
        action={
          <Link to="/admin/blog/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              New Article
            </Button>
          </Link>
        }
      />

      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Card className="p-4 border-zinc-200/90 dark:border-zinc-800/90 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </Card>

      {filteredPosts.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8 text-zinc-400" />}
          title="No articles found"
          description="Create your first markdown engineering article to share insights with peers and recruiters."
          actionLabel="New Article"
          onAction={() => {}}
        />
      ) : (
        <AdminTable headers={['Title', 'Status', 'Read Time', 'Tags', 'Published', 'Actions']}>
          {filteredPosts.map((p) => {
            const isPublished = Boolean(p.publishedAt);
            return (
              <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <td className="px-5 py-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{p.title}</span>
                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-xs">{p.summary}</p>
                    <div className="text-[10px] font-mono text-zinc-400">/{p.slug}</div>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <Badge
                    variant={isPublished ? 'success' : 'warning'}
                    size="sm"
                    className="font-mono text-[10px]"
                  >
                    {isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-zinc-500 whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {p.readingTimeMinutes} min
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {p.tags.map((t) => (
                      <span
                        key={t.id}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-zinc-500 whitespace-nowrap">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleTogglePublish(p)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isPublished
                          ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                          : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                      title={isPublished ? 'Unpublish to draft' : 'Publish live'}
                    >
                      {isPublished ? (
                        <FileEdit className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      to={`/admin/blog/edit/${p.id}`}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      title="Edit article"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Blog Article"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete Article"
      />
    </div>
  );
};
