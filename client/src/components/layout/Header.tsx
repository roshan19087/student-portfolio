import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle.js';
import { MobileNav } from './MobileNav.js';
import { Container } from './Container.js';
import { useScrollSpy } from '../../hooks/useScrollSpy.js';
import { useSiteSettings } from '../../context/SiteSettingsContext.js';

export const Header: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const { settings, profile } = useSiteSettings();

  const sectionIds = [
    'hero',
    'about',
    'skills',
    'projects',
    'apps',
    'education',
    'certificates',
    'contact',
  ];
  const activeSection = useScrollSpy(sectionIds, 120);

  const allNavLinks = [
    { label: 'About', href: '/#about', sectionId: 'about' },
    { label: 'Skills', href: '/#skills', sectionId: 'skills' },
    { label: 'Projects', href: '/#projects', sectionId: 'projects' },
    { label: 'Apps', href: '/#apps', sectionId: 'apps', feature: 'appsEnabled' as const },
    { label: 'Education', href: '/#education', sectionId: 'education' },
    {
      label: 'Certificates',
      href: '/#certificates',
      sectionId: 'certificates',
      feature: 'certificatesEnabled' as const,
    },
    { label: 'Blog', href: '/blog', isRoute: true, feature: 'blogEnabled' as const },
    { label: 'Resume', href: '/resume', isRoute: true },
    {
      label: 'Contact',
      href: '/#contact',
      sectionId: 'contact',
      feature: 'contactFormEnabled' as const,
    },
  ];

  const navLinks = allNavLinks.filter((link) => {
    if (link.feature && settings.features[link.feature] === false) {
      return false;
    }
    return true;
  });

  const brandName = profile?.fullName || settings?.authorName || 'DevPortfolio';

  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
        <Container size="lg">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">
                &lt;/&gt;
              </span>
              <span className="text-base tracking-tight font-semibold">{brandName}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isSectionActive =
                  location.pathname === '/' && activeSection === link.sectionId;
                const isRouteActive = location.pathname.startsWith(link.href);
                const isActive = link.isRoute ? isRouteActive : isSectionActive;

                if (link.isRoute) {
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/30'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/30'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden sm:inline-flex" />

              {settings.features.contactFormEnabled !== false && (
                <a
                  href="/#contact"
                  className="hidden sm:inline-flex items-center justify-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
                >
                  Hire / Connect
                </a>
              )}

              {/* Mobile Hamburger */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-expanded={mobileNavOpen}
                aria-label="Open mobile menu"
                className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        activeSection={activeSection}
        features={settings.features}
      />
    </>
  );
};
