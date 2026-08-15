import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { blogService } from '../../services/blogService.js';
import { CreateBlogPostInput } from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { ArrowLeft, Save, Eye, Edit3, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminBlogEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<CreateBlogPostInput>({
    title: '',
    slug: '',
    summary: '',
    contentMarkdown: '',
    coverImageUrl: '',
    readingTimeMinutes: 5,
    status: 'DRAFT',
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (id) {
      blogService
        .getAdminPostById(id)
        .then((post) => {
          setFormData({
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            contentMarkdown: post.contentMarkdown,
            coverImageUrl: post.coverImageUrl || '',
            readingTimeMinutes: post.readingTimeMinutes,
            status: post.publishedAt ? 'PUBLISHED' : 'DRAFT',
            tags: post.tags.map((t) => t.name),
          });
          setTagsInput(post.tags.map((t) => t.name).join(', '));
        })
        .catch((err) => {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to load article.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => {
      if (!id) {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return { ...prev, title, slug };
      }
      return { ...prev, title };
    });
  };

  const handleSave = async (targetStatus: 'DRAFT' | 'PUBLISHED') => {
    if (isSaving) return;

    if (!formData.title.trim()) {
      setErrorMessage('Article title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setErrorMessage('Article slug is required.');
      return;
    }
    if (!formData.summary.trim()) {
      setErrorMessage('Article summary is required.');
      return;
    }
    if (!formData.contentMarkdown.trim()) {
      setErrorMessage('Content is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: CreateBlogPostInput = {
      ...formData,
      status: targetStatus,
      tags: tagsArray,
      publishedAt: targetStatus === 'PUBLISHED' ? new Date().toISOString() : null,
    };

    try {
      if (id) {
        await blogService.updatePost(id, payload);
      } else {
        await blogService.createPost(payload);
      }
      setSuccessMessage(
        targetStatus === 'PUBLISHED'
          ? 'Article published successfully!'
          : 'Draft saved successfully!',
      );
      setTimeout(() => {
        navigate('/admin/blog');
      }, 800);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save article.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/blog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Articles</span>
      </Link>

      <AdminPageHeader
        title={formData.title ? `Article: ${formData.title}` : 'Create New Article'}
        description="Author technical content using clean Markdown formatting and live preview."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Save className="h-4 w-4" />}
              onClick={() => handleSave('DRAFT')}
              isLoading={isSaving}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Globe className="h-4 w-4" />}
              onClick={() => handleSave('PUBLISHED')}
              isLoading={isSaving}
            >
              Publish Article
            </Button>
          </div>
        }
      />

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Settings */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-900 dark:text-zinc-100">
              Article Meta
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Article Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Architecting Distributed Systems"
                required
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="architecting-distributed-systems"
                required
                className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Short Summary *
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="A concise synopsis displayed on article cards..."
                required
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Read Time (min)
                </label>
                <input
                  type="number"
                  value={formData.readingTimeMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      readingTimeMinutes: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as CreateBlogPostInput['status'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="TypeScript, Docker, PostgreSQL"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Cover Image URL
              </label>
              <input
                type="text"
                value={formData.coverImageUrl || ''}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </Card>
        </div>

        {/* Right Editor Area */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-5 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Markdown Supported</span>
            </div>

            {activeTab === 'edit' ? (
              <textarea
                rows={18}
                value={formData.contentMarkdown}
                onChange={(e) => setFormData({ ...formData, contentMarkdown: e.target.value })}
                placeholder="# Introduction&#10;&#10;Write your article content here in standard markdown..."
                className="w-full p-4 font-mono text-xs leading-relaxed bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            ) : (
              <div className="p-6 min-h-[420px] bg-zinc-50/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl prose dark:prose-invert prose-sm max-w-none">
                <Markdown>
                  {formData.contentMarkdown ||
                    '*No content written yet. Switch to the Editor tab to start typing.*'}
                </Markdown>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
