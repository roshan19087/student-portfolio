import { Request, Response } from 'express';
import { ProjectsService } from './projects.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import {
  ApiResponse,
  ProjectQueryInput,
  PublicProjectListItemDto,
  PublicProjectDetailDto,
} from '@portfolio/shared';

export const listProjects = asyncCatch(async (req: Request, res: Response) => {
  const query = req.query as unknown as ProjectQueryInput;
  const projects = await ProjectsService.getPublicProjects(query);

  const response: ApiResponse<PublicProjectListItemDto[]> = {
    success: true,
    data: projects,
  };

  res.status(200).json(response);
});

export const getProjectBySlug = asyncCatch(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const project = await ProjectsService.getPublicProjectBySlug(slug as string);

  const response: ApiResponse<PublicProjectDetailDto> = {
    success: true,
    data: project,
  };

  res.status(200).json(response);
});

export const getAdminProjectsHandler = asyncCatch(async (_req: Request, res: Response) => {
  const projects = await ProjectsService.getAdminProjects();
  const response: ApiResponse<PublicProjectDetailDto[]> = {
    success: true,
    data: projects,
  };
  res.status(200).json(response);
});

export const getAdminProjectByIdHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const project = await ProjectsService.getAdminProjectById(id as string);
  const response: ApiResponse<PublicProjectDetailDto> = {
    success: true,
    data: project,
  };
  res.status(200).json(response);
});

export const createProjectHandler = asyncCatch(async (req: Request, res: Response) => {
  const project = await ProjectsService.createProject(req.body);
  const response: ApiResponse<PublicProjectDetailDto> = {
    success: true,
    data: project,
  };
  res.status(201).json(response);
});

export const updateProjectHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const project = await ProjectsService.updateProject(id as string, req.body);
  const response: ApiResponse<PublicProjectDetailDto> = {
    success: true,
    data: project,
  };
  res.status(200).json(response);
});

export const deleteProjectHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await ProjectsService.deleteProject(id as string);
  const response: ApiResponse<null> = {
    success: true,
    data: null,
  };
  res.status(200).json(response);
});
