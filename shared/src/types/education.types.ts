export interface PublicEducationDto {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
  gradeOrCgpa?: string | null;
  activities?: string | null;
  coursework: string[];
  displayOrder: number;
}
