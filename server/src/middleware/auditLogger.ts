import { AuthenticatedRequest } from './auth';
import { AuditLog } from '../models/AuditLog';
import { AuditAction, AuditModule } from '../config/constants';
import { logger } from '../utils/logger';

export interface AuditLogOptions {
  module: AuditModule;
  action: AuditAction;
  recordId?: string;
  targetModel?: string;
  previousValue?: any;
  newValue?: any;
  description?: string;
}

export const logAuditEvent = async (
  req: AuthenticatedRequest,
  options: AuditLogOptions
): Promise<void> => {
  try {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    await AuditLog.create({
      adminUser: req.user?._id,
      adminName: req.user?.name || 'System Admin',
      adminEmail: req.user?.email || 'admin@droptaxi.com',
      module: options.module,
      action: options.action,
      recordId: options.recordId,
      targetModel: options.targetModel,
      previousValue: options.previousValue,
      newValue: options.newValue,
      ipAddress,
      userAgent,
      description: options.description || `${options.action} on ${options.module}`,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Failed to write audit log:', error);
  }
};
