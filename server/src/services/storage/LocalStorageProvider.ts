import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IStorageProvider, UploadFileOptions } from './StorageService.js';
import { MediaCategory, MediaUploadResultDto, StorageProviderType } from '@portfolio/shared';
import { env } from '../../config/env.config.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';

export class LocalStorageProvider implements IStorageProvider {
  public readonly providerName: StorageProviderType = 'local';
  private readonly uploadRoot: string;

  constructor(customUploadRoot?: string) {
    this.uploadRoot = customUploadRoot || path.resolve(process.cwd(), 'uploads');
  }

  private getCategorySubdirectory(category: MediaCategory): string {
    switch (category) {
      case 'IMAGE':
        return 'images';
      case 'PDF':
        return 'documents';
      case 'RELEASE':
        return 'releases';
      default:
        return 'misc';
    }
  }

  private getSafeExtension(filename?: string, mimeType?: string): string {
    if (filename) {
      const ext = path.extname(filename).toLowerCase();
      if (ext && ext.length <= 10) return ext;
    }

    // MIME fallback
    if (mimeType === 'image/jpeg') return '.jpg';
    if (mimeType === 'image/png') return '.png';
    if (mimeType === 'image/webp') return '.webp';
    if (mimeType === 'application/pdf') return '.pdf';
    if (mimeType === 'application/zip') return '.zip';
    if (mimeType === 'application/vnd.android.package-archive') return '.apk';
    if (mimeType === 'application/x-msdownload') return '.exe';

    return '.bin';
  }

  private resolveSafePath(storageKey: string): string {
    // Normalize and prevent path traversal
    const normalizedKey = storageKey.replace(/\\/g, '/').replace(/^\/+/, '');
    const resolvedPath = path.resolve(this.uploadRoot, normalizedKey);

    if (!resolvedPath.startsWith(this.uploadRoot)) {
      throw AppError.badRequest('Invalid storage key: directory traversal is strictly forbidden.');
    }

    return resolvedPath;
  }

  async upload(options: UploadFileOptions): Promise<MediaUploadResultDto> {
    const { buffer, originalFilename, mimeType, category, size } = options;

    const subDir = this.getCategorySubdirectory(category);
    const targetDir = path.join(this.uploadRoot, subDir);

    await fs.promises.mkdir(targetDir, { recursive: true });

    const extension = this.getSafeExtension(originalFilename, mimeType);
    const uniqueFilename = `${crypto.randomUUID()}${extension}`;
    const storageKey = `${subDir}/${uniqueFilename}`;
    const filePath = path.join(targetDir, uniqueFilename);

    await fs.promises.writeFile(filePath, buffer);

    const baseUrl = env.API_URL && !env.API_URL.includes('localhost') ? env.API_URL : '';
    const publicUrl = `${baseUrl}/uploads/${storageKey}`;

    logger.debug({ storageKey, size, category }, 'File stored on local filesystem');

    return {
      storageKey,
      url: publicUrl,
      provider: 'local',
      mimeType,
      size,
      category,
      originalFilename,
      uploadedAt: new Date().toISOString(),
    };
  }

  async delete(storageKey: string): Promise<boolean> {
    try {
      const filePath = this.resolveSafePath(storageKey);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        logger.debug({ storageKey }, 'File deleted from local filesystem');
        return true;
      }

      return false;
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.warn({ storageKey, err }, 'Failed to delete local storage file');
      return false;
    }
  }
}
