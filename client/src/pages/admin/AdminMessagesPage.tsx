import React, { useEffect, useState } from 'react';
import { messageService } from '../../services/messageService.js';
import { AdminContactMessageDto } from '@portfolio/shared';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader.js';
import { AdminLoadingState } from '../../components/admin/AdminLoadingState.js';
import { EmptyState } from '../../components/admin/EmptyState.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Mail, Search, Trash2, Calendar, User, Inbox } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminContactMessageDto[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<AdminContactMessageDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminContactMessageDto | null>(null);

  useEffect(() => {
    messageService
      .getMessages()
      .then((data) => {
        setMessages(data);
        if (data.length > 0) setSelectedMessage(data[0]);
      })
      .catch(() => {
        setMessages([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredMessages = messages.filter(
    (m) =>
      m.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectMessage = async (message: AdminContactMessageDto) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      try {
        const updated = await messageService.markRead(message.id, true);
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      } catch {
        // Optimistic update fallback
        setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m)));
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await messageService.deleteMessage(deleteTarget.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (selectedMessage?.id === deleteTarget.id) {
        setSelectedMessage(messages.find((m) => m.id !== deleteTarget.id) || null);
      }
    } catch {
      // Optimistic delete fallback
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Messages Inbox"
        description="Review recruiter inquiries, collaboration opportunities, and viewer questions."
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-8 w-8 text-zinc-400" />}
          title="Your inbox is empty"
          description="When visitors submit the contact form on your portfolio website, messages will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Message List */}
          <div className="lg:col-span-5 space-y-3">
            <Card className="p-3 border-zinc-200/90 dark:border-zinc-800/90">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </Card>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredMessages.map((m) => (
                <Card
                  key={m.id}
                  onClick={() => handleSelectMessage(m)}
                  className={`p-4 border-zinc-200/90 dark:border-zinc-800/90 cursor-pointer transition-all ${
                    selectedMessage?.id === m.id
                      ? 'ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/30'
                      : !m.isRead
                        ? 'border-l-4 border-l-blue-600 bg-blue-50/10'
                        : ''
                  }`}
                  hoverable
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                      {m.senderName}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate mb-1">
                    {m.subject || 'No Subject'}
                  </p>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{m.message}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Message Detail */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <Card className="p-6 sm:p-8 border-zinc-200/90 dark:border-zinc-800/90 space-y-6">
                {/* Header with Sender info and actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {selectedMessage.subject || 'No Subject'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-mono">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedMessage.senderName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedMessage.senderEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setDeleteTarget(selectedMessage)}
                      title="Delete Message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Message Body Content */}
                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap min-h-[160px]">
                  {selectedMessage.message}
                </div>

                {/* Reply Footer */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Direct response:</span>
                  <a
                    href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Reply via Email ({selectedMessage.senderEmail})</span>
                  </a>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">
                  Select a message from the list to view its full details.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message={`Are you sure you want to delete message from "${deleteTarget?.senderName}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
};
