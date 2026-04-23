export type FaqItem = {
  id: string;
  category: 'General' | 'Bookings' | 'Artists' | 'Workshops' | 'Payments' | 'Support';
  question: string;
  answer: string;
  keywords: string[];
};

export const CHAT_FAQS: FaqItem[] = [
  {
    id: 'how-to-book',
    category: 'Bookings',
    question: 'How do I book a workshop on LankaCrafts?',
    answer:
      'Open an artist profile or workshop page, choose your preferred date and time, and complete the booking form. After that, you can review your booking from the My Bookings page.',
    keywords: ['book', 'booking', 'workshop', 'reserve', 'schedule', 'my bookings'],
  },
  {
    id: 'find-artists',
    category: 'Artists',
    question: 'How can I find artists on the website?',
    answer:
      'Use the Browse Artists page to search by craft type and location. You can explore artisan profiles, compare specialties, and open a chat with an artist before booking.',
    keywords: ['artist', 'artists', 'browse', 'find artist', 'craft type', 'location', 'search'],
  },
  {
    id: 'what-can-tourists-do',
    category: 'General',
    question: 'What can tourists do on LankaCrafts?',
    answer:
      'Tourists can create an account, browse verified artists, book workshops, chat with artisans, manage bookings, and share feedback after their experience.',
    keywords: ['tourist', 'tourists', 'features', 'account', 'dashboard', 'what can i do'],
  },
  {
    id: 'artist-registration',
    category: 'Artists',
    question: 'How do artists join LankaCrafts?',
    answer:
      'Artists can register through the artist sign-up flow, complete their profile with craft details and location, and wait for verification before publishing their services.',
    keywords: ['artist register', 'join', 'signup', 'sign up', 'verification', 'profile'],
  },
  {
    id: 'chat-feature',
    category: 'Support',
    question: 'Can I chat with an artist before booking?',
    answer:
      'Yes. The site includes direct chat so tourists can ask about availability, pricing, workshop details, and custom requests before confirming a booking.',
    keywords: ['chat', 'message', 'contact artist', 'before booking', 'inbox'],
  },
  {
    id: 'payments',
    category: 'Payments',
    question: 'How do payments work?',
    answer:
      'Payments are connected to the booking flow. If a workshop or service requires payment, the site guides you through the payment step before the booking is finalized.',
    keywords: ['payment', 'pay', 'price', 'pricing', 'checkout', 'payhere'],
  },
  {
    id: 'reviews',
    category: 'General',
    question: 'Can I leave a review after a workshop?',
    answer:
      'Yes. After your experience, you can leave a review and rating to help other tourists choose trusted artisans and workshops.',
    keywords: ['review', 'rating', 'feedback', 'after workshop', 'comment'],
  },
  {
    id: 'admin-role',
    category: 'Support',
    question: 'What does the admin team do?',
    answer:
      'Admins monitor user activity, review artisan and workshop submissions, manage reports, and help keep the platform safe and trustworthy.',
    keywords: ['admin', 'verification', 'monitoring', 'reports', 'safety'],
  },
];

export const SUGGESTED_QUESTIONS = [
  'How do I book a workshop?',
  'How can I find artists?',
  'Can I chat with an artist before booking?',
  'Can I leave a review after a workshop?',
];

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

export const findFaqAnswer = (message: string) => {
  const normalizedMessage = normalize(message);

  const ranked = CHAT_FAQS.map((faq) => {
    const score = faq.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalize(keyword);
      return total + (normalizedMessage.includes(normalizedKeyword) ? 1 : 0);
    }, 0) + (normalizedMessage.includes(normalize(faq.question)) ? 2 : 0);

    return { faq, score };
  }).sort((a, b) => b.score - a.score);

  return ranked[0] && ranked[0].score >= 1 ? ranked[0].faq : null;
};

export const getFallbackAnswer = () =>
  "I’m here to help with LankaCrafts questions only, such as bookings, artists, workshops, payments, reviews, and support. Please ask a website-related question or choose one of the suggestions below.";
