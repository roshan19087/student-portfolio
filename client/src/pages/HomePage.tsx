import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/public/HeroSection.js';
import { HighlightsSection } from '../components/public/HighlightsSection.js';
import { AboutSection } from '../components/public/AboutSection.js';
import { SkillsSection } from '../components/public/SkillsSection.js';
import { ProjectsSection } from '../components/public/ProjectsSection.js';
import { AppsSection } from '../components/public/AppsSection.js';
import { EducationSection } from '../components/public/EducationSection.js';
import { CertificatesSection } from '../components/public/CertificatesSection.js';
import { BlogSection } from '../components/public/BlogSection.js';
import { ResumeSection } from '../components/public/ResumeSection.js';
import { ContactSection } from '../components/public/ContactSection.js';
import { HomePageSkeleton } from '../components/public/PublicPageSkeleton.js';
import {
  PublicProfileDto,
  PublicSkillCategoryDto,
  PublicProjectListItemDto,
  PublicAppListItemDto,
  PublicEducationDto,
  PublicCertificateDto,
  PublicBlogPostListItemDto,
  PublicSiteSettingsDto,
} from '@portfolio/shared';
import { profileService } from '../services/profileService.js';
import { skillService } from '../services/skillService.js';
import { projectService } from '../services/projectService.js';
import { appService } from '../services/appService.js';
import { educationService } from '../services/educationService.js';
import { certificateService } from '../services/certificateService.js';
import { blogService } from '../services/blogService.js';
import { settingsService } from '../services/settingsService.js';
import { Container } from '../components/layout/Container.js';
import { Card } from '../components/common/Card.js';
import { AlertCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<PublicProfileDto | null>(null);
  const [categories, setCategories] = useState<PublicSkillCategoryDto[]>([]);
  const [projects, setProjects] = useState<PublicProjectListItemDto[]>([]);
  const [apps, setApps] = useState<PublicAppListItemDto[]>([]);
  const [education, setEducation] = useState<PublicEducationDto[]>([]);
  const [certificates, setCertificates] = useState<PublicCertificateDto[]>([]);
  const [blogPosts, setBlogPosts] = useState<PublicBlogPostListItemDto[]>([]);
  const [settings, setSettings] = useState<PublicSiteSettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([
      profileService.getProfile(),
      skillService.getSkills(),
      projectService.getProjects(),
      appService.getApps(),
      educationService.getEducation(),
      certificateService.getCertificates(),
      blogService.getPosts(),
      settingsService.getSettings(),
    ])
      .then(
        ([profileRes, skillsRes, projectsRes, appsRes, eduRes, certsRes, blogRes, settingsRes]) => {
          if (!isMounted) return;

          if (profileRes.status === 'fulfilled' && profileRes.value) {
            setProfile(profileRes.value);
          } else {
            setHasError(true);
          }

          if (skillsRes.status === 'fulfilled' && skillsRes.value) {
            setCategories(skillsRes.value);
          }
          if (projectsRes.status === 'fulfilled' && projectsRes.value) {
            setProjects(projectsRes.value);
          }
          if (appsRes.status === 'fulfilled' && appsRes.value) {
            setApps(appsRes.value);
          }
          if (eduRes.status === 'fulfilled' && eduRes.value) {
            setEducation(eduRes.value);
          }
          if (certsRes.status === 'fulfilled' && certsRes.value) {
            setCertificates(certsRes.value);
          }
          if (blogRes.status === 'fulfilled' && blogRes.value) {
            setBlogPosts(blogRes.value);
          }
          if (settingsRes.status === 'fulfilled' && settingsRes.value) {
            setSettings(settingsRes.value);
          }
        },
      )
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (hasError && !profile) {
    return (
      <main id="main-content" className="py-24 text-center">
        <Container size="sm">
          <Card className="p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Unable to load portfolio
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Please check your database connection or reload the page.
            </p>
          </Card>
        </Container>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  const features = settings?.features;

  return (
    <main id="main-content">
      <HeroSection profile={profile} />
      <HighlightsSection />
      <AboutSection profile={profile} />
      {categories.length > 0 && <SkillsSection categories={categories} />}
      <ProjectsSection projects={projects} />
      {features?.appsEnabled !== false && apps.length > 0 && <AppsSection apps={apps} />}
      {education.length > 0 && <EducationSection education={education} />}
      {features?.certificatesEnabled !== false && certificates.length > 0 && (
        <CertificatesSection certificates={certificates} />
      )}
      {features?.blogEnabled !== false && blogPosts.length > 0 && <BlogSection posts={blogPosts} />}
      <ResumeSection profile={profile} />
      {features?.contactFormEnabled !== false && <ContactSection profile={profile} />}
    </main>
  );
};
