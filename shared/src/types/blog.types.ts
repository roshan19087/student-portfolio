export interface PublicTagDto {
  id: string;
  name: string;
  slug: string;
}

export interface PublicBlogPostListItemDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl?: string | null;
  readingTimeMinutes: number;
  publishedAt: string;
  tags: PublicTagDto[];
}

export interface PublicBlogPostDetailDto extends PublicBlogPostListItemDto {
  contentMarkdown: string;
  updatedAt: string;
}
