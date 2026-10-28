import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment';
import { AdminUser, IAdminUser } from '../models/AdminUser';
import { IRole } from '../models/Role';
import { errorResponse } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: any;
  adminUser?: any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Authentication token missing or invalid', 401, 'Unauthorized');
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string };

    const user = await AdminUser.findById(decoded.id).populate<{ role: IRole }>('role');
    if (!user) {
      errorResponse(res, 'Admin user account not found', 401, 'Unauthorized');
      return;
    }

    if (!user.isActive) {
      errorResponse(res, 'Admin account has been deactivated', 403, 'Forbidden');
      return;
    }

    req.user = user;
    req.adminUser = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      errorResponse(res, 'Session token expired. Please log in again.', 401, 'Token Expired');
      return;
    }
    errorResponse(res, 'Invalid authentication token', 401, 'Unauthorized');
  }
};
