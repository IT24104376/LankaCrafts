import React, { useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  FilterIcon,
  StarIcon,
  EyeIcon,
  EyeOffIcon,
  Trash2Icon,
  AlertTriangleIcon,
  RotateCcwIcon,
  XIcon,
  FlagIcon,
  BarChart3Icon,
  ChevronDownIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  UserIcon,
  BuildingIcon,
  ShieldAlertIcon } from
'lucide-react';
import { motion as m } from 'framer-motion';
type ReviewStatus = 'active' | 'hidden' | 'flagged' | 'removed';
interface AdminReview {
  id: string;
  touristName: string;
  touristInitials: string;
  touristColor: string;
  artisanName: string;
  workshopName: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  datePosted: string;
  flagReason?: string;
  reportCount: number;
}
const MOCK_REVIEWS: AdminReview[] = [
{
  id: 'REV-001',
  touristName: 'Arjun Mehta',
  touristInitials: 'AM',
  touristColor: '#C1440E',
  artisanName: 'Nimal Perera',
  workshopName: 'Kandyan Lacquerwork Session',
  rating: 5,
  text: "An absolutely transformative experience. Nimal's patience and depth of knowledge made this workshop unforgettable.",
  status: 'active',
  datePosted: '2025-02-15',
  reportCount: 0
},
{
  id: 'REV-002',
  touristName: 'Sofia Reyes',
  touristInitials: 'SR',
  touristColor: '#2F5D50',
  artisanName: 'Kamala Wijesinghe',
  workshopName: 'Batik Textile Workshop',
  rating: 5,
  text: "I've attended craft workshops in Japan and Morocco, and this was on par with the very best.",
  status: 'active',
  datePosted: '2025-01-28',
  reportCount: 0
},
{
  id: 'REV-003',
  touristName: 'Kenji Tanaka',
  touristInitials: 'KT',
  touristColor: '#C9A227',
  artisanName: 'Suresh Fernando',
  workshopName: 'Mask Carving Workshop',
  rating: 2,
  text: 'This workshop was a complete waste of money. The artisan was rude and the materials were cheap. DO NOT BOOK!!!',
  status: 'flagged',
  datePosted: '2025-01-10',
  flagReason: 'Potentially abusive language',
  reportCount: 3
},
{
  id: 'REV-004',
  touristName: 'Priya Nair',
  touristInitials: 'PN',
  touristColor: '#1A6B6B',
  artisanName: 'Priya Rajapaksa',
  workshopName: 'Palmyra Weaving Class',
  rating: 5,
  text: 'Came here as part of a cultural tour and it was the highlight of my entire Sri Lanka trip.',
  status: 'active',
  datePosted: '2024-12-22',
  reportCount: 0
},
{
  id: 'REV-005',
  touristName: 'Marcus Weber',
  touristInitials: 'MW',
  touristColor: '#6366f1',
  artisanName: 'Rohan De Silva',
  workshopName: 'Clay & Wheel Pottery',
  rating: 1,
  text: 'Spam content promoting external website. Visit my-craft-shop.com for better deals!!!',
  status: 'removed',
  datePosted: '2024-12-10',
  flagReason: 'Spam / promotional content',
  reportCount: 7
},
{
  id: 'REV-006',
  touristName: 'Yuki Tanaka',
  touristInitials: 'YT',
  touristColor: '#C65D3B',
  artisanName: 'Anura Dissanayake',
  workshopName: 'Brasswork Masterclass',
  rating: 3,
  text: 'Average experience. The workshop was okay but nothing special. Could be improved.',
  status: 'hidden',
  datePosted: '2024-11-30',
  reportCount: 1
},
{
  id: 'REV-007',
  touristName: 'Emma Thompson',
  touristInitials: 'ET',
  touristColor: '#2F5D50',
  artisanName: 'Nimal Perera',
  workshopName: 'Kandyan Lacquerwork Session',
  rating: 4,
  text: 'Very good workshop overall. The technique is fascinating and Nimal explains each step clearly.',
  status: 'active',
  datePosted: '2024-11-15',
  reportCount: 0
},
{
  id: 'REV-008',
  touristName: 'Carlos Mendez',
  touristInitials: 'CM',
  touristColor: '#C9A227',
  artisanName: 'Kamala Wijesinghe',
  workshopName: 'Batik Textile Workshop',
  rating: 5,
  text: 'Kamala is a true master. Her batik patterns are incredible and she shares the cultural history behind each design.',
  status: 'flagged',
  datePosted: '2024-10-20',
  flagReason: 'Reported by artisan',
  reportCount: 2
}];

const STATUS_CONFIG: Record<
  ReviewStatus,
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
  }> =
{
  active: {
    label: 'Active',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500'
  },
  hidden: {
    label: 'Hidden',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400'
  },
  flagged: {
    label: 'Flagged',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400'
  },
  removed: {
    label: 'Removed',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500'
  }
};
function StarDisplay({ rating }: {rating: number;}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
      <StarIcon
        key={s}
        className="w-3 h-3"
        style={{
          color: s <= rating ? '#C9A227' : '#E5E7EB',
          fill: s <= rating ? '#C9A227' : '#E5E7EB'
        }} />

      )}
    </div>);

}
// ── Analytics Widgets ──────────────────────────────────────────
function AnalyticsWidgets({ reviews }: {reviews: AdminReview[];}) {
  const totalActive = reviews.filter((r) => r.status === 'active').length;
  const avgRating = (
  reviews.
  filter((r) => r.status === 'active').
  reduce((s, r) => s + r.rating, 0) / totalActive || 0).
  toFixed(1);
  const workshopCounts: Record<string, number> = {};
  reviews.forEach((r) => {
    workshopCounts[r.workshopName] = (workshopCounts[r.workshopName] || 0) + 1;
  });
  const mostReviewed =
  Object.entries(workshopCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const touristCounts: Record<string, number> = {};
  reviews.forEach((r) => {
    touristCounts[r.touristName] = (touristCounts[r.touristName] || 0) + 1;
  });
  const mostActive =
  Object.entries(touristCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const widgets = [
  {
    label: 'Total Reviews',
    value: reviews.length.toString(),
    icon: <MessageCircleIcon className="w-5 h-5" />,
    color: '#2F5D50',
    bg: 'bg-forest/10'
  },
  {
    label: 'Avg Platform Rating',
    value: avgRating,
    icon: <StarIcon className="w-5 h-5" />,
    color: '#C9A227',
    bg: 'bg-mustard/10'
  },
  {
    label: 'Most Reviewed Workshop',
    value: mostReviewed.split(' ').slice(0, 2).join(' ') + '...',
    icon: <BuildingIcon className="w-5 h-5" />,
    color: '#C65D3B',
    bg: 'bg-terracotta/10'
  },
  {
    label: 'Most Active Reviewer',
    value: mostActive,
    icon: <UserIcon className="w-5 h-5" />,
    color: '#6366f1',
    bg: 'bg-indigo-50'
  }];

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
    pct:
    Math.round(
      reviews.filter((r) => r.rating === s).length / reviews.length * 100
    ) || 0
  }));
  return (
    <div className="space-y-4 mb-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {widgets.map((w, i) =>
        <motion.div
          key={w.label}
          initial={{
            opacity: 0,
            y: 12
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: i * 0.06
          }}
          className="bg-white rounded-2xl border border-gray-200 p-4 relative overflow-hidden">

            <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{
              backgroundColor: w.color
            }} />

            <div
            className={`w-9 h-9 ${w.bg} rounded-xl flex items-center justify-center mb-3`}
            style={{
              color: w.color
            }}>

              {w.icon}
            </div>
            <p className="text-2xl font-black text-gray-900 font-display leading-none mb-1">
              {w.value}
            </p>
            <p className="text-xs text-gray-400">{w.label}</p>
          </motion.div>
        )}
      </div>

      {/* Rating Distribution Chart */}
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
          delay: 0.3
        }}
        className="bg-white rounded-2xl border border-gray-200 p-5">

        <div className="flex items-center gap-2 mb-4">
          <BarChart3Icon className="w-4 h-4 text-forest" />
          <h3 className="font-bold text-gray-900 text-sm font-display">
            Rating Distribution Across Platform
          </h3>
        </div>
        <div className="flex items-end gap-3 h-24">
          {ratingDist.map(({ stars, count, pct }) =>
          <div
            key={stars}
            className="flex-1 flex flex-col items-center gap-1">

              <span className="text-xs font-bold text-gray-500">{count}</span>
              <motion.div
              initial={{
                height: 0
              }}
              animate={{
                height: `${Math.max(pct, 4)}%`
              }}
              transition={{
                duration: 0.7,
                delay: (5 - stars) * 0.08,
                ease: 'easeOut'
              }}
              className="w-full rounded-t-lg min-h-[4px]"
              style={{
                backgroundColor:
                stars >= 4 ?
                '#2F5D50' :
                stars === 3 ?
                '#C9A227' :
                '#C65D3B',
                height: `${Math.max(pct, 4)}%`
              }} />

              <div className="flex items-center gap-0.5">
                <span className="text-xs text-gray-400">{stars}</span>
                <StarIcon className="w-2.5 h-2.5 text-mustard fill-mustard" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>);

}
// ── Full Review Modal ──────────────────────────────────────────
function ReviewModal({
  review,
  onClose,
  onAction




}: {review: AdminReview;onClose: () => void;onAction: (id: string, action: 'hide' | 'remove' | 'restore' | 'spam') => void;}) {
  return (
    <>
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose} />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }}
        transition={{
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.stopPropagation()}>

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
          {/* Header */}
          <div className="bg-forest px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white font-display">
                Review Details
              </h2>
              <p className="text-white/60 text-xs mt-0.5">{review.id}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">

              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Tourist + Rating */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{
                  backgroundColor: review.touristColor
                }}>

                {review.touristInitials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {review.touristName}
                </p>
                <StarDisplay rating={review.rating} />
              </div>
              <span
                className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[review.status].bg} ${STATUS_CONFIG[review.status].text}`}>

                <span
                  className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[review.status].dot}`} />

                {STATUS_CONFIG[review.status].label}
              </span>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Artisan</p>
                <p className="text-sm font-semibold text-gray-800">
                  {review.artisanName}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Workshop</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {review.workshopName}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Date Posted</p>
                <p className="text-sm font-semibold text-gray-800">
                  {review.datePosted}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Reports</p>
                <p className="text-sm font-semibold text-gray-800">
                  {review.reportCount} reports
                </p>
              </div>
            </div>

            {/* Review Text */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                "{review.text}"
              </p>
            </div>

            {/* Flag Reason */}
            {review.flagReason &&
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertTriangleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-700">
                    Flag Reason
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {review.flagReason}
                  </p>
                </div>
              </div>
            }

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {review.status !== 'hidden' && review.status !== 'removed' &&
              <button
                onClick={() => {
                  onAction(review.id, 'hide');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">

                  <EyeOffIcon className="w-3.5 h-3.5" /> Hide
                </button>
              }
              {(review.status === 'hidden' || review.status === 'removed') &&
              <button
                onClick={() => {
                  onAction(review.id, 'restore');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors">

                  <RotateCcwIcon className="w-3.5 h-3.5" /> Restore
                </button>
              }
              <button
                onClick={() => {
                  onAction(review.id, 'spam');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors">

                <FlagIcon className="w-3.5 h-3.5" /> Mark as Spam
              </button>
              {review.status !== 'removed' &&
              <button
                onClick={() => {
                  onAction(review.id, 'remove');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors ml-auto">

                  <Trash2Icon className="w-3.5 h-3.5" /> Remove
                </button>
              }
            </div>
          </div>
        </div>
      </motion.div>
    </>);

}
// ── Main Component ─────────────────────────────────────────────
export function ReviewMonitoring() {
  const [reviews, setReviews] = useState<AdminReview[]>(MOCK_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [workshopFilter, setWorkshopFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>(
    'newest'
  );
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [showWorkshopDropdown, setShowWorkshopDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'flagged'>('all');
  const workshops = [
  'all',
  ...Array.from(new Set(reviews.map((r) => r.workshopName)))];

  const filtered = reviews.
  filter((r) => {
    const matchSearch =
    r.touristName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.workshopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
    statusFilter === 'all' ? true : r.status === statusFilter;
    const matchRating =
    ratingFilter === 'all' ? true : r.rating === ratingFilter;
    const matchWorkshop =
    workshopFilter === 'all' ? true : r.workshopName === workshopFilter;
    const matchTab = activeTab === 'flagged' ? r.status === 'flagged' : true;
    return (
      matchSearch && matchStatus && matchRating && matchWorkshop && matchTab);

  }).
  sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return b.id.localeCompare(a.id);
  });
  const handleAction = (
  id: string,
  action: 'hide' | 'remove' | 'restore' | 'spam') =>
  {
    setReviews((prev) =>
    prev.map((r) => {
      if (r.id !== id) return r;
      if (action === 'hide')
      return {
        ...r,
        status: 'hidden' as ReviewStatus
      };
      if (action === 'remove')
      return {
        ...r,
        status: 'removed' as ReviewStatus
      };
      if (action === 'restore')
      return {
        ...r,
        status: 'active' as ReviewStatus
      };
      if (action === 'spam')
      return {
        ...r,
        status: 'flagged' as ReviewStatus,
        flagReason: 'Marked as spam by admin'
      };
      return r;
    })
    );
  };
  const counts = {
    all: reviews.length,
    active: reviews.filter((r) => r.status === 'active').length,
    hidden: reviews.filter((r) => r.status === 'hidden').length,
    flagged: reviews.filter((r) => r.status === 'flagged').length,
    removed: reviews.filter((r) => r.status === 'removed').length
  };
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 font-display mb-1">
          Review Monitoring
        </h1>
        <p className="text-gray-500 text-sm">
          Moderate, manage, and analyze platform reviews
        </p>
      </div>

      {/* Analytics */}
      <AnalyticsWidgets reviews={reviews} />

      {/* Tab: All / Flagged */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'all' ? 'bg-forest text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-forest/30'}`}>

          All Reviews
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>

            {counts.all}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('flagged')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'flagged' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-300'}`}>

          <ShieldAlertIcon className="w-3.5 h-3.5" />
          Flagged Reviews
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'flagged' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-600'}`}>

            {counts.flagged}
          </span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      {activeTab === 'all' &&
      <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', 'active', 'hidden', 'flagged', 'removed'] as const).map(
          (status) =>
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize flex items-center gap-1.5 ${statusFilter === status ? 'bg-forest text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-forest/30'}`}>

                {status !== 'all' &&
            <span
              className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[status as ReviewStatus].dot}`} />

            }
                {status === 'all' ?
            'All' :
            STATUS_CONFIG[status as ReviewStatus].label}
                <span
              className={`text-[10px] px-1 py-0.5 rounded-full font-bold ${statusFilter === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>

                  {status === 'all' ?
              counts.all :
              counts[status as keyof typeof counts]}
                </span>
              </button>

        )}
        </div>
      }

      {/* Search & Filters */}
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

        {/* Rating Filter */}
        <select
          value={ratingFilter}
          onChange={(e) =>
          setRatingFilter(
            e.target.value === 'all' ? 'all' : parseInt(e.target.value)
          )
          }
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40">

          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) =>
          <option key={r} value={r}>
              {r} Star{r !== 1 ? 's' : ''}
            </option>
          )}
        </select>

        {/* Workshop Filter */}
        <div className="relative">
          <button
            onClick={() => setShowWorkshopDropdown(!showWorkshopDropdown)}
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-forest/30 transition-all whitespace-nowrap">

            <FilterIcon className="w-4 h-4" />
            {workshopFilter === 'all' ?
            'All Workshops' :
            workshopFilter.split(' ').slice(0, 2).join(' ') + '...'}
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          {showWorkshopDropdown &&
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[200px] py-1 max-h-48 overflow-y-auto">
              {workshops.map((w) =>
            <button
              key={w}
              onClick={() => {
                setWorkshopFilter(w);
                setShowWorkshopDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors truncate ${workshopFilter === w ? 'text-forest font-semibold' : 'text-gray-600'}`}>

                  {w === 'all' ? 'All Workshops' : w}
                </button>
            )}
            </div>
          }
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:ring-2 focus:ring-forest/20">

          <option value="newest">Newest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Review ID
                </th>
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
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden xl:table-cell">
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
              {filtered.map((review, i) => {
                const statusCfg = STATUS_CONFIG[review.status];
                return (
                  <motion.tr
                    key={review.id}
                    initial={{
                      opacity: 0,
                      y: 6
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      delay: i * 0.03
                    }}
                    className={`hover:bg-gray-50/50 transition-colors ${review.status === 'flagged' ? 'bg-amber-50/30' : ''}`}>

                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {review.id}
                      </span>
                    </td>
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
                    <td className="px-5 py-3.5 hidden xl:table-cell">
                      <p className="text-xs text-gray-400 max-w-[180px] truncate">
                        {review.text}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>

                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />

                        {statusCfg.label}
                      </span>
                      {review.reportCount > 0 &&
                      <span className="ml-1 text-xs text-amber-600 font-bold">
                          ⚑ {review.reportCount}
                        </span>
                      }
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-xs text-gray-400">
                      {review.datePosted}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="p-1.5 text-gray-400 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                          title="View full review">

                          <EyeIcon className="w-3.5 h-3.5" />
                        </button>
                        {review.status !== 'hidden' &&
                        review.status !== 'removed' &&
                        <button
                          onClick={() => handleAction(review.id, 'hide')}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Hide review">

                              <EyeOffIcon className="w-3.5 h-3.5" />
                            </button>
                        }
                        {(review.status === 'hidden' ||
                        review.status === 'removed') &&
                        <button
                          onClick={() => handleAction(review.id, 'restore')}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Restore review">

                            <RotateCcwIcon className="w-3.5 h-3.5" />
                          </button>
                        }
                        <button
                          onClick={() => handleAction(review.id, 'spam')}
                          className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Mark as spam">

                          <FlagIcon className="w-3.5 h-3.5" />
                        </button>
                        {review.status !== 'removed' &&
                        <button
                          onClick={() => handleAction(review.id, 'remove')}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove review">

                            <Trash2Icon className="w-3.5 h-3.5" />
                          </button>
                        }
                      </div>
                    </td>
                  </motion.tr>);

              })}
            </tbody>
          </table>
          {filtered.length === 0 &&
          <div className="text-center py-16 text-gray-400">
              <MessageCircleIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-sm">
                No reviews match your filters
              </p>
            </div>
          }
        </div>
      </div>

      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview &&
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onAction={handleAction} />

        }
      </AnimatePresence>
    </div>);

}