import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService.js';
import { PublicSiteSettingsDto, UpdateSettingsInput } from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Save, CheckCircle2, AlertCircle, Sliders, Globe } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PublicSiteSettingsDto | null>(null);
  const [formData, setFormData] = useState<UpdateSettingsInput>({
    siteTitle: '',
    siteDescription: '',
    authorName: '',
    seoKeywords: [],
    features: {
      blogEnabled: true,
      appsEnabled: true,
      certificatesEnabled: true,
      contactFormEnabled: true,
    },
  });
  const [keywordsText, setKeywordsText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    settingsService
      .getSettings()
      .then((data) => {
        setSettings(data);
        setFormData({
          siteTitle: data.siteTitle,
          siteDescription: data.siteDescription,
          authorName: data.authorName,
          seoKeywords: data.seoKeywords,
          features: data.features,
        });
        setKeywordsText(data.seoKeywords.join(', '));
      })
      .catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load site settings');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleFeature = (key: keyof UpdateSettingsInput['features']) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (
      !formData.siteTitle.trim() ||
      !formData.authorName.trim() ||
      !formData.siteDescription.trim()
    ) {
      setErrorMessage('Site title, author name, and description are required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    const keywords = keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const payload: UpdateSettingsInput = {
      ...formData,
      seoKeywords: keywords,
    };

    try {
      const updated = await settingsService.updateSettings(payload);
      setSettings(updated);
      setSuccessMessage('Site settings updated and persisted successfully!');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update site settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Site Settings & Features"
        description="Configure metadata, SEO tags, canonical author identity, and public feature flags."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save Settings
          </Button>
        }
      />

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* General Meta Settings */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Globe className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-zinc-900 dark:text-zinc-100">
                General & SEO Metadata
              </h3>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="siteTitle"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Site Title *
              </label>
              <input
                id="siteTitle"
                type="text"
                value={formData.siteTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, siteTitle: e.target.value }))}
                required
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="authorName"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Author Name *
              </label>
              <input
                id="authorName"
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                required
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="siteDescription"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Site Meta Description *
              </label>
              <textarea
                id="siteDescription"
                rows={3}
                value={formData.siteDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, siteDescription: e.target.value }))
                }
                required
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="keywords"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                SEO Keywords (comma separated)
              </label>
              <input
                id="keywords"
                type="text"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                placeholder="developer, portfolio, full-stack, react"
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </Card>
        </div>

        {/* Feature Toggles */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Sliders className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-zinc-900 dark:text-zinc-100">
                Public Modules & Features
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Engineering Blog
                  </div>
                  <div className="text-[11px] text-zinc-500">Enable technical articles section</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.features.blogEnabled}
                  onChange={() => handleToggleFeature('blogEnabled')}
                  className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Application Hub
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Enable downloadable software catalog
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.features.appsEnabled}
                  onChange={() => handleToggleFeature('appsEnabled')}
                  className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Certifications & Badges
                  </div>
                  <div className="text-[11px] text-zinc-500">Show professional credentials</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.features.certificatesEnabled}
                  onChange={() => handleToggleFeature('certificatesEnabled')}
                  className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Contact Form
                  </div>
                  <div className="text-[11px] text-zinc-500">Enable direct contact messaging</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.features.contactFormEnabled}
                  onChange={() => handleToggleFeature('contactFormEnabled')}
                  className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};
