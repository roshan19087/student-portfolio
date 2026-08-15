import { prisma } from '../../db.js';
import { AppError } from '../../utils/AppError.js';
import { PublicEducationDto, CreateEducationInput, UpdateEducationInput } from '@portfolio/shared';

export class EducationService {
  static async getPublicEducation(): Promise<PublicEducationDto[]> {
    const records = await prisma.education.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return records.map((edu) => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gradeOrCgpa: edu.gradeOrCgpa,
      activities: edu.activities,
      coursework: edu.coursework,
      displayOrder: edu.displayOrder,
    }));
  }

  static async getAdminEducationById(id: string): Promise<PublicEducationDto> {
    const edu = await prisma.education.findUnique({
      where: { id },
    });

    if (!edu) {
      throw AppError.notFound(`Education with id '${id}' not found.`);
    }

    return {
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gradeOrCgpa: edu.gradeOrCgpa,
      activities: edu.activities,
      coursework: edu.coursework,
      displayOrder: edu.displayOrder,
    };
  }

  static async createEducation(input: CreateEducationInput): Promise<PublicEducationDto> {
    const edu = await prisma.education.create({
      data: {
        institution: input.institution,
        degree: input.degree,
        fieldOfStudy: input.fieldOfStudy,
        startDate: input.startDate,
        endDate: input.endDate ?? null,
        gradeOrCgpa: input.gradeOrCgpa ?? null,
        activities: input.activities ?? null,
        coursework: input.coursework || [],
        displayOrder: input.displayOrder,
      },
    });

    return {
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gradeOrCgpa: edu.gradeOrCgpa,
      activities: edu.activities,
      coursework: edu.coursework,
      displayOrder: edu.displayOrder,
    };
  }

  static async updateEducation(
    id: string,
    input: UpdateEducationInput,
  ): Promise<PublicEducationDto> {
    const existing = await prisma.education.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Education with id '${id}' not found.`);
    }

    const updated = await prisma.education.update({
      where: { id },
      data: {
        ...(input.institution !== undefined && { institution: input.institution }),
        ...(input.degree !== undefined && { degree: input.degree }),
        ...(input.fieldOfStudy !== undefined && { fieldOfStudy: input.fieldOfStudy }),
        ...(input.startDate !== undefined && { startDate: input.startDate }),
        ...(input.endDate !== undefined && { endDate: input.endDate ?? null }),
        ...(input.gradeOrCgpa !== undefined && { gradeOrCgpa: input.gradeOrCgpa ?? null }),
        ...(input.activities !== undefined && { activities: input.activities ?? null }),
        ...(input.coursework !== undefined && { coursework: input.coursework }),
        ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
      },
    });

    return {
      id: updated.id,
      institution: updated.institution,
      degree: updated.degree,
      fieldOfStudy: updated.fieldOfStudy,
      startDate: updated.startDate,
      endDate: updated.endDate,
      gradeOrCgpa: updated.gradeOrCgpa,
      activities: updated.activities,
      coursework: updated.coursework,
      displayOrder: updated.displayOrder,
    };
  }

  static async deleteEducation(id: string): Promise<void> {
    const existing = await prisma.education.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Education with id '${id}' not found.`);
    }

    await prisma.education.delete({
      where: { id },
    });
  }
}
