import React from 'react';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { Card } from '../common/Card.js';
import { Badge } from '../common/Badge.js';
import { PublicEducationDto } from '@portfolio/shared';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';

export interface EducationSectionProps {
  education: PublicEducationDto[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <Section id="education" alternate>
      <Container size="lg">
        <SectionHeading
          badge="Academic Background"
          title="Education & Academic Foundations"
          description="Formal university education, relevant computer science coursework, and academic milestones."
        />

        <div className="space-y-6">
          {education.map((item) => (
            <Card key={item.id} className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                      {item.institution}
                    </h3>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                      {item.degree}
                    </p>
                    {item.fieldOfStudy && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.fieldOfStudy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {formatDate(item.startDate)} —{' '}
                      {item.endDate ? formatDate(item.endDate) : 'Present'}
                    </span>
                  </div>
                  {item.gradeOrCgpa && (
                    <Badge variant="neutral" size="sm" className="font-mono">
                      {item.gradeOrCgpa}
                    </Badge>
                  )}
                </div>
              </div>

              {item.activities && (
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Activities:{' '}
                  </span>
                  {item.activities}
                </p>
              )}

              {/* Coursework */}
              {item.coursework && item.coursework.length > 0 && (
                <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                    <span>Key Coursework:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.coursework.map((course, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
