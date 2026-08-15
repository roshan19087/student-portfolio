import React, { useEffect, useState } from 'react';
import { projectService } from '../../services/projectService.js';
import { skillService } from '../../services/skillService.js';
import { PublicProjectDetailDto, CreateProjectInput, PublicSkillDto } from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminTable } from '../../components/admin/AdminTable.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { EmptyState } from '../../components/admin/EmptyState.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { Card } from '../../components/common/Card.js';
import {
  Plus,
  Search,
  Layers,
  Edit,
  Trash2,
  Sparkles,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<PublicProjectDetailDto[]>([]);
  const [availableSkills, setAvailableSkills] = useState<PublicSkillDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<PublicProjectDetailDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PublicProjectDetailDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<CreateProjectInput>({
    title: '',
    slug: '',
    shortSummary: '',
    fullDescription: '',
    thumbnailUrl: '',
    githubUrl: '',
    liveDemoUrl: '',
    downloadUrl: '',
    status: 'COMPLETED',
    isFeatured: false,
    displayOrder: 0,
    skillIds: [],
    screenshots: [],
  });

  const loadData = async () => {
    try {
      const [projectsData, categoriesData] = await Promise.all([
        projectService.getAdminProjects(),
        skillService.getSkills().catch(() => []),
      ]);
      setProjects(projectsData);
      setAvailableSkills((categoriesData || []).flatMap((c) => c.skills || []));
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      shortSummary: '',
      fullDescription: '',
      thumbnailUrl: '',
      githubUrl: '',
      liveDemoUrl: '',
      downloadUrl: '',
      status: 'COMPLETED',
      isFeatured: false,
      displayOrder: projects.length + 1,
      skillIds: [],
      screenshots: [],
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: PublicProjectDetailDto) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      shortSummary: project.shortSummary,
      fullDescription: project.fullDescription,
      thumbnailUrl: project.thumbnailUrl || '',
      githubUrl: project.githubUrl || '',
      liveDemoUrl: project.liveDemoUrl || '',
      downloadUrl: project.downloadUrl || '',
      status: project.status,
      isFeatured: project.isFeatured,
      displayOrder: project.displayOrder,
      skillIds: project.skills.map((s) => s.id),
      screenshots: project.screenshots.map((s) => ({
        imageUrl: s.imageUrl,
        caption: s.caption || '',
        displayOrder: s.displayOrder,
      })),
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => {
      // auto-generate slug on add if user hasn't explicitly customized slug
      if (!editingProject) {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return { ...prev, title, slug };
      }
      return { ...prev, title };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!formData.title.trim()) {
      setModalError('Project title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setModalError('Project slug is required.');
      return;
    }
    if (!formData.shortSummary.trim()) {
      setModalError('Short summary is required.');
      return;
    }
    if (!formData.fullDescription.trim()) {
      setModalError('Full description is required.');
      return;
    }

    setIsSaving(true);
    setModalError('');

    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData);
        setNotification({
          type: 'success',
          message: `Project "${formData.title}" updated successfully!`,
        });
      } else {
        await projectService.createProject(formData);
        setNotification({
          type: 'success',
          message: `Project "${formData.title}" created successfully!`,
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
      await projectService.deleteProject(deleteTarget.id);
      setNotification({ type: 'success', message: `Project "${deleteTarget.title}" deleted.` });
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete project.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortSummary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects & Showcase"
        description="Manage software engineering projects, live demos, repositories, and screenshots."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleOpenAdd}
          >
            Add Project
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

      {/* Filter and Search Bar */}
      <Card className="p-4 border-zinc-200/90 dark:border-zinc-800/90 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </Card>

      {/* Projects Table */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-8 w-8 text-zinc-400" />}
          title="No projects found"
          description="Try modifying your search query or add a new project to your showcase."
          actionLabel="Add Project"
          onAction={handleOpenAdd}
        />
      ) : (
        <AdminTable headers={['Project', 'Status', 'Featured', 'Tech Stack', 'Links', 'Actions']}>
          {filteredProjects.map((p) => (
            <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="px-5 py-4">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</div>
                  <div className="text-xs text-zinc-500 line-clamp-1">{p.shortSummary}</div>
                  <div className="text-[10px] font-mono text-zinc-400">/{p.slug}</div>
                </div>
              </td>

              <td className="px-5 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    p.status === 'COMPLETED'
                      ? 'success'
                      : p.status === 'IN_PROGRESS'
                        ? 'warning'
                        : 'neutral'
                  }
                  size="sm"
                >
                  {p.status}
                </Badge>
              </td>

              <td className="px-5 py-4 whitespace-nowrap">
                {p.isFeatured ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <Sparkles className="h-3.5 w-3.5" /> Featured
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400">—</span>
                )}
              </td>

              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {p.skills.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    >
                      {s.name}
                    </span>
                  ))}
                  {p.skills.length > 3 && (
                    <span className="text-[10px] font-mono text-zinc-400 self-center">
                      +{p.skills.length - 3}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-zinc-400">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-zinc-900 dark:hover:text-white"
                      title="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {p.liveDemoUrl && (
                    <a
                      href={p.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-500"
                      title="Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </td>

              <td className="px-5 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    title="Edit project"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete project"
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
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Project"
      />

      {/* Add / Edit Project Modal */}
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
                  {editingProject ? 'Edit Project' : 'New Project Showcase'}
                </h2>
                <p className="text-xs text-zinc-500">
                  Fill in the project metadata, descriptions, URLs, and technologies.
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
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Distributed Task Queue"
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
                    placeholder="e.g. distributed-task-queue"
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 font-mono text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Short Summary (Card View) *
                </label>
                <textarea
                  rows={2}
                  value={formData.shortSummary}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, shortSummary: e.target.value }))
                  }
                  placeholder="High-level overview for cards and list views..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Markdown Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))
                  }
                  placeholder="Detailed project architecture, technical highlights, achievements..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveDemoUrl || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, liveDemoUrl: e.target.value }))
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as CreateProjectInput['status'],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
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
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                    }
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    Featured on Home
                  </label>
                </div>
              </div>

              {availableSkills.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Associated Skills & Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                    {availableSkills.map((skill) => {
                      const selected = (formData.skillIds || []).includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const existing = prev.skillIds || [];
                              const updated = selected
                                ? existing.filter((id) => id !== skill.id)
                                : [...existing, skill.id];
                              return { ...prev, skillIds: updated };
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                            selected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
