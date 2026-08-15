import { prisma } from '../../db.js';
import { AppError } from '../../utils/AppError.js';
import {
  PublicAppListItemDto,
  PublicAppDetailDto,
  AppPlatformEnum,
  CreateAppInput,
  UpdateAppInput,
} from '@portfolio/shared';

export class AppsService {
  static async getPublicApps(): Promise<PublicAppListItemDto[]> {
    const apps = await prisma.app.findMany({
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        releases: {
          orderBy: {
            releaseDate: 'desc',
          },
          take: 3,
        },
      },
    });

    return apps.map((app) => ({
      id: app.id,
      name: app.name,
      slug: app.slug,
      tagline: app.tagline,
      iconUrl: app.iconUrl,
      webUrl: app.webUrl,
      githubUrl: app.githubUrl,
      currentVersion: app.currentVersion,
      isFeatured: app.isFeatured,
      displayOrder: app.displayOrder,
      latestReleases: app.releases.map((rel) => ({
        id: rel.id,
        version: rel.version,
        platform: rel.platform as AppPlatformEnum,
        downloadUrl: rel.downloadUrl,
        releaseNotes: rel.releaseNotes,
        releaseDate: rel.releaseDate.toISOString(),
      })),
    }));
  }

  static async getPublicAppBySlug(slug: string): Promise<PublicAppDetailDto> {
    const app = await prisma.app.findUnique({
      where: { slug },
      include: {
        screenshots: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        releases: {
          orderBy: {
            releaseDate: 'desc',
          },
        },
      },
    });

    if (!app) {
      throw AppError.notFound(`Application with slug '${slug}' not found.`);
    }

    return {
      id: app.id,
      name: app.name,
      slug: app.slug,
      tagline: app.tagline,
      description: app.description,
      iconUrl: app.iconUrl,
      webUrl: app.webUrl,
      githubUrl: app.githubUrl,
      currentVersion: app.currentVersion,
      isFeatured: app.isFeatured,
      displayOrder: app.displayOrder,
      latestReleases: app.releases.slice(0, 3).map((rel) => ({
        id: rel.id,
        version: rel.version,
        platform: rel.platform as AppPlatformEnum,
        downloadUrl: rel.downloadUrl,
        releaseNotes: rel.releaseNotes,
        releaseDate: rel.releaseDate.toISOString(),
      })),
      allReleases: app.releases.map((rel) => ({
        id: rel.id,
        version: rel.version,
        platform: rel.platform as AppPlatformEnum,
        downloadUrl: rel.downloadUrl,
        releaseNotes: rel.releaseNotes,
        releaseDate: rel.releaseDate.toISOString(),
      })),
      screenshots: app.screenshots.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        caption: s.caption,
        displayOrder: s.displayOrder,
      })),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    };
  }

  static async getAdminApps(): Promise<PublicAppDetailDto[]> {
    const apps = await prisma.app.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        screenshots: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        releases: {
          orderBy: {
            releaseDate: 'desc',
          },
        },
      },
    });

    return apps.map((app) => ({
      id: app.id,
      name: app.name,
      slug: app.slug,
      tagline: app.tagline,
      description: app.description,
      iconUrl: app.iconUrl,
      webUrl: app.webUrl,
      githubUrl: app.githubUrl,
      currentVersion: app.currentVersion,
      isFeatured: app.isFeatured,
      displayOrder: app.displayOrder,
      latestReleases: app.releases.slice(0, 3).map((rel) => ({
        id: rel.id,
        version: rel.version,
        platform: rel.platform as AppPlatformEnum,
        downloadUrl: rel.downloadUrl,
        releaseNotes: rel.releaseNotes,
        releaseDate: rel.releaseDate.toISOString(),
      })),
      allReleases: app.releases.map((rel) => ({
        id: rel.id,
        version: rel.version,
        platform: rel.platform as AppPlatformEnum,
        downloadUrl: rel.downloadUrl,
        releaseNotes: rel.releaseNotes,
        releaseDate: rel.releaseDate.toISOString(),
      })),
      screenshots: app.screenshots.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        caption: s.caption,
        displayOrder: s.displayOrder,
      })),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }));
  }

  static async getAdminAppById(id: string): Promise<PublicAppDetailDto> {
    const app = await prisma.app.findUnique({
      where: { id },
      include: {
        screenshots: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        releases: {
          orderBy: {
            releaseDate: 'desc',
          },
        },
      },
    });

    if (!app) {
      throw AppError.notFound(`Application with id '${id}' not found.`);
    }

    return {
      id: app.id,
      name: app.name,
      slug: app.slug,
      tagline: app.tagline,
      description: app.description,
      iconUrl: app.iconUrl,
      webUrl: app.webUrl,
      githubUrl: app.githubUrl,
      currentVersion: app.currentVersion,
      isFeatured: app.isFeatured,
      displayOrder: app.displayOrder,
      latestReleases: app.releases.slice(0, 3).map((rel) => ({
        id: rel.id,
        version: rel.version,
        platform: rel.platform as AppPlatformEnum,
        downloadUrl: rel.downloadUrl,
        releaseNotes: rel.releaseNotes,
        releaseDate: rel.releaseDate.toISOString(),
      })),
      allReleases: app.releases.map((rel) => ({
        id: rel.id,
        version: rel.version,
        platform: rel.platform as AppPlatformEnum,
        downloadUrl: rel.downloadUrl,
        releaseNotes: rel.releaseNotes,
        releaseDate: rel.releaseDate.toISOString(),
      })),
      screenshots: app.screenshots.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        caption: s.caption,
        displayOrder: s.displayOrder,
      })),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    };
  }

  static async createApp(input: CreateAppInput): Promise<PublicAppDetailDto> {
    const existing = await prisma.app.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw AppError.badRequest(`An application with slug '${input.slug}' already exists.`);
    }

    const created = await prisma.$transaction(async (tx) => {
      return tx.app.create({
        data: {
          name: input.name,
          slug: input.slug,
          tagline: input.tagline,
          description: input.description,
          iconUrl: input.iconUrl ?? null,
          webUrl: input.webUrl ?? null,
          githubUrl: input.githubUrl ?? null,
          currentVersion: input.currentVersion,
          isFeatured: input.isFeatured,
          displayOrder: input.displayOrder,
          releases: {
            create: (input.releases || []).map((rel) => ({
              version: rel.version,
              platform: rel.platform,
              downloadUrl: rel.downloadUrl,
              releaseNotes: rel.releaseNotes,
              releaseDate: rel.releaseDate ? new Date(rel.releaseDate) : new Date(),
            })),
          },
          screenshots: {
            create: (input.screenshots || []).map((s, idx) => ({
              imageUrl: s.imageUrl,
              caption: s.caption ?? null,
              displayOrder: s.displayOrder ?? idx,
            })),
          },
        },
      });
    });

    return this.getAdminAppById(created.id);
  }

  static async updateApp(id: string, input: UpdateAppInput): Promise<PublicAppDetailDto> {
    const existing = await prisma.app.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Application with id '${id}' not found.`);
    }

    if (input.slug && input.slug !== existing.slug) {
      const slugConflict = await prisma.app.findUnique({
        where: { slug: input.slug },
      });
      if (slugConflict) {
        throw AppError.badRequest(`An application with slug '${input.slug}' already exists.`);
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.app.update({
        where: { id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.tagline !== undefined && { tagline: input.tagline }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.iconUrl !== undefined && { iconUrl: input.iconUrl ?? null }),
          ...(input.webUrl !== undefined && { webUrl: input.webUrl ?? null }),
          ...(input.githubUrl !== undefined && { githubUrl: input.githubUrl ?? null }),
          ...(input.currentVersion !== undefined && { currentVersion: input.currentVersion }),
          ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
          ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
        },
      });

      if (input.releases !== undefined) {
        await tx.appRelease.deleteMany({
          where: { appId: id },
        });
        if (input.releases.length > 0) {
          await tx.appRelease.createMany({
            data: input.releases.map((rel) => ({
              appId: id,
              version: rel.version,
              platform: rel.platform,
              downloadUrl: rel.downloadUrl,
              releaseNotes: rel.releaseNotes,
              releaseDate: rel.releaseDate ? new Date(rel.releaseDate) : new Date(),
            })),
          });
        }
      }

      if (input.screenshots !== undefined) {
        await tx.appScreenshot.deleteMany({
          where: { appId: id },
        });
        if (input.screenshots.length > 0) {
          await tx.appScreenshot.createMany({
            data: input.screenshots.map((s, idx) => ({
              appId: id,
              imageUrl: s.imageUrl,
              caption: s.caption ?? null,
              displayOrder: s.displayOrder ?? idx,
            })),
          });
        }
      }
    });

    return this.getAdminAppById(id);
  }

  static async deleteApp(id: string): Promise<void> {
    const existing = await prisma.app.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Application with id '${id}' not found.`);
    }

    await prisma.app.delete({
      where: { id },
    });
  }
}
