import { PublicSkillDto } from './skill.types.js';

export type ProjectStatusEnum = 'COMPLETED' | 'IN_PROGRESS' | 'MAINTENANCE' | 'ARCHIVED';

export interface PublicProjectScreenshotDto {
  id: string;
  imageUrl: string;
  caption?: string | null;
  displayOrder: number;
}

export interface PublicProjectListItemDto {
  id: string;
  title: string;
  slug: string;
  shortSummary: string;
  thumbnailUrl?: string | null;
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  downloadUrl?: string | null;
  status: ProjectStatusEnum;
  isFeatured: boolean;
  displayOrder: number;
  skills: PublicSkillDto[];
  createdAt: string;
}

export interface PublicProjectDetailDto extends PublicProjectListItemDto {
  fullDescription: string;
  screenshots: PublicProjectScreenshotDto[];
  updatedAt: string;
}
