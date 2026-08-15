import { Request, Response } from 'express';
import { ContactService } from './contact.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, ContactSubmissionInput, ContactSubmissionResultDto } from '@portfolio/shared';

export const submitContactMessage = asyncCatch(async (req: Request, res: Response) => {
  const input = req.body as ContactSubmissionInput;
  const result = await ContactService.handleContactSubmission(input);

  const response: ApiResponse<ContactSubmissionResultDto> = {
    success: true,
    data: result,
  };

  res.status(201).json(response);
});
