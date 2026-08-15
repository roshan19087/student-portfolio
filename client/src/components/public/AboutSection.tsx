import React from 'react';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { Card } from '../common/Card.js';
import { Code, Compass, Lightbulb, Rocket } from 'lucide-react';
import { PublicProfileDto } from '@portfolio/shared';

export interface AboutSectionProps {
  profile: PublicProfileDto;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const pillars = [
    {
      icon: Code,
      title: 'Clean Architecture',
      description:
        'Prioritizing type safety, modular structures, and maintainable codebase patterns.',
    },
    {
      icon: Rocket,
      title: 'Full-Stack Execution',
      description:
        'Building end-to-end solutions from PostgreSQL database schemas to modern React UIs.',
    },
    {
      icon: Lightbulb,
      title: 'Continuous Learning',
      description:
        'Constantly expanding knowledge across systems design, distributed APIs, and cloud services.',
    },
    {
      icon: Compass,
      title: 'Product Focus',
      description:
        'Balancing rigorous engineering with intuitive, responsive, and accessible user experiences.',
    },
  ];

  return (
    <Section id="about" alternate>
      <Container size="lg">
        <SectionHeading
          badge="About Me"
          title="Driven by curiosity, grounded in fundamentals."
          description="A glimpse into my background, development principles, and current engineering journey."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Bio */}
          <div className="lg:col-span-6 space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
            <p>{profile.fullAbout || profile.shortBio}</p>
            <p>
              As a computer science student, I bridge academic computer science theory with hands-on
              software engineering. I enjoy taking ideas from initial system architectural design
              all the way to production deployment.
            </p>
            <p>
              When I am not writing code, I actively participate in hackathons, explore open-source
              repositories, and document my technical learnings through in-depth blog posts.
            </p>
          </div>

          {/* Core Engineering Pillars */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Card key={idx} className="p-5" hoverable>
                  <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
};
