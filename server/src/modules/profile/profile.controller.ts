import { Request, Response } from 'express';
import { ProfileService } from './profile.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, PublicProfileDto } from '@portfolio/shared';

export const getProfile = asyncCatch(async (_req: Request, res: Response) => {
  const profile = await ProfileService.getPublicProfile();

  const response: ApiResponse<PublicProfileDto | null> = {
    success: true,
    data: profile,
  };

  res.status(200).json(response);
});

export const getAdminProfileHandler = asyncCatch(async (_req: Request, res: Response) => {
  const profile = await ProfileService.getAdminProfile();

  const response: ApiResponse<PublicProfileDto> = {
    success: true,
    data: profile,
  };

  res.status(200).json(response);
});

export const updateProfileHandler = asyncCatch(async (req: Request, res: Response) => {
  const updated = await ProfileService.updateProfile(req.body);

  const response: ApiResponse<PublicProfileDto> = {
    success: true,
    data: updated,
  };

  res.status(200).json(response);
});
