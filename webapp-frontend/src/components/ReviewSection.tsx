import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  SparklesIcon,
  CameraIcon,
  SendIcon,
  EditIcon,
  Trash2Icon,
  MessageCircleIcon,
  ThumbsUpIcon,
  XIcon,
  CheckIcon,
  BotIcon } from
'lucide-react';
// ── Types ──────────────────────────────────────────────────────
interface ReviewPhoto {
  id: number;
  url: string;
  alt: string;
}
interface ArtisanReply {
  text: string;
  date: string;
}
interface Review {
  id: number;
  touristName: string;
  touristInitials: string;
  touristColor: string;
  country: string;
  countryFlag: string;
  rating: number;
  text: string;
  photos: ReviewPhoto[];
  date: string;
  edited: boolean;
  workshopName?: string;
  artisanReply?: ArtisanReply;
  helpful: number;
  isOwn?: boolean;
}
interface ReviewSectionProps {
  context: 'workshop' | 'artisan';
  artisanName?: string;
  workshopName?: string;
}
// ── Mock Data ──────────────────────────────────────────────────
const MOCK_REVIEWS: Review[] = [
{
  id: 1,
  touristName: 'Arjun Mehta',
  touristInitials: 'AM',
  touristColor: '#C1440E',
  country: 'India',
  countryFlag: '🇮🇳',
  rating: 5,
  text: "An absolutely transformative experience. Nimal's patience and depth of knowledge made this workshop unforgettable. I came in knowing nothing about lacquerwork and left with a beautiful piece I made myself. The cultural context he shared made it so much richer than just a craft class.",
  photos: [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop',
    alt: 'Workshop photo 1'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=200&auto=format&fit=crop',
    alt: 'Workshop photo 2'
  }],

  date: 'Feb 15, 2025',
  edited: false,
  workshopName: 'Kandyan Lacquerwork Session',
  artisanReply: {
    text: 'Thank you so much, Arjun! It was a pleasure sharing this ancient craft with you. Your enthusiasm made the session truly special. I hope to see you again on your next visit to Kandy! 🙏',
    date: 'Feb 16, 2025'
  },
  helpful: 12,
  isOwn: true
},
{
  id: 2,
  touristName: 'Sofia Reyes',
  touristInitials: 'SR',
  touristColor: '#2F5D50',
  country: 'Spain',
  countryFlag: '🇪🇸',
  rating: 5,
  text: "I've attended craft workshops in Japan and Morocco, and this was on par with the very best. The studio is beautiful, the materials are authentic, and Nimal is a true master. The 3-hour session flew by. Highly recommend booking in advance as slots fill up fast.",
  photos: [
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=200&auto=format&fit=crop',
    alt: 'Workshop photo 3'
  }],

  date: 'Jan 28, 2025',
  edited: true,
  workshopName: 'Kandyan Lacquerwork Session',
  helpful: 8
},
{
  id: 3,
  touristName: 'Kenji Tanaka',
  touristInitials: 'KT',
  touristColor: '#C9A227',
  country: 'Japan',
  countryFlag: '🇯🇵',
  rating: 4,
  text: 'Very good workshop overall. The technique is fascinating and Nimal explains each step clearly. I would have loved a bit more time to practice before the final piece. The studio location is a bit hard to find — bring the address on your phone. Still, a wonderful cultural experience.',
  photos: [],
  date: 'Jan 10, 2025',
  edited: false,
  workshopName: 'Kandyan Lacquerwork Session',
  helpful: 5
},
{
  id: 4,
  touristName: 'Priya Nair',
  touristInitials: 'PN',
  touristColor: '#1A6B6B',
  country: 'United Kingdom',
  countryFlag: '🇬🇧',
  rating: 5,
  text: "Came here as part of a cultural tour and it was the highlight of my entire Sri Lanka trip. The lacquerwork tradition is incredible and Nimal's family has been doing this for generations. I bought two pieces to take home as well. Cannot recommend highly enough.",
  photos: [
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&auto=format&fit=crop',
    alt: 'Workshop photo 4'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&auto=format&fit=crop',
    alt: 'Workshop photo 5'
  }],

  date: 'Dec 22, 2024',
  edited: false,
  workshopName: 'Kandyan Lacquerwork Session',
  helpful: 15
}];

const RATING_DISTRIBUTION = [
{
  stars: 5,
  count: 89,
  pct: 72
},
{
  stars: 4,
  count: 24,
  pct: 19
},
{
  stars: 3,
  count: 7,
  pct: 6
},
{
  stars: 2,
  count: 2,
  pct: 2
},
{
  stars: 1,
  count: 2,
  pct: 1
}];

const OVERALL_RATING = 4.8;
const TOTAL_REVIEWS = 124;
// ── Star Display ───────────────────────────────────────────────
function StarDisplay({
  rating,
  size = 'md'



}: {rating: number;size?: 'sm' | 'md' | 'lg';}) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
      <StarIcon
        key={s}
        className={`${sizes[size]} transition-colors`}
        style={{
          color: s <= rating ? '#C9A227' : '#E5E7EB',
          fill: s <= rating ? '#C9A227' : '#E5E7EB'
        }} />

      )}
    </div>);

}
// ── Interactive Star Selector ──────────────────────────────────
function StarSelector({
  value,
  onChange



}: {value: number;onChange: (v: number) => void;}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) =>
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        onMouseEnter={() => setHovered(s)}
        onMouseLeave={() => setHovered(0)}
        className="transition-transform hover:scale-110 active:scale-95">

          <StarIcon
          className="w-7 h-7 transition-colors"
          style={{
            color: s <= (hovered || value) ? '#C9A227' : '#D1D5DB',
            fill: s <= (hovered || value) ? '#C9A227' : '#D1D5DB'
          }} />

        </button>
      )}
      {value > 0 &&
      <span className="ml-2 text-sm font-semibold text-gray-600">
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
        </span>
      }
    </div>);

}
// ── AI Summary Card ────────────────────────────────────────────
function AISummaryCard({ loading = false }: {loading?: boolean;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4
      }}
      className="relative rounded-2xl overflow-hidden border border-forest/20 bg-gradient-to-br from-forest/5 via-white to-mustard/5 p-6">

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="ai-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse">

              <circle cx="10" cy="10" r="1.5" fill="#2F5D50" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ai-pattern)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center">
            <BotIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-forest font-display">
              AI Summary of Visitor Feedback
            </h3>
            <p className="text-xs text-gray-400">
              Generated from {TOTAL_REVIEWS} reviews
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-forest/10 text-forest">
            <SparklesIcon className="w-3 h-3" /> AI Powered
          </span>
        </div>

        {loading ?
        <div className="space-y-2.5">
            {[100, 90, 75].map((w, i) =>
          <div
            key={i}
            className="h-3 bg-gray-200 rounded-full animate-pulse"
            style={{
              width: `${w}%`
            }} />

          )}
          </div> :

        <p className="text-sm text-gray-600 leading-relaxed">
            Visitors consistently praise{' '}
            <strong className="text-forest">
              Nimal's deep cultural knowledge
            </strong>{' '}
            and patient teaching style. The hands-on experience of creating a
            personal lacquer piece is highlighted as the standout element.
            Reviewers from India, Europe, and East Asia all note the{' '}
            <strong className="text-forest">
              authenticity and heritage value
            </strong>{' '}
            of the workshop. Minor suggestions include clearer location
            directions and slightly longer practice time. Overall sentiment is
            overwhelmingly positive, with 91% of reviewers rating the experience
            4 stars or above.
          </p>
        }
      </div>
    </motion.div>);

}
// ── Add Review Form ────────────────────────────────────────────
function AddReviewForm({
  onSubmit


}: {onSubmit: (r: Partial<Review>) => void;}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls].slice(0, 4));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !text.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmit({
        rating,
        text,
        photos: photos.map((url, i) => ({
          id: i,
          url,
          alt: `Photo ${i + 1}`
        }))
      });
    }, 1000);
  };
  if (submitted) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">

        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckIcon className="w-6 h-6 text-green-600" />
        </div>
        <h4 className="font-bold text-green-800 font-display mb-1">
          Review Submitted!
        </h4>
        <p className="text-sm text-green-600">
          Thank you for sharing your experience. Your review helps other
          travelers.
        </p>
      </motion.div>);

  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-forest font-display mb-1">
        Share Your Experience
      </h3>
      <p className="text-sm text-gray-400 mb-5">
        Help other travelers by reviewing this workshop
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Your Rating
          </label>
          <StarSelector value={rating} onChange={setRating} />
          {rating === 0 &&
          <p className="text-xs text-gray-400 mt-1">Click to rate</p>
          }
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Describe your experience — what did you learn, what stood out, would you recommend it?"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none text-sm resize-none transition-shadow" />

          <p className="text-xs text-gray-400 mt-1 text-right">
            {text.length}/500
          </p>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Add Photos (optional)
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {photos.map((url, i) =>
            <div
              key={i}
              className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">

                <img
                src={url}
                alt={`Upload ${i + 1}`}
                className="w-full h-full object-cover" />

                <button
                type="button"
                onClick={() =>
                setPhotos((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center">

                  <XIcon className="w-2.5 h-2.5 text-white" />
                </button>
              </div>
            )}
            {photos.length < 4 &&
            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-mustard transition-colors">
                <CameraIcon className="w-5 h-5 text-gray-300" />
                <span className="text-xs text-gray-300 mt-0.5">Add</span>
                <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload} />

              </label>
            }
          </div>
        </div>

        <button
          type="submit"
          disabled={rating === 0 || !text.trim() || isSubmitting}
          className="w-full py-3 rounded-xl font-bold text-sm text-forest flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#C9A227'
          }}>

          {isSubmitting ?
          <>
              <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none">

                <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4" />

                <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />

              </svg>
              Submitting...
            </> :

          <>
              <SendIcon className="w-4 h-4" /> Submit Review
            </>
          }
        </button>
      </form>
    </div>);

}
// ── Single Review Card ─────────────────────────────────────────
function ReviewCard({
  review,
  onEdit,
  onDelete,
  onReply,
  showWorkshop






}: {review: Review;onEdit: (id: number) => void;onDelete: (id: number) => void;onReply: (id: number, text: string) => void;showWorkshop: boolean;}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [helpful, setHelpful] = useState(review.helpful);
  const [markedHelpful, setMarkedHelpful] = useState(false);
  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(review.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{
              backgroundColor: review.touristColor
            }}>

            {review.touristInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">
                {review.touristName}
              </span>
              <span className="text-sm">{review.countryFlag}</span>
              <span className="text-xs text-gray-400">{review.country}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarDisplay rating={review.rating} size="sm" />
              <span className="text-xs text-gray-400">{review.date}</span>
              {review.edited &&
              <span className="text-xs text-gray-400 italic">(edited)</span>
              }
            </div>
          </div>
        </div>

        {/* Own review actions */}
        {review.isOwn &&
        <div className="flex items-center gap-1 shrink-0">
            <button
            onClick={() => onEdit(review.id)}
            className="p-1.5 text-gray-400 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
            title="Edit review">

              <EditIcon className="w-3.5 h-3.5" />
            </button>
            <button
            onClick={() => onDelete(review.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete review">

              <Trash2Icon className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      </div>

      {/* Workshop label (for artisan profile view) */}
      {showWorkshop && review.workshopName &&
      <div className="mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest/8 text-forest border border-forest/15">
            📍 {review.workshopName}
          </span>
        </div>
      }

      {/* Review text */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {review.text}
      </p>

      {/* Photos */}
      {review.photos.length > 0 &&
      <div className="flex gap-2 mb-4 flex-wrap">
          {review.photos.map((photo) =>
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.alt}
          className="w-20 h-20 rounded-xl object-cover border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity" />

        )}
        </div>
      }

      {/* Helpful */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
        <button
          onClick={() => {
            if (!markedHelpful) {
              setHelpful((h) => h + 1);
              setMarkedHelpful(true);
            }
          }}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${markedHelpful ? 'text-forest' : 'text-gray-400 hover:text-forest'}`}>

          <ThumbsUpIcon
            className={`w-3.5 h-3.5 ${markedHelpful ? 'fill-forest' : ''}`} />

          Helpful ({helpful})
        </button>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-forest transition-colors ml-auto">

          <MessageCircleIcon className="w-3.5 h-3.5" />
          {review.artisanReply ? 'View Reply' : 'Reply as Artisan'}
        </button>
      </div>

      {/* Artisan Reply */}
      {review.artisanReply &&
      <div className="mt-4 ml-4 pl-4 border-l-2 border-forest/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-forest flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-xs font-bold text-forest">Artisan Reply</span>
            <span className="text-xs text-gray-400">
              {review.artisanReply.date}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {review.artisanReply.text}
          </p>
        </div>
      }

      {/* Reply Form */}
      <AnimatePresence>
        {showReplyForm && !review.artisanReply &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="mt-4 overflow-hidden">

            <div className="ml-4 pl-4 border-l-2 border-forest/20">
              <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              placeholder="Write a reply as the artisan..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest/20 outline-none text-sm resize-none" />

              <div className="flex gap-2 mt-2">
                <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-forest text-white rounded-lg text-xs font-bold disabled:opacity-40 transition-colors hover:bg-forest-dark">

                  Post Reply
                </button>
                <button
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">

                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}
// ── Main ReviewSection ─────────────────────────────────────────
export function ReviewSection({
  context,
  artisanName,
  workshopName
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [aiLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>(
    'newest'
  );
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return b.id - a.id;
  });
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };
  const handleEdit = (id: number) => {
    alert('Edit functionality: opens edit form for review ' + id);
  };
  const handleReply = (id: number, text: string) => {
    setReviews((prev) =>
    prev.map((r) =>
    r.id === id ?
    {
      ...r,
      artisanReply: {
        text,
        date: 'Just now'
      }
    } :
    r
    )
    );
  };
  const handleNewReview = (partial: Partial<Review>) => {
    const newReview: Review = {
      id: Date.now(),
      touristName: 'You',
      touristInitials: 'YO',
      touristColor: '#C1440E',
      country: 'Your Country',
      countryFlag: '🌍',
      rating: partial.rating || 5,
      text: partial.text || '',
      photos: partial.photos || [],
      date: 'Just now',
      edited: false,
      workshopName: workshopName || 'Workshop',
      helpful: 0,
      isOwn: true
    };
    setReviews((prev) => [newReview, ...prev]);
  };
  const sectionTitle =
  context === 'artisan' ?
  `Reviews for ${artisanName || 'this Artisan'}` :
  'Workshop Reviews';
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-3xl font-bold text-forest mb-2 font-display">
          {sectionTitle}
        </h2>
        <p className="text-gray-500 text-sm">
          {context === 'artisan' ?
          'Aggregated feedback from all workshops' :
          'Honest reviews from past participants'}
        </p>
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Big Number */}
          <div className="flex flex-col items-center justify-center text-center shrink-0 md:w-40">
            <span className="text-6xl font-black text-forest font-display">
              {OVERALL_RATING}
            </span>
            <StarDisplay rating={Math.round(OVERALL_RATING)} size="lg" />
            <p className="text-sm text-gray-400 mt-2">
              {TOTAL_REVIEWS} reviews
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-100" />

          {/* Rating Bars */}
          <div className="flex-1 space-y-2.5">
            {RATING_DISTRIBUTION.map(({ stars, count, pct }) =>
            <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 shrink-0">
                  <span className="text-xs font-bold text-gray-600">
                    {stars}
                  </span>
                  <StarIcon className="w-3 h-3 text-mustard fill-mustard" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                  initial={{
                    width: 0
                  }}
                  animate={{
                    width: `${pct}%`
                  }}
                  transition={{
                    duration: 0.8,
                    delay: (5 - stars) * 0.1,
                    ease: 'easeOut'
                  }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                    stars >= 4 ?
                    '#2F5D50' :
                    stars === 3 ?
                    '#C9A227' :
                    '#C65D3B'
                  }} />

                </div>
                <span className="text-xs text-gray-400 w-8 text-right shrink-0">
                  {count}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <AISummaryCard loading={aiLoading} />

      {/* Add Review */}
      <AddReviewForm onSubmit={handleNewReview} />

      {/* Reviews List */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-forest font-display">
            All Reviews{' '}
            <span className="text-gray-400 font-normal text-base">
              ({reviews.length})
            </span>
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-mustard bg-white text-gray-600">

            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        <div className="space-y-4">
          {sortedReviews.map((review, i) =>
          <motion.div
            key={review.id}
            initial={{
              opacity: 0,
              y: 16
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: i * 0.06
            }}>

              <ReviewCard
              review={review}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReply={handleReply}
              showWorkshop={context === 'artisan'} />

            </motion.div>
          )}
        </div>
      </div>
    </section>);

}