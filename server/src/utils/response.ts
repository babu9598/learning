import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: any;
  };
  error?: string | any;
}

export const successResponse = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
  meta?: ApiResponse['meta']
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const errorResponse = (
  res: Response,
  error: string | any,
  statusCode = 400,
  message = 'An error occurred'
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: typeof error === 'string' ? error : error?.message || error,
  });
};
