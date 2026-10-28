import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

// Ensure uploads directory exists
const uploadBaseDir = path.resolve(process.cwd(), 'uploads');
const docUploadDir = path.join(uploadBaseDir, 'documents');
if (!fs.existsSync(docUploadDir)) {
  fs.mkdirSync(docUploadDir, { recursive: true });
}

// Multer disk storage engine
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, docUploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

// File filter for images and documents
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'application/pdf',
  ];

  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, and PDF files are allowed'));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
  },
  fileFilter,
});

export interface UploadedFileResponse {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  storage: 'local' | 's3';
}

/**
 * Upload Service
 * Ready for AWS S3: when AWS_S3_BUCKET is configured in .env,
 * it can seamlessly pipe buffer to S3 PutObjectCommand.
 */
export class UploadService {
  static formatFileResponse(file: Express.Multer.File, req: Request): UploadedFileResponse {
    // S3 check:
    const s3Bucket = process.env.AWS_S3_BUCKET;
    if (s3Bucket) {
      // Future S3 integration point:
      // return { url: `https://${s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/documents/${file.filename}`, ... }
    }

    const relativePath = `/uploads/documents/${file.filename}`;
    return {
      url: relativePath,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      storage: 'local',
    };
  }
}
