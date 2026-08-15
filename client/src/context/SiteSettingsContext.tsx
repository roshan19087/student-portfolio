import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PublicSiteSettingsDto, PublicProfileDto } from '@portfolio/shared';
import { settingsService } from '../services/settingsService.js';
import { profileService } from '../services/profileService.js';

export const DEFAULT_SITE_SETTINGS: PublicSiteSettingsDto = {
  siteTitle: '',
  siteDescription: '',
  authorName: '',
  seoKeywords: [],
  features: {
    blogEnabled: true,
    appsEnabled: true,
    certificatesEnabled: true,
    contactFormEnabled: true,
  },
};

export interface SiteSettingsContextType {
  settings: PublicSiteSettingsDto;
  profile: PublicProfileDto | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

export const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SITE_SETTINGS,
  profile: null,
  isLoading: true,
  refreshSettings: async () => {},
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PublicSiteSettingsDto>(DEFAULT_SITE_SETTINGS);
  const [profile, setProfile] = useState<PublicProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGlobalData = useCallback(async () => {
    try {
      const [settingsRes, profileRes] = await Promise.allSettled([
        settingsService.getSettings(),
        profileService.getProfile(),
      ]);

      if (settingsRes.status === 'fulfilled' && settingsRes.value) {
        setSettings(settingsRes.value);
        if (settingsRes.value.siteTitle) {
          document.title = settingsRes.value.siteTitle;
        }
      }
      if (profileRes.status === 'fulfilled' && profileRes.value) {
        setProfile(profileRes.value);
      }
    } catch {
      // Retain default empty state without mock data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, [fetchGlobalData]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        profile,
        isLoading,
        refreshSettings: fetchGlobalData,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
