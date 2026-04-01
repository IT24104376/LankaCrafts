import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import {
  User,
  Settings,
  Trash2,
  Eye,
  Edit2,
  LogOut,
  MapPin,
  Star,
  Calendar,
  Clock,
  Plus,
  X,
  Save,
  Lock,
  MessageCircle,
  Check,
  SearchIcon,
  SendIcon,
  CheckCheckIcon,
  CheckIcon,
  MoreVerticalIcon,
  ArrowLeftIcon } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../lib/auth';
import { chatApi, handleApiError } from '../config/api';
// ── Inbox Data ──────────────────────────────────────────────────
interface InboxMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  seen: boolean;
  edited?: boolean;
}
interface InboxConversation {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  country: string;
  workshopContext: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: InboxMessage[];
}

const INBOX_CONVERSATIONS: InboxConversation[] = [];
const AVATAR_COLORS = ['#C1440E', '#2F5D50', '#C9A227', '#1A6B6B'];

const DEFAULT_SCHEDULE = [
{
  day: 'Mon',
  slots: ['10:00 AM', '2:00 PM']
},
{
  day: 'Tue',
  slots: ['10:00 AM', '2:00 PM']
},
{
  day: 'Wed',
  slots: ['10:00 AM']
},
{
  day: 'Thu',
  slots: ['10:00 AM', '2:00 PM']
},
{
  day: 'Fri',
  slots: ['10:00 AM', '2:00 PM']
},
{
  day: 'Sat',
  slots: ['9:00 AM']
}];

const getInitials = (name: string) =>
name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() || '')
  .join('') || 'AR';

const getUsernameFromName = (name: string) =>
name.trim().toLowerCase().replace(/\s+/g, '.');

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
  return normalizedSenderId && normalizedCurrentUserId && normalizedSenderId === normalizedCurrentUserId ? 'me' : 'them';
};

const mapInboxMessage = (message: any, currentUserId?: string | null): InboxMessage => ({
  id: message.id,
  text: message.text,
  sender: getMessageSide(message.sender?.id ?? message.sender, currentUserId),
  time: formatTimestamp(message.createdAt),
  seen: Boolean(message.readAt),
  edited: Boolean(message.editedAt),
});

const createInitialArtistData = () => {
  const storedUser = getStoredUser();
  const fullName = storedUser?.fullName || 'Artist User';
  const email = storedUser?.email || 'artist@example.com';

  return {
    name: fullName,
    username: getUsernameFromName(fullName),
    email,
    craft: 'Traditional Artisan',
    region: 'Sri Lanka',
    location: 'Sri Lanka',
    bio: 'Complete your artist profile to show your craft, story, and workshop details to tourists.',
    rating: 0,
    reviews: 0,
    initials: getInitials(fullName),
    specialties: ['Add your specialties'],
    schedule: DEFAULT_SCHEDULE,
  };
};
export function ArtistDashboard() {
  const navigate = useNavigate();
  const initialArtistData = createInitialArtistData();
  const [activeTab, setActiveTab] = useState<
    'view' | 'edit' | 'schedule' | 'inbox' | 'settings'>(
    'view');
  const [artistData, setArtistData] = useState(initialArtistData);
  const [editForm, setEditForm] = useState(initialArtistData);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  // Inbox state
  const currentUser = getStoredUser();
  const currentUserId = normalizeId(currentUser?.id);
  const [inboxConversations, setInboxConversations] =
  useState<InboxConversation[]>(INBOX_CONVERSATIONS);
  const [activeInboxId, setActiveInboxId] = useState<string | null>(null);
  const [inboxInput, setInboxInput] = useState('');
  const [inboxSearch, setInboxSearch] = useState('');
  const [inboxError, setInboxError] = useState('');
  const [selectedInboxMessageId, setSelectedInboxMessageId] = useState<string | null>(null);
  const [openInboxMessageMenuId, setOpenInboxMessageMenuId] = useState<string | null>(null);
  const [editingInboxMessageId, setEditingInboxMessageId] = useState<string | null>(null);
  const [editingInboxText, setEditingInboxText] = useState('');
  const [isSavingInboxEdit, setIsSavingInboxEdit] = useState(false);
  const [deletingInboxMessageId, setDeletingInboxMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeTab !== 'inbox') {
      return;
    }

    const loadConversations = async () => {
      try {
        const response = await chatApi.getConversations();
        const items = (response.data.data || []).map((conversation: any) => ({
          id: conversation.id,
          name: conversation.otherUser?.fullName || 'Tourist',
          initials: getInitials(conversation.otherUser?.fullName || 'Tourist'),
          avatarColor: getAvatarColor(conversation.otherUser?.fullName || 'Tourist'),
          country: conversation.otherUser?.country || 'Sri Lanka',
          workshopContext: conversation.artistProfile?.craftType || 'Workshop inquiry',
          lastMessage: conversation.lastMessage || 'No messages yet',
          time: formatTimestamp(conversation.lastMessageAt),
          unread: conversation.unread || 0,
          online: Boolean(conversation.online),
          messages: [],
        })) as InboxConversation[];

        setInboxConversations(items);
        setActiveInboxId((current) => current || items[0]?.id || null);
      } catch (err) {
        setInboxError(handleApiError(err).message);
      }
    };

    loadConversations();
  }, [activeTab]);
  useEffect(() => {
    if (activeTab === 'inbox') {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [activeInboxId, inboxConversations, activeTab]);
  useEffect(() => {
    if (activeTab !== 'inbox') {
      return;
    }

    const loadMessages = async () => {
      if (!activeInboxId) return;

      try {
        const response = await chatApi.getConversationMessages(activeInboxId);
        const messages = (response.data.data || []).map((message: any) =>
          mapInboxMessage(message, currentUserId)
        ) as InboxMessage[];

        setInboxConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === activeInboxId ? { ...conversation, messages } : conversation
          )
        );
      } catch (err) {
        setInboxError(handleApiError(err).message);
      }
    };

    loadMessages();
  }, [activeInboxId, currentUserId, activeTab]);
  useEffect(() => {
    if (activeTab !== 'inbox') {
      return;
    }

    const intervalId = window.setInterval(async () => {
      if (document.hidden) {
        return;
      }

      try {
        const response = await chatApi.getConversations();
        const items = (response.data.data || []).map((conversation: any) => ({
          id: conversation.id,
          name: conversation.otherUser?.fullName || 'Tourist',
          initials: getInitials(conversation.otherUser?.fullName || 'Tourist'),
          avatarColor: getAvatarColor(conversation.otherUser?.fullName || 'Tourist'),
          country: conversation.otherUser?.country || 'Sri Lanka',
          workshopContext: conversation.artistProfile?.craftType || 'Workshop inquiry',
          lastMessage: conversation.lastMessage || 'No messages yet',
          time: formatTimestamp(conversation.lastMessageAt),
          unread: conversation.unread || 0,
          online: Boolean(conversation.online),
          messages: [],
        })) as InboxConversation[];

        setInboxConversations((prev) =>
          items.map((item) => ({
            ...item,
            messages: prev.find((existing) => existing.id === item.id)?.messages || [],
          }))
        );

        if (activeInboxId) {
          const messagesResponse = await chatApi.getConversationMessages(activeInboxId);
          const messages = (messagesResponse.data.data || []).map((message: any) =>
            mapInboxMessage(message, currentUserId)
          ) as InboxMessage[];

          setInboxConversations((prev) =>
            prev.map((conversation) =>
              conversation.id === activeInboxId ? { ...conversation, messages } : conversation
            )
          );
        }
      } catch {
        // Silent polling retry
      }
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [activeInboxId, currentUserId, activeTab]);
  const activeInboxConv = inboxConversations.find((c) => c.id === activeInboxId);
  const handleSendInbox = async () => {
    if (!inboxInput.trim() || !activeInboxId) return;

    try {
      const response = await chatApi.sendMessage(activeInboxId, inboxInput.trim());
      const sentMessage = response.data.data;
      const newMsg: InboxMessage = {
        id: sentMessage.id,
        text: sentMessage.text,
        sender: 'me',
        time: formatTimestamp(sentMessage.createdAt),
        seen: Boolean(sentMessage.readAt),
        edited: Boolean(sentMessage.editedAt),
      };
      setInboxConversations((prev) =>
        prev.map((c) =>
          c.id === activeInboxId ?
          {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: inboxInput.trim(),
            time: newMsg.time,
            unread: 0
          } :
          c
        )
      );
      setInboxInput('');
    } catch (err) {
      setInboxError(handleApiError(err).message);
    }
  };
  const startEditingInboxMessage = (message: InboxMessage) => {
    setSelectedInboxMessageId(message.id);
    setOpenInboxMessageMenuId(null);
    setEditingInboxMessageId(message.id);
    setEditingInboxText(message.text);
  };
  const cancelEditingInboxMessage = () => {
    setEditingInboxMessageId(null);
    setEditingInboxText('');
  };
  const handleUpdateInboxMessage = async () => {
    if (!activeInboxId || !editingInboxMessageId || !editingInboxText.trim()) return;

    try {
      setIsSavingInboxEdit(true);
      const response = await chatApi.updateMessage(activeInboxId, editingInboxMessageId, editingInboxText.trim());
      const updatedMessage = response.data.data;

      setInboxConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === activeInboxId
            ? {
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === editingInboxMessageId
                    ? { ...message, text: updatedMessage.text, edited: Boolean(updatedMessage.editedAt) }
                    : message
                ),
                lastMessage:
                  conversation.messages[conversation.messages.length - 1]?.id === editingInboxMessageId
                    ? updatedMessage.text
                    : conversation.lastMessage,
              }
            : conversation
        )
      );

      cancelEditingInboxMessage();
    } catch (err) {
      setInboxError(handleApiError(err).message);
    } finally {
      setIsSavingInboxEdit(false);
    }
  };
  const handleDeleteInboxMessage = async (messageId: string) => {
    if (!activeInboxId) return;
    const confirmed = window.confirm('Delete this message?');
    if (!confirmed) return;

    try {
      setDeletingInboxMessageId(messageId);
      setInboxConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id !== activeInboxId) return conversation;

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

      await chatApi.deleteMessage(activeInboxId, messageId);
      if (selectedInboxMessageId === messageId) setSelectedInboxMessageId(null);
      if (openInboxMessageMenuId === messageId) setOpenInboxMessageMenuId(null);
      if (editingInboxMessageId === messageId) cancelEditingInboxMessage();
    } catch (err) {
      setInboxError(handleApiError(err).message);
      const response = await chatApi.getConversationMessages(activeInboxId);
      const messages = (response.data.data || []).map((message: any) =>
        mapInboxMessage(message, currentUserId)
      ) as InboxMessage[];

      setInboxConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === activeInboxId ? { ...conversation, messages } : conversation
        )
      );
    } finally {
      setDeletingInboxMessageId(null);
    }
  };
  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };
  const handleDeleteProfile = () => {
    if (
    window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone.'
    ))
    {
      alert('Profile deleted successfully');
      navigate('/');
    }
  };
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setArtistData(editForm);
    alert('Profile updated successfully!');
    setActiveTab('view');
  };
  const handleSaveSchedule = () => {
    setArtistData((prev) => ({
      ...prev,
      schedule: editForm.schedule
    }));
    alert('Schedule updated successfully!');
  };
  const handleAddSlot = (dayIndex: number) => {
    const time = prompt('Enter time (e.g., 3:00 PM):');
    if (time) {
      const newSchedule = [...editForm.schedule];
      newSchedule[dayIndex].slots.push(time);
      setEditForm({
        ...editForm,
        schedule: newSchedule
      });
    }
  };
  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...editForm.schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    setEditForm({
      ...editForm,
      schedule: newSchedule
    });
  };
  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...editForm.specialties];
    newSpecialties[index] = value;
    setEditForm({
      ...editForm,
      specialties: newSpecialties
    });
  };
  const totalUnread = inboxConversations.reduce((sum, c) => sum + c.unread, 0);
  return (
    <div className="min-h-screen bg-offwhite font-body flex flex-col">
      <Navbar artistMode />

      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-forest mb-2 font-display">
                Artist Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your profile, schedule, and settings
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300">

              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                <div className="p-6 border-b border-gray-100 bg-forest text-white text-center">
                  <div className="w-20 h-20 bg-mustard rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-forest border-4 border-white/20">
                    {artistData.initials}
                  </div>
                  <h3 className="font-bold text-lg">{artistData.name}</h3>
                  <p className="text-white/70 text-sm">{artistData.craft}</p>
                </div>
                <div className="p-2 space-y-1">
                  <SidebarItem
                    icon={<Eye className="w-4 h-4" />}
                    label="View Profile"
                    active={activeTab === 'view'}
                    onClick={() => setActiveTab('view')} />

                  <SidebarItem
                    icon={<Edit2 className="w-4 h-4" />}
                    label="Edit Profile"
                    active={activeTab === 'edit'}
                    onClick={() => setActiveTab('edit')} />

                  <SidebarItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="Manage Schedule"
                    active={activeTab === 'schedule'}
                    onClick={() => setActiveTab('schedule')} />

                  <SidebarItem
                    icon={<MessageCircle className="w-4 h-4" />}
                    label="Inbox"
                    active={activeTab === 'inbox'}
                    onClick={() => setActiveTab('inbox')}
                    badge={totalUnread > 0 ? totalUnread : undefined} />

                  <SidebarItem
                    icon={<Settings className="w-4 h-4" />}
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')} />

                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  duration: 0.3
                }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* VIEW PROFILE TAB */}
                {activeTab === 'view' &&
                <div className="flex flex-col">
                    <div className="bg-mustard/10 p-3 text-center text-mustard-dark text-sm font-bold border-b border-mustard/20">
                      <Eye className="w-4 h-4 inline-block mr-2" />
                      This is how travelers see your profile
                    </div>
                    <div className="relative h-[300px] bg-forest overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <svg
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg">

                          <defs>
                            <pattern
                            id="profile-pattern"
                            x="0"
                            y="0"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse">

                              <circle cx="20" cy="20" r="2" fill="white" />
                            </pattern>
                          </defs>
                          <rect
                          width="100%"
                          height="100%"
                          fill="url(#profile-pattern)" />

                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-forest to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                          <div className="w-24 h-24 rounded-full border-4 border-white bg-terracotta shadow-xl flex items-center justify-center text-white text-2xl font-display font-bold">
                            {artistData.initials}
                          </div>
                          <div className="flex-1 text-white">
                            <div className="flex items-center gap-2 mb-2 text-mustard font-bold uppercase tracking-wider text-xs">
                              <Star className="w-3 h-3 fill-current" /> Master
                              Artisan
                            </div>
                            <h1 className="text-3xl font-black font-display mb-2">
                              {artistData.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                              <span className="font-semibold">
                                {artistData.craft}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-white/40" />
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{' '}
                                {artistData.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-8">
                        <section>
                          <h2 className="text-xl font-bold text-forest mb-4 font-display">
                            About the Artisan
                          </h2>
                          <p className="text-gray-600 leading-relaxed">
                            {artistData.bio}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {artistData.specialties.map((tag) =>
                          <span
                            key={tag}
                            className="px-3 py-1 bg-offwhite rounded-lg text-xs font-semibold text-forest-dark">

                                {tag}
                              </span>
                          )}
                          </div>
                        </section>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-offwhite p-5 rounded-xl border border-gray-200">
                          <h3 className="text-lg font-bold text-forest mb-3 font-display flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Availability
                          </h3>
                          <div className="space-y-2">
                            {artistData.schedule.map((day) =>
                          <div
                            key={day.day}
                            className="flex items-start text-sm border-b border-gray-200/50 pb-2 last:border-0">

                                <span className="w-10 font-bold text-gray-900">
                                  {day.day}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {day.slots.length > 0 ?
                              day.slots.map((slot) =>
                              <span
                                key={slot}
                                className="text-gray-600">

                                        {slot},
                                      </span>
                              ) :

                              <span className="text-gray-400 italic">
                                      No slots
                                    </span>
                              }
                                </div>
                              </div>
                          )}
                          </div>
                          <Button className="w-full mt-4" size="sm">
                            Request Booking
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                {/* EDIT PROFILE TAB */}
                {activeTab === 'edit' &&
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-forest font-display">
                        Edit Profile
                      </h2>
                      <Button onClick={handleSaveProfile} className="gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                      </Button>
                    </div>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            name: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none" />

                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            email: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none" />

                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Craft Type
                          </label>
                          <select
                          value={editForm.craft}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            craft: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white">

                            <option>Kandyan Lacquerwork</option>
                            <option>Batik Textiles</option>
                            <option>Mask Carving</option>
                            <option>Pottery</option>
                            <option>Brasswork</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Region
                          </label>
                          <select
                          value={editForm.region}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            region: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white">

                            <option>Kandy</option>
                            <option>Galle</option>
                            <option>Colombo</option>
                            <option>Jaffna</option>
                            <option>Ratnapura</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                          rows={5}
                          value={editForm.bio}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bio: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none resize-none" />

                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Specialties
                          </label>
                          <div className="space-y-3">
                            {editForm.specialties.map((specialty, index) =>
                          <div key={index} className="flex gap-2">
                                <input
                              type="text"
                              value={specialty}
                              onChange={(e) =>
                              handleSpecialtyChange(index, e.target.value)
                              }
                              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none" />

                              </div>
                          )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                }

                {/* SCHEDULE TAB */}
                {activeTab === 'schedule' &&
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-forest font-display">
                          Manage Schedule
                        </h2>
                        <p className="text-gray-500 text-sm">
                          Set your weekly workshop availability
                        </p>
                      </div>
                      <Button onClick={handleSaveSchedule} className="gap-2">
                        <Save className="w-4 h-4" /> Save Schedule
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {editForm.schedule.map((day, dayIndex) =>
                    <div
                      key={day.day}
                      className="bg-offwhite rounded-xl p-4 border border-gray-200">

                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="w-16 font-bold text-lg text-forest">
                              {day.day}
                            </div>
                            <div className="flex-1 flex flex-wrap gap-2">
                              {day.slots.length > 0 ?
                          day.slots.map((slot, slotIndex) =>
                          <div
                            key={slotIndex}
                            className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium flex items-center gap-2 shadow-sm">

                                    {slot}
                                    <button
                              onClick={() =>
                              handleRemoveSlot(dayIndex, slotIndex)
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors">

                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                          ) :

                          <span className="text-gray-400 text-sm italic py-1.5">
                                  No slots available
                                </span>
                          }
                              <button
                            onClick={() => handleAddSlot(dayIndex)}
                            className="px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:text-forest hover:border-forest hover:bg-white transition-all flex items-center gap-1">

                                <Plus className="w-3 h-3" /> Add Slot
                              </button>
                            </div>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                }

                {/* INBOX TAB */}
                {activeTab === 'inbox' &&
                <div className="flex h-[600px]">
                    {/* Conversation List */}
                    <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-lg font-bold text-forest font-display">
                            Messages
                          </h2>
                          {totalUnread > 0 &&
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white bg-terracotta">
                              {totalUnread}
                            </span>
                        }
                        </div>
                        <div className="relative">
                          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                          type="text"
                          placeholder="Search tourists..."
                          value={inboxSearch}
                          onChange={(e) => setInboxSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-gray-200 transition-colors" />

                        </div>
                        {inboxError &&
                        <p className="mt-2 text-xs text-red-500">{inboxError}</p>
                        }
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {inboxConversations.
                      filter((c) =>
                      c.name.
                      toLowerCase().
                      includes(inboxSearch.toLowerCase())
                      ).
                      map((conv) =>
                      <button
                        key={conv.id}
                        onClick={() => {
                          setActiveInboxId(conv.id);
                          setInboxConversations((prev) =>
                          prev.map((c) =>
                          c.id === conv.id ?
                          {
                            ...c,
                            unread: 0
                          } :
                          c
                          )
                          );
                          void chatApi.markConversationRead(conv.id).catch(() => undefined);
                        }}
                        className={`w-full flex items-start gap-3 p-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${activeInboxId === conv.id ? 'bg-forest/5 border-l-2 border-l-forest' : ''}`}>

                              <div className="relative shrink-0">
                                <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{
                              backgroundColor: conv.avatarColor
                            }}>

                                  {conv.initials}
                                </div>
                                {conv.online &&
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                          }
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-semibold text-sm text-gray-900 truncate">
                                    {conv.name}
                                  </span>
                                  <span className="text-xs text-gray-400 shrink-0 ml-1">
                                    {conv.time}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-0.5">
                                  {conv.country}
                                </p>
                                <p
                            className={`text-xs truncate ${conv.unread > 0 ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>

                                  {conv.lastMessage}
                                </p>
                              </div>
                              {conv.unread > 0 &&
                        <span className="shrink-0 w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center bg-terracotta mt-1">
                                  {conv.unread}
                                </span>
                        }
                            </button>
                      )}
                      </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col min-w-0">
                      {activeInboxConv ?
                    <>
                          {/* Chat Header */}
                          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                            <div className="relative">
                              <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{
                              backgroundColor: activeInboxConv.avatarColor
                            }}>

                                {activeInboxConv.initials}
                              </div>
                              {activeInboxConv.online &&
                          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-white" />
                          }
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm">
                                {activeInboxConv.name}
                              </h3>
                              <p className="text-xs text-gray-400">
                                {activeInboxConv.country} ·{' '}
                                {activeInboxConv.workshopContext}
                              </p>
                            </div>
                          </div>

                          {/* Workshop context */}
                          <div className="px-4 py-2 flex items-center gap-2 text-xs font-medium border-b border-gray-100 bg-forest/5 text-forest">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Context:{' '}
                              <strong>{activeInboxConv.workshopContext}</strong>
                            </span>
                          </div>

                          {/* Messages */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {activeInboxConv.messages.map((msg, idx) => {
                          const isMe = msg.sender === 'me';
                          const isSelected = selectedInboxMessageId === msg.id;
                          const isEditing = editingInboxMessageId === msg.id;
                          return (
                            <motion.div
                              key={msg.id}
                              initial={{
                                opacity: 0,
                                y: 6
                              }}
                              animate={{
                                opacity: 1,
                                y: 0
                              }}
                              transition={{
                                duration: 0.15,
                                delay: idx * 0.02
                              }}
                              onClick={() => {
                                setSelectedInboxMessageId(msg.id);
                                if (openInboxMessageMenuId && openInboxMessageMenuId !== msg.id) {
                                  setOpenInboxMessageMenuId(null);
                                }
                              }}
                              className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>

                                  {!isMe &&
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto shrink-0"
                                style={{
                                  backgroundColor:
                                  activeInboxConv.avatarColor
                                }}>

                                      {activeInboxConv.initials[0]}
                                    </div>
                              }
                                  <div
                                className={`max-w-xs flex flex-col ${isMe ? 'items-end' : 'items-start'} relative`}>

                                    <div
                                  className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed border"
                                  style={
                                  isMe ?
                                  {
                                    backgroundColor: '#2F5D50',
                                    color: 'white',
                                    borderBottomRightRadius: '4px',
                                    borderColor: isSelected ? '#1E3E36' : 'transparent'
                                  } :
                                  {
                                    backgroundColor: 'white',
                                    color: '#1E1E1E',
                                    borderBottomLeftRadius: '4px',
                                    boxShadow:
                                    '0 1px 2px rgba(0,0,0,0.06)',
                                    borderColor: isSelected ? '#2F5D50' : 'transparent'
                                  }
                                  }>

                                      {isEditing ?
                                  <div className="space-y-2">
                                          <textarea
                                          value={editingInboxText}
                                          onChange={(e) => setEditingInboxText(e.target.value)}
                                          rows={3}
                                          className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none text-gray-900" />
                                          <div className="flex items-center justify-end gap-2">
                                            <button
                                            type="button"
                                            onClick={cancelEditingInboxMessage}
                                            className="p-1 rounded-lg hover:bg-black/10 transition-colors">

                                              <X className="w-4 h-4" />
                                            </button>
                                            <button
                                            type="button"
                                            onClick={handleUpdateInboxMessage}
                                            disabled={!editingInboxText.trim() || isSavingInboxEdit}
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
                                          setOpenInboxMessageMenuId((current) => current === msg.id ? null : msg.id);
                                        }}
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">

                                          <MoreVerticalIcon className="w-4 h-4" />
                                        </button>
                                        {openInboxMessageMenuId === msg.id &&
                                    <div className="absolute right-0 mt-1 min-w-32 rounded-xl border border-gray-200 bg-white shadow-lg py-1 z-10">
                                            <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              startEditingInboxMessage(msg);
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2">

                                              <Edit2 className="w-4 h-4" />
                                              Edit
                                            </button>
                                            <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              void handleDeleteInboxMessage(msg.id);
                                            }}
                                            disabled={deletingInboxMessageId === msg.id}
                                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 inline-flex items-center gap-2 disabled:opacity-50">

                                              <Trash2 className="w-4 h-4" />
                                              Delete
                                            </button>
                                          </div>
                                    }
                                      </div>
                                }
                                    <div
                                  className={`flex items-center gap-1 mt-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>

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
                                  <CheckCheckIcon className="w-3 h-3 text-blue-400" /> :

                                  <CheckIcon className="w-3 h-3 text-gray-400" />)
                                  }
                                    </div>
                                  </div>
                                </motion.div>);

                        })}
                            <div ref={messagesEndRef} />
                          </div>

                          {/* Input */}
                          <div className="p-3 bg-white border-t border-gray-100">
                            <div className="flex items-end gap-2">
                              <textarea
                            value={inboxInput}
                            onChange={(e) => setInboxInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendInbox();
                              }
                            }}
                            placeholder={`Reply to ${activeInboxConv.name}...`}
                            rows={1}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm resize-none focus:border-gray-300 transition-colors"
                            style={{
                              maxHeight: '80px'
                            }} />

                              <motion.button
                            whileHover={{
                              scale: 1.05
                            }}
                            whileTap={{
                              scale: 0.95
                            }}
                            onClick={handleSendInbox}
                            disabled={!inboxInput.trim()}
                            className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 bg-forest shrink-0">

                                <SendIcon className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </> :

                    <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <MessageCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">
                              Select a conversation to reply
                            </p>
                          </div>
                        </div>
                    }
                    </div>
                  </div>
                }

                {/* SETTINGS TAB */}
                {activeTab === 'settings' &&
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-forest font-display mb-6">
                      Account Settings
                    </h2>
                    <div className="mb-10">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-400" /> Change
                        Password
                      </h3>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4 max-w-lg">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white"
                          placeholder="••••••••" />

                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white"
                          placeholder="••••••••" />

                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white"
                          placeholder="••••••••" />

                        </div>
                        <Button className="w-full">Update Password</Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" /> Danger Zone
                      </h3>
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                        <h4 className="font-bold text-red-900 mb-2">
                          Delete Account
                        </h4>
                        <p className="text-red-700 text-sm mb-6 max-w-xl">
                          Once you delete your account, there is no going back.
                          Please be certain. All your listings, messages, and
                          booking history will be permanently removed.
                        </p>
                        <Button
                        onClick={handleDeleteProfile}
                        className="bg-red-600 hover:bg-red-700 text-white border-none shadow-none">

                          Delete My Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                }
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>);

}
function SidebarItem({
  icon,
  label,
  active,
  onClick,
  badge






}: {icon: React.ReactNode;label: string;active: boolean;onClick: () => void;badge?: number;}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${active ? 'bg-forest text-white shadow-md translate-x-1' : 'text-gray-600 hover:bg-gray-50 hover:text-forest'}`}>

      <span className={active ? 'text-mustard' : 'text-gray-400'}>{icon}</span>
      {label}
      {badge !== undefined &&
      <span
        className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-mustard text-forest' : 'bg-terracotta text-white'}`}>

          {badge}
        </span>
      }
      {active && badge === undefined &&
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mustard" />
      }
    </button>);

}
