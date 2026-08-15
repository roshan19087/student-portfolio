import { Request, Response } from 'express';
import { CertificatesService } from './certificates.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, PublicCertificateDto } from '@portfolio/shared';

export const getCertificates = asyncCatch(async (_req: Request, res: Response) => {
  const certificates = await CertificatesService.getPublicCertificates();
  const response: ApiResponse<PublicCertificateDto[]> = {
    success: true,
    data: certificates,
  };
  res.status(200).json(response);
});

export const getAdminCertificateByIdHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const cert = await CertificatesService.getAdminCertificateById(id as string);
  const response: ApiResponse<PublicCertificateDto> = {
    success: true,
    data: cert,
  };
  res.status(200).json(response);
});

export const createCertificateHandler = asyncCatch(async (req: Request, res: Response) => {
  const cert = await CertificatesService.createCertificate(req.body);
  const response: ApiResponse<PublicCertificateDto> = {
    success: true,
    data: cert,
  };
  res.status(201).json(response);
});

export const updateCertificateHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const cert = await CertificatesService.updateCertificate(id as string, req.body);
  const response: ApiResponse<PublicCertificateDto> = {
    success: true,
    data: cert,
  };
  res.status(200).json(response);
});

export const deleteCertificateHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await CertificatesService.deleteCertificate(id as string);
  const response: ApiResponse<null> = {
    success: true,
    data: null,
  };
  res.status(200).json(response);
});
