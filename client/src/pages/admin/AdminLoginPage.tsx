import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { LoginInputSchema } from '@portfolio/shared';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to /admin or requested location
  if (isAuthenticated && !isLoading) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const validation = LoginInputSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Invalid login credentials. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-md space-y-6">
        {/* Return to Public Site */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Public Portfolio</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 items-center justify-center font-mono font-extrabold text-lg mb-2">
            &lt;/&gt;
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Sign In</h1>
          <p className="text-xs text-zinc-500">
            Enter your authorized administrative credentials to access the CMS.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 border-zinc-200/90 dark:border-zinc-800/90 shadow-sm">
          {serverError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-colors`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-colors`}
                />
              </div>
              {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
