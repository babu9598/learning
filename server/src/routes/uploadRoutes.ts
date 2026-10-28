import { Router, Request, Response } from 'express';
import { uploadMiddleware, UploadService } from '../services/uploadService';
import { successResponse, errorResponse } from '../utils/response';

export const uploadRouter = Router();

/**
 * @route POST /api/upload/single
 * @desc Upload a single document or live picture (image / pdf)
 */
uploadRouter.post(
  '/single',
  uploadMiddleware.single('file'),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        errorResponse(res, 'No file was uploaded', 400);
        return;
      }

      const fileData = UploadService.formatFileResponse(req.file, req);
      successResponse(res, fileData, 'File uploaded successfully', 201);
    } catch (err: any) {
      errorResponse(res, err.message || 'File upload failed', 500);
    }
  }
);

/**
 * @route POST /api/upload/multiple
 * @desc Upload up to 10 documents simultaneously
 */
uploadRouter.post(
  '/multiple',
  uploadMiddleware.array('files', 10),
  (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        errorResponse(res, 'No files were uploaded', 400);
        return;
      }

      const formatted = files.map((f) => UploadService.formatFileResponse(f, req));
      successResponse(res, formatted, 'Files uploaded successfully', 201);
    } catch (err: any) {
      errorResponse(res, err.message || 'Files upload failed', 500);
    }
  }
);
