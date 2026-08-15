import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle.js';
import { useAuth } from '../../hooks/useAuth.js';

export interface AdminHeaderProps {
  onOpenMobileNav: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileNav }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open admin menu"
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline-block">
          Portfolio Control Center
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-800">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">{user?.email}</span>
          <button
            type="button"
            onClick={() => logout()}
            title="Log Out"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
