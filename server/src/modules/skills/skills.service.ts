import { prisma } from '../../db.js';
import { AppError } from '../../utils/AppError.js';
import {
  PublicSkillCategoryDto,
  PublicSkillDto,
  CreateSkillCategoryInput,
  UpdateSkillCategoryInput,
  CreateSkillInput,
  UpdateSkillInput,
} from '@portfolio/shared';

export class SkillsService {
  static async getPublicSkills(): Promise<PublicSkillCategoryDto[]> {
    const categories = await prisma.skillCategory.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
      include: {
        skills: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      displayOrder: cat.displayOrder,
      skills: cat.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        iconUrl: skill.iconUrl,
        proficiencyLevel: skill.proficiencyLevel,
        isFeatured: skill.isFeatured,
        displayOrder: skill.displayOrder,
      })),
    }));
  }

  // Category CRUD
  static async getSkillCategories(): Promise<PublicSkillCategoryDto[]> {
    return this.getPublicSkills();
  }

  static async createSkillCategory(
    input: CreateSkillCategoryInput,
  ): Promise<PublicSkillCategoryDto> {
    const existing = await prisma.skillCategory.findUnique({
      where: { name: input.name },
    });

    if (existing) {
      throw AppError.badRequest(`Category '${input.name}' already exists.`);
    }

    const created = await prisma.skillCategory.create({
      data: {
        name: input.name,
        displayOrder: input.displayOrder ?? 0,
      },
      include: {
        skills: true,
      },
    });

    return {
      id: created.id,
      name: created.name,
      displayOrder: created.displayOrder,
      skills: [],
    };
  }

  static async updateSkillCategory(
    id: string,
    input: UpdateSkillCategoryInput,
  ): Promise<PublicSkillCategoryDto> {
    const existing = await prisma.skillCategory.findUnique({
      where: { id },
      include: { skills: true },
    });

    if (!existing) {
      throw AppError.notFound(`Skill category with id '${id}' not found.`);
    }

    if (input.name && input.name !== existing.name) {
      const nameConflict = await prisma.skillCategory.findUnique({
        where: { name: input.name },
      });
      if (nameConflict) {
        throw AppError.badRequest(`Category '${input.name}' already exists.`);
      }
    }

    const updated = await prisma.skillCategory.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
      },
      include: {
        skills: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      displayOrder: updated.displayOrder,
      skills: updated.skills.map((s) => ({
        id: s.id,
        name: s.name,
        iconUrl: s.iconUrl,
        proficiencyLevel: s.proficiencyLevel,
        isFeatured: s.isFeatured,
        displayOrder: s.displayOrder,
      })),
    };
  }

  static async deleteSkillCategory(id: string): Promise<void> {
    const existing = await prisma.skillCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Skill category with id '${id}' not found.`);
    }

    await prisma.skillCategory.delete({
      where: { id },
    });
  }

  // Skill CRUD
  static async getSkills(): Promise<PublicSkillDto[]> {
    const skills = await prisma.skill.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });

    return skills.map((s) => ({
      id: s.id,
      name: s.name,
      iconUrl: s.iconUrl,
      proficiencyLevel: s.proficiencyLevel,
      isFeatured: s.isFeatured,
      displayOrder: s.displayOrder,
    }));
  }

  static async createSkill(input: CreateSkillInput): Promise<PublicSkillDto> {
    const category = await prisma.skillCategory.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      throw AppError.notFound(`Category with id '${input.categoryId}' not found.`);
    }

    const skill = await prisma.skill.create({
      data: {
        categoryId: input.categoryId,
        name: input.name,
        iconUrl: input.iconUrl ?? null,
        proficiencyLevel: input.proficiencyLevel ?? null,
        isFeatured: input.isFeatured,
        displayOrder: input.displayOrder,
      },
    });

    return {
      id: skill.id,
      name: skill.name,
      iconUrl: skill.iconUrl,
      proficiencyLevel: skill.proficiencyLevel,
      isFeatured: skill.isFeatured,
      displayOrder: skill.displayOrder,
    };
  }

  static async updateSkill(id: string, input: UpdateSkillInput): Promise<PublicSkillDto> {
    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Skill with id '${id}' not found.`);
    }

    if (input.categoryId) {
      const category = await prisma.skillCategory.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) {
        throw AppError.notFound(`Category with id '${input.categoryId}' not found.`);
      }
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.iconUrl !== undefined && { iconUrl: input.iconUrl ?? null }),
        ...(input.proficiencyLevel !== undefined && {
          proficiencyLevel: input.proficiencyLevel ?? null,
        }),
        ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
        ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      iconUrl: updated.iconUrl,
      proficiencyLevel: updated.proficiencyLevel,
      isFeatured: updated.isFeatured,
      displayOrder: updated.displayOrder,
    };
  }

  static async deleteSkill(id: string): Promise<void> {
    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Skill with id '${id}' not found.`);
    }

    await prisma.skill.delete({
      where: { id },
    });
  }
}
