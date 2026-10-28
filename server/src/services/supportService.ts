import { SupportTicket, ISupportTicket } from '../models/SupportTicket';
import { TicketStatus, TicketPriority } from '../config/constants';

export class SupportService {
  static async getTickets(params: any) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.search) {
      query.$or = [
        { ticketId: { $regex: params.search, $options: 'i' } },
        { subject: { $regex: params.search, $options: 'i' } },
        { description: { $regex: params.search, $options: 'i' } },
      ];
    }
    if (params.status) query.status = params.status;
    if (params.priority) query.priority = params.priority;
    if (params.userType) query.userType = params.userType;

    const [tickets, total] = await Promise.all([
      SupportTicket.find(query)
        .populate('customer', 'name email mobile customerId')
        .populate('driver', 'name mobile driverId')
        .populate('booking', 'bookingId serviceType')
        .populate('assignedAdmin', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SupportTicket.countDocuments(query),
    ]);

    return {
      tickets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getTicketById(id: string) {
    const ticket = await SupportTicket.findById(id)
      .populate('customer')
      .populate('driver')
      .populate('booking')
      .populate('assignedAdmin');

    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  }

  static async createTicket(data: any) {
    const count = await SupportTicket.countDocuments();
    const ticketId = `TCK-${String(count + 1).padStart(6, '0')}`;

    return SupportTicket.create({
      ...data,
      ticketId,
      status: TicketStatus.OPEN,
    });
  }

  static async addMessage(ticketId: string, messageData: any) {
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    ticket.messages.push({
      senderType: messageData.senderType || 'ADMIN',
      senderId: messageData.senderId,
      senderName: messageData.senderName || 'Support Agent',
      message: messageData.message,
      attachments: messageData.attachments || [],
      createdAt: new Date(),
    });

    if (ticket.status === TicketStatus.OPEN) {
      ticket.status = TicketStatus.IN_PROGRESS;
    }

    await ticket.save();
    return ticket;
  }

  static async updateTicketStatus(
    id: string,
    status: TicketStatus,
    resolutionNotes?: string,
    adminId?: string
  ) {
    const update: any = { status };
    if (resolutionNotes) update.resolutionNotes = resolutionNotes;
    if (status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED) {
      update.resolvedAt = new Date();
      if (adminId) update.resolvedBy = adminId;
    }

    const ticket = await SupportTicket.findByIdAndUpdate(id, update, { new: true });
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  }
}
