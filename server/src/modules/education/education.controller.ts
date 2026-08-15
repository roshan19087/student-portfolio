import { Request, Response } from 'express';
import { EducationService } from './education.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, PublicEducationDto } from '@portfolio/shared';

export const getEducation = asyncCatch(async (_req: Request, res: Response) => {
  const education = await EducationService.getPublicEducation();
  const response: ApiResponse<PublicEducationDto[]> = {
    success: true,
    data: education,
  };
  res.status(200).json(response);
});

export const getAdminEducationByIdHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const edu = await EducationService.getAdminEducationById(id as string);
  const response: ApiResponse<PublicEducationDto> = {
    success: true,
    data: edu,
  };
  res.status(200).json(response);
});

export const createEducationHandler = asyncCatch(async (req: Request, res: Response) => {
  const edu = await EducationService.createEducation(req.body);
  const response: ApiResponse<PublicEducationDto> = {
    success: true,
    data: edu,
  };
  res.status(201).json(response);
});

export const updateEducationHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const edu = await EducationService.updateEducation(id as string, req.body);
  const response: ApiResponse<PublicEducationDto> = {
    success: true,
    data: edu,
  };
  res.status(200).json(response);
});

export const deleteEducationHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await EducationService.deleteEducation(id as string);
  const response: ApiResponse<null> = {
    success: true,
    data: null,
  };
  res.status(200).json(response);
});
