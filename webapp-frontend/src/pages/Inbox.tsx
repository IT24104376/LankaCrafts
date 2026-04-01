import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  SendIcon,
  PaperclipIcon,
  CheckCheckIcon,
  CheckIcon,
  Edit2Icon,
  Trash2Icon,
  XIcon,
  ArrowLeftIcon,
  MoreVerticalIcon,
  MapPinIcon,
  CalendarIcon } from
'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { TouristNavbar } from './tourist/TouristNavbar';
import { artistsApi, chatApi, handleApiError } from '../config/api';
import { getStoredUser } from '../lib/auth';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  seen: boolean;
  edited?: boolean;
}
interface Conversation {
  id: string;
  name: string;
  fullName: string;
  username: string;
  craft: string;
  location: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  otherUserRole?: string;
  artistProfileId?: string;
  messages: Message[];
}

interface ArtistSearchResult {
  id: string;
  userId?: string;
  username: string;
  fullName: string;
  craft: string;
  location: string;
  avatar: string;
  avatarColor: string;
}

const AVATAR_COLORS = ['#C1440E', '#2F5D50', '#C9A227', '#1A6B6B'];

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'AR';

const getAvatarColor = (seed: string) => {
  const hash = seed.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeId = (value?: string | { id?: string; _id?: string } | null) => {
  if (!value) return null;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    return (value.id || value._id || '').trim() || null;
  }
  return null;
};

const getMessageSide = (
  senderId?: string | { id?: string; _id?: string } | null,
  currentUserId?: string | null
): 'me' | 'them' => {
  const normalizedSenderId = normalizeId(senderId);
  const normalizedCurrentUserId = normalizeId(currentUserId);
  return normalizedSenderId && normalizedCurrentUserId && normalizedSenderId === normalizedCurrentUserId
    ? 'me'
    : 'them';
};

const mapApiMessage = (message: any, currentUserId?: string | null): Message => ({
  id: message.id,
  text: message.text,
  sender: getMessageSide(message.sender?.id ?? message.sender, currentUserId),
  time: formatTimestamp(message.createdAt),
  seen: Boolean(message.readAt),
  edited: Boolean(message.editedAt),
});

const mapConversation = (conversation: any, fallbackArtist?: Partial<ArtistSearchResult>): Conversation => {
  const otherUserRole = conversation.otherUser?.role;
  const isOtherUserArtist = otherUserRole === 'artist';
  const displayName = isOtherUserArtist
    ? conversation.artistProfile?.username || conversation.otherUser?.fullName || fallbackArtist?.username || 'Artist'
    : conversation.otherUser?.fullName || conversation.otherUser?.email || 'Tourist';
  const fullName = conversation.otherUser?.fullName || fallbackArtist?.fullName || displayName;
  const username = isOtherUserArtist
    ? conversation.artistProfile?.username || fallbackArtist?.username || ''
    : '';
  const craft = isOtherUserArtist
    ? conversation.artistProfile?.craftType || fallbackArtist?.craft || 'Artist'
    : otherUserRole === 'tourist'
      ? 'Tourist'
      : 'User';
  const location = isOtherUserArtist
    ? conversation.artistProfile?.region || fallbackArtist?.location || conversation.otherUser?.country || 'Sri Lanka'
    : conversation.otherUser?.country || 'Sri Lanka';

  return {
    id: conversation.id,
    name: displayName,
    fullName,
    username,
    craft,
    location,
    avatar: getInitials(displayName),
    avatarColor: getAvatarColor(displayName),
    lastMessage: conversation.lastMessage || 'No messages yet',
    time: formatTimestamp(conversation.lastMessageAt),
    unread: conversation.unread || 0,
    online: Boolean(conversation.online),
    otherUserRole,
    artistProfileId: conversation.artistProfile?.id || fallbackArtist?.id,
    messages: [],
  };
};

export function Inbox() {
  const currentUser = getStoredUser();
  const currentUserId = normalizeId(currentUser?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [error, setError] = useState('');
  const [artistResults, setArtistResults] = useState<ArtistSearchResult[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [openMessageMenuId, setOpenMessageMenuId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const currentUserIdRef = useRef<string | null>(currentUserId);
  const activeConversation = conversations.find((c) => c.id === activeId);
  const isArtistConversation = activeConversation?.otherUserRole === 'artist';
  const filteredConversations = conversations.filter(
    (c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const visibleArtistResults = artistResults.filter(
    (artist) =>
      currentUser?.role === 'tourist' &&
      !conversations.some(
        (conversation) =>
          conversation.artistProfileId === artist.id ||
          conversation.username.toLowerCase() === artist.username.toLowerCase()
      )
  );

  const upsertConversation = (conversation: any, fallbackArtist?: Partial<ArtistSearchResult>) => {
    const normalizedConversation = mapConversation(conversation, fallbackArtist);

    setConversations((prev) => {
      const existingConversation = prev.find((item) => item.id === normalizedConversation.id);
      const mergedConversation = existingConversation ?
      {
        ...normalizedConversation,
        messages: existingConversation.messages
      } :
      normalizedConversation;
      const exists = Boolean(existingConversation);
      if (exists) {
        return prev.map((item) => (item.id === normalizedConversation.id ? mergedConversation : item));
      }
      return [mergedConversation, ...prev];
    });
    setActiveId(normalizedConversation.id);
    setMobileView('chat');
    return normalizedConversation;
  };

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  const syncConversations = async (conversationId = activeIdRef.current) => {
    const conversationsResponse = await chatApi.getConversations();
    const items = (conversationsResponse.data.data || []).map((conversation: any) =>
      mapConversation(conversation)
    );

    setConversations((prev) =>
      items.map((item: Conversation) => ({
        ...item,
        messages: prev.find((existing) => existing.id === item.id)?.messages || [],
      }))
    );

    if (!conversationId) {
      return;
    }

    const messagesResponse = await chatApi.getConversationMessages(conversationId);
    const messages = (messagesResponse.data.data || []).map((message: any) =>
      mapApiMessage(message, currentUserIdRef.current)
    ) as Message[];

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, messages } : conversation
      )
    );
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setError('');
        const response = await chatApi.getConversations();
        const items = (response.data.data || []).map((conversation: any) => mapConversation(conversation));
        setConversations((prev) =>
          items.map((item: Conversation) => ({
            ...item,
            messages: prev.find((existing) => existing.id === item.id)?.messages || [],
          }))
        );
        setActiveId((current) => current || items[0]?.id || null);
      } catch (err) {
        setError(handleApiError(err).message);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeId) return;

      try {
        const response = await chatApi.getConversationMessages(activeId);
        const messages = (response.data.data || []).map((message: any) =>
          mapApiMessage(message, currentUserId)
        ) as Message[];

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === activeId
              ? {
                  ...conversation,
                  messages,
                }
              : conversation
          )
        );
      } catch (err) {
        setError(handleApiError(err).message);
      }
    };

    loadMessages();
  }, [activeId, currentUserId]);

  useEffect(() => {
    const runSync = async () => {
      if (document.hidden) {
        return;
      }

      try {
        await syncConversations();
      } catch {
        // Silent polling retry
      }
    };

    void runSync();

    const intervalId = window.setInterval(runSync, 2500);
    const handleWindowFocus = () => {
      void runSync();
    };
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void runSync();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const loadArtistResults = async () => {
      if (currentUser?.role !== 'tourist') {
        setArtistResults([]);
        return;
      }

      try {
        const response = await artistsApi.getAll(
          1,
          100,
          searchQuery.trim() ? searchQuery.trim() : undefined
        );
        const items = (response.data.data || []).map((artist: any) => ({
          id: artist._id,
          userId: artist.userId,
          username: artist.username || '',
          fullName: artist.username || artist.email || 'Artist',
          craft: artist.craftType || 'Artist',
          location: artist.region || 'Sri Lanka',
          avatar: getInitials(artist.username || artist.email || 'Artist'),
          avatarColor: getAvatarColor(artist.username || artist.email || 'Artist'),
        })) as ArtistSearchResult[];

        setArtistResults(items);
      } catch {
        setArtistResults([]);
      }
    };

    const timeoutId = window.setTimeout(loadArtistResults, 250);
    return () => window.clearTimeout(timeoutId);
  }, [currentUser?.role, searchQuery]);

  useEffect(() => {
    const artistProfileId = searchParams.get('artistProfileId');
    const artistUserId = searchParams.get('artistUserId');
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      setActiveId(conversationId);
      setMobileView('chat');
      return;
    }

    if (!artistProfileId && !artistUserId) {
      return;
    }

    if (currentUser?.role !== 'tourist') {
      setSearchParams(
        conversationId ? { conversationId } : {},
        { replace: true }
      );
      return;
    }

    const openArtistConversation = async () => {
      try {
        setError('');
        const response = await chatApi.createConversation({
          artistProfileId: artistProfileId || undefined,
          artistUserId: artistUserId || undefined,
        });
        const conversation = upsertConversation(response.data.data);
        setSearchParams(
          conversation ? { conversationId: conversation.id } : {},
          { replace: true }
        );
      } catch (err) {
        setError(handleApiError(err).message);
      }
    };

    void openArtistConversation();
  }, [currentUser?.role, searchParams, setSearchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [activeId, conversations]);
  const handleSend = async () => {
    if (!inputText.trim() || !activeId) return;

    try {
      const response = await chatApi.sendMessage(activeId, inputText.trim());
      const sentMessage = response.data.data;
      const newMessage: Message = {
        id: sentMessage.id,
        text: sentMessage.text,
        sender: 'me',
        time: formatTimestamp(sentMessage.createdAt),
        seen: Boolean(sentMessage.readAt),
        edited: Boolean(sentMessage.editedAt),
      };

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === activeId
            ? {
                ...conversation,
                messages: [...conversation.messages, newMessage],
                lastMessage: newMessage.text,
                time: newMessage.time,
                unread: 0,
              }
            : conversation
        )
      );
      setInputText('');
    } catch (err) {
      setError(handleApiError(err).message);
    }
  };
  const startEditingMessage = (message: Message) => {
    setSelectedMessageId(message.id);
    setOpenMessageMenuId(null);
    setEditingMessageId(message.id);
    setEditingText(message.text);
  };
  const cancelEditingMessage = () => {
    setEditingMessageId(null);
    setEditingText('');
  };
  const handleUpdateMessage = async () => {
    if (!activeId || !editingMessageId || !editingText.trim()) return;

    try {
      setIsSavingEdit(true);
      const response = await chatApi.updateMessage(activeId, editingMessageId, editingText.trim());
      const updatedMessage = response.data.data;

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === activeId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === editingMessageId
                    ? {
                        ...message,
                        text: updatedMessage.text,
                        edited: Boolean(updatedMessage.editedAt),
                      }
                    : message
                ),
                lastMessage:
                  conversation.messages[conversation.messages.length - 1]?.id === editingMessageId
                    ? updatedMessage.text
                    : conversation.lastMessage,
              }
            : conversation
        )
      );

      cancelEditingMessage();
    } catch (err) {
      setError(handleApiError(err).message);
    } finally {
      setIsSavingEdit(false);
    }
  };
  const handleDeleteMessage = async (messageId: string) => {
    if (!activeId) return;
    const confirmed = window.confirm('Delete this message?');
    if (!confirmed) return;

    try {
      setDeletingMessageId(messageId);
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id !== activeId) return conversation;

          const remainingMessages = conversation.messages.filter((message) => message.id !== messageId);
          const lastMessage = remainingMessages[remainingMessages.length - 1];

          return {
            ...conversation,
            messages: remainingMessages,
            lastMessage: lastMessage?.text || 'No messages yet',
            time: lastMessage?.time || conversation.time,
          };
        })
      );

      await chatApi.deleteMessage(activeId, messageId);
      if (selectedMessageId === messageId) setSelectedMessageId(null);
      if (openMessageMenuId === messageId) setOpenMessageMenuId(null);
      if (editingMessageId === messageId) cancelEditingMessage();
    } catch (err) {
      setError(handleApiError(err).message);
      const response = await chatApi.getConversationMessages(activeId);
      const messages = (response.data.data || []).map((message: any) =>
        mapApiMessage(message, currentUserId)
      ) as Message[];

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === activeId ? { ...conversation, messages } : conversation
        )
      );
    } finally {
      setDeletingMessageId(null);
    }
  };
  const handleSelectConversation = async (id: string) => {
    setActiveId(id);
    setMobileView('chat');
    setConversations((prev) =>
    prev.map((c) =>
    c.id === id ?
    {
      ...c,
      unread: 0
    } :
    c
    )
    );

    try {
      await chatApi.markConversationRead(id);
    } catch {
      // Keep the optimistic UI state even if read tracking fails
    }
  };
  const handleStartConversation = async (artist: ArtistSearchResult) => {
    if (currentUser?.role !== 'tourist') {
      setError('Only tourist accounts can start a new conversation with an artist.');
      return;
    }

    try {
      setError('');
      const response = await chatApi.createConversation({
        artistUserId: artist.userId,
        artistProfileId: artist.id,
      });
      const conversation = upsertConversation(response.data.data, artist);
      setSearchParams({ conversationId: conversation.id }, { replace: true });
    } catch (err) {
      setError(handleApiError(err).message);
    }
  };
  return (
    <div
      className="min-h-screen font-body"
      style={{
        backgroundColor: '#FAF6F0'
      }}>

      {currentUser?.role === 'tourist' ? <TouristNavbar /> : <Navbar artistMode={currentUser?.role === 'artist'} />}

      <div className="pt-16 h-screen flex flex-col">
        <div
          className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 flex gap-0 overflow-hidden"
          style={{
            height: 'calc(100vh - 64px)'
          }}>

          <div className="flex w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* ── LEFT PANEL: Conversation List ── */}
            <div
              className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col shrink-0 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>

              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h1
                    className="text-xl font-bold text-gray-900"
                    style={{
                      fontFamily: 'Fraunces, serif'
                    }}>

                    Messages
                  </h1>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{
                      backgroundColor: '#C1440E'
                    }}>

                    {conversations.reduce((sum, c) => sum + c.unread, 0)} new
                  </span>
                </div>
                {/* Search */}
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-gray-300 transition-colors" />

                </div>
                {error &&
                <p className="mt-3 text-xs text-red-500">{error}</p>
                }
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {!filteredConversations.length &&
                !visibleArtistResults.length &&
                <div className="p-6 text-sm text-gray-400">
                    No matching conversations found.
                  </div>
                }
                {visibleArtistResults.map((artist) =>
                <button
                  key={`artist-${artist.id}`}
                  onClick={() => handleStartConversation(artist)}
                  className="w-full flex items-start gap-3 p-4 hover:bg-emerald-50 transition-colors border-b border-gray-50 text-left">

                    <div className="relative shrink-0">
                      <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        backgroundColor: artist.avatarColor
                      }}>

                        {artist.avatar}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {artist.username}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                          Start chat
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1 truncate">
                        {artist.fullName} · {artist.craft} · {artist.location}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Artist found from search
                      </p>
                    </div>
                  </button>
                )}
                {filteredConversations.map((conv) =>
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${activeId === conv.id ? 'bg-orange-50 border-l-2' : ''}`}
                  style={
                  activeId === conv.id ?
                  {
                    borderLeftColor: '#C1440E'
                  } :
                  {}
                  }>

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        backgroundColor: conv.avatarColor
                      }}>

                        {conv.avatar}
                      </div>
                      {conv.online &&
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {conv.name}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1 truncate">
                        {conv.username || conv.fullName} · {conv.craft} · {conv.location}
                      </p>
                      <p
                      className={`text-xs truncate ${conv.unread > 0 ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>

                        {conv.lastMessage}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {conv.unread > 0 &&
                  <span
                    className="shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center mt-1"
                    style={{
                      backgroundColor: '#C1440E'
                    }}>

                        {conv.unread}
                      </span>
                  }
                  </button>
                )}
              </div>
            </div>

            {/* ── RIGHT PANEL: Chat Window ── */}
            <div
              className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>

              {activeConversation ?
              <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
                    <button
                    className="md:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors mr-1"
                    onClick={() => setMobileView('list')}>

                      <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="relative">
                      <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        backgroundColor: activeConversation.avatarColor
                      }}>

                        {activeConversation.avatar}
                      </div>
                      {activeConversation.online &&
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                    }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-gray-900 text-sm">
                        {activeConversation.name}
                      </h2>
                      <p className="text-xs text-gray-400">
                        {activeConversation.online ?
                      <span className="text-green-500 font-medium">
                            ● Online
                          </span> :

                      `${activeConversation.username || activeConversation.fullName} · ${activeConversation.craft} · ${activeConversation.location}`
                      }
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {isArtistConversation && (
                      <Link
                      to={`/book?artisan=${activeConversation.artistProfileId || activeConversation.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-white"
                      style={{
                        backgroundColor: '#C1440E'
                      }}>

                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Book Workshop</span>
                      </Link>
                      )}
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVerticalIcon className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Workshop context banner */}
                  {isArtistConversation && (
                  <div
                  className="px-4 py-2.5 flex items-center gap-2 text-xs font-medium border-b border-gray-100"
                  style={{
                    backgroundColor: '#FEF0EB',
                    color: '#C1440E'
                  }}>

                    <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      <strong>{activeConversation.craft}</strong> workshop in{' '}
                      {activeConversation.location} —
                      <Link
                      to={`/artist/${activeConversation.artistProfileId || activeConversation.id}`}
                      className="underline ml-1">

                        View Profile
                      </Link>
                    </span>
                  </div>
                  )}

                  {/* Messages */}
                  <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{
                    backgroundColor: '#FAF6F0'
                  }}>

                    {activeConversation.messages.map((msg, idx) => {
                    const isMe = msg.sender === 'me';
                    const isSelected = selectedMessageId === msg.id;
                    const isEditing = editingMessageId === msg.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{
                          opacity: 0,
                          y: 8
                        }}
                        animate={{
                          opacity: 1,
                          y: 0
                        }}
                        transition={{
                          duration: 0.2,
                          delay: idx * 0.03
                        }}
                        onClick={() => {
                          setSelectedMessageId(msg.id);
                          if (openMessageMenuId && openMessageMenuId !== msg.id) {
                            setOpenMessageMenuId(null);
                          }
                        }}
                        className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>

                          {!isMe &&
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto shrink-0"
                          style={{
                            backgroundColor: activeConversation.avatarColor
                          }}>

                              {activeConversation.avatar}
                            </div>
                        }
                          <div
                          className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col relative`}>

                            <div
                            className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed border"
                            style={
                            isMe ?
                            {
                              backgroundColor: '#C1440E',
                              color: 'white',
                              borderBottomRightRadius: '4px',
                              borderColor: isSelected ? '#7A2507' : 'transparent'
                            } :
                            {
                              backgroundColor: 'white',
                              color: '#1E1E1E',
                              borderBottomLeftRadius: '4px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                              borderColor: isSelected ? '#C1440E' : 'transparent'
                            }
                            }>
                              {isEditing ?
                              <div className="space-y-2">
                                  <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  rows={3}
                                  className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none"
                                  style={{
                                    color: '#1E1E1E'
                                  }} />
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                    type="button"
                                    onClick={cancelEditingMessage}
                                    className="p-1 rounded-lg hover:bg-black/10 transition-colors">

                                      <XIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                    type="button"
                                    onClick={handleUpdateMessage}
                                    disabled={!editingText.trim() || isSavingEdit}
                                    className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 transition-colors">

                                      Save
                                    </button>
                                  </div>
                                </div> :

                              msg.text}
                            </div>
                            {isSelected && isMe && !isEditing &&
                            <div className="self-end mt-2 relative">
                                <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMessageMenuId((current) => current === msg.id ? null : msg.id);
                                }}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">

                                  <MoreVerticalIcon className="w-4 h-4" />
                                </button>
                                {openMessageMenuId === msg.id &&
                                <div className="absolute right-0 mt-1 min-w-32 rounded-xl border border-gray-200 bg-white shadow-lg py-1 z-10">
                                    <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditingMessage(msg);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2">

                                      <Edit2Icon className="w-4 h-4" />
                                      Edit
                                    </button>
                                    <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      void handleDeleteMessage(msg.id);
                                    }}
                                    disabled={deletingMessageId === msg.id}
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 inline-flex items-center gap-2 disabled:opacity-50">

                                      <Trash2Icon className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </div>
                                }
                              </div>
                            }
                            <div
                            className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>

                              <span className="text-xs text-gray-400">
                                {msg.time}
                              </span>
                              {msg.edited &&
                              <span className="text-xs text-gray-400">
                                  edited
                                </span>
                              }
                              {isMe && (
                            msg.seen ?
                            <CheckCheckIcon className="w-3.5 h-3.5 text-blue-400" /> :

                            <CheckIcon className="w-3.5 h-3.5 text-gray-400" />)
                            }
                            </div>
                          </div>
                        </motion.div>);

                  })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-end gap-3">
                      <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors shrink-0">
                        <PaperclipIcon className="w-5 h-5 text-gray-400" />
                      </button>
                      <div className="flex-1 relative">
                        <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder={`Message ${activeConversation.name}...`}
                        rows={1}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none text-sm resize-none focus:border-gray-300 transition-colors"
                        style={{
                          maxHeight: '120px'
                        }} />

                      </div>
                      <motion.button
                      whileHover={{
                        scale: 1.05
                      }}
                      whileTap={{
                        scale: 0.95
                      }}
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className="p-3 rounded-xl text-white transition-all disabled:opacity-40 shrink-0"
                      style={{
                        backgroundColor: '#C1440E'
                      }}>

                        <SendIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </> /* Empty state */ :

              <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <SendIcon className="w-7 h-7 text-gray-300" />
                    </div>
                    <h3
                    className="font-bold text-gray-700 mb-1"
                    style={{
                      fontFamily: 'Fraunces, serif'
                    }}>

                      Select a conversation
                    </h3>
                    <p className="text-sm text-gray-400">
                      Choose an artisan to start chatting
                    </p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>);

}
