import { Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { SupportService } from '../services/supportService';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditLogger';
import { AuditAction, AuditModule } from '../config/constants';
import { successResponse, errorResponse } from '../utils/response';

export class NotificationController {
  static async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await NotificationService.getNotifications(req.query);
      successResponse(res, result.notifications, 'Notifications fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async sendBroadcast(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const notification = await NotificationService.sendBroadcast(
        req.body,
        req.user?._id?.toString() || ''
      );
      await logAuditEvent(req, {
        module: AuditModule.NOTIFICATIONS,
        action: AuditAction.CREATE,
        recordId: notification._id.toString(),
        targetModel: 'Notification',
        description: `Broadcasted notification: ${notification.title}`,
      });
      successResponse(res, notification, 'Notification sent successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getTemplates(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const templates = await NotificationService.getTemplates();
      successResponse(res, templates, 'Templates fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async createTemplate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const template = await NotificationService.createTemplate(req.body);
      successResponse(res, template, 'Template created', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateTemplate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const template = await NotificationService.updateTemplate(id, req.body);
      successResponse(res, template, 'Template updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async deleteTemplate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await NotificationService.deleteTemplate(id);
      successResponse(res, { success: true }, 'Template deleted');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}

export class SupportController {
  static async getTickets(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await SupportService.getTickets(req.query);
      successResponse(res, result.tickets, 'Support tickets fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getTicketById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const ticket = await SupportService.getTicketById(id);
      successResponse(res, ticket, 'Ticket details fetched');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  }

  static async createTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const ticket = await SupportService.createTicket(req.body);
      successResponse(res, ticket, 'Ticket created successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async addMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const ticket = await SupportService.addMessage(id, {
        ...req.body,
        senderId: req.user?._id,
        senderName: req.user?.name || 'Support Desk Agent',
        senderType: 'ADMIN',
      });
      successResponse(res, ticket, 'Reply added to ticket');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { status, resolutionNotes } = req.body;
      const ticket = await SupportService.updateTicketStatus(
        id,
        status,
        resolutionNotes,
        req.user?._id?.toString()
      );
      await logAuditEvent(req, {
        module: AuditModule.SUPPORT,
        action: AuditAction.STATUS_CHANGE,
        recordId: ticket._id.toString(),
        targetModel: 'SupportTicket',
        newValue: { status, resolutionNotes },
        description: `Updated support ticket ${ticket.ticketId} to ${status}`,
      });
      successResponse(res, ticket, `Ticket status updated to ${status}`);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}
