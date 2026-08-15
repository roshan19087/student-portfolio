import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import {
  PublicProfileDto,
  PublicEducationDto,
  PublicSkillCategoryDto,
  PublicProjectListItemDto,
  PublicCertificateDto,
} from '@portfolio/shared';
import { profileService } from '../services/profileService.js';
import { educationService } from '../services/educationService.js';
import { skillService } from '../services/skillService.js';
import { projectService } from '../services/projectService.js';
import { certificateService } from '../services/certificateService.js';
import { ResumePageSkeleton } from '../components/public/PublicPageSkeleton.js';
import { Download, Printer, ArrowLeft, MapPin, Github, AlertCircle } from 'lucide-react';

export const ResumePage: React.FC = () => {
  const [profile, setProfile] = useState<PublicProfileDto | null>(null);
  const [education, setEducation] = useState<PublicEducationDto[]>([]);
  const [categories, setCategories] = useState<PublicSkillCategoryDto[]>([]);
  const [projects, setProjects] = useState<PublicProjectListItemDto[]>([]);
  const [certificates, setCertificates] = useState<PublicCertificateDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([
      profileService.getProfile(),
      educationService.getEducation(),
      skillService.getSkills(),
      projectService.getProjects(),
      certificateService.getCertificates(),
    ])
      .then(([profRes, eduRes, skillsRes, projRes, certsRes]) => {
        if (!isMounted) return;

        if (profRes.status === 'fulfilled' && profRes.value) {
          setProfile(profRes.value);
        } else {
          setHasError(true);
        }

        if (eduRes.status === 'fulfilled' && eduRes.value) {
          setEducation(eduRes.value);
        }
        if (skillsRes.status === 'fulfilled' && skillsRes.value) {
          setCategories(skillsRes.value);
        }
        if (projRes.status === 'fulfilled' && projRes.value) {
          setProjects(projRes.value);
        }
        if (certsRes.status === 'fulfilled' && certsRes.value) {
          setCertificates(certsRes.value);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return <ResumePageSkeleton />;
  }

  if (hasError && !profile) {
    return (
      <main id="main-content" className="py-24 text-center">
        <Container size="sm">
          <Card className="p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Unable to load resume
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Please check your database connection or reload the page.
            </p>
            <Link to="/">
              <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Home
              </Button>
            </Link>
          </Card>
        </Container>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  const githubLink = profile.socialLinks.find((l) => l.platform.toLowerCase().includes('github'));

  return (
    <main id="main-content" className="py-12 sm:py-16">
      <Container size="md">
        {/* Navigation & Controls Bar (Hidden in Print) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-2 text-xs font-mono text-zinc-500"
          >
            <Link to="/" className="hover:text-zinc-900 dark:text-zinc-100 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Curriculum Vitae</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link to="/">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={handlePrint}
            >
              Print
            </Button>
            {profile.resumePdfUrl && (
              <a href={profile.resumePdfUrl} download>
                <Button variant="primary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                  Download PDF
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Paper Document Card */}
        <Card className="print-page p-8 sm:p-12 border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 shadow-sm space-y-10">
          {/* Header */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 space-y-3 print-break-inside-avoid">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {profile.fullName}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 font-mono">
              {profile.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 font-mono pt-1">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
              {githubLink && (
                <a
                  href={githubLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Github className="h-3.5 w-3.5" />
                  {githubLink.url.replace(/^https?:\/\//, '')}
                </a>
              )}
              {profile.statusBadge && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {profile.statusBadge}
                </span>
              )}
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {edu.institution}
                      </h3>
                      <span className="text-xs text-zinc-500 font-mono">
                        {formatDate(edu.startDate)} —{' '}
                        {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300">
                      <span>
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </span>
                      {edu.gradeOrCgpa && (
                        <span className="font-mono text-xs font-semibold">{edu.gradeOrCgpa}</span>
                      )}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold">Coursework: </span>
                        {edu.coursework.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {categories.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                Technical Proficiencies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-1.5">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {category.name}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {category.skills.map((s) => s.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Projects */}
          {projects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                Key Projects & Implementations
              </h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        {proj.githubUrl && <span className="no-print">Open Source</span>}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {proj.shortSummary}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500">
                      Stack: {proj.skills.map((s) => s.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certificates.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                Certifications & Credentials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{cert.title}</h3>
                    <p className="text-zinc-500">
                      {cert.issuer} {cert.issueDate ? `(${formatDate(cert.issueDate)})` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </Container>
    </main>
  );
};
