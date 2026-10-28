import { Response } from 'express';
import { AdminUserService } from '../services/adminUserService';
import { SettingsService, AuditLogService } from '../services/settingsService';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditLogger';
import { AuditAction, AuditModule } from '../config/constants';
import { successResponse, errorResponse } from '../utils/response';

export class AdminUserController {
  static async getAdminUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const users = await AdminUserService.getAdminUsers();
      successResponse(res, users, 'Admin users fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getRoles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const roles = await AdminUserService.getRoles();
      successResponse(res, roles, 'Roles fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async createAdminUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await AdminUserService.createAdminUser(req.body);
      await logAuditEvent(req, {
        module: AuditModule.ADMIN_USERS,
        action: AuditAction.CREATE,
        recordId: user._id.toString(),
        targetModel: 'AdminUser',
        description: `Created admin user ${user.name} (${user.email})`,
      });
      successResponse(res, user, 'Admin user created', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateAdminUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const user = await AdminUserService.updateAdminUser(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.ADMIN_USERS,
        action: AuditAction.UPDATE,
        recordId: user._id.toString(),
        targetModel: 'AdminUser',
        description: `Updated admin user ${user.name}`,
      });
      successResponse(res, user, 'Admin user updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateRolePermissions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const role = await AdminUserService.updateRolePermissions(id, req.body.permissions);
      await logAuditEvent(req, {
        module: AuditModule.ADMIN_USERS,
        action: AuditAction.UPDATE,
        recordId: role._id.toString(),
        targetModel: 'Role',
        description: `Updated permissions for role ${role.name}`,
      });
      successResponse(res, role, 'Role permissions updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}

export class SettingsController {
  static async getSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const settings = await SettingsService.getSettings();
      successResponse(res, settings, 'Application settings fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const settings = await SettingsService.updateSettings(req.body);
      await logAuditEvent(req, {
        module: AuditModule.SETTINGS,
        action: AuditAction.UPDATE,
        recordId: settings._id.toString(),
        targetModel: 'AppSetting',
        description: 'Updated application settings',
      });
      successResponse(res, settings, 'Application settings updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}

export class AuditLogController {
  static async getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await AuditLogService.getAuditLogs(req.query);
      successResponse(res, result.logs, 'Audit logs fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}
