import { storageService } from '../../services/storage/StorageService.js';
import { validateUploadedFile } from '../../middlewares/upload.middleware.js';
import { MediaCategory, MediaUploadResultDto, MediaDeleteResultDto } from '@portfolio/shared';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';

export class MediaService {
  /**
   * Validate uploaded file buffer and store it via the configured StorageService provider
   */
  static async uploadMedia(
    file: Express.Multer.File | undefined,
    category: MediaCategory,
  ): Promise<MediaUploadResultDto> {
    const validated = await validateUploadedFile(file, category);

    const result = await storageService.upload({
      buffer: validated.buffer,
      originalFilename: validated.originalFilename,
      mimeType: validated.mimeType,
      category: validated.category,
      size: validated.size,
    });

    logger.info(
      { storageKey: result.storageKey, provider: result.provider, size: result.size },
      'Media uploaded successfully',
    );

    return result;
  }

  /**
   * Delete stored asset by storage key
   */
  static async deleteMedia(storageKey: string): Promise<MediaDeleteResultDto> {
    if (!storageKey || storageKey.trim() === '') {
      throw AppError.badRequest('Storage key is required.');
    }

    if (storageKey.includes('..') || storageKey.startsWith('/') || storageKey.startsWith('\\')) {
      throw AppError.badRequest('Invalid storage key: directory traversal pattern is prohibited.');
    }

    const deleted = await storageService.delete(storageKey);

    logger.info({ storageKey, deleted }, 'Media delete request processed');

    return {
      storageKey,
      deleted,
      message: deleted ? 'Asset deleted successfully.' : 'Asset was not found or already removed.',
    };
  }
}
