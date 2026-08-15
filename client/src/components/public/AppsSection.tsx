import React from 'react';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { AppCard } from './AppCard.js';
import { PublicAppListItemDto } from '@portfolio/shared';
import { Smartphone } from 'lucide-react';

export interface AppsSectionProps {
  apps: PublicAppListItemDto[];
}

export const AppsSection: React.FC<AppsSectionProps> = ({ apps }) => {
  return (
    <Section id="apps">
      <Container size="lg">
        <SectionHeading
          badge="Applications & Software"
          title="Installable apps and digital utilities."
          description="Desktop software, mobile packages, and web utilities engineered for productivity and developer workflows."
        />

        {apps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center">
            <Smartphone className="h-10 w-10 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              No standalone applications listed yet
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Binaries and mobile releases are currently in build pipeline testing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
};
