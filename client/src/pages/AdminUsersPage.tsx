import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Plus, UserPlus, Key, Shield, Check, Lock } from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { AdminUser, AdminRoleInfo } from '../types';
import { formatDateTime } from '../utils/formatters';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('adminPassword123!');
  const [mobile, setMobile] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // 1. Fetch Admin Users
  const { data: adminUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin-users').then((res: any) => res.data),
  });

  // 2. Fetch Roles
  const { data: roles } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => api.get('/admin-users/roles').then((res: any) => res.data),
  });

  // Create Admin Mutation
  const createAdminMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin-users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsAddUserOpen(false);
      setName('');
      setEmail('');
      setMobile('');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAdminMutation.mutate({
      name,
      email,
      password,
      mobile,
      roleId: selectedRoleId,
    });
  };

  const userColumns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'Admin User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={u.name}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-cloudy-200 dark:ring-slate-700"
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-white leading-tight">{u.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (u) => (
        <Badge variant="brand" size="sm">
          {u.role?.name || 'Super Admin'}
        </Badge>
      ),
    },
    {
      key: 'mobile',
      header: 'Mobile',
      render: (u) => <span className="text-xs text-slate-700 dark:text-slate-300">{u.mobile}</span>,
    },
    {
      key: 'lastLogin',
      header: 'Last Active',
      render: (u) => (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          {u.lastLogin ? formatDateTime(u.lastLogin) : 'Never logged in'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: (u) => (
        <Badge variant={u.isActive ? 'success' : 'danger'} size="sm" dot>
          {u.isActive ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Admin Staff & RBAC Role Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage administrative personnel, permission matrix, and role security boundaries.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => {
            if (roles && roles[0]) setSelectedRoleId(roles[0]._id);
            setIsAddUserOpen(true);
          }}
        >
          Add Admin User
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cloudy-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/40 border border-cloudy-200 dark:border-transparent'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Admin Users Directory
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'roles'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/40 border border-cloudy-200 dark:border-transparent'
          }`}
        >
          <Shield className="w-4 h-4" /> Roles & Permissions Matrix
        </button>
      </div>

      {/* Admin Users Table */}
      {activeTab === 'users' && (
        <DataTable columns={userColumns} data={adminUsers || []} isLoading={loadingUsers} />
      )}

      {/* Roles & Permissions View */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(roles || []).map((role: AdminRoleInfo) => (
            <div
              key={role._id}
              className="glass-panel p-5 rounded-2xl border border-cloudy-200 dark:border-slate-800 shadow-card space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{role.name}</h4>
                <Badge variant="neutral" size="sm">
                  {role.code}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">{role.description}</p>

              <div className="pt-2 border-t border-cloudy-200 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                  Permissions ({role.permissions?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pt-1">
                  {(role.permissions || []).map((p: string) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-lg bg-cloudy-100 dark:bg-slate-950 border border-cloudy-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Admin User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Create Administrative User Account"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Ramesh V"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="admin@droptaxi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Mobile Number</label>
              <input
                type="text"
                placeholder="+91 98401 00000"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Assigned Role</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              >
                {(roles || []).map((r: AdminRoleInfo) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={createAdminMutation.isPending}>
              Create Admin User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
