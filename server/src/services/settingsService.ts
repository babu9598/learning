import { AuditLog } from '../models/AuditLog';
import { AppSetting } from '../models/AppSetting';

export class AuditLogService {
  static async getAuditLogs(params: any) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.module) query.module = params.module;
    if (params.action) query.action = params.action;
    if (params.search) {
      query.$or = [
        { adminName: { $regex: params.search, $options: 'i' } },
        { adminEmail: { $regex: params.search, $options: 'i' } },
        { description: { $regex: params.search, $options: 'i' } },
        { recordId: { $regex: params.search, $options: 'i' } },
      ];
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(query),
    ]);

    return {
      logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export class SettingsService {
  static async getSettings() {
    let settings = await AppSetting.findOne();
    if (!settings) {
      settings = await AppSetting.create({});
    }
    return settings;
  }

  static async updateSettings(data: any) {
    let settings = await AppSetting.findOne();
    if (!settings) {
      settings = await AppSetting.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    return settings;
  }
}
