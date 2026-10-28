import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { AdminRole, Permission } from '../config/constants';
import { errorResponse } from '../utils/response';

// Require one of the specified roles
export const requireRole = (...roles: AdminRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      errorResponse(res, 'Access denied. Missing role information.', 403, 'Forbidden');
      return;
    }

    const userRoleCode = req.user.role.code;
    // Super admin always has access
    if (userRoleCode === AdminRole.SUPER_ADMIN || roles.includes(userRoleCode)) {
      next();
      return;
    }

    errorResponse(
      res,
      `Access denied. Requires one of roles: ${roles.join(', ')}`,
      403,
      'Insufficient Role'
    );
  };
};

// Require a specific permission
export const requirePermission = (...permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      errorResponse(res, 'Access denied. Missing role permissions.', 403, 'Forbidden');
      return;
    }

    // Super Admin bypasses all checks
    if (req.user.role.code === AdminRole.SUPER_ADMIN) {
      next();
      return;
    }

    const userPermissions: string[] = [
      ...(req.user.role.permissions || []),
      ...(req.user.customPermissions || []),
    ];

    const hasAll = permissions.every((p) => userPermissions.includes(p));
    if (!hasAll) {
      errorResponse(
        res,
        `Access denied. Missing required permission(s): ${permissions.join(', ')}`,
        403,
        'Permission Denied'
      );
      return;
    }

    next();
  };
};
