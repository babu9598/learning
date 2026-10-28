import { AdminUser, IAdminUser } from '../models/AdminUser';
import { Role, IRole } from '../models/Role';

export class AdminUserService {
  static async getAdminUsers() {
    return AdminUser.find().populate('role').sort({ createdAt: -1 });
  }

  static async getRoles() {
    return Role.find().sort({ isSystem: -1, createdAt: 1 });
  }

  static async createAdminUser(data: any) {
    const existing = await AdminUser.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new Error('Email already registered for an admin');

    const user = await AdminUser.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      mobile: data.mobile,
      role: data.roleId,
      customPermissions: data.customPermissions || [],
    });

    return user.populate('role');
  }

  static async updateAdminUser(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.roleId) updateData.role = data.roleId;

    const user = await AdminUser.findByIdAndUpdate(id, updateData, { new: true }).populate('role');
    if (!user) throw new Error('Admin user not found');
    return user;
  }

  static async updateRolePermissions(roleId: string, permissions: string[]) {
    const role = await Role.findByIdAndUpdate(roleId, { permissions }, { new: true });
    if (!role) throw new Error('Role not found');
    return role;
  }

  static async createRole(data: any) {
    return Role.create(data);
  }
}
