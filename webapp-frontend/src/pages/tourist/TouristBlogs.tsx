import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  PenLineIcon,
  XIcon,
  UploadCloudIcon,
  TrendingUpIcon,
  AwardIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { TouristNavbar } from './TouristNavbar';
import { getBlogs, likeBlog, createBlog, getBlog } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { TRENDING_TAGS } from '../../constants/touristConstants'

// ── Tab → sort param mapping ───────────────────────────────────
const TABS = ['All', 'Most Recent', 'Most Liked', 'By Workshop'] as const;
type Tab = typeof TABS[number];

const TAB_SORT: Record<Tab, string> = {
  'All': 'recent',
  'Most Recent': 'recent',
  'Most Liked': 'liked',
  'By Workshop': 'workshop',
};

// ── API Blog shape ─────────────────────────────────────────────
interface BlogAuthor {
  _id: string;
  fullName: string;
  country: string;
  initials: string;
  profilePicUrl?: string;
}

interface MediaItem {
  _id?: string;
  url: string;
  publicId: string;
  mediaType: 'image' | 'video';
  order: number;
}

interface ApiBlog {
  _id: string;
  title: string;
  content: string;
  workshopTag: string;
  media: MediaItem[];
  hashtags: string[];
  author: BlogAuthor;
  likes: string[];
  likeCount: number;
  status: 'published' | 'draft';
  createdAt: string;
}

// Resolve primary media item for card thumbnails — media[] only
function getPrimaryMedia(post: ApiBlog): { url: string; type: 'image' | 'video' | '' } {
  if (post.media && post.media.length > 0) {
    const first = [...post.media].sort((a, b) => a.order - b.order)[0];
    return { url: first.url, type: first.mediaType };
  }
  return { url: '', type: '' };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Country flag helper (simple map) ───────────────────────────
const COUNTRY_FLAGS: Record<string, string> = {
  India: '🇮🇳', 'United Kingdom': '🇬🇧', UK: '🇬🇧', USA: '🇺🇸',
  France: '🇫🇷', Germany: '🇩🇪', Japan: '🇯🇵', Australia: '🇦🇺',
  Canada: '🇨🇦', Italy: '🇮🇹', Spain: '🇪🇸', Brazil: '🇧🇷',
  'Sri Lanka': '🇱🇰',
};
function getFlag(country: string) { return COUNTRY_FLAGS[country] ?? '🌍'; }

// ── Skeleton Card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export function TouristBlogs() {
  const { tourist } = useAuth();

  // ── Data state ────────────────────────────────────────────────
  const [blogs, setBlogs] = useState<ApiBlog[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── UI state ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Track which blog IDs the current user already liked (optimistic UI)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  // Track optimistic like count deltas
  const [likeDeltas, setLikeDeltas] = useState<Record<string, number>>({});

  // ── Create-post modal state ───────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', workshop: '', content: '' });
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const TOTAL_LIMIT = 40 * 1024 * 1024; // 40 MB — matches backend

  // ── Hashtag sidebar filter ───────────────────────────────────
  const [activeHashtagFilter, setActiveHashtagFilter] = useState<string | null>(null);

  // ── Read-post modal state ───────────────────────────────────
  const [readModal, setReadModal] = useState(false);
  const [readBlog, setReadBlog] = useState<ApiBlog | null>(null);
  const [readLoading, setReadLoading] = useState(false);
  const [readError, setReadError] = useState('');

  // ── Fetch blogs ───────────────────────────────────────────────
  const fetchBlogs = useCallback(async (page: number, tab: Tab, hashtagFilter?: string | null) => {
    setLoading(true);
    setError('');
    try {
      let sort = TAB_SORT[tab];
      let tag: string | undefined;
      if (hashtagFilter) {
        sort = 'hashtag';
        tag = hashtagFilter;
      } else {
        sort = TAB_SORT[tab];
      }

      const res = await getBlogs(page, sort, tag);
      const fetchedBlogs = res.data.blogs ?? [];

      setBlogs(fetchedBlogs);
      setTotalPages(res.data.pagination?.pages ?? 1);
      setLikeDeltas({});

      if (tourist && tourist.id) {
        const alreadyLikedByMe = new Set<string>();

        fetchedBlogs.forEach((blog: ApiBlog) => {
          if (blog.likes && blog.likes.includes(tourist.id)) {
            alreadyLikedByMe.add(blog._id);
          }
        });

        setLikedIds(alreadyLikedByMe);
      }


    } catch (err: unknown) {
      setError('Failed to load blog posts. Please try again.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [tourist]);

  useEffect(() => {
    fetchBlogs(currentPage, activeTab, activeHashtagFilter);
  }, [currentPage, activeTab, activeHashtagFilter, fetchBlogs]);

  // ── Tab change ────────────────────────────────────────────────
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setActiveHashtagFilter(null); // clear hashtag filter when switching tabs
  };

  const handleHashtagFilter = (tag: string) => {
    // Toggle: clicking the same tag again clears it
    const next = activeHashtagFilter === tag ? null : tag;
    setActiveHashtagFilter(next);
    setCurrentPage(1);
    setActiveTab('All'); // reset the tab indicator
  };

  // ── Read blog ─────────────────────────────────────────────────
  const handleReadMore = async (id: string) => {
    setReadModal(true);
    setReadLoading(true);
    setReadError('');
    setReadBlog(null);

    try {
      const res = await getBlog(id);
      setReadBlog(res.data.blog || res.data);
      setLikeDeltas((prev) => ({ ...prev, [id]: 0 }));
    } catch (err: unknown) {
      setReadError('Failed to load blog details. Please try again.');
    } finally {
      setReadLoading(false);
    }
  };

  // ── Like toggle (optimistic) ──────────────────────────────────
  const handleLike = async (blog: ApiBlog) => {
    if (!tourist) setError('You must Logged in first'); // must be logged in
    const id = blog._id;
    const alreadyLiked = likedIds.has(id);

    // Optimistic update
    setLikedIds((prev) => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(id) : next.add(id);
      return next;
    });
    setLikeDeltas((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + (alreadyLiked ? -1 : 1),
    }));

    try {
      await likeBlog(id);
    } catch {
      // Revert on error
      setLikedIds((prev) => {
        const next = new Set(prev);
        alreadyLiked ? next.add(id) : next.delete(id);
        return next;
      });
      setLikeDeltas((prev) => ({
        ...prev,
        [id]: (prev[id] ?? 0) + (alreadyLiked ? 1 : -1),
      }));
    }
  };

  // ── Create blog ───────────────────────────────────────────────
  const handlePublish = async (status: 'published' | 'draft') => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setSubmitError('Title and story content are required.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const fd = new FormData();
      fd.append('title', newPost.title.trim());
      fd.append('content', newPost.content.trim());
      fd.append('workshopTag', newPost.workshop);
      fd.append('status', status);
      // Send hashtags as JSON string to safely pass an empty array or multiple
      fd.append('hashtags', JSON.stringify(selectedHashtags));
      // Append each file under the same field name 'media'
      uploadedFiles.forEach((f) => fd.append('media', f));

      await createBlog(fd);

      // Reset form and refresh
      setNewPost({ title: '', workshop: '', content: '' });
      setSelectedHashtags([]);
      setUploadedFiles([]);
      setUploadError('');
      setShowModal(false);
      fetchBlogs(1, activeTab, activeHashtagFilter);
      setCurrentPage(1);
    } catch (err: unknown) {
      setSubmitError('Failed to publish. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const next = [...uploadedFiles, ...selected];
    const totalSize = next.reduce((s, f) => s + f.size, 0);

    if (totalSize > TOTAL_LIMIT) {
      setUploadError(`Total size exceeds 40 MB limit. Current: ${(totalSize / 1024 / 1024).toFixed(1)} MB.`);
      return;
    }
    setUploadError('');
    setUploadedFiles(next);
    // Reset input so the same file can be re-added if removed
    e.target.value = '';
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadError('');
  };

  // ── Derive top contributors from loaded blogs ─────────────────
  const topContributors = (() => {
    const counts: Record<string, { name: string; country: string; initials: string; profilePicUrl: string; posts: number }> = {};
    blogs.forEach((b) => {
      if (!b.author) return;
      const key = b.author._id;
      if (!counts[key]) {
        counts[key] = { name: b.author.fullName, country: b.author.country, initials: b.author.initials, profilePicUrl: b.author.profilePicUrl ?? '', posts: 0 };
      }
      counts[key].posts += 1;
    });
    return Object.values(counts).sort((a, b) => b.posts - a.posts).slice(0, 3);
  })();

  // ── Masonry layout ────────────────────────────────────────────
  const leftCol = blogs.filter((_, i) => i % 2 === 0);
  const rightCol = blogs.filter((_, i) => i % 2 !== 0);

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#FAF6F0' }}>
      <TouristNavbar activeTab="blogs" />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Top Bar */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-[#1E1E1E]">Cultural Stories</h1>
              <p className="text-gray-400 font-body mt-1 text-sm">Shared by our community of explorers</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm font-body shadow-md"
              style={{ backgroundColor: '#C1440E' }}>
              <PenLineIcon className="w-4 h-4" />
              Share Your Experience
            </motion.button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium font-body transition-colors duration-150 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-[#1E1E1E]'
                  }`}>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: '#C1440E' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-body">
              <AlertCircleIcon className="w-4 h-4 shrink-0" />
              {error}
              <button className="ml-auto font-semibold underline" onClick={() => fetchBlogs(currentPage, activeTab)}>
                Retry
              </button>
            </div>
          )}

          {/* Main Layout */}
          <div className="flex gap-6 items-start">
            {/* Masonry Grid */}
            <div className="flex-1 flex flex-col gap-6">
              {loading ? (
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-4">
                    {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                  </div>
                  <div className="flex-1 space-y-4 mt-6">
                    {[4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                  </div>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-body">
                  <p className="text-lg font-semibold mb-1">No posts yet</p>
                  <p className="text-sm">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-4">
                    {leftCol.map((post, i) => (
                      <BlogCard
                        key={post._id}
                        post={post}
                        liked={likedIds.has(post._id)}
                        likeDelta={likeDeltas[post._id] ?? 0}
                        onLike={() => handleLike(post)}
                        onReadMore={() => handleReadMore(post._id)}
                        delay={i * 0.1} />
                    ))}
                  </div>
                  <div className="flex-1 space-y-4 mt-6">
                    {rightCol.map((post, i) => (
                      <BlogCard
                        key={post._id}
                        post={post}
                        liked={likedIds.has(post._id)}
                        likeDelta={likeDeltas[post._id] ?? 0}
                        onLike={() => handleLike(post)}
                        onReadMore={() => handleReadMore(post._id)}
                        delay={i * 0.06 + 0.03} />
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && blogs.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#C1440E] hover:text-[#C1440E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold font-body transition-colors border ${currentPage === page
                        ? 'text-white border-[#C1440E]'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#C1440E] hover:text-[#C1440E]'
                        }`}
                      style={currentPage === page ? { backgroundColor: '#C1440E' } : {}}>
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#C1440E] hover:text-[#C1440E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>

                  <span className="text-xs text-gray-400 font-body ml-2">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="hidden xl:block w-72 shrink-0 space-y-4 sticky top-24">
              {/* Trending Topics */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUpIcon className="w-4 h-4" style={{ color: '#C1440E' }} />
                  <h3 className="text-sm font-bold text-[#1E1E1E] font-body">Trending Topics</h3>
                  {activeHashtagFilter && (
                    <button
                      onClick={() => handleHashtagFilter(activeHashtagFilter)}
                      className="ml-auto text-xs text-gray-400 hover:text-red-500 font-body underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) => {
                    const isActive = activeHashtagFilter === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => handleHashtagFilter(tag)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium font-body border transition-all duration-150"
                        style={{
                          backgroundColor: isActive ? '#C1440E' : '#FAF6F0',
                          color: isActive ? 'white' : '#1E1E1E',
                          borderColor: isActive ? '#C1440E' : '#E5E7EB',
                          boxShadow: isActive ? '0 2px 8px rgba(193,68,14,0.3)' : 'none',
                          fontWeight: isActive ? 700 : 500,
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {activeHashtagFilter && (
                  <p className="text-xs text-gray-400 font-body mt-3">
                    Showing posts tagged <span className="font-semibold text-[#C1440E]">{activeHashtagFilter}</span>
                  </p>
                )}
              </div>

              {/* Top Contributors — derived from loaded blogs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AwardIcon className="w-4 h-4" style={{ color: '#1A6B6B' }} />
                  <h3 className="text-sm font-bold text-[#1E1E1E] font-body">Top Contributors</h3>
                  <span className="text-xs text-gray-400 font-body ml-auto">This page</span>
                </div>
                <div className="space-y-3">
                  {topContributors.length === 0 ? (
                    <p className="text-xs text-gray-400 font-body">No data yet</p>
                  ) : (
                    topContributors.map(({ name, country, initials, profilePicUrl, posts }, idx) => (
                      <div key={name} className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold font-body shrink-0 overflow-hidden"
                          style={{ backgroundColor: idx === 0 ? '#C1440E' : '#1A6B6B' }}>
                          {profilePicUrl ? (
                            <img src={profilePicUrl} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            initials || name.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1E1E1E] font-body truncate">
                            {name} {getFlag(country)}
                          </p>
                          <p className="text-xs text-gray-400 font-body">{posts} post{posts !== 1 ? 's' : ''}</p>
                        </div>
                        {idx === 0 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white font-body" style={{ backgroundColor: '#1A6B6B' }}>
                            #1
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── Create Post Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-16 overflow-y-auto"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative">

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <XIcon className="w-4 h-4 text-gray-500" />
              </button>

              <h2 className="text-2xl font-display font-bold text-[#1E1E1E] mb-1">Share Your Experience</h2>
              <p className="text-sm text-gray-400 font-body mb-6">Inspire others with your cultural journey</p>

              {submitError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-body flex items-center gap-2">
                  <AlertCircleIcon className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Blog Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Give your story a title..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                </div>

                {/* Workshop */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Workshop Tag</label>
                  <select
                    value={newPost.workshop}
                    onChange={(e) => setNewPost({ ...newPost, workshop: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body bg-white">
                    <option value="">Select a workshop (optional)</option>
                    <option>Batik Workshop — Kandy</option>
                    <option>Pottery Class — Kelaniya</option>
                    <option>Wood Carving — Ambalangoda</option>
                    <option>Weaving — Jaffna</option>
                    <option>Lacquer Work — Kandy</option>
                    <option>Drumming — Kandy</option>
                    <option>Cooking — Colombo</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Your Story</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Describe your experience..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body resize-none" />
                </div>

                {/* Hashtag picker */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                    Hashtags
                    <span className="text-gray-400 font-normal ml-1">(tap to select)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_TAGS.map((tag) => {
                      const active = selectedHashtags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setSelectedHashtags((prev) =>
                              active ? prev.filter((t) => t !== tag) : [...prev, tag]
                            )
                          }
                          className="px-3 py-1.5 rounded-full text-xs font-medium font-body border transition-all duration-150"
                          style={{
                            backgroundColor: active ? '#C1440E' : '#FAF6F0',
                            color: active ? 'white' : '#1E1E1E',
                            borderColor: active ? '#C1440E' : '#E5E7EB',
                            fontWeight: active ? 700 : 500,
                            boxShadow: active ? '0 2px 8px rgba(193,68,14,0.25)' : 'none',
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  {selectedHashtags.length > 0 && (
                    <p className="text-xs text-gray-400 font-body mt-2">
                      Selected: {selectedHashtags.join(' ')}
                    </p>
                  )}
                </div>

                {/* Media upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                    Add Media
                    <span className="text-gray-400 font-normal ml-1">(up to 10 files, 40 MB total)</span>
                  </label>

                  {/* Staged file previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          {f.type.startsWith('video/') ? (
                            <video src={URL.createObjectURL(f)} className="w-full h-full object-cover" muted playsInline />
                          ) : (
                            <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(i)}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                          >
                            <XIcon className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label
                    htmlFor="media-upload"
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${uploadedFiles.length > 0 ? 'border-[#1A6B6B] bg-[#E8F4F4]' : 'border-gray-200 hover:border-[#C1440E]/40'
                      }`}>
                    <input
                      id="media-upload"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                      className="hidden"
                      onChange={handleFileChange} />
                    <UploadCloudIcon className={`w-8 h-8 ${uploadedFiles.length > 0 ? 'text-[#1A6B6B]' : 'text-gray-300'}`} />
                    {uploadedFiles.length > 0 ? (
                      <p className="text-sm font-semibold font-body" style={{ color: '#1A6B6B' }}>
                        {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} selected —
                        {' '}{(uploadedFiles.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1)} MB
                        <span className="font-normal text-gray-400 ml-1">(click to add more)</span>
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-400 font-body">
                          Drop files here or{' '}
                          <span className="font-semibold" style={{ color: '#C1440E' }}>browse</span>
                        </p>
                        <p className="text-xs text-gray-300 font-body">JPG, PNG, GIF, MP4, MOV, WEBM — 40 MB total, up to 10 files</p>
                      </>
                    )}
                  </label>
                  {uploadError && <p className="text-xs text-red-500 mt-1.5 font-body">{uploadError}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 font-body hover:bg-gray-50 transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handlePublish('draft')}
                    className="flex-1 py-3 rounded-xl border text-sm font-semibold font-body transition-colors disabled:opacity-50"
                    style={{ borderColor: '#1A6B6B', color: '#1A6B6B' }}
                    onMouseEnter={(e) => {
                      if (!submitting) {
                        e.currentTarget.style.backgroundColor = '#1A6B6B';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#1A6B6B';
                    }}>
                    Save as Draft
                  </button>
                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    disabled={submitting}
                    onClick={() => handlePublish('published')}
                    className="flex-1 py-3 rounded-xl text-white text-sm font-semibold font-body disabled:opacity-60"
                    style={{ backgroundColor: '#C1440E' }}>
                    {submitting ? 'Publishing…' : 'Publish Story'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Read Post Modal ── */}
      <AnimatePresence>
        {readModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-16 overflow-y-auto"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => e.target === e.currentTarget && setReadModal(false)}>

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative mt-10 mb-20 flex flex-col max-h-[85vh]">

              <button
                onClick={() => setReadModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10">
                <XIcon className="w-4 h-4 text-gray-500" />
              </button>

              {readLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
              ) : readError ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <AlertCircleIcon className="w-12 h-12 text-red-400" />
                  <p className="text-red-500 font-body">{readError}</p>
                </div>
              ) : readBlog ? (
                <div className="overflow-y-auto pr-2 custom-scrollbar">
                  {/* ── Horizontal media carousel (media[] only) ── */}
                  {readBlog.media && readBlog.media.length > 0 && (() => {
                    const items = [...readBlog.media].sort((a, b) => a.order - b.order);
                    return (
                      <MediaCarousel items={items} />
                    );
                  })()}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {readBlog.workshopTag && (
                      <span
                        className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full font-body"
                        style={{ backgroundColor: '#E8F4F4', color: '#1A6B6B' }}>
                        {readBlog.workshopTag}
                      </span>
                    )}
                    {readBlog.hashtags?.map(tag => (
                      <span
                        key={tag}
                        className="inline-block text-xs font-medium px-3 py-1.5 rounded-full font-body"
                        style={{ backgroundColor: '#FAF6F0', color: '#1E1E1E', border: '1px solid #E5E7EB' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl font-display font-bold text-[#1E1E1E] mb-4">{readBlog.title}</h2>

                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold font-body shrink-0 overflow-hidden"
                      style={{ backgroundColor: '#C1440E' }}>
                      {readBlog.author?.profilePicUrl ? (
                        <img src={readBlog.author.profilePicUrl} alt={readBlog.author.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{readBlog.author?.initials || readBlog.author?.fullName?.charAt(0) || 'A'}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E] font-body">
                        {readBlog.author?.fullName || 'Anonymous'} {getFlag(readBlog.author?.country || '')}
                      </p>
                      <p className="text-xs text-gray-400 font-body">{formatDate(readBlog.createdAt)}</p>
                    </div>

                    <button
                      onClick={() => handleLike(readBlog)}
                      className="ml-auto flex items-center gap-2 text-sm font-body font-medium transition-colors"
                      style={{ color: likedIds.has(readBlog._id) ? '#E11D48' : '#9CA3AF' }}
                    >
                      <HeartIcon className="w-5 h-5" fill={likedIds.has(readBlog._id) ? '#E11D48' : 'none'} />
                      {(readBlog.likeCount ?? readBlog.likes?.length ?? 0) + (likeDeltas[readBlog._id] ?? 0)} Likes
                    </button>
                  </div>

                  <div className="prose prose-sm font-body text-gray-700 max-w-none leading-relaxed whitespace-pre-wrap">
                    {readBlog.content}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

//----------------------------------------------------
//  Media Carousel (horizontal scroll + dot indicator) 
//----------------------------------------------------

function MediaCarousel({ items }: { items: MediaItem[] }) {
  const [active, setActive] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const scrollTo = (idx: number) => {
    setActive(idx);
    const el = trackRef.current;
    if (el) el.scrollLeft = idx * el.clientWidth;
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(idx);
  };

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Scroll track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto rounded-2xl"
        style={{
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="shrink-0 w-full h-96 flex justify-center items-center bg-white rounded-2xl overflow-hidden"
            style={{ scrollSnapAlign: 'center' }}
          >
            {item.mediaType === 'video' ? (
              <video
                src={item.url}
                className="w-auto h-full object-cover rounded-2xl"
                controls
                autoPlay={idx === active}
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={item.url}
                alt={`media ${idx + 1}`}
                className="w-auto h-full object-cover rounded-2xl"
              />
            )}
          </div>
        ))}
      </div>

      {/* Dot indicators - only shown when there are multiple items */}
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className="rounded-full transition-all duration-200"
              style={{
                width: active === idx ? 20 : 8,
                height: 8,
                backgroundColor: active === idx ? '#C1440E' : '#D1D5DB',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------
//  Blog Card       
// ---------------------------------
interface BlogCardProps {
  post: ApiBlog;
  liked: boolean;
  likeDelta: number;
  onLike: () => void;
  onReadMore: () => void;
  delay: number;
}

function BlogCard({ post, liked, likeDelta, onLike, onReadMore, delay }: BlogCardProps) {
  const { url: primaryUrl, type: primaryType } = getPrimaryMedia(post);
  const mediaCount = post.media?.length ?? (primaryUrl ? 1 : 0);
  const displayLikes = (post.likeCount ?? post.likes?.length ?? 0) + likeDelta;
  const authorName = post.author?.fullName ?? 'Anonymous';
  const authorFlag = getFlag(post.author?.country ?? '');
  const authorInitials = post.author?.initials ?? authorName.charAt(0);
  const authorProfilePic = post.author?.profilePicUrl ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <div className="relative">
        {primaryType === 'video' && primaryUrl ? (
          <video
            src={primaryUrl}
            className="w-full h-52 object-cover"
            muted
            playsInline
            autoPlay
            loop
          />
        ) : (
          <img src={primaryUrl} alt={post.title} className="w-full h-52 object-cover" />
        )}
        {mediaCount > 1 && (
          <span className="absolute top-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full font-body">
            +{mediaCount - 1} more
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {post.workshopTag && (
            <span
              className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full font-body"
              style={{ backgroundColor: '#E8F4F4', color: '#1A6B6B' }}>
              {post.workshopTag}
            </span>
          )}
          {post.hashtags?.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full font-body border"
              style={{ backgroundColor: '#FAF6F0', color: '#1E1E1E', borderColor: '#E5E7EB' }}>
              {tag}
            </span>
          ))}
          {(post.hashtags?.length || 0) > 3 && (
            <span className="text-[10px] text-gray-400 font-body py-0.5">
              +{post.hashtags!.length - 3}
            </span>
          )}
        </div>

        <h3 className="font-display font-bold text-[#1E1E1E] text-base leading-snug mb-1.5">{post.title}</h3>

        {/* Content excerpt */}
        <p className="text-xs text-gray-500 font-body leading-relaxed mb-3 line-clamp-2">{post.content}</p>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold font-body shrink-0 overflow-hidden"
            style={{ backgroundColor: '#C1440E' }}>
            {authorProfilePic ? (
              <img src={authorProfilePic} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <span>{authorInitials}</span>
            )}
          </div>
          <span className="text-xs font-medium text-[#1E1E1E] font-body">{authorName}</span>
          <span className="text-sm">{authorFlag}</span>
          <span className="text-xs text-gray-400 font-body ml-auto">{formatDate(post.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 text-xs font-body transition-colors"
            style={{ color: liked ? '#E11D48' : '#9CA3AF' }}>
            <HeartIcon className="w-4 h-4" fill={liked ? '#E11D48' : 'none'} />
            {displayLikes}
          </button>
          <button onClick={onReadMore}
            className="text-xs font-semibold font-body px-3 py-1.5 rounded-full transition-all duration-150 hover:shadow-md"
            style={{ backgroundColor: '#1A6B6B', color: 'white' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#145858'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1A6B6B'; }}
          >
            Read More →
          </button>
        </div>
      </div>
    </motion.div>
  );
}