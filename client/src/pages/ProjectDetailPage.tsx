import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/layout/Container.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Card } from '../components/common/Card.js';
import { Modal } from '../components/common/Modal.js';
import { ArrowLeft, ExternalLink, Github, Layers, Eye } from 'lucide-react';
import { PublicProjectDetailDto, PublicProjectScreenshotDto } from '@portfolio/shared';
import { projectService } from '../services/projectService.js';
import { DetailPageSkeleton } from '../components/public/PublicPageSkeleton.js';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PublicProjectDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<PublicProjectScreenshotDto | null>(
    null,
  );

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    projectService
      .getProjectBySlug(slug)
      .then((data) => {
        setProject(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Project not found');
        setProject(null);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (error || !project) {
    return (
      <main id="main-content" className="py-24 text-center">
        <Container size="sm">
          <Card className="p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Project Not Found
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The project you requested does not exist or may have been removed.
            </p>
            <Link to="/#projects">
              <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Projects
              </Button>
            </Link>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main id="main-content" className="py-12 sm:py-16">
      <Container size="md">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="mb-8 flex items-center gap-2 text-xs font-mono text-zinc-500"
        >
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/#projects"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Projects
          </Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-xs">
            {project.title}
          </span>
        </nav>

        {/* Back Link */}
        <Link
          to="/#projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all projects</span>
        </Link>

        {/* Header Title & Badges */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={project.status === 'COMPLETED' ? 'success' : 'warning'}
              size="md"
              className="font-mono text-xs"
            >
              {project.status === 'COMPLETED' ? 'Production Ready' : 'In Active Development'}
            </Badge>
            {project.isFeatured && (
              <Badge variant="accent" size="md" className="font-mono text-xs">
                Featured Case Study
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {project.shortSummary}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="md" leftIcon={<Github className="h-4 w-4" />}>
                  View Repository
                </Button>
              </a>
            )}
            {project.liveDemoUrl && (
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ExternalLink className="h-4 w-4" />}
                >
                  Open Live Demo
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Main Cover / Thumbnail */}
        {project.thumbnailUrl && (
          <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md mb-10 bg-zinc-100 dark:bg-zinc-800 aspect-video">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}

        {/* Technical Overview & Architecture */}
        <div className="space-y-8">
          <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Project Architecture & Overview
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </p>

            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                Technologies & Tools Employed
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="font-mono text-xs px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/80"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Screenshots Gallery */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-500" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Screenshots & Interface Gallery
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.screenshots.map((ss) => (
                  <Card
                    key={ss.id}
                    className="overflow-hidden border-zinc-200/90 dark:border-zinc-800/90 cursor-pointer group"
                    onClick={() => setSelectedScreenshot(ss)}
                  >
                    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={ss.imageUrl}
                        alt={ss.caption || project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="h-6 w-6" />
                      </div>
                    </div>
                    {ss.caption && (
                      <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/80">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium truncate">
                          {ss.caption}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Screenshot Lightbox Modal */}
        <Modal
          isOpen={!!selectedScreenshot}
          onClose={() => setSelectedScreenshot(null)}
          title={selectedScreenshot?.caption || 'Project Screenshot'}
        >
          {selectedScreenshot?.imageUrl && (
            <div className="rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center">
              <img
                src={selectedScreenshot.imageUrl}
                alt={selectedScreenshot.caption || 'Screenshot'}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          )}
        </Modal>
      </Container>
    </main>
  );
};
