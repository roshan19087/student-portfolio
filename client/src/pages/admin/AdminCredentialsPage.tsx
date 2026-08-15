import React, { useEffect, useState } from 'react';
import { educationService } from '../../services/educationService.js';
import { certificateService } from '../../services/certificateService.js';
import {
  PublicEducationDto,
  PublicCertificateDto,
  CreateEducationInput,
  CreateCertificateInput,
} from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import {
  Plus,
  GraduationCap,
  Award,
  Edit,
  Trash2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';

export const AdminCredentialsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'education' | 'certificates'>('education');
  const [education, setEducation] = useState<PublicEducationDto[]>([]);
  const [certificates, setCertificates] = useState<PublicCertificateDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Education Modal
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<PublicEducationDto | null>(null);
  const [eduFormData, setEduFormData] = useState<CreateEducationInput>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    gradeOrCgpa: '',
    activities: '',
    coursework: [],
    displayOrder: 0,
  });
  const [courseworkText, setCourseworkText] = useState('');

  // Certificate Modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<PublicCertificateDto | null>(null);
  const [certFormData, setCertFormData] = useState<CreateCertificateInput>({
    title: '',
    issuer: '',
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
    category: '',
    displayOrder: 0,
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'education' | 'certificate';
    id: string;
    title: string;
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
      const [eduData, certData] = await Promise.all([
        educationService.getEducation().catch(() => []),
        certificateService.getCertificates().catch(() => []),
      ]);
      setEducation(eduData);
      setCertificates(certData);
    } catch {
      setEducation([]);
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Education Handlers
  const handleOpenAddEdu = () => {
    setEditingEdu(null);
    setEduFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gradeOrCgpa: '',
      activities: '',
      coursework: [],
      displayOrder: education.length + 1,
    });
    setCourseworkText('');
    setModalError('');
    setIsEduModalOpen(true);
  };

  const handleOpenEditEdu = (edu: PublicEducationDto) => {
    setEditingEdu(edu);
    setEduFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      gradeOrCgpa: edu.gradeOrCgpa || '',
      activities: edu.activities || '',
      coursework: edu.coursework || [],
      displayOrder: edu.displayOrder,
    });
    setCourseworkText((edu.coursework || []).join(', '));
    setModalError('');
    setIsEduModalOpen(true);
  };

  const handleEduSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (
      !eduFormData.institution.trim() ||
      !eduFormData.degree.trim() ||
      !eduFormData.startDate.trim()
    ) {
      setModalError('Institution, degree, and start date are required.');
      return;
    }

    setIsSaving(true);
    setModalError('');

    const courseworkArray = courseworkText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = { ...eduFormData, coursework: courseworkArray };

    try {
      if (editingEdu) {
        await educationService.updateEducation(editingEdu.id, payload);
        setNotification({ type: 'success', message: `Education record updated!` });
      } else {
        await educationService.createEducation(payload);
        setNotification({ type: 'success', message: `Education record created!` });
      }
      setIsEduModalOpen(false);
      await loadData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to save education record.');
    } finally {
      setIsSaving(false);
    }
  };

  // Certificate Handlers
  const handleOpenAddCert = () => {
    setEditingCert(null);
    setCertFormData({
      title: '',
      issuer: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
      imageUrl: '',
      category: '',
      displayOrder: certificates.length + 1,
    });
    setModalError('');
    setIsCertModalOpen(true);
  };

  const handleOpenEditCert = (cert: PublicCertificateDto) => {
    setEditingCert(cert);
    setCertFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expirationDate: cert.expirationDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      imageUrl: cert.imageUrl || '',
      category: cert.category || '',
      displayOrder: cert.displayOrder,
    });
    setModalError('');
    setIsCertModalOpen(true);
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (
      !certFormData.title.trim() ||
      !certFormData.issuer.trim() ||
      !certFormData.issueDate.trim()
    ) {
      setModalError('Title, issuer, and issue date are required.');
      return;
    }

    setIsSaving(true);
    setModalError('');

    try {
      if (editingCert) {
        await certificateService.updateCertificate(editingCert.id, certFormData);
        setNotification({
          type: 'success',
          message: `Certificate "${certFormData.title}" updated!`,
        });
      } else {
        await certificateService.createCertificate(certFormData);
        setNotification({ type: 'success', message: `Certificate "${certFormData.title}" added!` });
      }
      setIsCertModalOpen(false);
      await loadData();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to save certificate.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === 'education') {
        await educationService.deleteEducation(deleteTarget.id);
        setNotification({ type: 'success', message: `Education record deleted.` });
      } else {
        await certificateService.deleteCertificate(deleteTarget.id);
        setNotification({ type: 'success', message: `Certificate deleted.` });
      }
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete record.',
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
        title="Education & Credentials"
        description="Manage your academic background, degree coursework, and verified professional certifications."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={activeTab === 'education' ? handleOpenAddEdu : handleOpenAddCert}
          >
            {activeTab === 'education' ? 'Add Degree' : 'Add Certificate'}
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'education'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Education ({education.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Certifications ({certificates.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'education' ? (
        <div className="space-y-4">
          {education.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4">No education records found.</p>
          ) : (
            education.map((edu) => (
              <Card
                key={edu.id}
                className="p-6 border-zinc-200/90 dark:border-zinc-800/90 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {edu.institution}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {edu.degree} — {edu.fieldOfStudy}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditEdu(edu)}
                      title="Edit education"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'education',
                          id: edu.id,
                          title: `${edu.degree} at ${edu.institution}`,
                        })
                      }
                      title="Delete education"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </span>
                  </div>
                  {edu.gradeOrCgpa && <div>GPA: {edu.gradeOrCgpa}</div>}
                </div>

                {edu.activities && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{edu.activities}</p>
                )}

                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {edu.coursework.map((course, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 col-span-2">No certificates found.</p>
          ) : (
            certificates.map((cert) => (
              <Card
                key={cert.id}
                className="p-6 border-zinc-200/90 dark:border-zinc-800/90 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-500" />
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {cert.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditCert(cert)}
                        title="Edit certificate"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          setDeleteTarget({
                            type: 'certificate',
                            id: cert.id,
                            title: cert.title,
                          })
                        }
                        title="Delete certificate"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {cert.issuer}
                  </p>
                  <p className="text-xs font-mono text-zinc-400">Issued: {cert.issueDate}</p>
                </div>

                {cert.credentialUrl && (
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Verify Credential</span>
                    </a>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={
          deleteTarget?.type === 'education' ? 'Delete Education Record' : 'Delete Certificate'
        }
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Confirm Delete"
      />

      {/* Education Form Modal */}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {editingEdu ? 'Edit Degree / Education' : 'Add Degree / Education'}
              </h2>
              <button
                type="button"
                onClick={() => setIsEduModalOpen(false)}
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

            <form onSubmit={handleEduSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={eduFormData.institution}
                  onChange={(e) =>
                    setEduFormData((prev) => ({ ...prev, institution: e.target.value }))
                  }
                  placeholder="e.g. University of California, Berkeley"
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={eduFormData.degree}
                    onChange={(e) =>
                      setEduFormData((prev) => ({ ...prev, degree: e.target.value }))
                    }
                    placeholder="e.g. Bachelor of Science"
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    value={eduFormData.fieldOfStudy}
                    onChange={(e) =>
                      setEduFormData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))
                    }
                    placeholder="e.g. Computer Science"
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Start Date *
                  </label>
                  <input
                    type="text"
                    value={eduFormData.startDate}
                    onChange={(e) =>
                      setEduFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    placeholder="2022-09 or Fall 2022"
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={eduFormData.endDate || ''}
                    onChange={(e) =>
                      setEduFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    placeholder="2026-05 (leave blank for Present)"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Grade / CGPA
                  </label>
                  <input
                    type="text"
                    value={eduFormData.gradeOrCgpa || ''}
                    onChange={(e) =>
                      setEduFormData((prev) => ({ ...prev, gradeOrCgpa: e.target.value }))
                    }
                    placeholder="e.g. 3.9 / 4.0"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Key Coursework (comma-separated)
                </label>
                <input
                  type="text"
                  value={courseworkText}
                  onChange={(e) => setCourseworkText(e.target.value)}
                  placeholder="Data Structures, Algorithms, Distributed Systems"
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Activities & Societies
                </label>
                <textarea
                  rows={2}
                  value={eduFormData.activities || ''}
                  onChange={(e) =>
                    setEduFormData((prev) => ({ ...prev, activities: e.target.value }))
                  }
                  placeholder="ACM Student Chapter, Hackathon Organizer..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Display Order
                </label>
                <input
                  type="number"
                  value={eduFormData.displayOrder}
                  onChange={(e) =>
                    setEduFormData((prev) => ({
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
                  onClick={() => setIsEduModalOpen(false)}
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
                  Save Degree
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Form Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fadeIn">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {editingCert ? 'Edit Certificate' : 'Add Professional Certificate'}
              </h2>
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
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

            <form onSubmit={handleCertSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={certFormData.title}
                  onChange={(e) => setCertFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Issuer / Organization *
                  </label>
                  <input
                    type="text"
                    value={certFormData.issuer}
                    onChange={(e) =>
                      setCertFormData((prev) => ({ ...prev, issuer: e.target.value }))
                    }
                    placeholder="e.g. Amazon Web Services"
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Issue Date *
                  </label>
                  <input
                    type="text"
                    value={certFormData.issueDate}
                    onChange={(e) =>
                      setCertFormData((prev) => ({ ...prev, issueDate: e.target.value }))
                    }
                    placeholder="e.g. 2025-06"
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Verification Credential URL
                </label>
                <input
                  type="url"
                  value={certFormData.credentialUrl || ''}
                  onChange={(e) =>
                    setCertFormData((prev) => ({ ...prev, credentialUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={certFormData.credentialId || ''}
                    onChange={(e) =>
                      setCertFormData((prev) => ({ ...prev, credentialId: e.target.value }))
                    }
                    placeholder="e.g. AWS-12345"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value={certFormData.category || ''}
                    onChange={(e) =>
                      setCertFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    placeholder="e.g. Cloud Architecture"
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCertModalOpen(false)}
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
                  Save Certificate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
