import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Compass, Flag, MessageCircle, X } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';
import { findFaqAnswer, getFallbackAnswer, SUGGESTED_QUESTIONS } from './chatFaq';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'bot',
    content:
      "Hello! I'm the Lanka Crafts assistant. I can help with bookings, artists, workshops, reviews, payments, and general site questions. What would you like to know?",
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  },
];

const getTimeLabel = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const getFollowUpQuestions = (currentQuestion: string) =>
  SUGGESTED_QUESTIONS.filter((question) => question !== currentQuestion);

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: getTimeLabel(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    window.setTimeout(() => {
      const matchedFaq = findFaqAnswer(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: matchedFaq?.answer || getFallbackAnswer(),
        timestamp: getTimeLabel(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 900);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-colors duration-300 ${isOpen ? 'bg-gray-800 text-white' : 'bg-forest text-white'}`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <MessageCircle className="h-7 w-7" />
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-mustard" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 flex h-[50vh] max-h-[450px] w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl md:h-[420px] md:w-[360px]"
          >
            <div className="flex items-center justify-between bg-forest p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Compass className="h-6 w-6 text-mustard" />
                </div>
                <div>
                  <h3 className="font-body font-bold text-white">Lanka Crafts AI Guide</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                    <span className="text-xs text-white/80">FAQ Assistant · Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="hidden rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:block"
                >
                  <ChevronLeft className={`h-5 w-5 transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <AnimatePresence>
                {showSidebar && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="hidden border-r border-gray-200 md:block"
                  >
                    <ChatSidebar />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative flex min-w-0 flex-1 flex-col bg-white">
                <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F9FAFB] p-3 space-y-3">
                  {messages.map((msg) => (
                    <React.Fragment key={msg.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`group relative flex min-w-0 max-w-[90%] flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          {msg.role === 'bot' && (
                            <button className="absolute right-0 -top-5 p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100">
                              <Flag className="h-3 w-3" />
                            </button>
                          )}

                          <div
                            className={`break-words rounded-2xl p-3 shadow-sm ${msg.role === 'user' ? 'rounded-tr-sm bg-gradient-to-br from-forest to-[#1E3D35] text-white' : 'rounded-tl-sm border border-gray-100 bg-white text-gray-800'}`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                          </div>

                          <span className="mt-1 px-1 text-[10px] text-gray-400">{msg.timestamp}</span>
                        </div>
                      </motion.div>

                      {msg.role === 'user' && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="max-w-[90%] px-1 pt-1">
                            <div className="flex flex-wrap gap-2">
                              {getFollowUpQuestions(msg.content).map((question) => (
                                <button
                                  key={`${msg.id}-${question}`}
                                  onClick={() => handleSend(question)}
                                  className="rounded-full border border-forest/20 bg-white px-3 py-1.5 text-xs font-medium text-forest transition-colors hover:bg-forest/5"
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </React.Fragment>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-1 rounded-2xl rounded-tl-sm border border-gray-100 bg-white p-4 shadow-sm">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6 }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {messages.length === 1 && !isTyping && (
                  <div className="overflow-x-auto border-t border-gray-50 bg-white px-4 py-2">
                    <div className="flex gap-2 pb-2">
                      {SUGGESTED_QUESTIONS.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleSend(reply)}
                          className="whitespace-nowrap rounded-full border border-forest/20 px-3 py-1.5 text-xs font-medium text-forest transition-colors hover:bg-forest/5"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <ChatInput onSend={handleSend} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
