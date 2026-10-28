import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Send, Plus, MessageSquare, Radio, CheckCircle, Trash2 } from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { formatDateTime } from '../utils/formatters';

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'sent' | 'templates'>('sent');
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);

  // Broadcast Form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'PUSH' | 'SMS' | 'EMAIL'>('PUSH');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'DRIVERS' | 'CUSTOMERS'>('ALL');

  // 1. Fetch Sent Broadcasts
  const { data: sentData, isLoading: loadingSent } = useQuery({
    queryKey: ['notifications-sent'],
    queryFn: () => api.get('/notifications').then((res: any) => res),
    enabled: activeTab === 'sent',
  });

  // 2. Fetch Templates
  const { data: templates, isLoading: loadingTemplates } = useQuery({
    queryKey: ['notification-templates'],
    queryFn: () => api.get('/notifications/templates').then((res: any) => res.data),
    enabled: activeTab === 'templates',
  });

  // Send Broadcast Mutation
  const sendMutation = useMutation({
    mutationFn: (data: any) => api.post('/notifications/send', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-sent'] });
      setIsSendOpen(false);
      setTitle('');
      setMessage('');
    },
  });

  // Create Template Mutation
  const templateMutation = useMutation({
    mutationFn: (data: any) => api.post('/notifications/templates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      setIsTemplateOpen(false);
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      title,
      message,
      channel,
      targetAudience,
    });
  };

  const sentColumns: Column<any>[] = [
    {
      key: 'title',
      header: 'Notification Title & Message',
      render: (n) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{n.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">{n.message}</p>
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Channel',
      render: (n) => (
        <Badge variant={n.channel === 'PUSH' ? 'brand' : n.channel === 'SMS' ? 'warning' : 'info'} size="sm">
          {n.channel}
        </Badge>
      ),
    },
    {
      key: 'target',
      header: 'Audience',
      render: (n) => (
        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{n.targetAudience}</span>
      ),
    },
    {
      key: 'sentBy',
      header: 'Dispatched By',
      render: (n) => (
        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.sentBy?.name || 'System Admin'}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{formatDateTime(n.sentAt)}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Notification & Broadcast Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Send real-time push alerts, SMS alerts, and marketing broadcasts to drivers and customers.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Send className="w-4 h-4" />}
          onClick={() => setIsSendOpen(true)}
        >
          Send Live Broadcast
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cloudy-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'sent'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/40 border border-cloudy-200 dark:border-transparent'
          }`}
        >
          <Bell className="w-4 h-4" /> Broadcast History
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'templates'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/40 border border-cloudy-200 dark:border-transparent'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Pre-built Templates
        </button>
      </div>

      {/* Broadcast History Table */}
      {activeTab === 'sent' && (
        <DataTable columns={sentColumns} data={sentData?.data || []} isLoading={loadingSent} />
      )}

      {/* Templates Grid */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(templates || []).map((t: any) => (
            <div key={t._id} className="glass-panel p-5 rounded-2xl border border-cloudy-200 dark:border-slate-800 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="sm">
                  {t.channel}
                </Badge>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{t.code}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 bg-cloudy-50 dark:bg-slate-950 p-3 rounded-xl border border-cloudy-200 dark:border-slate-800">
                  {t.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Broadcast Modal */}
      <Modal
        isOpen={isSendOpen}
        onClose={() => setIsSendOpen(false)}
        title="Compose Broadcast Notification"
        size="md"
      >
        <form onSubmit={handleSend} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Delivery Channel</label>
              <select
                value={channel}
                onChange={(e: any) => setChannel(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              >
                <option value="PUSH">In-App Push Alert</option>
                <option value="SMS">SMS Gateway</option>
                <option value="EMAIL">Email Newsletter</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e: any) => setTargetAudience(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
              >
                <option value="ALL">All Drivers & Customers</option>
                <option value="DRIVERS">Drivers Only</option>
                <option value="CUSTOMERS">Customers Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Notification Title</label>
            <input
              type="text"
              placeholder="e.g. Festival Season Surge Multipliers Active"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Message Body</label>
            <textarea
              rows={4}
              placeholder="Write your broadcast announcement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsSendOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={sendMutation.isPending}>
              Dispatch Notification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
