import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`${req.method} ${req.originalUrl} - Error:`, err);

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    errorResponse(res, `A record with this ${field} already exists.`, 409, 'Duplicate Resource');
    return;
  }

  // Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    errorResponse(res, `Resource not found with id ${err.value}`, 404, 'Not Found');
    return;
  }

  // Default Internal Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  errorResponse(res, process.env.NODE_ENV === 'production' ? 'Server Error' : err.stack || message, statusCode, message);
};
