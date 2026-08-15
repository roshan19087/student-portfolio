import React, { useEffect, useState, useRef } from 'react';
import { profileService } from '../../services/profileService.js';
import { mediaService } from '../../services/mediaService.js';
import { PublicProfileDto, UpdateProfileInput, SocialLinkInput } from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import {
  User,
  MapPin,
  FileText,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Loader2,
  X,
} from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PublicProfileDto | null>(null);
  const [formData, setFormData] = useState<UpdateProfileInput>({
    fullName: '',
    tagline: '',
    shortBio: '',
    fullAbout: '',
    location: '',
    statusBadge: '',
    isAvailable: true,
    avatarUrl: '',
    resumePdfUrl: '',
    socialLinks: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    profileService
      .getAdminProfile()
      .then((data) => {
        if (mounted) {
          setProfile(data);
          setFormData({
            fullName: data.fullName,
            tagline: data.tagline,
            shortBio: data.shortBio,
            fullAbout: data.fullAbout,
            location: data.location || '',
            statusBadge: data.statusBadge || '',
            isAvailable: data.isAvailable,
            avatarUrl: data.avatarUrl || '',
            resumePdfUrl: data.resumePdfUrl || '',
            socialLinks: data.socialLinks.map((s) => ({
              id: s.id,
              platform: s.platform,
              url: s.url,
              iconName: s.iconName || null,
              displayOrder: s.displayOrder,
            })),
          });
        }
      })
      .catch((err) => {
        if (mounted) {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to load profile');
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLinkInput, value: string) => {
    setFormData((prev) => {
      const updated = [...(prev.socialLinks || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, socialLinks: updated };
    });
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const handleAddSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...(prev.socialLinks || []),
        {
          platform: 'GitHub',
          url: 'https://github.com/',
          iconName: 'github',
          displayOrder: (prev.socialLinks || []).length + 1,
        },
      ],
    }));
  };

  const handleRemoveSocialLink = (index: number) => {
    setFormData((prev) => {
      const updated = (prev.socialLinks || []).filter((_, idx) => idx !== index);
      return { ...prev, socialLinks: updated };
    });
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file format. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds maximum limit of 5MB.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      const res = await mediaService.uploadFile(file);
      const uploadedUrl = res.publicUrl || res.url;
      setFormData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
      setSuccessMessage('Avatar uploaded successfully! Remember to click Save Changes to persist.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!formData.fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!formData.tagline.trim()) {
      setErrorMessage('Tagline is required.');
      return;
    }
    if (!formData.shortBio.trim()) {
      setErrorMessage('Short bio is required.');
      return;
    }
    if (!formData.fullAbout.trim()) {
      setErrorMessage('Full about description is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updated = await profileService.updateAdminProfile(formData);
      setProfile(updated);
      setSuccessMessage('Profile changes saved successfully!');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to update profile. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Profile & Bio Management"
        description="Configure your personal branding, headline, bio, and social links showcased on the website."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
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

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Live Preview Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border-zinc-200/90 dark:border-zinc-800/90 text-center space-y-4 sticky top-24">
            <div className="relative w-28 h-28 mx-auto rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center group">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.fullName || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-zinc-400" />
              )}
            </div>

            {/* Avatar Upload Actions */}
            <div className="flex items-center justify-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageUpload}
                aria-label="Upload Avatar Image"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFileClick}
                disabled={isUploading}
                leftIcon={
                  isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )
                }
              >
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Remove avatar"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formData.fullName || 'Your Name'}
              </h2>
              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                {formData.tagline || 'Your Professional Tagline'}
              </p>
            </div>

            <div className="flex justify-center">
              <Badge
                variant={formData.isAvailable ? 'success' : 'neutral'}
                size="sm"
                className="font-mono text-xs"
              >
                {formData.statusBadge || (formData.isAvailable ? 'Available' : 'Unavailable')}
              </Badge>
            </div>

            {formData.location && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 font-mono">
                <MapPin className="h-3.5 w-3.5" />
                <span>{formData.location}</span>
              </div>
            )}

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3 text-left">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-bold uppercase font-mono text-zinc-900 dark:text-zinc-100">
                  Resume Link
                </span>
              </div>
              <input
                type="text"
                name="resumePdfUrl"
                value={formData.resumePdfUrl || ''}
                onChange={handleChange}
                placeholder="/assets/resume.pdf or URL"
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </Card>
        </div>

        {/* Right: Editable Profile Form Structure */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-6">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="location"
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="tagline"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Professional Tagline *
              </label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Full-Stack Developer & CS Student"
                required
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="statusBadge"
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Status Badge Text
                </label>
                <input
                  id="statusBadge"
                  name="statusBadge"
                  type="text"
                  value={formData.statusBadge || ''}
                  onChange={handleChange}
                  placeholder="e.g. Open for Summer 2026 Internships"
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="avatarUrl"
                  className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Avatar Image URL
                </label>
                <input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="text"
                  value={formData.avatarUrl || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="isAvailable"
                className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                Available for hire / contract / internship opportunities
              </label>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="shortBio"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Short Bio (Hero section) *
              </label>
              <textarea
                id="shortBio"
                name="shortBio"
                rows={3}
                value={formData.shortBio}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="fullAbout"
                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Full About Description (About section) *
              </label>
              <textarea
                id="fullAbout"
                name="fullAbout"
                rows={5}
                value={formData.fullAbout}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 resize-none"
              />
            </div>
          </Card>

          {/* Social Links List */}
          <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-zinc-900 dark:text-zinc-100">
                Social Profiles & Links
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={handleAddSocialLink}
              >
                Add Link
              </Button>
            </div>

            {!formData.socialLinks || formData.socialLinks.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">No social links configured yet.</p>
            ) : (
              <div className="space-y-3">
                {formData.socialLinks.map((link, idx) => (
                  <div
                    key={link.id || idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs"
                  >
                    <Globe className="h-4 w-4 text-blue-500 shrink-0 hidden sm:block" />

                    <div className="w-full sm:w-36">
                      <select
                        aria-label={`Social platform ${idx + 1}`}
                        value={link.platform}
                        onChange={(e) => handleSocialLinkChange(idx, 'platform', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      >
                        <option value="GitHub">GitHub</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter">Twitter / X</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Discord">Discord</option>
                        <option value="Portfolio">Portfolio / Other</option>
                      </select>
                    </div>

                    <div className="flex-1 w-full">
                      <input
                        type="url"
                        aria-label={`Social URL ${idx + 1}`}
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(idx, 'url', e.target.value)}
                        placeholder="https://..."
                        required
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(idx)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer self-end sm:self-center"
                      title="Remove link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </form>
    </div>
  );
};
