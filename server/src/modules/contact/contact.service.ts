import { prisma } from '../../db.js';
import { logger } from '../../utils/logger.js';
import { ContactSubmissionInput, ContactSubmissionResultDto } from '@portfolio/shared';

export class ContactService {
  static async handleContactSubmission(
    input: ContactSubmissionInput,
  ): Promise<ContactSubmissionResultDto> {
    const { name, email, subject, message, _hp } = input;

    // Honeypot anti-spam trigger: if _hp is filled, silently discard without saving
    if (_hp && _hp.trim().length > 0) {
      logger.warn({ senderEmail: email }, 'Spam bot caught via contact honeypot');
      return {
        message: 'Thank you for your message! I will get back to you shortly.',
        delivered: true,
      };
    }

    await prisma.contactMessage.create({
      data: {
        senderName: name.trim(),
        senderEmail: email.trim().toLowerCase(),
        subject: subject?.trim() || 'New Contact Form Submission',
        message: message.trim(),
      },
    });

    logger.info({ senderEmail: email }, 'Contact form submission successfully stored');

    return {
      message: 'Thank you for reaching out! Your message has been received.',
      delivered: true,
    };
  }
}
