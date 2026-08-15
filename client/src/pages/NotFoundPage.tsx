import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container.js';
import { Button } from '../components/common/Button.js';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <main id="main-content" className="flex min-h-[70vh] items-center justify-center py-16">
      <Container size="sm" className="text-center space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
          <Compass className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            The page or case study you are looking for might have been moved, renamed, or is
            temporarily unavailable.
          </p>
        </div>

        <div>
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="h-4 w-4" />}>
              Back to Homepage
            </Button>
          </Link>
        </div>
      </Container>
    </main>
  );
};
