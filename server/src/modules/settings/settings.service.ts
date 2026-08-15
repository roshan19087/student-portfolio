import { prisma } from '../../db.js';
import { PublicSiteSettingsDto, UpdateSettingsInput } from '@portfolio/shared';

const DEFAULT_PUBLIC_SETTINGS: PublicSiteSettingsDto = {
  siteTitle: 'Developer Portfolio',
  siteDescription: 'Personal developer portfolio and software application hub.',
  authorName: 'Student Developer',
  seoKeywords: ['developer', 'portfolio', 'full-stack', 'software engineer', 'projects'],
  ogImageUrl: null,
  features: {
    blogEnabled: true,
    appsEnabled: true,
    certificatesEnabled: true,
    contactFormEnabled: true,
  },
};

export class SettingsService {
  static async getPublicSettings(): Promise<PublicSiteSettingsDto> {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'site_public_config' },
    });

    if (!setting || typeof setting.value !== 'object' || setting.value === null) {
      return DEFAULT_PUBLIC_SETTINGS;
    }

    const value = setting.value as Partial<PublicSiteSettingsDto>;

    return {
      siteTitle: value.siteTitle || DEFAULT_PUBLIC_SETTINGS.siteTitle,
      siteDescription: value.siteDescription || DEFAULT_PUBLIC_SETTINGS.siteDescription,
      authorName: value.authorName || DEFAULT_PUBLIC_SETTINGS.authorName,
      seoKeywords: Array.isArray(value.seoKeywords)
        ? value.seoKeywords
        : DEFAULT_PUBLIC_SETTINGS.seoKeywords,
      ogImageUrl: value.ogImageUrl ?? DEFAULT_PUBLIC_SETTINGS.ogImageUrl,
      features: {
        blogEnabled: value.features?.blogEnabled ?? DEFAULT_PUBLIC_SETTINGS.features.blogEnabled,
        appsEnabled: value.features?.appsEnabled ?? DEFAULT_PUBLIC_SETTINGS.features.appsEnabled,
        certificatesEnabled:
          value.features?.certificatesEnabled ??
          DEFAULT_PUBLIC_SETTINGS.features.certificatesEnabled,
        contactFormEnabled:
          value.features?.contactFormEnabled ?? DEFAULT_PUBLIC_SETTINGS.features.contactFormEnabled,
      },
      socials: value.socials,
    };
  }

  static async updateSettings(input: UpdateSettingsInput): Promise<PublicSiteSettingsDto> {
    const upserted = await prisma.siteSetting.upsert({
      where: { key: 'site_public_config' },
      update: {
        value: input,
      },
      create: {
        key: 'site_public_config',
        value: input,
      },
    });

    const value = upserted.value as Partial<PublicSiteSettingsDto>;

    return {
      siteTitle: value.siteTitle || input.siteTitle,
      siteDescription: value.siteDescription || input.siteDescription,
      authorName: value.authorName || input.authorName,
      seoKeywords: Array.isArray(value.seoKeywords) ? value.seoKeywords : input.seoKeywords,
      ogImageUrl: value.ogImageUrl ?? input.ogImageUrl ?? null,
      features: {
        blogEnabled: value.features?.blogEnabled ?? input.features.blogEnabled,
        appsEnabled: value.features?.appsEnabled ?? input.features.appsEnabled,
        certificatesEnabled:
          value.features?.certificatesEnabled ?? input.features.certificatesEnabled,
        contactFormEnabled: value.features?.contactFormEnabled ?? input.features.contactFormEnabled,
      },
    };
  }
}
