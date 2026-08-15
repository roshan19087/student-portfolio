export interface PublicSocialLinkDto {
  id: string;
  platform: string;
  url: string;
  iconName?: string | null;
  displayOrder: number;
}

export interface PublicProfileDto {
  id: string;
  fullName: string;
  tagline: string;
  shortBio: string;
  fullAbout: string;
  avatarUrl?: string | null;
  resumePdfUrl?: string | null;
  location?: string | null;
  statusBadge?: string | null;
  isAvailable: boolean;
  socialLinks: PublicSocialLinkDto[];
  updatedAt: string;
}

export type AdminProfileDto = PublicProfileDto;
