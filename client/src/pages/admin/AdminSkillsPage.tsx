import React, { useEffect, useState } from 'react';
import { skillService } from '../../services/skillService.js';
import {
  PublicSkillCategoryDto,
  PublicSkillDto,
  CreateSkillCategoryInput,
  CreateSkillInput,
} from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import {
  Plus,
  Code2,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Sparkles,
} from 'lucide-react';

export const AdminSkillsPage: React.FC = () => {
  const [categories, setCategories] = useState<PublicSkillCategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<PublicSkillCategoryDto | null>(null);
  const [catFormData, setCatFormData] = useState<CreateSkillCategoryInput>({
    name: '',
    displayOrder: 0,
  });

  // Skill Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{
    skill: PublicSkillDto;
    categoryId: string;
  } | null>(null);
  const [skillFormData, setSkillFormData] = useState<CreateSkillInput>({
    categoryId: '',
    name: '',
    iconUrl: '',
    proficiencyLevel: '',
    isFeatured: false,
    displayOrder: 0,
  });

  // Delete Target State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'category' | 'skill';
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadData = async () => {
    try {
      const data = await skillService.getSkillCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Category handlers
  const handleOpenAddCategory = () => {
    setEditingCat(null);
    setCatFormData({ name: '', displayOrder: categories.length + 1 });
    setModalError('');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat: PublicSkillCategoryDto) => {
    setEditingCat(cat);
    setCatFormData({ name: cat.name, displayOrder: cat.displayOrder });
    setModalError('');
    setIsCatModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    if (!catFormData.name.trim()) {
      setModalError('Category name is required.');
      return;
    }

    setIsSaving(true);
    setModalError('');

    try {
      if (editingCat) {
        await skillService.updateSkillCategory(editingCat.id, catFormData);
        setNotification({ type: 'success', message: `Category "${catFormData.name}" updated!` });
      } else {
        await skillService.createSkillCategory(catFormData);
        setNotification({ type: 'success', message: `Category "${catFormData.name}" created!` });
      }
      setIsCatModalOpen(false);
      await loadData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Error saving category.');
    } finally {
      setIsSaving(false);
    }
  };

  // Skill handlers
  const handleOpenAddSkill = (defaultCatId?: string) => {
    setEditingSkill(null);
    setSkillFormData({
      categoryId: defaultCatId || categories[0]?.id || '',
      name: '',
      iconUrl: '',
      proficiencyLevel: 'ADVANCED',
      isFeatured: false,
      displayOrder: 0,
    });
    setModalError('');
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill: PublicSkillDto, categoryId: string) => {
    setEditingSkill({ skill, categoryId });
    setSkillFormData({
      categoryId,
      name: skill.name,
      iconUrl: skill.iconUrl || '',
      proficiencyLevel: skill.proficiencyLevel || '',
      isFeatured: skill.isFeatured,
      displayOrder: skill.displayOrder,
    });
    setModalError('');
    setIsSkillModalOpen(true);
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    if (!skillFormData.name.trim()) {
      setModalError('Skill name is required.');
      return;
    }
    if (!skillFormData.categoryId) {
      setModalError('Please select a category.');
      return;
    }

    setIsSaving(true);
    setModalError('');

    try {
      if (editingSkill) {
        await skillService.updateSkill(editingSkill.skill.id, skillFormData);
        setNotification({ type: 'success', message: `Skill "${skillFormData.name}" updated!` });
      } else {
        await skillService.createSkill(skillFormData);
        setNotification({ type: 'success', message: `Skill "${skillFormData.name}" added!` });
      }
      setIsSkillModalOpen(false);
      await loadData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Error saving skill.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === 'category') {
        await skillService.deleteSkillCategory(deleteTarget.id);
        setNotification({ type: 'success', message: `Category "${deleteTarget.name}" deleted.` });
      } else {
        await skillService.deleteSkill(deleteTarget.id);
        setNotification({ type: 'success', message: `Skill "${deleteTarget.name}" deleted.` });
      }
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete.',
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
        title="Technical Skills Taxonomy"
        description="Organize programming languages, libraries, databases, and developer tooling into categories."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleOpenAddCategory}
            >
              Add Category
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => handleOpenAddSkill()}
              disabled={categories.length === 0}
            >
              Add Skill
            </Button>
          </div>
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

      {categories.length === 0 ? (
        <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <Code2 className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No skill categories found
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Create your first category to start organizing skills.
          </p>
          <Button variant="primary" size="sm" onClick={handleOpenAddCategory}>
            Add Category
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="p-6 border-zinc-200/90 dark:border-zinc-800/90 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-5 w-5 text-blue-500" />
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {category.name}
                  </h3>
                  <span className="font-mono text-xs text-zinc-400">
                    ({category.skills.length} skills)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    leftIcon={<Plus className="h-3 w-3" />}
                    onClick={() => handleOpenAddSkill(category.id)}
                  >
                    Add to Category
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenEditCategory(category)}
                    title="Edit category"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    onClick={() =>
                      setDeleteTarget({
                        type: 'category',
                        id: category.id,
                        name: category.name,
                      })
                    }
                    title="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {category.skills.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2">
                  No skills in this category. Click &quot;Add to Category&quot; to populate.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/30 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {skill.name}
                        </span>
                        {skill.isFeatured && (
                          <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {skill.proficiencyLevel && (
                          <span className="font-mono text-[10px] text-zinc-400 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                            {skill.proficiencyLevel}
                          </span>
                        )}
                        <button
                          onClick={() => handleOpenEditSkill(skill, category.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-blue-500 transition-opacity"
                          title="Edit skill"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: 'skill',
                              id: skill.id,
                              name: skill.name,
                            })
                          }
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-opacity"
                          title="Delete skill"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={deleteTarget?.type === 'category' ? 'Delete Category' : 'Delete Skill'}
        message={
          deleteTarget?.type === 'category'
            ? `Are you sure you want to delete category "${deleteTarget?.name}"? All associated skills will also be removed.`
            : `Are you sure you want to delete skill "${deleteTarget?.name}"?`
        }
        confirmLabel="Confirm Delete"
      />

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {editingCat ? 'Edit Skill Category' : 'New Skill Category'}
              </h2>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-xs text-red-700 dark:text-red-300">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCategorySubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={catFormData.name}
                  onChange={(e) => setCatFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Languages & Frameworks"
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Display Order
                </label>
                <input
                  type="number"
                  value={catFormData.displayOrder}
                  onChange={(e) =>
                    setCatFormData((prev) => ({
                      ...prev,
                      displayOrder: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCatModalOpen(false)}
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
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {editingSkill ? 'Edit Skill' : 'New Technical Skill'}
              </h2>
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-xs text-red-700 dark:text-red-300">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSkillSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Category *
                </label>
                <select
                  value={skillFormData.categoryId}
                  onChange={(e) =>
                    setSkillFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={skillFormData.name}
                  onChange={(e) => setSkillFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. TypeScript, React, Docker"
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Proficiency Level
                  </label>
                  <input
                    type="text"
                    value={skillFormData.proficiencyLevel || ''}
                    onChange={(e) =>
                      setSkillFormData((prev) => ({ ...prev, proficiencyLevel: e.target.value }))
                    }
                    placeholder="e.g. ADVANCED, EXPERT"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={skillFormData.displayOrder}
                    onChange={(e) =>
                      setSkillFormData((prev) => ({
                        ...prev,
                        displayOrder: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isSkillFeatured"
                  checked={skillFormData.isFeatured}
                  onChange={(e) =>
                    setSkillFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                  }
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="isSkillFeatured"
                  className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  Featured Skill
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSkillModalOpen(false)}
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
                  Save Skill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
