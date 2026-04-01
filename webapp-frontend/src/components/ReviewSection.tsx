import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SendIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { reviewApi, type Review } from '../services/reviewApi';
import { aiApi, type AiReviewSummary } from '../services/aiApi';
import { session } from '../services/session';
import { Modal } from './ui/Modal';
import { SummaryBlurb } from './SummaryBlurb';
interface ReviewSectionProps {
  context: 'workshop' | 'artisan';
  artisanName?: string;
  workshopName?: string;
}
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon
          key={s}
          className="w-4 h-4"
          style={{ color: s <= rating ? '#C9A227' : '#E5E7EB', fill: s <= rating ? '#C9A227' : '#E5E7EB' }}
        />
      ))}
    </div>
  );
}

export function ReviewSection({
  context,
  artisanName,
  workshopName
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [overallRating, setOverallRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiSummary, setAiSummary] = useState<AiReviewSummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [viewer, setViewer] = useState(() => session.get());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  /** When the API is offline: rating-based overview only (does not paste review text). */
  const buildFallbackSummary = (items: Review[], subjectName: string) => {
    if (!items.length) return 'Summary will appear once reviews are available.';
    const n = items.length;
    const avg = items.reduce((sum, r) => sum + r.rating, 0) / n;
    const name = subjectName.trim() || 'This artisan';
    const hi = items.filter((r) => r.rating >= 4).length;
    const lo = items.filter((r) => r.rating <= 2).length;
    const mid = n - hi - lo;
    let tone: string;
    if (n === 1) {
      tone =
        avg >= 4 ? 'The only review so far leans positive.'
        : avg <= 2 ? 'The only review so far is largely critical.'
        : 'The only review so far is mixed.';
    } else if (hi > lo && hi > mid) {
      tone = 'Most ratings are on the high side; guests often sound pleased.';
    } else if (lo > hi && lo > mid) {
      tone = 'Lower ratings are common enough that friction points deserve a closer look.';
    } else {
      tone = 'Ratings and tone vary from guest to guest.';
    }
    const narrative =
      `${name} has ${n} review${n === 1 ? '' : 's'}. Averaged together, scores sit near ${avg.toFixed(1)} out of 5. ${tone} See the list below for each person’s exact words.`;
    const foot =
      n === 1 ?
        `— ${n} review, ${avg.toFixed(1)}/5 average`
      : `— ${n} reviews, ${avg.toFixed(1)}/5 average`;
    return `${narrative}\n\n${foot}`;
  };

  const params = useMemo(
    () => ({
      context,
      artisanName: artisanName || '',
      workshopName: workshopName || '',
      sortBy
    }),
    [context, artisanName, workshopName, sortBy]
  );

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reviewApi.getReviews(params);
      setReviews(data.reviews.filter((item) => item.status !== 'hidden' && item.status !== 'removed'));
      setOverallRating(data.stats.overallRating);
      setTotalReviews(data.stats.totalReviews);

      const visible = data.reviews.filter((item) => item.status !== 'hidden' && item.status !== 'removed');
      if (visible.length > 0) {
        setAiLoading(true);
        setAiError('');
        const label =
          context === 'artisan' ? (artisanName || 'Unknown Artisan') : (workshopName || 'Unknown Workshop');
        try {
          const s = await aiApi.summarizeArtistReviews({
            artisanName: label,
            reviews: visible.map((r) => ({ rating: r.rating, text: r.text }))
          });
          setAiSummary(s);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'AI summary unavailable.';
          setAiError(message);
          setAiSummary({
            artisanName: label,
            summary: buildFallbackSummary(visible, label)
          });
        } finally {
          setAiLoading(false);
        }
      } else {
        setAiSummary(null);
        setAiError('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setViewer(session.get());
    loadReviews();
  }, [params]);

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.');
      return;
    }
    if (!text.trim()) {
      setError('Please enter your review text.');
      return;
    }
    if (text.trim().length < 3) {
      setError('Review text must be at least 3 characters.');
      return;
    }
    const current = session.get();
    if (!current) {
      setError('Please log in first to submit a review.');
      setShowLoginModal(true);
      return;
    }
    if (current.role !== 'tourist') {
      setError('Only tourist accounts can submit reviews. Please sign in as a tourist.');
      return;
    }
    try {
      await reviewApi.createReview({
        artisanName: artisanName || 'Unknown Artisan',
        workshopName: workshopName || 'Unknown Workshop',
        rating: Number(rating),
        text: text.trim(),
        photos: []
      });
      setRating(0);
      setText('');
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    }
  };

  const handleDelete = async (id: string) => {
    await reviewApi.deleteReview(id);
    await loadReviews();
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading reviews...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-forest mb-2 font-display">
          {context === 'artisan' ? `Reviews for ${artisanName || 'this Artisan'}` : 'Workshop Reviews'}
        </h2>
        <p className="text-gray-500 text-sm">
          {overallRating.toFixed(1)} avg from {totalReviews} reviews
        </p>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="bg-offwhite border border-gray-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Review summary
        </p>
        {aiLoading ?
        <p className="text-sm text-gray-500">Summarizing reviews…</p> :
        aiSummary?.summary ?
          <SummaryBlurb text={aiSummary.summary} note={aiSummary.providerNote} />
        : <p className="text-sm text-gray-700">Summary will appear once reviews are available.</p>
        }
        {aiError &&
        <p className="text-xs text-amber-700 mt-2">
            Live AI unavailable: {aiError}
          </p>
        }
      </div>

      <form onSubmit={handleCreateReview} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button" onClick={() => setRating(s)}>
              <StarIcon
                className="w-6 h-6"
                style={{ color: s <= rating ? '#C9A227' : '#E5E7EB', fill: s <= rating ? '#C9A227' : '#E5E7EB' }}
              />
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your workshop experience"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
        />
        <button
          type="submit"
          disabled={!rating || !text.trim() || !viewer || viewer.role !== 'tourist'}
          className="px-4 py-2 rounded-lg bg-mustard text-forest font-semibold flex items-center gap-2 disabled:opacity-40"
        >
          <SendIcon className="w-4 h-4" /> Submit review
        </button>
        {viewer && viewer.role !== 'tourist' && (
        <p className="text-xs text-amber-700">
            Logged in as <span className="font-semibold">{viewer.role}</span>. Switch to a tourist account to post reviews.
          </p>
        )}
      </form>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-forest font-display">All Reviews ({reviews.length})</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: review.touristColor }}>
                  {review.touristInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {review.touristName} {review.countryFlag}
                  </p>
                  <StarDisplay rating={review.rating} />
                </div>
              </div>
              {review.isOwn && (
                <button onClick={() => setDeleteReviewId(review.id)} className="text-red-500">
                  <Trash2Icon className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600">{review.text}</p>
            {review.artisanReply && (
              <div className="mt-3 pl-3 border-l-2 border-forest/20 text-sm text-gray-600">{review.artisanReply.text}</div>
            )}
          </motion.div>
        ))}
      </div>

      <Modal
        open={showLoginModal}
        title="Login Required"
        onClose={() => setShowLoginModal(false)}
        onConfirm={() => {
          setShowLoginModal(false);
          window.location.href = '/login';
        }}
        confirmText="Go to Login"
      >
        You need to log in before posting a review.
      </Modal>

      <Modal
        open={!!deleteReviewId}
        title="Delete Review"
        onClose={() => setDeleteReviewId(null)}
        onConfirm={async () => {
          if (!deleteReviewId) return;
          await handleDelete(deleteReviewId);
          setDeleteReviewId(null);
        }}
        confirmText="Delete"
      >
        Delete this review?
      </Modal>
    </section>
  );
}