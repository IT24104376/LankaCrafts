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
import { getBlogs, likeBlog, createBlog } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ── Tab → sort param mapping ───────────────────────────────────
const TABS = ['All', 'Most Recent', 'Most Liked', 'By Workshop'] as const;
type Tab = typeof TABS[number];

const TAB_SORT: Record<Tab, string> = {
  'All': 'recent',
  'Most Recent': 'recent',
  'Most Liked': 'liked',
  'By Workshop': 'workshop',
};

const TRENDING_TAGS = [
  '#Batik', '#Pottery', '#Kandy', '#WoodCarving',
  '#SriLanka', '#Weaving', '#Masks', '#Lacquer', '#Cooking',
];

// ── API Blog shape ─────────────────────────────────────────────
interface BlogAuthor {
  _id: string;
  fullName: string;
  country: string;
  initials: string;
  profilePicUrl?: string;
}

interface ApiBlog {
  _id: string;
  title: string;
  content: string;
  workshopTag: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | '';
  author: BlogAuthor;
  likes: string[];     // array of tourist ObjectId strings
  likeCount: number;   // virtual from backend
  status: 'published' | 'draft';
  createdAt: string;
}

// // ── Fallback image for blogs without media ────────────────────
// const FALLBACK_IMAGES = [
//   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=500&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=500&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop',
//   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop',
// ];

// function getFallbackImage(id: string) {
//   const charSum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
//   return FALLBACK_IMAGES[charSum % FALLBACK_IMAGES.length];
// }

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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  // ── Fetch blogs ───────────────────────────────────────────────
  const fetchBlogs = useCallback(async (page: number, tab: Tab) => {
    setLoading(true);
    setError('');
    try {
      const sort = TAB_SORT[tab];
      const res = await getBlogs(page, sort);
      const fetchedBlogs = res.data.blogs ?? [];

      setBlogs(fetchedBlogs);
      setTotalPages(res.data.pagination?.pages ?? 1);

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
    fetchBlogs(currentPage, activeTab);
  }, [currentPage, activeTab, fetchBlogs]);

  // ── Tab change ────────────────────────────────────────────────
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
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
      if (uploadedFile) fd.append('media', uploadedFile);

      await createBlog(fd);

      // Reset form and refresh
      setNewPost({ title: '', workshop: '', content: '' });
      setUploadedFile(null);
      setUploadError('');
      setShowModal(false);
      fetchBlogs(1, activeTab);
      setCurrentPage(1);
    } catch (err: unknown) {
      setSubmitError('Failed to publish. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) {
      setUploadError('File exceeds 30MB limit.');
      setUploadedFile(null);
      return;
    }
    setUploadError('');
    setUploadedFile(file);
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
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onMouseEnter={() => setHoveredTag(tag)}
                      onMouseLeave={() => setHoveredTag(null)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium font-body border transition-all duration-150"
                      style={{
                        backgroundColor: hoveredTag === tag ? '#C1440E' : '#FAF6F0',
                        color: hoveredTag === tag ? 'white' : '#1E1E1E',
                        borderColor: hoveredTag === tag ? '#C1440E' : '#E5E7EB',
                      }}>
                      {tag}
                    </button>
                  ))}
                </div>
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
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
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

                {/* Media upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                    Add Media
                    <span className="text-gray-400 font-normal ml-1">(images or videos, up to 30MB)</span>
                  </label>
                  <label
                    htmlFor="media-upload"
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${uploadedFile ? 'border-[#1A6B6B] bg-[#E8F4F4]' : 'border-gray-200 hover:border-[#C1440E]/40'
                      }`}>
                    <input
                      id="media-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                      className="hidden"
                      onChange={handleFileChange} />
                    <UploadCloudIcon className={`w-8 h-8 ${uploadedFile ? 'text-[#1A6B6B]' : 'text-gray-300'}`} />
                    {uploadedFile ? (
                      <p className="text-sm font-semibold font-body" style={{ color: '#1A6B6B' }}>✓ {uploadedFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-400 font-body">
                          Drop a file here or{' '}
                          <span className="font-semibold" style={{ color: '#C1440E' }}>browse</span>
                        </p>
                        <p className="text-xs text-gray-300 font-body">JPG, PNG, GIF, MP4, MOV, WEBM — max 30MB</p>
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
    </div>
  );
}

// ── Blog Card ─────────────────────────────────────────────────
interface BlogCardProps {
  post: ApiBlog;
  liked: boolean;
  likeDelta: number;
  onLike: () => void;
  delay: number;
}

function BlogCard({ post, liked, likeDelta, onLike, delay }: BlogCardProps) {
  const imgSrc = post.mediaUrl || '';
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

      {post.mediaType === 'video' && post.mediaUrl ? (
        <video
          src={post.mediaUrl}
          className="w-full h-52 object-cover"
          muted
          playsInline
          onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
          onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause()}
        />
      ) : (
        <img src={imgSrc} alt={post.title} className="w-full h-52 object-cover" />
      )}

      <div className="p-4">
        {post.workshopTag && (
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full font-body mb-2"
            style={{ backgroundColor: '#E8F4F4', color: '#1A6B6B' }}>
            {post.workshopTag}
          </span>
        )}

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
          <a href="#" className="text-xs font-semibold font-body" style={{ color: '#1A6B6B' }}>
            Read More →
          </a>
        </div>
      </div>
    </motion.div>
  );
}