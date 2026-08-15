import { Request, Response } from 'express';
import { AdminService } from './admin.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, AdminDashboardStatsDto, AdminContactMessageDto } from '@portfolio/shared';

export const getDashboardStatsHandler = asyncCatch(async (_req: Request, res: Response) => {
  const stats = await AdminService.getDashboardStats();
  const response: ApiResponse<AdminDashboardStatsDto> = {
    success: true,
    data: stats,
  };
  res.json(response);
});

export const getMessagesHandler = asyncCatch(async (req: Request, res: Response) => {
  const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
  const isArchived =
    req.query.isArchived !== undefined ? req.query.isArchived === 'true' : undefined;

  const messages = await AdminService.getMessages({ isRead, isArchived });
  const response: ApiResponse<AdminContactMessageDto[]> = {
    success: true,
    data: messages,
  };
  res.json(response);
});

export const getMessageByIdHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const message = await AdminService.getMessageById(id);
  const response: ApiResponse<AdminContactMessageDto> = {
    success: true,
    data: message,
  };
  res.json(response);
});

export const markMessageReadHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const isRead = req.body.isRead !== undefined ? Boolean(req.body.isRead) : true;
  const updated = await AdminService.updateMessageStatus(id, { isRead });
  const response: ApiResponse<AdminContactMessageDto> = {
    success: true,
    data: updated,
  };
  res.json(response);
});

export const archiveMessageHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const isArchived = req.body.isArchived !== undefined ? Boolean(req.body.isArchived) : true;
  const updated = await AdminService.updateMessageStatus(id, { isArchived });
  const response: ApiResponse<AdminContactMessageDto> = {
    success: true,
    data: updated,
  };
  res.json(response);
});

export const deleteMessageHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await AdminService.deleteMessage(id);
  const response: ApiResponse<null> = {
    success: true,
    data: null,
  };
  res.json(response);
});
