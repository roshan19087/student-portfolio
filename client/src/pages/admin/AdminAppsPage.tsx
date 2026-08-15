import React, { useEffect, useState } from 'react';
import { appService } from '../../services/appService.js';
import { PublicAppDetailDto, CreateAppInput, CreateAppReleaseInput } from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminTable } from '../../components/admin/AdminTable.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { EmptyState } from '../../components/admin/EmptyState.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import {
  Plus,
  Smartphone,
  Edit,
  Trash2,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';

export const AdminAppsPage: React.FC = () => {
  const [apps, setApps] = useState<PublicAppDetailDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PublicAppDetailDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<PublicAppDetailDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<CreateAppInput>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    iconUrl: '',
    webUrl: '',
    githubUrl: '',
    currentVersion: '1.0.0',
    isFeatured: false,
    displayOrder: 0,
    releases: [],
    screenshots: [],
  });

  const loadData = async () => {
    try {
      const data = await appService.getAdminApps();
      setApps(data);
    } catch {
      setApps([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingApp(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      iconUrl: '',
      webUrl: '',
      githubUrl: '',
      currentVersion: '1.0.0',
      isFeatured: false,
      displayOrder: apps.length + 1,
      releases: [],
      screenshots: [],
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: PublicAppDetailDto) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      slug: app.slug,
      tagline: app.tagline,
      description: app.description,
      iconUrl: app.iconUrl || '',
      webUrl: app.webUrl || '',
      githubUrl: app.githubUrl || '',
      currentVersion: app.currentVersion,
      isFeatured: app.isFeatured,
      displayOrder: app.displayOrder,
      releases: (app.allReleases || app.latestReleases || []).map((rel) => ({
        version: rel.version,
        platform: rel.platform,
        downloadUrl: rel.downloadUrl,
        releaseNotes: rel.releaseNotes,
        releaseDate: rel.releaseDate,
      })),
      screenshots: (app.screenshots || []).map((s) => ({
        imageUrl: s.imageUrl,
        caption: s.caption || '',
        displayOrder: s.displayOrder,
      })),
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => {
      if (!editingApp) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return { ...prev, name, slug };
      }
      return { ...prev, name };
    });
  };

  const handleAddRelease = () => {
    setFormData((prev) => ({
      ...prev,
      releases: [
        ...(prev.releases || []),
        {
          version: prev.currentVersion || '1.0.0',
          platform: 'CROSS_PLATFORM',
          downloadUrl: '',
          releaseNotes: 'Initial release',
        },
      ],
    }));
  };

  const handleRemoveRelease = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      releases: (prev.releases || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleReleaseChange = (
    index: number,
    field: keyof CreateAppReleaseInput,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.releases || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, releases: updated };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!formData.name.trim()) {
      setModalError('Application name is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setModalError('Slug is required.');
      return;
    }
    if (!formData.tagline.trim()) {
      setModalError('Tagline is required.');
      return;
    }
    if (!formData.description.trim()) {
      setModalError('Description is required.');
      return;
    }

    setIsSaving(true);
    setModalError('');

    try {
      if (editingApp) {
        await appService.updateApp(editingApp.id, formData);
        setNotification({
          type: 'success',
          message: `Application "${formData.name}" updated successfully!`,
        });
      } else {
        await appService.createApp(formData);
        setNotification({
          type: 'success',
          message: `Application "${formData.name}" created successfully!`,
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);

    try {
      await appService.deleteApp(deleteTarget.id);
      setNotification({ type: 'success', message: `Application "${deleteTarget.name}" deleted.` });
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete application.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Applications & Distribution"
        description="Manage downloadable desktop software, mobile builds, version releases, and binary distribution."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleOpenAdd}
          >
            Add Application
          </Button>
        }
      />

      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {apps.length === 0 ? (
        <EmptyState
          icon={<Smartphone className="h-8 w-8 text-zinc-400" />}
          title="No applications listed"
          description="Register a new desktop, mobile, or web application to distribute packages to users."
          actionLabel="Add Application"
          onAction={handleOpenAdd}
        />
      ) : (
        <AdminTable
          headers={['Application', 'Version', 'Featured', 'Platforms & Releases', 'Actions']}
        >
          {apps.map((app) => (
            <tr key={app.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700 shrink-0 flex items-center justify-center">
                    {app.iconUrl ? (
                      <img
                        src={app.iconUrl}
                        alt={app.name}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-mono font-bold text-blue-500">
                        {app.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{app.name}</span>
                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-xs">{app.tagline}</p>
                    <div className="text-[10px] font-mono text-zinc-400">/{app.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                v{app.currentVersion}
              </td>
              <td className="px-5 py-4">
                {app.isFeatured ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 font-mono">
                    <Sparkles className="h-3 w-3" />
                    <span>Featured</span>
                  </span>
                ) : (
                  <span className="text-zinc-400 text-xs">—</span>
                )}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {(app.allReleases || app.latestReleases || []).map((rel) => (
                    <Badge
                      key={rel.id || rel.version}
                      variant="neutral"
                      size="sm"
                      className="font-mono text-[10px]"
                    >
                      <Download className="h-2.5 w-2.5 mr-1 text-blue-500" />
                      {rel.platform}: v{rel.version}
                    </Badge>
                  ))}
                  {(!app.allReleases || app.allReleases.length === 0) && (
                    <span className="text-xs text-zinc-400">No releases</span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEdit(app)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    title="Edit app"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(app)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete app"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Application"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? All associated releases and download links will be removed.`}
        confirmLabel="Delete Application"
      />

      {/* Add / Edit App Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {editingApp ? 'Edit Application' : 'New Application'}
                </h2>
                <p className="text-xs text-zinc-500">
                  Configure software distribution, releases, binaries, and platform targets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Application Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. GitPulse CLI"
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. gitpulse-cli"
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 font-mono text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Tagline *
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g. Cross-platform developer utility"
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Detailed app overview, architecture, and feature description..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Current Version
                  </label>
                  <input
                    type="text"
                    value={formData.currentVersion}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, currentVersion: e.target.value }))
                    }
                    placeholder="1.0.0"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        displayOrder: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isAppFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                    }
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isAppFeatured"
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    Featured App
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Icon URL
                  </label>
                  <input
                    type="text"
                    value={formData.iconUrl || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, iconUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Web App URL
                  </label>
                  <input
                    type="url"
                    value={formData.webUrl || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, webUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Releases Section */}
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-900 dark:text-zinc-100">
                    Binary Releases & Downloads
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="h-3 w-3" />}
                    onClick={handleAddRelease}
                  >
                    Add Release
                  </Button>
                </div>

                {!formData.releases || formData.releases.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-1">No releases configured yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {formData.releases.map((rel, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Release #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRelease(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={rel.version}
                            onChange={(e) => handleReleaseChange(idx, 'version', e.target.value)}
                            placeholder="Version (e.g. 1.0.0)"
                            required
                            className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono"
                          />
                          <select
                            value={rel.platform}
                            onChange={(e) => handleReleaseChange(idx, 'platform', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                          >
                            <option value="WEB">Web</option>
                            <option value="IOS">iOS</option>
                            <option value="ANDROID">Android</option>
                            <option value="WINDOWS">Windows</option>
                            <option value="MACOS">macOS</option>
                            <option value="LINUX">Linux</option>
                            <option value="CROSS_PLATFORM">Cross Platform</option>
                          </select>
                          <input
                            type="text"
                            value={rel.downloadUrl}
                            onChange={(e) =>
                              handleReleaseChange(idx, 'downloadUrl', e.target.value)
                            }
                            placeholder="Download URL / Storage key"
                            required
                            className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                          />
                        </div>
                        <input
                          type="text"
                          value={rel.releaseNotes}
                          onChange={(e) => handleReleaseChange(idx, 'releaseNotes', e.target.value)}
                          placeholder="Release notes..."
                          required
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  {editingApp ? 'Save Changes' : 'Create Application'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
