import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  User,
  Layers,
  Smartphone,
  Code2,
  GraduationCap,
  BookOpen,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

export interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
}

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({
  isOpen,
  onClose,
  unreadCount = 0,
}) => {
  const { logout, user } = useAuth();

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

  const navItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Profile', to: '/admin/profile', icon: User },
    { label: 'Projects', to: '/admin/projects', icon: Layers },
    { label: 'Apps', to: '/admin/apps', icon: Smartphone },
    { label: 'Skills', to: '/admin/skills', icon: Code2 },
    { label: 'Credentials', to: '/admin/credentials', icon: GraduationCap },
    { label: 'Blog Posts', to: '/admin/blog', icon: BookOpen },
    {
      label: 'Messages',
      to: '/admin/messages',
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin Navigation Menu"
        className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">
                &lt;/&gt;
              </span>
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Admin CMS</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close admin menu"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-zinc-400 truncate">{user?.email}</span>
          </div>

          <nav aria-label="Admin Mobile Navigation" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="font-mono text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2">
          <Link
            to="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Site</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
