import React from 'react';
import { ArrowDown, FileText, Github, Linkedin, Mail, Twitter, Sparkles } from 'lucide-react';
import { Container } from '../layout/Container.js';
import { Button } from '../common/Button.js';
import { Badge } from '../common/Badge.js';
import { PublicProfileDto } from '@portfolio/shared';

export interface HeroSectionProps {
  profile: PublicProfileDto;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Introduction & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status / Availability Badge */}
            {profile.isAvailable && (
              <div>
                <Badge
                  variant="success"
                  size="md"
                  icon={<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                  className="font-mono text-xs"
                >
                  {profile.statusBadge || 'Available for Internships & Collaborations'}
                </Badge>
              </div>
            )}

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                Hi, I'm <span className="text-blue-600 dark:text-blue-400">{profile.fullName}</span>
                .
              </h1>
              <p className="font-mono text-base sm:text-lg text-zinc-700 dark:text-zinc-300 font-semibold">
                {profile.tagline}
              </p>
            </div>

            {/* Bio summary */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              {profile.shortBio || profile.fullAbout}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href="#projects">
                <Button variant="primary" size="lg" rightIcon={<ArrowDown className="h-4 w-4" />}>
                  View My Projects
                </Button>
              </a>
              {profile.resumePdfUrl ? (
                <a href="/resume">
                  <Button variant="outline" size="lg" leftIcon={<FileText className="h-4 w-4" />}>
                    View Resume
                  </Button>
                </a>
              ) : null}
              <a href="#contact">
                <Button variant="secondary" size="lg" leftIcon={<Mail className="h-4 w-4" />}>
                  Contact Me
                </Button>
              </a>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-3 pt-4 text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">
                Connect:
              </span>
              <div className="flex items-center gap-2">
                {profile.socialLinks.map((link) => {
                  const Icon =
                    link.platform === 'GITHUB'
                      ? Github
                      : link.platform === 'LINKEDIN'
                        ? Linkedin
                        : link.platform === 'TWITTER'
                          ? Twitter
                          : Mail;

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Visual Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl p-3 bg-linear-to-b from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    width={320}
                    height={320}
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400">
                    <Sparkles className="h-12 w-12 mb-2 text-blue-500" />
                    <span className="font-mono text-xs">Profile Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
