import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme.js';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
        className || ''
      }`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400 hover:rotate-45 transition-transform duration-200" />
      ) : (
        <Moon className="h-5 w-5 text-zinc-700 hover:-rotate-12 transition-transform duration-200" />
      )}
    </button>
  );
};
