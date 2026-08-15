import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card.js';
import { PublicBlogPostListItemDto } from '@portfolio/shared';

export interface BlogCardProps {
  post: PublicBlogPostListItemDto;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card
      className="flex flex-col h-full overflow-hidden border-zinc-200/90 dark:border-zinc-800/90"
      hoverable
    >
      {post.coverImageUrl && (
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTimeMinutes} min read
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug tracking-tight">
            <Link
              to={`/blog/${post.slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {post.summary}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Read Full Article</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
