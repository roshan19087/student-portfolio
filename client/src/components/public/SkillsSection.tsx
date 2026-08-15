import React, { useState } from 'react';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { Card } from '../common/Card.js';
import { PublicSkillCategoryDto } from '@portfolio/shared';
import { Code2, CheckCircle2 } from 'lucide-react';

export interface SkillsSectionProps {
  categories: PublicSkillCategoryDto[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || 'all');

  const activeCategory = categories.find((c) => c.id === activeTab);
  const displayedCategories =
    activeTab === 'all' ? categories : activeCategory ? [activeCategory] : categories;

  return (
    <Section id="skills">
      <Container size="lg">
        <SectionHeading
          badge="Technical Skills"
          title="Technologies, tools, and technical stack."
          description="A categorized breakdown of programming languages, libraries, and developer tooling I work with."
        />

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              All Skills ({categories.reduce((acc, cat) => acc + cat.skills.length, 0)})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat.name} ({cat.skills.length})
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        <div className="space-y-10">
          {displayedCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {category.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {category.skills.map((skill) => (
                  <Card
                    key={skill.id}
                    className="p-4 flex flex-col justify-between border-zinc-200/80 dark:border-zinc-800/80"
                    hoverable
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                        {skill.name}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                    </div>

                    {skill.proficiencyLevel && (
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                        <span>Level</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {skill.proficiencyLevel}
                        </span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
