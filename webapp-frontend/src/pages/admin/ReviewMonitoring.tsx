import React, { useEffect, useState } from 'react';
import { EyeOffIcon, FlagIcon, RotateCcwIcon, SearchIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { reviewApi, type Review, type ReviewStatus } from '../../services/reviewApi';
import { Modal } from '../../components/ui/Modal';

const STATUS_CONFIG: Record<ReviewStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  hidden: { label: 'Hidden', bg: 'bg-gray-100', text: 'text-gray-600' },
  flagged: { label: 'Flagged', bg: 'bg-amber-50', text: 'text-amber-700' },
  removed: { label: 'Removed', bg: 'bg-red-50', text: 'text-red-700' }
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} className="w-3 h-3" style={{ color: s <= rating ? '#C9A227' : '#E5E7EB', fill: s <= rating ? '#C9A227' : '#E5E7EB' }} />
      ))}
    </div>
  );
}
export function ReviewMonitoring() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [workshops, setWorkshops] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [workshopFilter, setWorkshopFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await reviewApi.getAdminReviews({
        search: searchQuery,
        status: statusFilter,
        rating: ratingFilter === 'all' ? 'all' : String(ratingFilter),
        workshop: workshopFilter,
        sortBy
      });
      setReviews(response.reviews);
      setWorkshops(response.workshops);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter, ratingFilter, workshopFilter, sortBy]);

  const handleAction = async (id: string, action: 'hide' | 'remove' | 'restore' | 'spam') => {
    await reviewApi.moderate(id, action);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await reviewApi.deleteReview(id);
    await loadData();
  };

  const counts = {
    all: reviews.length,
    active: reviews.filter((item) => item.status === 'active').length,
    hidden: reviews.filter((item) => item.status === 'hidden').length,
    flagged: reviews.filter((item) => item.status === 'flagged').length,
    removed: reviews.filter((item) => item.status === 'removed').length
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 font-display mb-1">
          Review Monitoring
        </h1>
        <p className="text-gray-500 text-sm">
          Moderate, manage, and analyze platform reviews
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-48 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tourist, artisan, workshop, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40 transition-all" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | ReviewStatus)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600"
        >
          <option value="all">All Status</option>
          <option value="active">Active ({counts.active})</option>
          <option value="hidden">Hidden ({counts.hidden})</option>
          <option value="flagged">Flagged ({counts.flagged})</option>
          <option value="removed">Removed ({counts.removed})</option>
        </select>
        <select
          value={ratingFilter}
          onChange={(e) =>
          setRatingFilter(
            e.target.value === 'all' ? 'all' : parseInt(e.target.value)
          )
          }
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40">

          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r !== 1 ? 's' : ''}
            </option>
          ))}
        </select>
        <select
          value={workshopFilter}
          onChange={(e) => setWorkshopFilter(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600"
        >
          {workshops.map((name) => (
            <option key={name} value={name}>
              {name === 'all' ? 'All Workshops' : name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:ring-2 focus:ring-forest/20">

          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tourist
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Artisan
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Workshop
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Preview
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((review) => {
                const statusCfg = STATUS_CONFIG[review.status];
                return (
                  <tr key={review.id} className={`hover:bg-gray-50/50 transition-colors ${review.status === 'flagged' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: review.touristColor
                          }}>

                          {review.touristInitials}
                        </div>
                        <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                          {review.touristName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                      {review.artisanName}
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 max-w-[140px] truncate block">
                        {review.workshopName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <StarDisplay rating={review.rating} />
                        <span className="text-xs font-bold text-gray-600">
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-gray-400 max-w-[280px] truncate">
                        {review.text}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}
                      >
                        {statusCfg.label}
                      </span>
                      {review.reportCount > 0 && (
                      <span className="ml-1 text-xs text-amber-600 font-bold">
                          ⚑ {review.reportCount}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-xs text-gray-400">
                      {new Date(review.datePosted).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {review.status !== 'hidden' && review.status !== 'removed' && (
                        <button
                          onClick={() => handleAction(review.id, 'hide')}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Hide review">
                              <EyeOffIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                        {(review.status === 'hidden' || review.status === 'removed') && (
                        <button
                          onClick={() => handleAction(review.id, 'restore')}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Restore review">
                            <RotateCcwIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(review.id, 'spam')}
                          className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Mark as spam">
                          <FlagIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteReviewId(review.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete permanently">
                          <Trash2Icon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && reviews.length === 0 &&
          <div className="text-center py-16 text-gray-400">
              <p className="font-medium text-sm">
                No reviews match your filters
              </p>
            </div>
          }
        </div>
      </div>
      <Modal
        open={!!deleteReviewId}
        title="Delete Review Permanently"
        onClose={() => setDeleteReviewId(null)}
        onConfirm={async () => {
          if (!deleteReviewId) return;
          await handleDelete(deleteReviewId);
          setDeleteReviewId(null);
        }}
        confirmText="Delete"
      >
        Permanently delete this review? This cannot be undone.
      </Modal>
    </div>
  );
}