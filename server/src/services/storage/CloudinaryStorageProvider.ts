import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { IStorageProvider, UploadFileOptions } from './StorageService.js';
import { MediaUploadResultDto, StorageProviderType } from '@portfolio/shared';
import { env } from '../../config/env.config.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';

export class CloudinaryStorageProvider implements IStorageProvider {
  public readonly providerName: StorageProviderType = 'cloudinary';

  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async upload(options: UploadFileOptions): Promise<MediaUploadResultDto> {
    const { buffer, originalFilename, mimeType, category, size } = options;

    const folder = `portfolio/${category.toLowerCase()}s`;
    const isImage = category === 'IMAGE';
    const resourceType = isImage ? 'image' : 'raw';

    return new Promise<MediaUploadResultDto>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          format: isImage ? undefined : undefined,
        },
        (error: unknown, result?: UploadApiResponse) => {
          if (error || !result) {
            logger.error({ error }, 'Cloudinary upload failed');
            return reject(
              new AppError(
                'Failed to upload file to cloud storage provider.',
                500,
                'CLOUD_STORAGE_ERROR',
              ),
            );
          }

          resolve({
            storageKey: result.public_id,
            url: result.secure_url,
            provider: 'cloudinary',
            mimeType: result.format ? `image/${result.format}` : mimeType,
            size: result.bytes || size,
            category,
            originalFilename,
            uploadedAt: result.created_at || new Date().toISOString(),
          });
        },
      );

      uploadStream.end(buffer);
    });
  }

  async delete(storageKey: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(storageKey);
      return result.result === 'ok';
    } catch (error) {
      logger.warn({ storageKey, error }, 'Cloudinary asset deletion failed');
      return false;
    }
  }
}
