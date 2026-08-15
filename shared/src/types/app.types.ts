export type AppPlatformEnum =
  'WEB' | 'IOS' | 'ANDROID' | 'WINDOWS' | 'MACOS' | 'LINUX' | 'CROSS_PLATFORM';

export interface PublicAppReleaseDto {
  id: string;
  version: string;
  platform: AppPlatformEnum;
  downloadUrl: string;
  releaseNotes: string;
  releaseDate: string;
}

export interface PublicAppScreenshotDto {
  id: string;
  imageUrl: string;
  caption?: string | null;
  displayOrder: number;
}

export interface PublicAppListItemDto {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  iconUrl?: string | null;
  webUrl?: string | null;
  githubUrl?: string | null;
  currentVersion: string;
  isFeatured: boolean;
  displayOrder: number;
  latestReleases: PublicAppReleaseDto[];
}

export interface PublicAppDetailDto extends PublicAppListItemDto {
  description: string;
  screenshots: PublicAppScreenshotDto[];
  allReleases: PublicAppReleaseDto[];
  createdAt: string;
  updatedAt: string;
}
