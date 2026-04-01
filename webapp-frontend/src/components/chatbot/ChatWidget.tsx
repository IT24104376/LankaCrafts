import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Compass,
  Flag,
  MapPin,
  MessageCircle,
  RotateCcw,
  Search,
  X
} from 'lucide-react';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  type?: 'text' | 'map-card';
  meta?: {
    craft?: string;
    distance?: string;
    location?: string;
  };
}

interface WorkshopSuggestion {
  name: string;
  craft: string;
  city: string;
  distance: string;
  note: string;
  matchTags: string[];
}

interface CommonQuestion {
  category: Category;
  text: string;
}

type Category = 'All' | 'Booking' | 'Chat' | 'Favorites' | 'Crafts' | 'Workshops';

const WORKSHOP_SUGGESTIONS: WorkshopSuggestion[] = [
  {
    name: 'Batik Textile Workshop',
    craft: 'Batik',
    city: 'Kandy',
    distance: '2.1 km',
    note: 'Great for beginners who want a colorful hands-on session.',
    matchTags: ['batik', 'textile', 'beginner', 'colorful']
  },
  {
    name: 'Traditional Pottery Class',
    craft: 'Pottery',
    city: 'Kelaniya',
    distance: '4.3 km',
    note: 'A calm workshop where you can shape clay and learn wheel work.',
    matchTags: ['pottery', 'clay', 'ceramic', 'family', 'relaxed']
  },
  {
    name: 'Lacquerwork Masterclass',
    craft: 'Lacquerwork',
    city: 'Kandy',
    distance: '1.8 km',
    note: 'Best if you want a deeper cultural story and detailed craft work.',
    matchTags: ['lacquer', 'heritage', 'art', 'detailed']
  },
  {
    name: 'Mask Carving Workshop',
    craft: 'Mask Carving',
    city: 'Ambalangoda',
    distance: '3.7 km',
    note: 'A strong choice for travelers interested in ritual art and carving.',
    matchTags: ['mask', 'carving', 'wood', 'culture']
  },
  {
    name: 'Palmyra Weaving Workshop',
    craft: 'Weaving',
    city: 'Jaffna',
    distance: '5.2 km',
    note: 'Nice for visitors who enjoy natural materials and traditional patterns.',
    matchTags: ['weaving', 'palmyra', 'traditional']
  }
];

const CATEGORIES: Category[] = ['All', 'Booking', 'Chat', 'Favorites', 'Crafts', 'Workshops'];

const COMMON_QUESTIONS: CommonQuestion[] = [
  { category: 'Booking', text: 'How do I book a workshop?' },
  { category: 'Booking', text: 'Can I choose the date and time?' },
  { category: 'Chat', text: 'How can I chat with an artisan?' },
  { category: 'Chat', text: 'What should I ask an artisan before booking?' },
  { category: 'Favorites', text: 'How do I save my favorite workshops?' },
  { category: 'Favorites', text: 'Where can I find my saved workshops?' },
  { category: 'Crafts', text: 'What is batik?' },
  { category: 'Crafts', text: 'What is lacquerwork?' },
  { category: 'Workshops', text: 'Recommend a beginner workshop' },
  { category: 'Workshops', text: 'How do I browse workshops?' },
  { category: 'Workshops', text: 'Which workshop is good for families?' },
  { category: 'Workshops', text: 'Show me a workshop in Kandy' }
];

const CRAFT_EXPLANATIONS: Record<string, string> = {
  batik:
    'Batik is a wax-resist dyeing craft. Artisans draw with wax, add color layers, and reveal detailed fabric patterns.',
  pottery:
    'Traditional pottery uses hand shaping and the wheel to form clay pieces. It is valued for both daily use and cultural design.',
  lacquer:
    'Lacquerwork is a decorative wood craft with layered colors and polished patterns. It is especially well known in Kandy.',
  lacquerwork:
    'Lacquerwork is a decorative wood craft with layered colors and polished patterns. It is especially well known in Kandy.',
  'mask carving':
    'Mask carving is a woodcraft tradition linked to storytelling and ritual performance. Ambalangoda is especially known for this art.'
};

function getTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function findMatchingWorkshops(input: string) {
  const normalized = normalizeText(input);
  const directMatches = WORKSHOP_SUGGESTIONS.filter(
    (workshop) =>
      normalized.includes(workshop.city.toLowerCase()) ||
      normalized.includes(workshop.craft.toLowerCase()) ||
      workshop.matchTags.some((tag) => normalized.includes(tag))
  );

  if (directMatches.length > 0) {
    return directMatches.slice(0, 2);
  }

  if (
    normalized.includes('beginner') ||
    normalized.includes('first time') ||
    normalized.includes('family')
  ) {
    return WORKSHOP_SUGGESTIONS.filter((workshop) =>
      ['Batik', 'Pottery'].includes(workshop.craft)
    ).slice(0, 2);
  }

  return WORKSHOP_SUGGESTIONS.slice(0, 2);
}

function getFollowUpQuestions(input: string) {
  const normalized = normalizeText(input);

  if (normalized.includes('book') || normalized.includes('date') || normalized.includes('time')) {
    return ['How do I browse workshops?', 'How can I chat with an artisan?'];
  }

  if (normalized.includes('chat') || normalized.includes('message')) {
    return ['What should I ask an artisan before booking?', 'How do I book a workshop?'];
  }

  if (normalized.includes('favorite') || normalized.includes('save')) {
    return ['Where can I find my saved workshops?', 'Recommend a beginner workshop'];
  }

  if (
    normalized.includes('batik') ||
    normalized.includes('pottery') ||
    normalized.includes('lacquer') ||
    normalized.includes('craft')
  ) {
    return ['Recommend a beginner workshop', 'Show me a workshop in Kandy'];
  }

  return ['How do I book a workshop?', 'How can I chat with an artisan?'];
}

function buildReply(input: string) {
  const normalized = normalizeText(input);

  if (!normalized || normalized.split(' ').length < 2) {
    return {
      text: 'Please ask about workshops, booking, artisan chat, favorites, or crafts.',
      suggestions: ['How do I browse workshops?', 'Recommend a beginner workshop']
    };
  }

  if (
    normalized.includes('book') ||
    normalized.includes('reserve') ||
    normalized.includes('date') ||
    normalized.includes('time')
  ) {
    return {
      text:
        'Open a workshop page, choose your date and time, then confirm your booking details.\nYou can browse workshops first if you have not picked one yet.',
      suggestions: ['How do I browse workshops?', 'How can I chat with an artisan?']
    };
  }

  if (
    normalized.includes('what should i ask') ||
    (normalized.includes('ask') && normalized.includes('artisan'))
  ) {
    return {
      text:
        'You can ask about materials, skill level, workshop duration, location, and what is included.\nThis helps you choose the right experience before booking.',
      suggestions: ['How can I chat with an artisan?', 'How do I book a workshop?']
    };
  }

  if (normalized.includes('chat') || normalized.includes('message')) {
    return {
      text:
        'Open the artisan or workshop page and use the chat option to send a message.\nYou can ask about materials, skill level, or workshop details.',
      suggestions: ['What should I ask an artisan before booking?', 'How do I book a workshop?']
    };
  }

  if (normalized.includes('where') && normalized.includes('saved')) {
    return {
      text:
        'Your saved workshops are available from your favorites or saved section.\nYou can open them later to compare and book when you are ready.',
      suggestions: ['How do I save my favorite workshops?', 'Recommend a beginner workshop']
    };
  }

  if (
    normalized.includes('favorite') ||
    normalized.includes('favourite') ||
    normalized.includes('save')
  ) {
    return {
      text:
        'Tap the heart icon on a workshop card to save it.\nYour saved workshops make it easier to compare and return later.',
      suggestions: ['Where can I find my saved workshops?', 'Recommend a beginner workshop']
    };
  }

  if (normalized.includes('browse') || normalized.includes('find')) {
    return {
      text:
        'You can browse workshops from the workshop listing pages and open any card for more details.\nUse the workshop page to check craft type, location, and booking options.',
      suggestions: ['Show me a workshop in Kandy', 'How do I book a workshop?']
    };
  }

  const craftKey = Object.keys(CRAFT_EXPLANATIONS).find((key) => normalized.includes(key));
  if (craftKey) {
    const relatedWorkshop = findMatchingWorkshops(craftKey)[0];
    return {
      text:
        `${CRAFT_EXPLANATIONS[craftKey]}\nYou can try ${relatedWorkshop.name} in ${relatedWorkshop.city} if you want a hands-on experience.`,
      suggestions: ['Recommend a beginner workshop', 'How do I book a workshop?']
    };
  }

  if (
    normalized.includes('recommend') ||
    normalized.includes('near') ||
    normalized.includes('workshop') ||
    normalized.includes('kandy') ||
    normalized.includes('family')
  ) {
    const matches = findMatchingWorkshops(normalized);
    return {
      text:
        `I recommend ${matches[0].name} in ${matches[0].city}.\n${matches[0].note}\nYou can also check ${matches[1].name}.`,
      cards: matches,
      suggestions: getFollowUpQuestions(normalized)
    };
  }

  return {
    text:
      'I can help with workshops, booking, artisan chat, favorites, and craft information.\nPlease ask a website-related question.',
    suggestions: ['How do I browse workshops?', 'How do I book a workshop?']
  };
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>(COMMON_QUESTIONS.slice(0, 4).map((item) => item.text));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = normalizeText(searchQuery);

    return COMMON_QUESTIONS.filter((item) => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const searchMatch =
        !normalizedSearch || normalizeText(item.text).includes(normalizedSearch);

      return categoryMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: getTimestamp()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = buildReply(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: reply.text,
        timestamp: getTimestamp(),
        type: 'text'
      };

      const cardMessages: Message[] = (reply.cards || []).map((workshop, index) => ({
        id: (Date.now() + 2 + index).toString(),
        role: 'bot',
        content: workshop.name,
        timestamp: getTimestamp(),
        type: 'map-card',
        meta: {
          craft: workshop.craft,
          distance: workshop.distance,
          location: workshop.city
        }
      }));

      setFollowUpQuestions(reply.suggestions || getFollowUpQuestions(text));
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg, ...cardMessages]);
    }, 700);
  };

  const handleClearChat = () => {
    setMessages([]);
    setSearchQuery('');
    setSelectedCategory('All');
    setFollowUpQuestions(COMMON_QUESTIONS.slice(0, 4).map((item) => item.text));
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
            className="fixed bottom-24 right-6 z-40 flex h-[60vh] max-h-[560px] w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl md:h-[520px] md:w-[390px]"
          >
            <div className="flex shrink-0 items-center justify-between bg-forest p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Compass className="h-6 w-6 text-mustard" />
                </div>
                <div>
                  <h3 className="font-body font-bold text-white">Website Help</h3>
                  <p className="text-xs text-white/80">Smart help for workshops and crafts</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  title="Clear chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-white">
              <div className="border-b border-gray-100 bg-white p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search common questions..."
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/10"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${selectedCategory === category ? 'bg-forest text-white' : 'border border-forest/20 text-forest hover:bg-forest/5'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto bg-[#F9FAFB] p-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-sm font-medium text-gray-700">Common questions</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((item) => (
                        <button
                          key={item.text}
                          onClick={() => handleSend(item.text)}
                          className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-medium text-forest transition-colors hover:bg-forest/5"
                        >
                          {item.text}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No questions match this search.</p>
                    )}
                  </div>
                </div>

                {messages.length > 0 && (
                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-medium text-gray-700">Suggested next questions</p>
                    <div className="flex flex-wrap gap-2">
                      {followUpQuestions.map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSend(question)}
                          className="rounded-full border border-mustard/40 bg-mustard/10 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-mustard/20"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`group relative flex min-w-0 max-w-[90%] flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {msg.role === 'bot' && (
                        <button className="absolute -top-5 right-0 p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100">
                          <Flag className="h-3 w-3" />
                        </button>
                      )}

                      <div
                        className={`break-words p-3 shadow-sm ${msg.role === 'user' ? 'rounded-2xl rounded-tr-sm bg-gradient-to-br from-forest to-[#1E3D35] text-white' : 'rounded-2xl rounded-tl-sm border border-gray-100 bg-white text-gray-800'}`}
                      >
                        {msg.type === 'text' && (
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {msg.content}
                          </p>
                        )}

                        {msg.type === 'map-card' && (
                          <div className="w-full">
                            <div className="mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-terracotta" />
                              <span className="text-sm font-bold">{msg.content}</span>
                            </div>
                            <p className="mb-2 text-xs text-gray-500">
                              {msg.meta?.craft} - {msg.meta?.location} - {msg.meta?.distance}
                            </p>
                          </div>
                        )}
                      </div>

                      <span className="mt-1 px-1 text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>
                  </motion.div>
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

              <ChatInput onSend={handleSend} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
