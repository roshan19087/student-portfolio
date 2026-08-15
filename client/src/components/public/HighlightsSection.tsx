import React from 'react';
import { Container } from '../layout/Container.js';
import { Card } from '../common/Card.js';
import { Sparkles, Terminal, BookOpen, Briefcase } from 'lucide-react';

export const HighlightsSection: React.FC = () => {
  const highlights = [
    {
      icon: Terminal,
      title: 'Current Focus',
      value: 'Full-Stack Architecture & TypeScript Monorepos',
      tag: 'Engineering',
    },
    {
      icon: Sparkles,
      title: 'Building',
      value: 'Real-time telemetry tools & desktop productivity apps',
      tag: 'Projects',
    },
    {
      icon: BookOpen,
      title: 'Exploring',
      value: 'PostgreSQL optimization, Docker & distributed caching',
      tag: 'Knowledge',
    },
    {
      icon: Briefcase,
      title: 'Open To',
      value: 'Software Engineering Internships & Open Source Work',
      tag: 'Opportunities',
    },
  ];

  return (
    <section className="py-8">
      <Container size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="p-5 border-zinc-200/90 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                  <Icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  {item.title}
                </h4>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                  {item.value}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
