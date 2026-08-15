import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Container } from '../components/layout/Container.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { PublicBlogPostDetailDto } from '@portfolio/shared';
import { blogService } from '../services/blogService.js';
import { DetailPageSkeleton } from '../components/public/PublicPageSkeleton.js';
import { ArrowLeft, Calendar, Clock, BookOpen } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PublicBlogPostDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    blogService
      .getPostBySlug(slug)
      .then((data) => {
        setPost(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Article not found');
        setPost(null);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (error || !post) {
    return (
      <main id="main-content" className="py-24 text-center">
        <Container size="sm">
          <Card className="p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Article Not Found
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The technical article you requested does not exist or may be an unpublished draft.
            </p>
            <Link to="/blog">
              <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Blog
              </Button>
            </Link>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main id="main-content" className="py-12 sm:py-16">
      <Container size="sm">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumbs"
          className="mb-8 flex items-center gap-2 text-xs font-mono text-zinc-500"
        >
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/blog"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-xs">
            {post.title}
          </span>
        </nav>

        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTimeMinutes} min read
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {post.summary}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md mb-10 bg-zinc-100 dark:bg-zinc-800 aspect-video">
            <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Markdown Content Article Body */}
        <Card className="p-6 sm:p-10 border-zinc-200/90 dark:border-zinc-800/90 prose dark:prose-invert max-w-none">
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-8 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-sm sm:text-base text-zinc-700 dark:text-zinc-300 space-y-1 mb-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-sm sm:text-base text-zinc-700 dark:text-zinc-300 space-y-1 mb-4">
                  {children}
                </ol>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  return (
                    <pre className="p-4 rounded-xl bg-zinc-900 text-zinc-100 text-xs sm:text-sm font-mono overflow-x-auto my-4 border border-zinc-800">
                      <code>{children}</code>
                    </pre>
                  );
                }
                return (
                  <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400">
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-zinc-600 dark:text-zinc-400 my-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {post.contentMarkdown}
          </Markdown>
        </Card>

        {/* Footer Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <BookOpen className="h-4 w-4" />
            <span>Read more technical articles</span>
          </Link>
        </div>
      </Container>
    </main>
  );
};
