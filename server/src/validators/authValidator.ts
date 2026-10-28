import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

export const createAdminUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    mobile: z.string().min(10, 'Valid 10-digit mobile required'),
    roleId: z.string().min(1, 'Role ID is required'),
    customPermissions: z.array(z.string()).optional(),
  }),
});

export const updateAdminUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    mobile: z.string().min(10).optional(),
    roleId: z.string().optional(),
    isActive: z.boolean().optional(),
    customPermissions: z.array(z.string()).optional(),
  }),
});
