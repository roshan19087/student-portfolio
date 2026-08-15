import multer from 'multer';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';
import { AppError } from '../utils/AppError.js';
import { MediaCategory } from '@portfolio/shared';

// 1. Multer Memory Storage Configuration (Strict Memory Limits)
const storage = multer.memoryStorage();

export const uploadSingleFile = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Global ceiling: 100 MB
    files: 1,
  },
}).single('file');

// Category-specific maximum file sizes
export const CATEGORY_SIZE_LIMITS: Record<MediaCategory, number> = {
  IMAGE: 5 * 1024 * 1024, // 5 MB
  PDF: 10 * 1024 * 1024, // 10 MB
  RELEASE: 100 * 1024 * 1024, // 100 MB
};

// Allowed file extensions by category
export const CATEGORY_ALLOWED_EXTENSIONS: Record<MediaCategory, string[]> = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.webp'],
  PDF: ['.pdf'],
  RELEASE: ['.apk', '.exe', '.dmg', '.zip'],
};

// Allowed detected MIME types by category
export const CATEGORY_ALLOWED_MIMES: Record<MediaCategory, string[]> = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  PDF: ['application/pdf'],
  RELEASE: [
    'application/zip',
    'application/vnd.android.package-archive',
    'application/x-msdownload',
    'application/x-dosexec',
    'application/x-apple-diskimage',
  ],
};

export interface ValidatedFileResult {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  size: number;
  originalFilename?: string;
  category: MediaCategory;
}

/**
 * Perform comprehensive magic-byte inspection, extension validation, and size checks
 */
export async function validateUploadedFile(
  file: Express.Multer.File | undefined,
  category: MediaCategory,
): Promise<ValidatedFileResult> {
  if (!file || !file.buffer) {
    throw AppError.badRequest('No file uploaded. Please provide a file in the "file" field.');
  }

  const rawExtension = path.extname(file.originalname || '').toLowerCase();

  // 1. Explicit SVG rejection (XSS prevention)
  if (rawExtension === '.svg' || file.mimetype === 'image/svg+xml') {
    throw AppError.badRequest('SVG uploads are strictly prohibited for security reasons.');
  }

  // 2. Validate Category Size Limit
  const maxAllowedSize = CATEGORY_SIZE_LIMITS[category];
  if (!maxAllowedSize || file.size > maxAllowedSize) {
    const sizeInMB = Math.round((maxAllowedSize || 0) / (1024 * 1024));
    throw AppError.badRequest(
      `File size exceeds the allowed limit of ${sizeInMB} MB for category ${category}.`,
      'FILE_TOO_LARGE',
    );
  }

  // 3. Validate Extension Allowlists
  const allowedExtensions = CATEGORY_ALLOWED_EXTENSIONS[category];
  if (!allowedExtensions || !allowedExtensions.includes(rawExtension)) {
    throw AppError.badRequest(
      `Invalid file extension "${rawExtension}". Allowed extensions for ${category}: ${allowedExtensions.join(', ')}`,
      'INVALID_EXTENSION',
    );
  }

  // 4. Binary Inspection & Magic-Byte Validation via file-type
  const detectedType = await fileTypeFromBuffer(file.buffer);

  let verifiedMime = detectedType?.mime;
  const verifiedExt = detectedType?.ext ? `.${detectedType.ext.toLowerCase()}` : rawExtension;

  // Custom fallback checks for specific binary types where file-type might be ambiguous
  if (!verifiedMime) {
    // Check for standard PDF header '%PDF-' (0x25 0x50 0x44 0x46 0x2D)
    if (
      category === 'PDF' &&
      file.buffer.length >= 5 &&
      file.buffer.toString('utf-8', 0, 5) === '%PDF-'
    ) {
      verifiedMime = 'application/pdf';
    }
    // Check for Windows Executable 'MZ' header (0x4D 0x5A)
    else if (
      category === 'RELEASE' &&
      rawExtension === '.exe' &&
      file.buffer.length >= 2 &&
      file.buffer[0] === 0x4d &&
      file.buffer[1] === 0x5a
    ) {
      verifiedMime = 'application/x-msdownload';
    }
    // Check for ZIP/APK header 'PK\x03\x04' (0x50 0x4B 0x03 0x04)
    else if (
      category === 'RELEASE' &&
      (rawExtension === '.zip' || rawExtension === '.apk') &&
      file.buffer.length >= 4 &&
      file.buffer[0] === 0x50 &&
      file.buffer[1] === 0x4b &&
      file.buffer[2] === 0x03 &&
      file.buffer[3] === 0x04
    ) {
      verifiedMime =
        rawExtension === '.apk' ? 'application/vnd.android.package-archive' : 'application/zip';
    }
    // Check for DMG / raw disk images
    else if (category === 'RELEASE' && rawExtension === '.dmg' && file.buffer.length >= 4) {
      verifiedMime = 'application/x-apple-diskimage';
    }
  }

  if (!verifiedMime) {
    throw AppError.badRequest(
      'Could not verify file binary signature. The uploaded file is corrupt or invalid.',
      'INVALID_FILE_SIGNATURE',
    );
  }

  // 5. Cross-Check Detected MIME with Category Allowlists
  const allowedMimes = CATEGORY_ALLOWED_MIMES[category];
  const isMimeAllowed =
    allowedMimes.includes(verifiedMime) ||
    (category === 'RELEASE' &&
      (verifiedMime.includes('zip') ||
        verifiedMime.includes('executable') ||
        verifiedMime.includes('octet-stream')));

  if (!isMimeAllowed) {
    throw AppError.badRequest(
      `File binary signature (${verifiedMime}) does not match the expected category ${category}.`,
      'MIME_MISMATCH',
    );
  }

  return {
    buffer: file.buffer,
    mimeType: verifiedMime,
    extension: verifiedExt,
    size: file.size,
    originalFilename: file.originalname,
    category,
  };
}
