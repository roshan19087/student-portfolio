import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { Card } from '../common/Card.js';
import { Button } from '../common/Button.js';
import { FileText, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PublicProfileDto } from '@portfolio/shared';

export interface ResumeSectionProps {
  profile: PublicProfileDto;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ profile }) => {
  const highlights = [
    'Comprehensive CS fundamentals & data structures',
    'Hands-on full-stack TypeScript & React development',
    'Experience building modular backend REST APIs & PostgreSQL models',
    'Version control, Docker containerization, and modern testing suites',
  ];

  return (
    <Section id="resume">
      <Container size="lg">
        <Card className="p-8 sm:p-12 border-zinc-200/90 dark:border-zinc-800/90 bg-linear-to-br from-blue-50/50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-950 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <FileText className="h-4 w-4" />
                <span>Curriculum Vitae</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Looking for a dedicated software engineering student?
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                Explore a detailed breakdown of my education, technical proficiencies, project
                contributions, and credentials prepared for engineering hiring teams.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {highlights.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link to="/resume" className="w-full">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View Full Resume
                </Button>
              </Link>
              {profile.resumePdfUrl ? (
                <a href={profile.resumePdfUrl} download className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download PDF
                  </Button>
                </a>
              ) : (
                <Button variant="ghost" size="md" disabled className="w-full text-xs text-zinc-400">
                  PDF Coming Soon
                </Button>
              )}
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
};
