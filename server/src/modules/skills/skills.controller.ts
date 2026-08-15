import { Request, Response } from 'express';
import { SkillsService } from './skills.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, PublicSkillCategoryDto, PublicSkillDto } from '@portfolio/shared';

export const getSkills = asyncCatch(async (_req: Request, res: Response) => {
  const skills = await SkillsService.getPublicSkills();
  const response: ApiResponse<PublicSkillCategoryDto[]> = {
    success: true,
    data: skills,
  };
  res.status(200).json(response);
});

// Category handlers
export const getSkillCategoriesHandler = asyncCatch(async (_req: Request, res: Response) => {
  const categories = await SkillsService.getSkillCategories();
  const response: ApiResponse<PublicSkillCategoryDto[]> = {
    success: true,
    data: categories,
  };
  res.status(200).json(response);
});

export const createSkillCategoryHandler = asyncCatch(async (req: Request, res: Response) => {
  const category = await SkillsService.createSkillCategory(req.body);
  const response: ApiResponse<PublicSkillCategoryDto> = {
    success: true,
    data: category,
  };
  res.status(201).json(response);
});

export const updateSkillCategoryHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const category = await SkillsService.updateSkillCategory(id as string, req.body);
  const response: ApiResponse<PublicSkillCategoryDto> = {
    success: true,
    data: category,
  };
  res.status(200).json(response);
});

export const deleteSkillCategoryHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await SkillsService.deleteSkillCategory(id as string);
  const response: ApiResponse<null> = {
    success: true,
    data: null,
  };
  res.status(200).json(response);
});

// Skill handlers
export const getSkillsListHandler = asyncCatch(async (_req: Request, res: Response) => {
  const skills = await SkillsService.getSkills();
  const response: ApiResponse<PublicSkillDto[]> = {
    success: true,
    data: skills,
  };
  res.status(200).json(response);
});

export const createSkillHandler = asyncCatch(async (req: Request, res: Response) => {
  const skill = await SkillsService.createSkill(req.body);
  const response: ApiResponse<PublicSkillDto> = {
    success: true,
    data: skill,
  };
  res.status(201).json(response);
});

export const updateSkillHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const skill = await SkillsService.updateSkill(id as string, req.body);
  const response: ApiResponse<PublicSkillDto> = {
    success: true,
    data: skill,
  };
  res.status(200).json(response);
});

export const deleteSkillHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await SkillsService.deleteSkill(id as string);
  const response: ApiResponse<null> = {
    success: true,
    data: null,
  };
  res.status(200).json(response);
});
