import { prisma } from '../../db.js';
import { AppError } from '../../utils/AppError.js';
import { PublicProfileDto, UpdateProfileInput } from '@portfolio/shared';

export class ProfileService {
  static async getPublicProfile(): Promise<PublicProfileDto | null> {
    const profile = await prisma.profile.findFirst({
      include: {
        socialLinks: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      fullName: profile.fullName,
      tagline: profile.tagline,
      shortBio: profile.shortBio,
      fullAbout: profile.fullAbout,
      avatarUrl: profile.avatarUrl,
      resumePdfUrl: profile.resumePdfUrl,
      location: profile.location,
      statusBadge: profile.statusBadge,
      isAvailable: profile.isAvailable,
      socialLinks: profile.socialLinks.map((link) => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        iconName: link.iconName,
        displayOrder: link.displayOrder,
      })),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static async getAdminProfile(): Promise<PublicProfileDto> {
    const profile = await prisma.profile.findFirst({
      include: {
        socialLinks: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    if (!profile) {
      throw AppError.notFound('Profile record not found. Please run seed script.');
    }

    return {
      id: profile.id,
      fullName: profile.fullName,
      tagline: profile.tagline,
      shortBio: profile.shortBio,
      fullAbout: profile.fullAbout,
      avatarUrl: profile.avatarUrl,
      resumePdfUrl: profile.resumePdfUrl,
      location: profile.location,
      statusBadge: profile.statusBadge,
      isAvailable: profile.isAvailable,
      socialLinks: profile.socialLinks.map((link) => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        iconName: link.iconName,
        displayOrder: link.displayOrder,
      })),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static async updateProfile(input: UpdateProfileInput): Promise<PublicProfileDto> {
    const existing = await prisma.profile.findFirst({
      include: { socialLinks: true },
    });

    let profileId: string;

    if (existing) {
      profileId = existing.id;
      await prisma.$transaction(async (tx) => {
        await tx.profile.update({
          where: { id: existing.id },
          data: {
            fullName: input.fullName,
            tagline: input.tagline,
            shortBio: input.shortBio,
            fullAbout: input.fullAbout,
            avatarUrl: input.avatarUrl ?? null,
            resumePdfUrl: input.resumePdfUrl ?? null,
            location: input.location ?? null,
            statusBadge: input.statusBadge ?? null,
            isAvailable: input.isAvailable,
          },
        });

        if (input.socialLinks) {
          await tx.socialLink.deleteMany({
            where: { profileId: existing.id },
          });

          if (input.socialLinks.length > 0) {
            await tx.socialLink.createMany({
              data: input.socialLinks.map((link, idx) => ({
                profileId: existing.id,
                platform: link.platform,
                url: link.url,
                iconName: link.iconName || null,
                displayOrder: link.displayOrder ?? idx,
              })),
            });
          }
        }
      });
    } else {
      const created = await prisma.profile.create({
        data: {
          fullName: input.fullName,
          tagline: input.tagline,
          shortBio: input.shortBio,
          fullAbout: input.fullAbout,
          avatarUrl: input.avatarUrl ?? null,
          resumePdfUrl: input.resumePdfUrl ?? null,
          location: input.location ?? null,
          statusBadge: input.statusBadge ?? null,
          isAvailable: input.isAvailable,
          socialLinks: {
            create: (input.socialLinks || []).map((link, idx) => ({
              platform: link.platform,
              url: link.url,
              iconName: link.iconName || null,
              displayOrder: link.displayOrder ?? idx,
            })),
          },
        },
      });
      profileId = created.id;
    }

    const updated = await prisma.profile.findUniqueOrThrow({
      where: { id: profileId },
      include: {
        socialLinks: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    return {
      id: updated.id,
      fullName: updated.fullName,
      tagline: updated.tagline,
      shortBio: updated.shortBio,
      fullAbout: updated.fullAbout,
      avatarUrl: updated.avatarUrl,
      resumePdfUrl: updated.resumePdfUrl,
      location: updated.location,
      statusBadge: updated.statusBadge,
      isAvailable: updated.isAvailable,
      socialLinks: updated.socialLinks.map((link) => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        iconName: link.iconName,
        displayOrder: link.displayOrder,
      })),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
