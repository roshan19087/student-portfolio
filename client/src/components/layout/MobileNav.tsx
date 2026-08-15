import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  Code2,
  BookOpen,
  Layers,
  Terminal,
  GraduationCap,
  Award,
  FileText,
  Mail,
  Home,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle.js';
import { PublicSiteSettingsDto } from '@portfolio/shared';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  features?: PublicSiteSettingsDto['features'];
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeSection,
  features,
}) => {
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allNavItems = [
    { label: 'Home', href: '/#hero', sectionId: 'hero', icon: Home },
    { label: 'About', href: '/#about', sectionId: 'about', icon: Terminal },
    { label: 'Skills', href: '/#skills', sectionId: 'skills', icon: Code2 },
    { label: 'Projects', href: '/#projects', sectionId: 'projects', icon: Layers },
    {
      label: 'Apps',
      href: '/#apps',
      sectionId: 'apps',
      icon: Terminal,
      feature: 'appsEnabled' as const,
    },
    { label: 'Education', href: '/#education', sectionId: 'education', icon: GraduationCap },
    {
      label: 'Certificates',
      href: '/#certificates',
      sectionId: 'certificates',
      icon: Award,
      feature: 'certificatesEnabled' as const,
    },
    {
      label: 'Blog',
      href: '/blog',
      isRoute: true,
      icon: BookOpen,
      feature: 'blogEnabled' as const,
    },
    { label: 'Resume', href: '/resume', isRoute: true, icon: FileText },
    {
      label: 'Contact',
      href: '/#contact',
      sectionId: 'contact',
      icon: Mail,
      feature: 'contactFormEnabled' as const,
    },
  ];

  const navItems = allNavItems.filter((item) => {
    if (features && item.feature && features[item.feature] === false) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Navigation
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSectionActive = location.pathname === '/' && activeSection === item.sectionId;
              const isRouteActive = location.pathname.startsWith(item.href);
              const isActive = item.isRoute ? isRouteActive : isSectionActive;

              if (item.isRoute) {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
