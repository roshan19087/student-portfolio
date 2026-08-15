import { Request, Response } from 'express';
import { SettingsService } from './settings.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, PublicSiteSettingsDto } from '@portfolio/shared';

export const getPublicSettings = asyncCatch(async (_req: Request, res: Response) => {
  const settings = await SettingsService.getPublicSettings();
  const response: ApiResponse<PublicSiteSettingsDto> = {
    success: true,
    data: settings,
  };
  res.status(200).json(response);
});

export const updateSettingsHandler = asyncCatch(async (req: Request, res: Response) => {
  const settings = await SettingsService.updateSettings(req.body);
  const response: ApiResponse<PublicSiteSettingsDto> = {
    success: true,
    data: settings,
  };
  res.status(200).json(response);
});
