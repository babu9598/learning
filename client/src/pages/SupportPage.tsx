import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Headphones, Search, MessageSquare, CheckCircle, AlertTriangle, Send, User, ArrowRight } from 'lucide-react';
import api from '../api/axiosClient';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Drawer } from '../components/common/Drawer';
import { SupportTicket } from '../types';
import { formatDateTime } from '../utils/formatters';

export const SupportPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // 1. Fetch Tickets
  const { data, isLoading } = useQuery({
    queryKey: ['support-tickets', page, status],
    queryFn: () =>
      api
        .get('/support/tickets', {
          params: { page, limit: 10, status },
        })
        .then((res: any) => res),
    refetchInterval: 8000,
  });

  // 2. Fetch Selected Ticket
  const { data: ticketDetail } = useQuery({
    queryKey: ['support-ticket-detail', selectedTicketId],
    queryFn: () => api.get(`/support/tickets/${selectedTicketId}`).then((res: any) => res.data),
    enabled: !!selectedTicketId,
  });

  // Add Message Mutation
  const addMessageMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      api.post(`/support/tickets/${id}/messages`, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-ticket-detail', selectedTicketId] });
      setReplyMessage('');
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, resolutionNotes }: { id: string; status: string; resolutionNotes?: string }) =>
      api.patch(`/support/tickets/${id}/status`, { status, resolutionNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-ticket-detail', selectedTicketId] });
    },
  });

  const columns: Column<SupportTicket>[] = [
    {
      key: 'ticketId',
      header: 'Ticket ID & Subject',
      render: (t) => (
        <div>
          <span className="font-mono font-black bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 px-2 py-0.5 rounded border border-brand-300 dark:border-brand-800 text-xs shadow-sm">
            {t.ticketId}
          </span>
          <p className="font-extrabold text-slate-950 dark:text-white mt-1.5">{t.subject}</p>
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{formatDateTime(t.createdAt)}</p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Raised By',
      render: (t) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-950 dark:text-white leading-tight">
              {t.userType === 'CUSTOMER' ? t.customer?.name : t.driver?.name}
            </span>
            <Badge variant={t.userType === 'CUSTOMER' ? 'brand' : 'warning'} size="sm">
              {t.userType}
            </Badge>
          </div>
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            {t.userType === 'CUSTOMER' ? t.customer?.mobile : t.driver?.mobile}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (t) => (
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-slate-200">
          {t.category.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => (
        <Badge
          variant={
            t.priority === 'URGENT'
              ? 'danger'
              : t.priority === 'HIGH'
              ? 'warning'
              : 'info'
          }
          size="sm"
        >
          {t.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedTicketId(t._id)}
            className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-800 hover:text-white dark:bg-brand-950/60 dark:hover:bg-brand-600 dark:text-brand-300 dark:hover:text-white border border-brand-300 dark:border-brand-800 transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>View Ticket</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            Customer Support & Driver Grievances
          </h1>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Resolve billing inquiries, driver disputes, and lost property support tickets.
          </p>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="glass-panel p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 border border-cloudy-200 dark:border-slate-800 shadow-card">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 shadow-sm"
        >
          <option value="">All Ticket Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Tickets Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 10,
          total: data?.meta?.total || 0,
          totalPages: data?.meta?.totalPages || 1,
          onPageChange: setPage,
        }}
        onRowClick={(t) => setSelectedTicketId(t._id)}
      />

      {/* Ticket Details Drawer */}
      <Drawer
        isOpen={!!selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        title={`Support Ticket ${ticketDetail?.ticketId || ''}`}
        subtitle={`Priority: ${ticketDetail?.priority || ''}`}
        size="lg"
      >
        {ticketDetail && (
          <div className="space-y-6 text-xs">
            {/* Ticket Summary Header */}
            <div className="p-4 bg-cloudy-50 dark:bg-slate-950 rounded-2xl border border-cloudy-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ticketDetail.subject}</h4>
                <StatusBadge status={ticketDetail.status} />
              </div>
              <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-cloudy-200 dark:border-slate-800">
                {ticketDetail.description}
              </p>

              {/* Status Actions */}
              <div className="flex items-center gap-2 pt-1">
                {ticketDetail.status !== 'RESOLVED' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      const note = prompt('Enter resolution notes:') || 'Resolved by Support Agent';
                      updateStatusMutation.mutate({
                        id: ticketDetail._id,
                        status: 'RESOLVED',
                        resolutionNotes: note,
                      });
                    }}
                  >
                    Mark as Resolved
                  </Button>
                )}

                {ticketDetail.status !== 'CLOSED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: ticketDetail._id,
                        status: 'CLOSED',
                      })
                    }
                  >
                    Close Ticket
                  </Button>
                )}
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Discussion Thread
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {(ticketDetail.messages || []).map((msg: any, mIdx: number) => (
                  <div
                    key={mIdx}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      msg.senderType === 'ADMIN'
                        ? 'bg-brand-500/10 dark:bg-brand-950/40 border-brand-500/30 text-slate-900 dark:text-white ml-6'
                        : 'bg-cloudy-50 dark:bg-slate-950 border-cloudy-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 mr-6'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className={msg.senderType === 'ADMIN' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'}>
                        {msg.senderName} ({msg.senderType})
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {formatDateTime(msg.createdAt)}
                      </span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="space-y-2 pt-2">
                <textarea
                  rows={3}
                  placeholder="Type your response to the user..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-cloudy-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:border-brand-500 text-xs shadow-sm"
                />

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-3.5 h-3.5" />}
                    disabled={!replyMessage.trim()}
                    isLoading={addMessageMutation.isPending}
                    onClick={() =>
                      addMessageMutation.mutate({
                        id: ticketDetail._id,
                        message: replyMessage,
                      })
                    }
                  >
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
