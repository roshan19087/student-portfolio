import { Request, Response } from 'express';
import { AppsService } from './apps.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, PublicAppListItemDto, PublicAppDetailDto } from '@portfolio/shared';

export const listApps = asyncCatch(async (_req: Request, res: Response) => {
  const apps = await AppsService.getPublicApps();

  const response: ApiResponse<PublicAppListItemDto[]> = {
    success: true,
    data: apps,
  };

  res.status(200).json(response);
});

export const getAppBySlug = asyncCatch(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const app = await AppsService.getPublicAppBySlug(slug as string);

  const response: ApiResponse<PublicAppDetailDto> = {
    success: true,
    data: app,
  };

  res.status(200).json(response);
});

export const getAdminAppsHandler = asyncCatch(async (_req: Request, res: Response) => {
  const apps = await AppsService.getAdminApps();
  const response: ApiResponse<PublicAppDetailDto[]> = {
    success: true,
    data: apps,
  };
  res.status(200).json(response);
});

export const getAdminAppByIdHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const app = await AppsService.getAdminAppById(id as string);
  const response: ApiResponse<PublicAppDetailDto> = {
    success: true,
    data: app,
  };
  res.status(200).json(response);
});

export const createAppHandler = asyncCatch(async (req: Request, res: Response) => {
  const app = await AppsService.createApp(req.body);
  const response: ApiResponse<PublicAppDetailDto> = {
    success: true,
    data: app,
  };
  res.status(201).json(response);
});

export const updateAppHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const app = await AppsService.updateApp(id as string, req.body);
  const response: ApiResponse<PublicAppDetailDto> = {
    success: true,
    data: app,
  };
  res.status(200).json(response);
});

export const deleteAppHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await AppsService.deleteApp(id as string);
  const response: ApiResponse<null> = {
    success: true,
    data: null,
  };
  res.status(200).json(response);
});
