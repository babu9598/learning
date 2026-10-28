import { z } from 'zod';
import { PayoutStatus } from '../config/constants';

export const processPayoutSchema = z.object({
  body: z.object({
    status: z.nativeEnum(PayoutStatus),
    paymentMode: z.enum(['BANK_TRANSFER', 'UPI', 'CHEQUE', 'MANUAL']).default('BANK_TRANSFER'),
    bankReferenceNumber: z.string().optional(),
    paidAmount: z.number().positive().optional(),
    notes: z.string().optional(),
  }),
});

export const generatePayoutBatchSchema = z.object({
  body: z.object({
    driverId: z.string().optional(),
    periodStart: z.string().or(z.date()).optional(),
    periodEnd: z.string().or(z.date()).optional(),
  }),
});
