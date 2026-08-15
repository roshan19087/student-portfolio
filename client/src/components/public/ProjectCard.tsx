import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowRight, Layers } from 'lucide-react';
import { Card } from '../common/Card.js';
import { Badge } from '../common/Badge.js';
import { PublicProjectListItemDto } from '@portfolio/shared';

export interface ProjectCardProps {
  project: PublicProjectListItemDto;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card
      className="flex flex-col h-full overflow-hidden border-zinc-200/90 dark:border-zinc-800/90"
      hoverable
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <Layers className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {project.isFeatured && (
            <Badge variant="accent" size="sm" className="font-mono">
              Featured
            </Badge>
          )}
          <Badge
            variant={project.status === 'COMPLETED' ? 'success' : 'warning'}
            size="sm"
            className="font-mono text-[10px]"
          >
            {project.status === 'COMPLETED' ? 'Live' : 'In Progress'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
            <Link
              to={`/projects/${project.slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {project.shortSummary}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <span
                key={skill.id}
                className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {skill.name}
              </span>
            ))}
          </div>

          {/* Links & CTA */}
          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Case Study</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Source on GitHub"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Live Demo"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
