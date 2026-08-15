export interface PublicSiteSettingsDto {
  siteTitle: string;
  siteDescription: string;
  authorName: string;
  seoKeywords: string[];
  ogImageUrl?: string | null;
  features: {
    blogEnabled: boolean;
    appsEnabled: boolean;
    certificatesEnabled: boolean;
    contactFormEnabled: boolean;
  };
  socials?: Record<string, string>;
}
