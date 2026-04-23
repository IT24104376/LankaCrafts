import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCheckIcon,
  MessageCircle,
  MoreVerticalIcon,
  PencilIcon,
  SearchIcon,
  SendIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { type ChatConversation, type ChatMessage, chatApi } from '../../services/chatApi';

const formatTime = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatDayLabel = (value?: string | null) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'LC';

const pickAvatarColor = (seed: string) => {
  const palette = ['#C1440E', '#2F5D50', '#C9A227', '#1A6B6B', '#8B5E3C'];
  const total = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[total % palette.length];
};

export function ArtistInboxPanel() {
  const { firebaseUser, artist } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || null,
    [activeConversationId, conversations]
  );

  const currentUserId = artist?.id || '';

  const filteredConversations = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return conversations;

    return conversations.filter((conversation) =>
      [conversation.otherUser.fullName, conversation.otherUser.country, conversation.lastMessage]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [conversations, searchQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

  const loadConversations = async () => {
    if (!firebaseUser) return;

    try {
      setLoadingConversations(true);
      const data = await chatApi.getConversations();
      setConversations(data);
      setActiveConversationId((current) => {
        if (current && data.some((conversation) => conversation.id === current)) {
          return current;
        }
        return data[0]?.id || null;
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations.');
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const data = await chatApi.getConversationMessages(conversationId);
      setMessages(data);
      setMenuOpenFor(null);

      const selectedConversation = conversations.find((conversation) => conversation.id === conversationId);
      if (selectedConversation?.unread) {
        await chatApi.markConversationRead(conversationId);
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages.');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      loadConversations();
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    loadMessages(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    if (!firebaseUser) return undefined;

    const interval = window.setInterval(() => {
      loadConversations();
      if (activeConversationId) {
        loadMessages(activeConversationId);
      }
    }, 6000);

    return () => window.clearInterval(interval);
  }, [firebaseUser, activeConversationId, conversations]);

  const refreshActiveConversation = async (conversationId: string) => {
    const [refreshedMessages, refreshedConversations] = await Promise.all([
      chatApi.getConversationMessages(conversationId),
      chatApi.getConversations(),
    ]);
    setMessages(refreshedMessages);
    setConversations(refreshedConversations);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !activeConversationId || sending) return;

    try {
      setSending(true);
      if (editingMessageId) {
        await chatApi.updateMessage(activeConversationId, editingMessageId, inputText.trim());
      } else {
        await chatApi.sendMessage(activeConversationId, inputText.trim());
      }
      await refreshActiveConversation(activeConversationId);
      setInputText('');
      setEditingMessageId(null);
      setMenuOpenFor(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save reply.');
    } finally {
      setSending(false);
    }
  };

  const handleStartEdit = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setInputText(message.text);
    setMenuOpenFor(null);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeConversationId) return;

    try {
      await chatApi.deleteMessage(activeConversationId, messageId);
      await refreshActiveConversation(activeConversationId);
      if (editingMessageId === messageId) {
        setEditingMessageId(null);
        setInputText('');
      }
      setMenuOpenFor(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message.');
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setInputText('');
    setMenuOpenFor(null);
  };

  const totalUnread = conversations.reduce((sum, conversation) => sum + conversation.unread, 0);

  return (
    <div className="flex h-[600px]">
      <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-forest font-display">Messages</h2>
            {totalUnread > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white bg-terracotta">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tourists..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-gray-200 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="p-4 text-sm text-gray-400">Loading conversations...</div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => {
                  setActiveConversationId(conversation.id);
                  setEditingMessageId(null);
                  setInputText('');
                }}
                className={`w-full flex items-start gap-3 p-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${activeConversationId === conversation.id ? 'bg-forest/5 border-l-2 border-l-forest' : ''}`}
              >
                <div className="relative shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: pickAvatarColor(conversation.id) }}
                  >
                    {getInitials(conversation.otherUser.fullName)}
                  </div>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm text-gray-900 truncate">
                      {conversation.otherUser.fullName}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 ml-1">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-0.5">
                    {conversation.otherUser.country || 'Tourist'}
                  </p>
                  <p className={`text-xs truncate ${conversation.unread > 0 ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <span className="shrink-0 w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center bg-terracotta mt-1">
                    {conversation.unread}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="p-4 text-sm text-gray-400">No tourist conversations yet.</div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: pickAvatarColor(activeConversation.id) }}
                >
                  {getInitials(activeConversation.otherUser.fullName)}
                </div>
                {activeConversation.online && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">{activeConversation.otherUser.fullName}</h3>
                <p className="text-xs text-gray-400">
                  {activeConversation.otherUser.country || 'Tourist'}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 flex items-center gap-2 text-xs font-medium border-b border-gray-100 bg-forest/5 text-forest">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Direct tourist conversation</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {loadingMessages ? (
                <div className="text-sm text-gray-400">Loading messages...</div>
              ) : messages.length > 0 ? (
                messages.map((message, index) => {
                  const isMe = message.sender.id === currentUserId;
                  const showDate =
                    index === 0 ||
                    new Date(messages[index - 1].createdAt).toDateString() !==
                      new Date(message.createdAt).toDateString();

                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-2">
                          <span className="px-3 py-1 rounded-full bg-white/85 border border-gray-200 text-[11px] font-semibold text-gray-500 shadow-sm">
                            {formatDayLabel(message.createdAt)}
                          </span>
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.02 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto shrink-0"
                            style={{ backgroundColor: pickAvatarColor(activeConversation.id) }}
                          >
                            {getInitials(activeConversation.otherUser.fullName)[0]}
                          </div>
                        )}
                        <div className={`max-w-xs flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setMenuOpenFor((current) => (current === message.id ? null : message.id))}
                              className={`absolute top-1 ${isMe ? 'left-1' : 'right-1'} p-1 rounded-full transition-colors ${isMe ? 'text-white/80 hover:bg-white/10' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                              <MoreVerticalIcon className="w-3.5 h-3.5" />
                            </button>
                            {menuOpenFor === message.id && (
                              <div className={`absolute top-8 z-10 ${isMe ? 'left-0' : 'right-0'} min-w-[120px] rounded-xl border border-gray-200 bg-white shadow-lg py-1`}>
                                {isMe ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(message)}
                                      className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <PencilIcon className="w-3.5 h-3.5" />
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMessage(message.id)}
                                      className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <Trash2Icon className="w-3.5 h-3.5" />
                                      Delete
                                    </button>
                                  </>
                                ) : (
                                  <div className="px-3 py-2 text-xs text-gray-400">No actions</div>
                                )}
                              </div>
                            )}
                            <div
                              className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                              style={isMe ? { backgroundColor: '#2F5D50', color: 'white', borderBottomRightRadius: '4px' } : { backgroundColor: 'white', color: '#1E1E1E', borderBottomLeftRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                            >
                              {message.text}
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-gray-400">{formatTime(message.createdAt)}</span>
                            {message.editedAt && <span className="text-[10px] text-gray-400">(edited)</span>}
                            {isMe && (
                              <CheckCheckIcon className={`w-3 h-3 ${message.readAt ? 'text-blue-400' : 'text-gray-400'}`} />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="text-sm text-gray-400">No messages in this conversation yet.</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              {editingMessageId && (
                <div className="mb-3 flex items-center justify-between rounded-xl bg-forest/10 border border-forest/15 px-3 py-2">
                  <span className="text-xs font-medium text-forest">Editing message</span>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-1 rounded-full hover:bg-forest/10 text-forest"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    editingMessageId
                      ? 'Edit your reply...'
                      : `Reply to ${activeConversation.otherUser.fullName}...`
                  }
                  rows={1}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm resize-none focus:border-gray-300 transition-colors"
                  style={{ maxHeight: '80px' }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!inputText.trim() || sending}
                  className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 bg-forest shrink-0"
                >
                  <SendIcon className="w-4 h-4" />
                </motion.button>
              </div>
              {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Select a conversation to reply</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
