import { Request, Response } from 'express';
import { MediaService } from './media.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import {
  ApiResponse,
  MediaUploadResultDto,
  MediaDeleteResultDto,
  MediaCategorySchema,
} from '@portfolio/shared';
import { AppError } from '../../utils/AppError.js';

export const uploadFile = asyncCatch(async (req: Request, res: Response) => {
  const rawCategory = req.body.category || 'IMAGE';
  const categoryResult = MediaCategorySchema.safeParse(rawCategory);

  if (!categoryResult.success) {
    throw AppError.badRequest('Invalid media category. Must be one of: IMAGE, PDF, RELEASE');
  }

  const result = await MediaService.uploadMedia(req.file, categoryResult.data);

  const response: ApiResponse<MediaUploadResultDto> = {
    success: true,
    data: result,
  };

  res.status(201).json(response);
});

export const deleteFile = asyncCatch(async (req: Request, res: Response) => {
  // In Express, route param may capture subdirectories (e.g., /media/:category/:filename or wildcard)
  const rawKey = req.params[0] || req.params.storageKey;
  const storageKey = Array.isArray(rawKey) ? rawKey.join('/') : rawKey;

  if (!storageKey) {
    throw AppError.badRequest('Storage key parameter is required.');
  }

  const result = await MediaService.deleteMedia(storageKey);

  const response: ApiResponse<MediaDeleteResultDto> = {
    success: true,
    data: result,
  };

  res.status(200).json(response);
});
