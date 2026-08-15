export interface PublicSkillDto {
  id: string;
  name: string;
  iconUrl?: string | null;
  proficiencyLevel?: string | null;
  isFeatured: boolean;
  displayOrder: number;
}

export interface PublicSkillCategoryDto {
  id: string;
  name: string;
  displayOrder: number;
  skills: PublicSkillDto[];
}
