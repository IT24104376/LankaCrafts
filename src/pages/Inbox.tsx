import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  SendIcon,
  PaperclipIcon,
  CheckCheckIcon,
  CheckIcon,
  ArrowLeftIcon,
  MoreVerticalIcon,
  PhoneIcon,
  VideoIcon,
  MapPinIcon,
  CalendarIcon } from
'lucide-react';
import { Link } from 'react-router-dom';
import { TouristNavbar } from './tourist/TouristNavbar';
interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
  seen: boolean;
}
interface Conversation {
  id: number;
  name: string;
  craft: string;
  location: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}
const CONVERSATIONS: Conversation[] = [
{
  id: 1,
  name: 'Nimal Perera',
  craft: 'Kandyan Lacquerwork',
  location: 'Kandy',
  avatar: 'NP',
  avatarColor: '#C1440E',
  lastMessage:
  'The workshop starts at 10 AM. Please bring comfortable clothes.',
  time: '10:32 AM',
  unread: 2,
  online: true,
  messages: [
  {
    id: 1,
    text: "Hello! I saw your lacquerwork profile and I'm very interested in booking a workshop.",
    sender: 'me',
    time: '9:45 AM',
    seen: true
  },
  {
    id: 2,
    text: "Welcome! I'd be happy to have you. When are you planning to visit Kandy?",
    sender: 'them',
    time: '9:52 AM',
    seen: true
  },
  {
    id: 3,
    text: "I'm thinking this Saturday morning. Is that available?",
    sender: 'me',
    time: '9:55 AM',
    seen: true
  },
  {
    id: 4,
    text: "Yes, Saturday is perfect! I have a slot at 10 AM. The session is about 3 hours and you'll make your own lacquer piece to take home.",
    sender: 'them',
    time: '10:01 AM',
    seen: true
  },
  {
    id: 5,
    text: 'That sounds amazing! How many people can join?',
    sender: 'me',
    time: '10:15 AM',
    seen: true
  },
  {
    id: 6,
    text: 'The workshop starts at 10 AM. Please bring comfortable clothes.',
    sender: 'them',
    time: '10:32 AM',
    seen: false
  }]

},
{
  id: 2,
  name: 'Kamala Wijesinghe',
  craft: 'Batik Textiles',
  location: 'Kandy',
  avatar: 'KW',
  avatarColor: '#2F5D50',
  lastMessage: 'I can show you both silk and cotton batik techniques.',
  time: 'Yesterday',
  unread: 0,
  online: false,
  messages: [
  {
    id: 1,
    text: "Hi Kamala! I'm a textile designer from India and I'd love to learn batik from you.",
    sender: 'me',
    time: 'Yesterday 2:00 PM',
    seen: true
  },
  {
    id: 2,
    text: 'How wonderful! Batik is such a beautiful art form. I can show you both silk and cotton batik techniques.',
    sender: 'them',
    time: 'Yesterday 2:15 PM',
    seen: true
  }]

},
{
  id: 3,
  name: 'Suresh Fernando',
  craft: 'Mask Carving',
  location: 'Ambalangoda',
  avatar: 'SF',
  avatarColor: '#C9A227',
  lastMessage: 'Each mask takes about 2 weeks to complete by hand.',
  time: 'Mon',
  unread: 1,
  online: true,
  messages: [
  {
    id: 1,
    text: 'Your kolam masks are incredible! Can I visit your workshop?',
    sender: 'me',
    time: 'Mon 11:00 AM',
    seen: true
  },
  {
    id: 2,
    text: 'Of course! Ambalangoda is the mask capital of Sri Lanka. Each mask takes about 2 weeks to complete by hand.',
    sender: 'them',
    time: 'Mon 11:30 AM',
    seen: false
  }]

},
{
  id: 4,
  name: 'Priya Rajapaksa',
  craft: 'Palmyra Weaving',
  location: 'Jaffna',
  avatar: 'PR',
  avatarColor: '#1A6B6B',
  lastMessage:
  'The best time to visit is early morning when the light is beautiful.',
  time: 'Sun',
  unread: 0,
  online: false,
  messages: [
  {
    id: 1,
    text: "I'm planning a trip to Jaffna and would love to see palmyra weaving.",
    sender: 'me',
    time: 'Sun 3:00 PM',
    seen: true
  },
  {
    id: 2,
    text: 'The best time to visit is early morning when the light is beautiful.',
    sender: 'them',
    time: 'Sun 3:45 PM',
    seen: true
  }]

}];

export function Inbox() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState<number | null>(1);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversation = conversations.find((c) => c.id === activeId);
  const filteredConversations = conversations.filter(
    (c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.craft.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [activeId, conversations]);
  const handleSend = () => {
    if (!inputText.trim() || !activeId) return;
    const newMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      seen: false
    };
    setConversations((prev) =>
    prev.map((c) =>
    c.id === activeId ?
    {
      ...c,
      messages: [...c.messages, newMessage],
      lastMessage: inputText.trim(),
      time: 'Now',
      unread: 0
    } :
    c
    )
    );
    setInputText('');
  };
  const handleSelectConversation = (id: number) => {
    setActiveId(id);
    setMobileView('chat');
    // Mark as read
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
  };
  return (
    <div
      className="min-h-screen font-body"
      style={{
        backgroundColor: '#FAF6F0'
      }}>

      <TouristNavbar />

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
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
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
                        {conv.craft} · {conv.location}
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

                      `${activeConversation.craft} · ${activeConversation.location}`
                      }
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                      to={`/book?artisan=${activeConversation.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-white"
                      style={{
                        backgroundColor: '#C1440E'
                      }}>

                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Book Workshop</span>
                      </Link>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVerticalIcon className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Workshop context banner */}
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
                      to={`/artist/${activeConversation.id}`}
                      className="underline ml-1">

                        View Profile
                      </Link>
                    </span>
                  </div>

                  {/* Messages */}
                  <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{
                    backgroundColor: '#FAF6F0'
                  }}>

                    {activeConversation.messages.map((msg, idx) => {
                    const isMe = msg.sender === 'me';
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
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>

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
                          className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>

                            <div
                            className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                            style={
                            isMe ?
                            {
                              backgroundColor: '#C1440E',
                              color: 'white',
                              borderBottomRightRadius: '4px'
                            } :
                            {
                              backgroundColor: 'white',
                              color: '#1E1E1E',
                              borderBottomLeftRadius: '4px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                            }
                            }>

                              {msg.text}
                            </div>
                            <div
                            className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>

                              <span className="text-xs text-gray-400">
                                {msg.time}
                              </span>
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