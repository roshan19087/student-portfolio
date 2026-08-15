import { prisma } from '../../db.js';
import { AppError } from '../../utils/AppError.js';
import {
  PublicCertificateDto,
  CreateCertificateInput,
  UpdateCertificateInput,
} from '@portfolio/shared';

export class CertificatesService {
  static async getPublicCertificates(): Promise<PublicCertificateDto[]> {
    const certificates = await prisma.certificate.findMany({
      orderBy: [{ displayOrder: 'asc' }, { issueDate: 'desc' }],
    });

    return certificates.map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      expirationDate: c.expirationDate,
      credentialId: c.credentialId,
      credentialUrl: c.credentialUrl,
      imageUrl: c.imageUrl,
      category: c.category,
      displayOrder: c.displayOrder,
    }));
  }

  static async getAdminCertificateById(id: string): Promise<PublicCertificateDto> {
    const c = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!c) {
      throw AppError.notFound(`Certificate with id '${id}' not found.`);
    }

    return {
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      expirationDate: c.expirationDate,
      credentialId: c.credentialId,
      credentialUrl: c.credentialUrl,
      imageUrl: c.imageUrl,
      category: c.category,
      displayOrder: c.displayOrder,
    };
  }

  static async createCertificate(input: CreateCertificateInput): Promise<PublicCertificateDto> {
    const created = await prisma.certificate.create({
      data: {
        title: input.title,
        issuer: input.issuer,
        issueDate: input.issueDate,
        expirationDate: input.expirationDate ?? null,
        credentialId: input.credentialId ?? null,
        credentialUrl: input.credentialUrl ? input.credentialUrl : null,
        imageUrl: input.imageUrl ?? null,
        category: input.category ?? null,
        displayOrder: input.displayOrder,
      },
    });

    return {
      id: created.id,
      title: created.title,
      issuer: created.issuer,
      issueDate: created.issueDate,
      expirationDate: created.expirationDate,
      credentialId: created.credentialId,
      credentialUrl: created.credentialUrl,
      imageUrl: created.imageUrl,
      category: created.category,
      displayOrder: created.displayOrder,
    };
  }

  static async updateCertificate(
    id: string,
    input: UpdateCertificateInput,
  ): Promise<PublicCertificateDto> {
    const existing = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Certificate with id '${id}' not found.`);
    }

    const updated = await prisma.certificate.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.issuer !== undefined && { issuer: input.issuer }),
        ...(input.issueDate !== undefined && { issueDate: input.issueDate }),
        ...(input.expirationDate !== undefined && { expirationDate: input.expirationDate ?? null }),
        ...(input.credentialId !== undefined && { credentialId: input.credentialId ?? null }),
        ...(input.credentialUrl !== undefined && {
          credentialUrl: input.credentialUrl ? input.credentialUrl : null,
        }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl ?? null }),
        ...(input.category !== undefined && { category: input.category ?? null }),
        ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      issuer: updated.issuer,
      issueDate: updated.issueDate,
      expirationDate: updated.expirationDate,
      credentialId: updated.credentialId,
      credentialUrl: updated.credentialUrl,
      imageUrl: updated.imageUrl,
      category: updated.category,
      displayOrder: updated.displayOrder,
    };
  }

  static async deleteCertificate(id: string): Promise<void> {
    const existing = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Certificate with id '${id}' not found.`);
    }

    await prisma.certificate.delete({
      where: { id },
    });
  }
}
