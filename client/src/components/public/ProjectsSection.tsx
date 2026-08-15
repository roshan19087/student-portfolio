import React, { useState } from 'react';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { ProjectCard } from './ProjectCard.js';
import { PublicProjectListItemDto } from '@portfolio/shared';
import { FolderGit2 } from 'lucide-react';

export interface ProjectsSectionProps {
  projects: PublicProjectListItemDto[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  const filteredProjects = filter === 'featured' ? projects.filter((p) => p.isFeatured) : projects;

  return (
    <Section id="projects" alternate>
      <Container size="lg">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <SectionHeading
            badge="Featured Work"
            title="Projects & Technical Implementations"
            description="Production-grade web apps, open-source utilities, and developer tooling built with modern architecture."
            className="mb-0 sm:mb-0"
          />

          {/* Filter Pills */}
          {projects.length > 0 && (
            <div className="flex items-center gap-1.5 mt-4 sm:mt-0 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                All ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('featured')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filter === 'featured'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Featured ({projects.filter((p) => p.isFeatured).length})
              </button>
            </div>
          )}
        </div>

        {/* Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center">
            <FolderGit2 className="h-10 w-10 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              No projects available
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              New project case studies and repositories are currently being documented.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
};
