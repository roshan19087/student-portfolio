import { MediaCategory, MediaUploadResultDto, StorageProviderType } from '@portfolio/shared';
import { env } from '../../config/env.config.js';
import { LocalStorageProvider } from './LocalStorageProvider.js';
import { CloudinaryStorageProvider } from './CloudinaryStorageProvider.js';
import { logger } from '../../utils/logger.js';

export interface UploadFileOptions {
  buffer: Buffer;
  originalFilename?: string;
  mimeType: string;
  category: MediaCategory;
  size: number;
}

export interface IStorageProvider {
  readonly providerName: StorageProviderType;
  upload(options: UploadFileOptions): Promise<MediaUploadResultDto>;
  delete(storageKey: string): Promise<boolean>;
}

export class StorageService {
  private provider: IStorageProvider;

  constructor(provider?: IStorageProvider) {
    if (provider) {
      this.provider = provider;
      return;
    }

    if (env.STORAGE_PROVIDER === 'cloudinary' && env.CLOUDINARY_CLOUD_NAME) {
      logger.info('Initializing Cloudinary Storage Provider');
      this.provider = new CloudinaryStorageProvider();
    } else {
      logger.info('Initializing Local Disk Storage Provider');
      this.provider = new LocalStorageProvider();
    }
  }

  get providerName(): StorageProviderType {
    return this.provider.providerName;
  }

  setProvider(provider: IStorageProvider): void {
    this.provider = provider;
  }

  async upload(options: UploadFileOptions): Promise<MediaUploadResultDto> {
    return this.provider.upload(options);
  }

  async delete(storageKey: string): Promise<boolean> {
    return this.provider.delete(storageKey);
  }
}

export const storageService = new StorageService();
