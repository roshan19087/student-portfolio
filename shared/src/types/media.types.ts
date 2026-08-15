export type MediaCategory = 'IMAGE' | 'PDF' | 'RELEASE';

export type StorageProviderType = 'local' | 'cloudinary';

export interface MediaUploadResultDto {
  storageKey: string;
  url: string;
  publicUrl?: string;
  provider: StorageProviderType;
  mimeType: string;
  size: number;
  category: MediaCategory;
  originalFilename?: string;
  uploadedAt: string;
}

export type UploadResponseDto = MediaUploadResultDto;

export interface MediaDeleteResultDto {
  storageKey: string;
  deleted: boolean;
  message: string;
}
