import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { BlogCard } from './BlogCard.js';
import { Button } from '../common/Button.js';
import { PublicBlogPostListItemDto } from '@portfolio/shared';
import { ArrowRight, BookOpen } from 'lucide-react';

export interface BlogSectionProps {
  posts: PublicBlogPostListItemDto[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <Section id="blog" alternate>
      <Container size="lg">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <SectionHeading
            badge="Engineering Notes"
            title="Technical Articles & Learnings"
            description="Documenting software architecture patterns, systems challenges, and development insights."
            className="mb-0 sm:mb-0"
          />

          {posts.length > 0 && (
            <Link to="/blog" className="mt-4 sm:mt-0 shrink-0">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Articles
              </Button>
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              No articles published yet
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Technical deep-dives and engineering writeups are in preparation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(0, 2).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
};
