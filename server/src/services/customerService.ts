import { Customer, ICustomer } from '../models/Customer';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { SupportTicket } from '../models/SupportTicket';

export interface CustomerFilterParams {
  search?: string;
  status?: 'ACTIVE' | 'BLOCKED';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class CustomerService {
  static async getCustomers(params: CustomerFilterParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.search) {
      query.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
        { mobile: { $regex: params.search, $options: 'i' } },
        { customerId: { $regex: params.search, $options: 'i' } },
      ];
    }

    if (params.status) query.status = params.status;

    const sortField = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      Customer.countDocuments(query),
    ]);

    return {
      customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCustomerById(id: string) {
    const customer = await Customer.findById(id);
    if (!customer) throw new Error('Customer not found');

    const [bookings, payments, tickets] = await Promise.all([
      Booking.find({ customer: customer._id }).sort({ createdAt: -1 }).limit(10),
      Payment.find({ customer: customer._id }).sort({ createdAt: -1 }).limit(10),
      SupportTicket.find({ customer: customer._id }).sort({ createdAt: -1 }),
    ]);

    return {
      customer,
      bookings,
      payments,
      tickets,
    };
  }

  static async updateStatus(id: string, status: 'ACTIVE' | 'BLOCKED') {
    const customer = await Customer.findByIdAndUpdate(id, { status }, { new: true });
    if (!customer) throw new Error('Customer not found');
    return customer;
  }
}
