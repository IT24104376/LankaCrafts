import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Compass,
  Flag,
  MapPin,
  ShieldAlert,
  ChevronLeft
} from
  'lucide-react';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';
interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  type?: 'text' | 'map-card' | 'image-card';
  meta?: any;
}
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'bot',
    content:
      "Hello! 👋 I'm your Travel Assistant for Lanka Craft. I can help you discover handmade shops, find workshops, and plan your craft journey across Sri Lanka. What would you like to explore?",
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  }];

const SUGGESTED_REPLIES = [
  'Best pottery in Kandy',
  'Batik workshops near me',
  'How to book a visit',
  'Show me the map'];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  const handleSend = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content:
          'Great choice! Kandy is famous for its traditional pottery. Here are some top workshops:',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      };
      const mapCardMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'bot',
        content: 'Kandy Pottery Workshop',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'map-card',
        meta: {
          location: 'Kandy',
          distance: '2.4 km'
        }
      };
      const imageCardMsg: Message = {
        id: (Date.now() + 3).toString(),
        role: 'bot',
        content: 'Traditional Kandy earthenware',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'image-card'
      };
      setMessages((prev) => [...prev, botMsg, mapCardMsg, imageCardMsg]);
    }, 2000);
  };
  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{
          scale: 0
        }}
        animate={{
          scale: 1
        }}
        whileHover={{
          scale: 1.1
        }}
        whileTap={{
          scale: 0.9
        }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-gray-800 text-white' : 'bg-forest text-white'}`}>

        <AnimatePresence mode="wait">
          {isOpen ?
            <motion.div
              key="close"
              initial={{
                rotate: -90,
                opacity: 0
              }}
              animate={{
                rotate: 0,
                opacity: 1
              }}
              exit={{
                rotate: 90,
                opacity: 0
              }}>

              <X className="w-6 h-6" />
            </motion.div> :

            <motion.div
              key="chat"
              initial={{
                scale: 0.5,
                opacity: 0
              }}
              animate={{
                scale: 1,
                opacity: 1
              }}
              exit={{
                scale: 0.5,
                opacity: 0
              }}>

              <MessageCircle className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-mustard rounded-full animate-pulse" />
            </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            transition={{
              duration: 0.2
            }}
            className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] md:w-[360px] h-[50vh] md:h-[420px] max-h-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">

            {/* Header */}
            <div className="bg-forest p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Compass className="w-6 h-6 text-mustard" />
                </div>
                <div>
                  <h3 className="font-bold text-white font-body">
                    Travel Assistant
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white/80">
                      AI Guide · Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors md:block hidden">

                  <ChevronLeft
                    className={`w-5 h-5 transition-transform ${showSidebar ? 'rotate-180' : ''}`} />

                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">

                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar (Desktop only) */}
              <AnimatePresence>
                {showSidebar &&
                  <motion.div
                    initial={{
                      width: 0,
                      opacity: 0
                    }}
                    animate={{
                      width: 240,
                      opacity: 1
                    }}
                    exit={{
                      width: 0,
                      opacity: 0
                    }}
                    className="border-r border-gray-200 hidden md:block">

                    <ChatSidebar />
                  </motion.div>
                }
              </AnimatePresence>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col bg-white relative min-w-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 bg-[#F9FAFB]">
                  {messages.map((msg) =>
                    <motion.div
                      key={msg.id}
                      initial={{
                        opacity: 0,
                        y: 10
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                      <div
                        className={`max-w-[90%] group relative ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col min-w-0`}>

                        {/* Report Button (Bot only) */}
                        {msg.role === 'bot' &&
                          <button className="absolute right-0 -top-5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 p-1">
                            <Flag className="w-3 h-3" />
                          </button>
                        }

                        {/* Message Bubble */}
                        <div
                          className={`p-3 shadow-sm break-words ${msg.role === 'user' ? 'bg-gradient-to-br from-forest to-[#1E3D35] text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'}`}>

                          {msg.type === 'text' &&
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          }

                          {msg.type === 'map-card' &&
                            <div className="w-full">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-terracotta" />
                                <span className="font-bold text-sm">
                                  {msg.content}
                                </span>
                              </div>
                              <div className="h-24 bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                                <svg
                                  viewBox="0 0 100 50"
                                  className="w-full h-full opacity-50">

                                  <path
                                    d="M0 25 Q25 10 50 25 T100 25"
                                    fill="none"
                                    stroke="#ccc"
                                    strokeWidth="2" />

                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <button className="bg-white/90 backdrop-blur shadow-sm px-3 py-1.5 rounded-full text-xs font-bold text-forest hover:scale-105 transition-transform">
                                    View on Map
                                  </button>
                                </div>
                              </div>
                            </div>
                          }

                          {msg.type === 'image-card' &&
                            <div className="w-full">
                              <div className="h-32 bg-gradient-to-br from-terracotta to-mustard rounded-lg mb-2 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/10" />
                              </div>
                              <p className="text-xs font-medium text-gray-500">
                                {msg.content}
                              </p>
                            </div>
                          }
                        </div>

                        {/* Timestamp */}
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping &&
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      className="flex justify-start">

                      <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6
                          }}
                          className="w-2 h-2 bg-gray-400 rounded-full" />

                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.2
                          }}
                          className="w-2 h-2 bg-gray-400 rounded-full" />

                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: 0.4
                          }}
                          className="w-2 h-2 bg-gray-400 rounded-full" />

                      </div>
                    </motion.div>
                  }
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Replies */}
                {messages.length === 1 && !isTyping &&
                  <div className="px-4 py-2 bg-white border-t border-gray-50 overflow-x-auto">
                    <div className="flex gap-2 pb-2">
                      {SUGGESTED_REPLIES.map((reply) =>
                        <button
                          key={reply}
                          onClick={() => handleSend(reply)}
                          className="whitespace-nowrap px-3 py-1.5 rounded-full border border-forest/20 text-forest text-xs font-medium hover:bg-forest/5 transition-colors">

                          {reply}
                        </button>
                      )}
                    </div>
                  </div>
                }

                {/* Input Area */}
                <ChatInput onSend={handleSend} />
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}