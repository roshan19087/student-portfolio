import { prisma } from '../../db.js';
import { AppError } from '../../utils/AppError.js';
import {
  ProjectQueryInput,
  PublicProjectListItemDto,
  PublicProjectDetailDto,
  CreateProjectInput,
  UpdateProjectInput,
} from '@portfolio/shared';
import { Prisma } from '@prisma/client';

export class ProjectsService {
  static async getPublicProjects(query: ProjectQueryInput): Promise<PublicProjectListItemDto[]> {
    const where: Prisma.ProjectWhereInput = {};

    if (typeof query.featured === 'boolean') {
      where.isFeatured = query.featured;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.skill) {
      where.skills = {
        some: {
          skill: {
            name: {
              equals: query.skill,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        skills: {
          include: {
            skill: true,
          },
          orderBy: {
            skill: {
              displayOrder: 'asc',
            },
          },
        },
      },
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortSummary: p.shortSummary,
      thumbnailUrl: p.thumbnailUrl,
      githubUrl: p.githubUrl,
      liveDemoUrl: p.liveDemoUrl,
      downloadUrl: p.downloadUrl,
      status: p.status,
      isFeatured: p.isFeatured,
      displayOrder: p.displayOrder,
      skills: p.skills.map((ps) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        iconUrl: ps.skill.iconUrl,
        proficiencyLevel: ps.skill.proficiencyLevel,
        isFeatured: ps.skill.isFeatured,
        displayOrder: ps.skill.displayOrder,
      })),
      createdAt: p.createdAt.toISOString(),
    }));
  }

  static async getPublicProjectBySlug(slug: string): Promise<PublicProjectDetailDto> {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        screenshots: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        skills: {
          include: {
            skill: true,
          },
          orderBy: {
            skill: {
              displayOrder: 'asc',
            },
          },
        },
      },
    });

    if (!project) {
      throw AppError.notFound(`Project with slug '${slug}' not found.`);
    }

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      shortSummary: project.shortSummary,
      fullDescription: project.fullDescription,
      thumbnailUrl: project.thumbnailUrl,
      githubUrl: project.githubUrl,
      liveDemoUrl: project.liveDemoUrl,
      downloadUrl: project.downloadUrl,
      status: project.status,
      isFeatured: project.isFeatured,
      displayOrder: project.displayOrder,
      skills: project.skills.map((ps) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        iconUrl: ps.skill.iconUrl,
        proficiencyLevel: ps.skill.proficiencyLevel,
        isFeatured: ps.skill.isFeatured,
        displayOrder: ps.skill.displayOrder,
      })),
      screenshots: project.screenshots.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        caption: s.caption,
        displayOrder: s.displayOrder,
      })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  static async getAdminProjects(): Promise<PublicProjectDetailDto[]> {
    const projects = await prisma.project.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        screenshots: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        skills: {
          include: {
            skill: true,
          },
          orderBy: {
            skill: {
              displayOrder: 'asc',
            },
          },
        },
      },
    });

    return projects.map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      shortSummary: project.shortSummary,
      fullDescription: project.fullDescription,
      thumbnailUrl: project.thumbnailUrl,
      githubUrl: project.githubUrl,
      liveDemoUrl: project.liveDemoUrl,
      downloadUrl: project.downloadUrl,
      status: project.status,
      isFeatured: project.isFeatured,
      displayOrder: project.displayOrder,
      skills: project.skills.map((ps) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        iconUrl: ps.skill.iconUrl,
        proficiencyLevel: ps.skill.proficiencyLevel,
        isFeatured: ps.skill.isFeatured,
        displayOrder: ps.skill.displayOrder,
      })),
      screenshots: project.screenshots.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        caption: s.caption,
        displayOrder: s.displayOrder,
      })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));
  }

  static async getAdminProjectById(id: string): Promise<PublicProjectDetailDto> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        screenshots: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
        skills: {
          include: {
            skill: true,
          },
          orderBy: {
            skill: {
              displayOrder: 'asc',
            },
          },
        },
      },
    });

    if (!project) {
      throw AppError.notFound(`Project with id '${id}' not found.`);
    }

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      shortSummary: project.shortSummary,
      fullDescription: project.fullDescription,
      thumbnailUrl: project.thumbnailUrl,
      githubUrl: project.githubUrl,
      liveDemoUrl: project.liveDemoUrl,
      downloadUrl: project.downloadUrl,
      status: project.status,
      isFeatured: project.isFeatured,
      displayOrder: project.displayOrder,
      skills: project.skills.map((ps) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        iconUrl: ps.skill.iconUrl,
        proficiencyLevel: ps.skill.proficiencyLevel,
        isFeatured: ps.skill.isFeatured,
        displayOrder: ps.skill.displayOrder,
      })),
      screenshots: project.screenshots.map((s) => ({
        id: s.id,
        imageUrl: s.imageUrl,
        caption: s.caption,
        displayOrder: s.displayOrder,
      })),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  static async createProject(input: CreateProjectInput): Promise<PublicProjectDetailDto> {
    const existing = await prisma.project.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw AppError.badRequest(`A project with slug '${input.slug}' already exists.`);
    }

    const created = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          title: input.title,
          slug: input.slug,
          shortSummary: input.shortSummary,
          fullDescription: input.fullDescription,
          thumbnailUrl: input.thumbnailUrl ?? null,
          githubUrl: input.githubUrl ?? null,
          liveDemoUrl: input.liveDemoUrl ?? null,
          downloadUrl: input.downloadUrl ?? null,
          status: input.status,
          isFeatured: input.isFeatured,
          displayOrder: input.displayOrder,
          screenshots: {
            create: (input.screenshots || []).map((s, idx) => ({
              imageUrl: s.imageUrl,
              caption: s.caption ?? null,
              displayOrder: s.displayOrder ?? idx,
            })),
          },
        },
      });

      if (input.skillIds && input.skillIds.length > 0) {
        await tx.projectSkill.createMany({
          data: input.skillIds.map((skillId) => ({
            projectId: project.id,
            skillId,
          })),
        });
      }

      return project;
    });

    return this.getAdminProjectById(created.id);
  }

  static async updateProject(
    id: string,
    input: UpdateProjectInput,
  ): Promise<PublicProjectDetailDto> {
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Project with id '${id}' not found.`);
    }

    if (input.slug && input.slug !== existing.slug) {
      const slugConflict = await prisma.project.findUnique({
        where: { slug: input.slug },
      });
      if (slugConflict) {
        throw AppError.badRequest(`A project with slug '${input.slug}' already exists.`);
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.shortSummary !== undefined && { shortSummary: input.shortSummary }),
          ...(input.fullDescription !== undefined && { fullDescription: input.fullDescription }),
          ...(input.thumbnailUrl !== undefined && { thumbnailUrl: input.thumbnailUrl ?? null }),
          ...(input.githubUrl !== undefined && { githubUrl: input.githubUrl ?? null }),
          ...(input.liveDemoUrl !== undefined && { liveDemoUrl: input.liveDemoUrl ?? null }),
          ...(input.downloadUrl !== undefined && { downloadUrl: input.downloadUrl ?? null }),
          ...(input.status !== undefined && { status: input.status }),
          ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
          ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
        },
      });

      if (input.skillIds !== undefined) {
        await tx.projectSkill.deleteMany({
          where: { projectId: id },
        });
        if (input.skillIds.length > 0) {
          await tx.projectSkill.createMany({
            data: input.skillIds.map((skillId) => ({
              projectId: id,
              skillId,
            })),
          });
        }
      }

      if (input.screenshots !== undefined) {
        await tx.projectScreenshot.deleteMany({
          where: { projectId: id },
        });
        if (input.screenshots.length > 0) {
          await tx.projectScreenshot.createMany({
            data: input.screenshots.map((s, idx) => ({
              projectId: id,
              imageUrl: s.imageUrl,
              caption: s.caption ?? null,
              displayOrder: s.displayOrder ?? idx,
            })),
          });
        }
      }
    });

    return this.getAdminProjectById(id);
  }

  static async deleteProject(id: string): Promise<void> {
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Project with id '${id}' not found.`);
    }

    await prisma.project.delete({
      where: { id },
    });
  }
}
