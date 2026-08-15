import React, { useState } from 'react';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { Card } from '../common/Card.js';
import { Modal } from '../common/Modal.js';
import { PublicCertificateDto } from '@portfolio/shared';
import { Award, ExternalLink, Calendar, Eye } from 'lucide-react';

export interface CertificatesSectionProps {
  certificates: PublicCertificateDto[];
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [selectedCert, setSelectedCert] = useState<PublicCertificateDto | null>(null);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <Section id="certificates">
      <Container size="lg">
        <SectionHeading
          badge="Certifications & Honors"
          title="Certificates, credentials, and achievements."
          description="Industry certifications, technical qualifications, and competitive engineering milestones."
        />

        {certificates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center">
            <Award className="h-10 w-10 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              No certifications listed yet
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="p-6 flex flex-col justify-between border-zinc-200/90 dark:border-zinc-800/90"
                hoverable
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    {cert.issueDate && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(cert.issueDate)}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
                      {cert.issuer}
                    </p>
                  </div>

                  {cert.credentialId && (
                    <p className="font-mono text-[11px] text-zinc-500 truncate">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-6">
                  {cert.imageUrl ? (
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview Badge</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      <span>Verify</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Certificate Preview Modal */}
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title={selectedCert?.title || 'Certificate Preview'}
        >
          {selectedCert?.imageUrl && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 max-h-[60vh] flex items-center justify-center p-2">
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Issuer: {selectedCert.issuer}</span>
                {selectedCert.credentialId && <span>ID: {selectedCert.credentialId}</span>}
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </Section>
  );
};
