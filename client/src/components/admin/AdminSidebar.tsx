import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
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

export const AdminSidebar: React.FC<{ unreadCount?: number }> = ({ unreadCount = 0 }) => {
  const { logout, user } = useAuth();

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
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between p-4 min-h-screen">
      <div className="space-y-6">
        {/* Brand & Badge */}
        <div className="px-3 pt-2">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">
              &lt;/&gt;
            </span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Admin CMS</span>
          </Link>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono text-zinc-400 truncate">
              {user?.email || 'admin'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Admin Sidebar" className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="font-mono text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-1">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Public Site</span>
        </Link>

        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
