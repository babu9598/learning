import { Notification, NotificationTemplate } from '../models/Notification';
import { io } from '../server';

export class NotificationService {
  static async getNotifications(params: any) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find()
        .populate('sentBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(),
    ]);

    return {
      notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async sendBroadcast(data: any, adminUserId: string) {
    const notification = await Notification.create({
      ...data,
      sentBy: adminUserId,
      status: 'SENT',
      sentAt: new Date(),
    });

    if (io) {
      io.emit('broadcast:notification', {
        title: data.title,
        message: data.message,
        channel: data.channel,
        targetAudience: data.targetAudience,
      });
    }

    return notification;
  }

  static async getTemplates() {
    return NotificationTemplate.find().sort({ createdAt: -1 });
  }

  static async createTemplate(data: any) {
    return NotificationTemplate.create(data);
  }

  static async updateTemplate(id: string, data: any) {
    return NotificationTemplate.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteTemplate(id: string) {
    return NotificationTemplate.findByIdAndDelete(id);
  }
}
