import { 
  PutObjectCommand, 
  DeleteObjectCommand, 
  GetObjectCommand,
  HeadObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './config';
import { createId } from '@paralleldrive/cuid2';

export interface UploadResult {
  key: string;
  url: string;
  size: number;
}

export interface FileMetadata {
  originalName: string;
  mimeType: string;
  size: number;
  userId?: string;
  organizationId?: string;
}

/**
 * Generate a unique file key with proper extension
 */
export function generateFileKey(originalName: string, prefix?: string): string {
  const extension = originalName.split('.').pop() || '';
  const id = createId();
  const key = prefix ? `${prefix}/${id}` : id;
  return extension ? `${key}.${extension}` : key;
}

/**
 * Upload a file to R2
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  metadata: FileMetadata,
  prefix?: string
): Promise<UploadResult> {
  const key = generateFileKey(metadata.originalName, prefix);
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: metadata.mimeType,
    ContentLength: metadata.size,
    Metadata: {
      originalName: metadata.originalName,
      userId: metadata.userId || '',
      organizationId: metadata.organizationId || '',
    },
  });

  await r2Client.send(command);

  return {
    key,
    url: `${R2_PUBLIC_URL}/${key}`,
    size: metadata.size,
  };
}

/**
 * Delete a file from R2
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Get a presigned URL for file upload
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Get a presigned URL for file download
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Check if a file exists in R2
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * Get file metadata from R2
 */
export async function getFileMetadata(key: string) {
  const command = new HeadObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  const response = await r2Client.send(command);
  
  return {
    size: response.ContentLength || 0,
    contentType: response.ContentType || 'application/octet-stream',
    lastModified: response.LastModified,
    metadata: response.Metadata || {},
  };
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes } = options; // Default 10MB

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
    };
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
}

/**
 * Common file type configurations
 */
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  SPREADSHEETS: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],
  ARCHIVES: ['application/zip', 'application/x-rar-compressed', 'application/x-tar'],
} as const;

