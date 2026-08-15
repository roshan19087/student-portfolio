import React, { useState } from 'react';
import { Container } from '../layout/Container.js';
import { Section } from '../layout/Section.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { Card } from '../common/Card.js';
import { Button } from '../common/Button.js';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin } from 'lucide-react';
import { ContactSubmissionSchema, PublicProfileDto } from '@portfolio/shared';

export interface ContactSectionProps {
  profile: PublicProfileDto;
  onSendMessage?: (data: unknown) => Promise<boolean>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, onSendMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _hp: '', // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setStatus('loading');

    // 1. Client-side Zod validation
    const validation = ContactSubmissionSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    try {
      if (onSendMessage) {
        const ok = await onSendMessage(formData);
        if (!ok) throw new Error('Failed to send message');
      } else {
        // Direct fetch to backend API
        const res = await fetch('/api/v1/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(
            json.error?.message || 'Something went wrong while sending your message.',
          );
        }
      }

      setStatus('success');
      setServerMessage('Thank you for reaching out! Your message has been delivered.');
      setFormData({ name: '', email: '', subject: '', message: '', _hp: '' });
    } catch (err) {
      setStatus('error');
      setServerMessage(
        err instanceof Error ? err.message : 'Unable to send message right now. Please try again.',
      );
    }
  };

  return (
    <Section id="contact" alternate>
      <Container size="lg">
        <SectionHeading
          badge="Get in Touch"
          title="Let's build something together."
          description="Have a question, collaboration idea, or internship opportunity? Drop me a message below."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-6">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  Contact Information
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  I typically respond within 24–48 hours.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-400 font-mono">Email</p>
                    <p className="font-medium">rrrrbhogta@gmail.com</p>
                  </div>
                </div>

                {profile.location && (
                  <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-400 font-mono">Location</p>
                      <p className="font-medium">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90">
              {status === 'success' ? (
                <div className="py-8 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Message Delivered!
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                    {serverMessage}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {status === 'error' && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{serverMessage}</span>
                    </div>
                  )}

                  {/* Honeypot anti-spam field */}
                  <input
                    type="text"
                    name="_hp"
                    value={formData._hp}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ada Lovelace"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border ${
                          errors.name
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-colors`}
                      />
                      {errors.name && <p className="text-[11px] text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ada@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border ${
                          errors.email
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-colors`}
                      />
                      {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry / Internship Opportunity"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Roshan, I came across your portfolio and would like to connect regarding..."
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border ${
                        errors.message
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-colors resize-none`}
                    />
                    {errors.message && <p className="text-[11px] text-red-500">{errors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={status === 'loading'}
                    rightIcon={<Send className="h-4 w-4" />}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
