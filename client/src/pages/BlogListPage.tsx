import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container.js';
import { BlogCard } from '../components/public/BlogCard.js';
import { PublicBlogPostListItemDto } from '@portfolio/shared';
import { blogService } from '../services/blogService.js';
import { Search, BookOpen, ArrowLeft, AlertCircle } from 'lucide-react';

export const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<PublicBlogPostListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    blogService
      .getPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
        setPosts([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags.map((t) => t.name))));

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === 'all' || post.tags.some((t) => t.name === selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <main id="main-content" className="py-12 sm:py-16">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="mb-6 flex items-center gap-2 text-xs font-mono text-zinc-500"
        >
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Engineering Blog</span>
        </nav>

        {/* Header */}
        <div className="max-w-2xl space-y-3 mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Engineering Notes & Articles
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Exploring system architecture, full-stack design patterns, and lessons learned from
            building software.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles by title or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-colors"
            />
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setSelectedTag('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTag === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                All Topics
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <AlertCircle className="h-10 w-10 mx-auto text-amber-500 mb-3" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Unable to load articles
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              No matching articles found
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Try adjusting your search keywords or topic filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
};
