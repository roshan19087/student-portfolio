export interface AdminDashboardCountsDto {
  totalProjects: number;
  totalApps: number;
  totalSkills: number;
  totalBlogPosts: number;
  unreadMessages: number;
}

export interface AdminRecentProjectDto {
  id: string;
  title: string;
  slug: string;
  status: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface AdminContactMessageDto {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStatsDto {
  counts: AdminDashboardCountsDto;
  recentProjects: AdminRecentProjectDto[];
  recentMessages: AdminContactMessageDto[];
}
