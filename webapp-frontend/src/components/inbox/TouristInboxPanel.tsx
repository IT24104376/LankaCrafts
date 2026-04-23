import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCheckIcon,
  CheckIcon,
  MapPinIcon,
  MoreVerticalIcon,
  PencilIcon,
  SearchIcon,
  SendIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  type ChatArtistSearchResult,
  type ChatConversation,
  type ChatMessage,
  chatApi,
} from '../../services/chatApi';

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

export function TouristInboxPanel() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [artistResults, setArtistResults] = useState<ChatArtistSearchResult[]>([]);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
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

  const filteredConversations = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return conversations;

    return conversations.filter((conversation) => {
      const haystack = [
        conversation.otherUser.fullName,
        conversation.artistProfile?.craftType,
        conversation.artistProfile?.region,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
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
    if (!authLoading && firebaseUser) {
      loadConversations();
    }
  }, [authLoading, firebaseUser]);

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

  useEffect(() => {
    if (!firebaseUser || !searchQuery.trim()) {
      setArtistResults([]);
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      try {
        const results = await chatApi.searchArtists(searchQuery.trim());
        setArtistResults(results);
      } catch {
        setArtistResults([]);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [firebaseUser, searchQuery]);

  const refreshActiveConversation = async (conversationId: string) => {
    const [refreshedMessages, refreshedConversations] = await Promise.all([
      chatApi.getConversationMessages(conversationId),
      chatApi.getConversations(),
    ]);
    setMessages(refreshedMessages);
    setConversations(refreshedConversations);
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setMobileView('chat');
    setEditingMessageId(null);
    setInputText('');
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
      )
    );
  };

  const handleStartConversation = async (artist: ChatArtistSearchResult) => {
    try {
      const conversation = await chatApi.createConversation({
        artistUserId: artist.artistUserId,
        artistProfileId: artist.artistProfileId,
      });

      setConversations((current) => {
        const withoutCurrent = current.filter((item) => item.id !== conversation.id);
        return [conversation, ...withoutCurrent];
      });
      setActiveConversationId(conversation.id);
      setMessages([]);
      setMobileView('chat');
      setEditingMessageId(null);
      setInputText('');
      setMenuOpenFor(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open conversation.');
    }
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
      setError(err instanceof Error ? err.message : 'Failed to save message.');
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
    <div className="flex w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col shrink-0 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Fraunces, serif' }}>
              Messages
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#C1440E' }}>
              {totalUnread} new
            </span>
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search artists or conversations..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-gray-300 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchQuery.trim() && artistResults.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-4 pt-3 pb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Registered Artists
              </div>
              {artistResults.map((artist) => (
                <button
                  key={artist.artistProfileId}
                  type="button"
                  onClick={() => handleStartConversation(artist)}
                  className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: pickAvatarColor(artist.artistProfileId) }}
                  >
                    {artist.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{artist.fullName}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {artist.craftType}
                      {artist.location ? ` · ${artist.location}` : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {loadingConversations ? (
            <div className="p-4 text-sm text-gray-400">Loading conversations...</div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const displayName = conversation.otherUser.fullName;
              const craft = conversation.artistProfile?.craftType || 'Artist';
              const location = conversation.artistProfile?.region || '';

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${activeConversationId === conversation.id ? 'bg-orange-50 border-l-2' : ''}`}
                  style={activeConversationId === conversation.id ? { borderLeftColor: '#C1440E' } : {}}
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: pickAvatarColor(conversation.id) }}
                    >
                      {getInitials(displayName)}
                    </div>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-sm text-gray-900 truncate">{displayName}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1 truncate">
                      {craft}
                      {location ? ` · ${location}` : ''}
                    </p>
                    <p className={`text-xs truncate ${conversation.unread > 0 ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>
                      {conversation.lastMessage || 'Start your conversation'}
                    </p>
                  </div>

                  {conversation.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center mt-1" style={{ backgroundColor: '#C1440E' }}>
                      {conversation.unread}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-4 text-sm text-gray-400">
              {searchQuery.trim() ? 'No matching conversations yet.' : 'Search for an artist to start messaging.'}
            </div>
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
              <button
                type="button"
                className="md:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors mr-1"
                onClick={() => setMobileView('list')}
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
              </button>
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: pickAvatarColor(activeConversation.id) }}
                >
                  {getInitials(activeConversation.otherUser.fullName)}
                </div>
                {activeConversation.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-sm">{activeConversation.otherUser.fullName}</h2>
                <p className="text-xs text-gray-400">
                  {activeConversation.online ? (
                    <span className="text-green-500 font-medium">Online</span>
                  ) : (
                    `${activeConversation.artistProfile?.craftType || 'Artist'}${activeConversation.artistProfile?.region ? ` · ${activeConversation.artistProfile.region}` : ''}`
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/book"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-white"
                  style={{ backgroundColor: '#C1440E' }}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Book Workshop</span>
                </Link>
                <button type="button" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MoreVerticalIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="px-4 py-2.5 flex items-center gap-2 text-xs font-medium border-b border-gray-100" style={{ backgroundColor: '#FEF0EB', color: '#C1440E' }}>
              <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>{activeConversation.artistProfile?.craftType || 'Artist'}</strong>
                {activeConversation.artistProfile?.region ? ` in ${activeConversation.artistProfile.region}` : ''}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#FAF6F0' }}>
              {loadingMessages ? (
                <div className="text-sm text-gray-400">Loading messages...</div>
              ) : messages.length > 0 ? (
                messages.map((message, index) => {
                  const isMe = message.sender.role === 'tourist';
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
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto shrink-0"
                            style={{ backgroundColor: pickAvatarColor(activeConversation.id) }}
                          >
                            {getInitials(activeConversation.otherUser.fullName)}
                          </div>
                        )}
                        <div className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
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
                              className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                              style={isMe ? { backgroundColor: '#C1440E', color: 'white', borderBottomRightRadius: '4px' } : { backgroundColor: 'white', color: '#1E1E1E', borderBottomLeftRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                            >
                              {message.text}
                            </div>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-gray-400">{formatTime(message.createdAt)}</span>
                            {message.editedAt && <span className="text-[10px] text-gray-400">(edited)</span>}
                            {isMe &&
                              (message.readAt ? (
                                <CheckCheckIcon className="w-3.5 h-3.5 text-blue-400" />
                              ) : (
                                <CheckIcon className="w-3.5 h-3.5 text-gray-400" />
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="text-sm text-gray-400">No messages yet. Say hello to the artist.</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              {editingMessageId && (
                <div className="mb-3 flex items-center justify-between rounded-xl bg-orange-50 border border-orange-100 px-3 py-2">
                  <span className="text-xs font-medium text-orange-700">Editing message</span>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-1 rounded-full hover:bg-orange-100 text-orange-600"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
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
                        ? 'Edit your message...'
                        : `Message ${activeConversation.otherUser.fullName}...`
                    }
                    rows={1}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none text-sm resize-none focus:border-gray-300 transition-colors"
                    style={{ maxHeight: '120px' }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!inputText.trim() || sending}
                  className="p-3 rounded-xl text-white transition-all disabled:opacity-40 shrink-0"
                  style={{ backgroundColor: '#C1440E' }}
                >
                  <SendIcon className="w-5 h-5" />
                </motion.button>
              </div>
              {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <SendIcon className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-700 mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                Select a conversation
              </h3>
              <p className="text-sm text-gray-400">Search for a registered artist to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
