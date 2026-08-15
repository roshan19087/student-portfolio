import React from 'react';
import { Container } from '../layout/Container.js';
import { Card } from '../common/Card.js';

export const HomePageSkeleton: React.FC = () => {
  return (
    <div className="space-y-16 py-12 sm:py-20 animate-pulse" data-testid="home-skeleton">
      {/* Hero Skeleton */}
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="space-y-3">
              <div className="h-12 sm:h-14 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
              <div className="h-6 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            </div>
            <div className="space-y-2 max-w-xl">
              <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="h-11 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-11 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-11 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </Container>

      {/* Highlights Skeleton */}
      <Container size="lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 border-zinc-200/90 dark:border-zinc-800/90 space-y-2">
              <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </Card>
          ))}
        </div>
      </Container>

      {/* Projects Skeleton */}
      <Container size="lg">
        <div className="space-y-4 mb-8">
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-zinc-200/90 dark:border-zinc-800/90">
              <div className="h-48 bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export const DetailPageSkeleton: React.FC = () => {
  return (
    <main id="main-content" className="py-12 sm:py-16 animate-pulse" data-testid="detail-skeleton">
      <Container size="md">
        <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded mb-8" />
        <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
        <div className="space-y-4 mb-8">
          <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-10 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="rounded-2xl bg-zinc-200 dark:bg-zinc-800 aspect-video mb-10" />
        <Card className="p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </Card>
      </Container>
    </main>
  );
};

export const ResumePageSkeleton: React.FC = () => {
  return (
    <main id="main-content" className="py-12 sm:py-16 animate-pulse" data-testid="resume-skeleton">
      <Container size="md">
        <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-8" />
        <Card className="p-8 sm:p-12 border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 space-y-8">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 space-y-3">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-5 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="flex gap-4 pt-1">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
        </Card>
      </Container>
    </main>
  );
};
