import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Container } from './Container.js';
import { useSiteSettings } from '../../context/SiteSettingsContext.js';

export const Footer: React.FC = () => {
  const { settings, profile } = useSiteSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandName = profile?.fullName || settings?.authorName || 'DevPortfolio';
  const authorName = settings?.authorName || profile?.fullName || 'Student Developer';
  const description =
    settings?.siteDescription ||
    profile?.shortBio ||
    'Student developer & software builder crafting modern web apps, APIs, and scalable digital solutions.';

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950 py-12 transition-colors">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold tracking-tight"
            >
              <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">
                &lt;/&gt;
              </span>
              <span className="text-base">{brandName}</span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="/#about"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About Me
                </a>
              </li>
              <li>
                <a
                  href="/#projects"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Featured Projects
                </a>
              </li>
              {settings.features.appsEnabled !== false && (
                <li>
                  <a
                    href="/#apps"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Applications
                  </a>
                </li>
              )}
              {settings.features.blogEnabled !== false && (
                <li>
                  <Link
                    to="/blog"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Technical Blog
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/resume"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              Connect
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-zinc-500 dark:text-zinc-400">
              {profile?.socialLinks && profile.socialLinks.length > 0 ? (
                profile.socialLinks.map((link) => {
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
                      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })
              ) : (
                <>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="/#contact"
                    aria-label="Contact Email"
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>
            © {new Date().getFullYear()} {authorName}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </Container>
    </footer>
  );
};
