import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  PenLineIcon,
  XIcon,
  UploadCloudIcon,
  TrendingUpIcon,
  AwardIcon,
  UserIcon,
  ChevronRightIcon,
  ChevronLeftIcon } from
'lucide-react';
import { TouristNavbar } from './TouristNavbar';
const TABS = ['All', 'Most Recent', 'Most Liked', 'By Workshop'];
const BLOG_POSTS = [
{
  id: 1,
  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop',
  imgHeight: 'h-56',
  workshopTag: '🎨 Batik Workshop — Kandy',
  title: 'How Batik Changed the Way I See Colour',
  excerpt:
  'Standing in the workshop, surrounded by the smell of hot wax and vibrant dyes, I realised that art is not just made – it is felt.',
  author: 'Arjun T.',
  country: '🇮🇳',
  date: 'Feb 28',
  likes: 84
},
{
  id: 2,
  img: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=500&auto=format&fit=crop',
  imgHeight: 'h-40',
  workshopTag: '⚱️ Pottery Class — Kelaniya',
  title: 'Clay, Wheel, and a Quiet Mind',
  excerpt:
  'The pottery wheel spun slowly as Master Rohan guided my hands. There is a meditative quality to shaping clay.',
  author: 'Sophie M.',
  country: '🇫🇷',
  date: 'Feb 22',
  likes: 61
},
{
  id: 3,
  img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=500&auto=format&fit=crop',
  imgHeight: 'h-64',
  workshopTag: '🪵 Wood Carving — Ambalangoda',
  title: 'The Masks of Ambalangoda: A Living Tradition',
  excerpt:
  'Each mask carved here carries centuries of ritual meaning. Suresh showed me how every chisel stroke is a prayer.',
  author: 'Kenji T.',
  country: '🇯🇵',
  date: 'Feb 18',
  likes: 102
},
{
  id: 4,
  img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop',
  imgHeight: 'h-44',
  workshopTag: '🧵 Weaving — Jaffna',
  title: 'Threads of the North: Jaffna Weaving',
  excerpt:
  'The loom clattered rhythmically as Priya demonstrated patterns passed down through generations of her family.',
  author: 'Emma L.',
  country: '🇬🇧',
  date: 'Feb 10',
  likes: 55
},
{
  id: 5,
  img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&auto=format&fit=crop',
  imgHeight: 'h-52',
  workshopTag: '✨ Lacquer Work — Kandy',
  title: 'Gold and Lacquer: The Kandyan Craft',
  excerpt:
  "Nimal Perera's workshop gleamed with finished pieces. Learning to apply lacquer is both science and art.",
  author: 'Lena K.',
  country: '🇩🇪',
  date: 'Jan 30',
  likes: 73
},
{
  id: 6,
  img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop',
  imgHeight: 'h-36',
  workshopTag: '🍛 Cooking — Colombo',
  title: 'Sri Lankan Spices: A Culinary Journey',
  excerpt:
  'From roasting cinnamon to grinding coconut, the cooking workshop was a feast for every sense.',
  author: 'Raj P.',
  country: '🇦🇺',
  date: 'Jan 25',
  likes: 48
},
{
  id: 7,
  img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&auto=format&fit=crop',
  imgHeight: 'h-60',
  workshopTag: '🥁 Drumming — Kandy',
  title: 'The Heartbeat of Kandyan Drumming',
  excerpt:
  'The Geta Beraya drum resonated through my chest. Learning even one rhythm felt like unlocking a secret language.',
  author: 'Carlos M.',
  country: '🇪🇸',
  date: 'Jan 18',
  likes: 91
},
{
  id: 8,
  img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop',
  imgHeight: 'h-44',
  workshopTag: '🎨 Batik Workshop — Galle',
  title: 'Batik by the Sea: Galle Fort Workshop',
  excerpt:
  'The Dutch colonial backdrop of Galle Fort made this batik session feel like stepping back in time.',
  author: 'Yuki S.',
  country: '🇯🇵',
  date: 'Jan 12',
  likes: 67
}];

const POSTS_PER_PAGE = 6;
const TRENDING_TAGS = [
'#Batik',
'#Pottery',
'#Kandy',
'#WoodCarving',
'#SriLanka',
'#Weaving',
'#Masks',
'#Lacquer',
'#Cooking'];

const TOP_CONTRIBUTORS = [
{
  initials: 'AT',
  name: 'Arjun T.',
  country: '🇮🇳',
  posts: 8
},
{
  initials: 'EL',
  name: 'Emma L.',
  country: '🇬🇧',
  posts: 6
},
{
  initials: 'KT',
  name: 'Kenji T.',
  country: '🇯🇵',
  posts: 5
}];

export function TouristBlogs() {
  const [activeTab, setActiveTab] = useState('All');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    workshop: '',
    content: ''
  });
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const toggleLike = (id: number) => {
    setLikedPosts((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const totalPages = Math.ceil(BLOG_POSTS.length / POSTS_PER_PAGE);
  const paginatedPosts = BLOG_POSTS.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const leftCol = paginatedPosts.filter((_, i) => i % 2 === 0);
  const rightCol = paginatedPosts.filter((_, i) => i % 2 !== 0);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 30 * 1024 * 1024; // 30MB
    if (file.size > maxSize) {
      setUploadError('File exceeds 30MB limit. Please choose a smaller file.');
      setUploadedFile(null);
      return;
    }
    setUploadError('');
    setUploadedFile(file);
  };
  return (
    <div
      className="min-h-screen font-body"
      style={{
        backgroundColor: '#FAF6F0'
      }}>

      <TouristNavbar activeTab="blogs" />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-[#1E1E1E]">
                Cultural Stories
              </h1>
              <p className="text-gray-400 font-body mt-1 text-sm">
                Shared by our community of explorers
              </p>
            </div>
            <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.97
              }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm font-body shadow-md"
              style={{
                backgroundColor: '#C1440E'
              }}>

              <PenLineIcon className="w-4 h-4" />
              Share Your Experience
            </motion.button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
            {TABS.map((tab) =>
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium font-body transition-colors duration-150 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-[#1E1E1E]'}`}>

                {activeTab === tab &&
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl"
                style={{
                  backgroundColor: '#C1440E'
                }}
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.4
                }} />

              }
                <span className="relative z-10">{tab}</span>
              </button>
            )}
          </div>

          {/* Main Layout */}
          <div className="flex gap-6 items-start">
            {/* Masonry Grid */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-4">
                  {leftCol.map((post, i) =>
                  <BlogCard
                    key={post.id}
                    post={post}
                    liked={likedPosts.includes(post.id)}
                    onLike={() => toggleLike(post.id)}
                    delay={i * 0.06} />

                  )}
                </div>
                <div className="flex-1 space-y-4 mt-6">
                  {rightCol.map((post, i) =>
                  <BlogCard
                    key={post.id}
                    post={post}
                    liked={likedPosts.includes(post.id)}
                    onLike={() => toggleLike(post.id)}
                    delay={i * 0.06 + 0.03} />

                  )}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 py-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#C1440E] hover:text-[#C1440E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">

                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                {Array.from(
                  {
                    length: totalPages
                  },
                  (_, i) => i + 1
                ).map((page) =>
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold font-body transition-colors border ${currentPage === page ? 'text-white border-[#C1440E]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#C1440E] hover:text-[#C1440E]'}`}
                  style={
                  currentPage === page ?
                  {
                    backgroundColor: '#C1440E'
                  } :
                  {}
                  }>

                    {page}
                  </button>
                )}

                <button
                  onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#C1440E] hover:text-[#C1440E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">

                  <ChevronRightIcon className="w-4 h-4" />
                </button>

                <span className="text-xs text-gray-400 font-body ml-2">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="hidden xl:block w-72 shrink-0 space-y-4 sticky top-24">
              {/* Trending Topics */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUpIcon
                    className="w-4 h-4"
                    style={{
                      color: '#C1440E'
                    }} />

                  <h3 className="text-sm font-bold text-[#1E1E1E] font-body">
                    Trending Topics
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TAGS.map((tag) =>
                  <button
                    key={tag}
                    onMouseEnter={() => setHoveredTag(tag)}
                    onMouseLeave={() => setHoveredTag(null)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium font-body border transition-all duration-150"
                    style={{
                      backgroundColor:
                      hoveredTag === tag ? '#C1440E' : '#FAF6F0',
                      color: hoveredTag === tag ? 'white' : '#1E1E1E',
                      borderColor: hoveredTag === tag ? '#C1440E' : '#E5E7EB'
                    }}>

                      {tag}
                    </button>
                  )}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AwardIcon
                    className="w-4 h-4"
                    style={{
                      color: '#1A6B6B'
                    }} />

                  <h3 className="text-sm font-bold text-[#1E1E1E] font-body">
                    Top Contributors
                  </h3>
                  <span className="text-xs text-gray-400 font-body ml-auto">
                    This month
                  </span>
                </div>
                <div className="space-y-3">
                  {TOP_CONTRIBUTORS.map(
                    ({ initials, name, country, posts }, idx) =>
                    <div key={name} className="flex items-center gap-3">
                        <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold font-body shrink-0"
                        style={{
                          backgroundColor: idx === 0 ? '#C1440E' : '#1A6B6B'
                        }}>

                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1E1E1E] font-body">
                            {name} {country}
                          </p>
                          <p className="text-xs text-gray-400 font-body">
                            {posts} posts this month
                          </p>
                        </div>
                        {idx === 0 &&
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full text-white font-body"
                        style={{
                          backgroundColor: '#1A6B6B'
                        }}>

                            #1
                          </span>
                      }
                      </div>

                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showModal &&
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
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>

            <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.97
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.97
            }}
            transition={{
              duration: 0.25
            }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative">

              <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">

                <XIcon className="w-4 h-4 text-gray-500" />
              </button>

              <h2 className="text-2xl font-display font-bold text-[#1E1E1E] mb-1">
                Share Your Experience
              </h2>
              <p className="text-sm text-gray-400 font-body mb-6">
                Inspire others with your cultural journey
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                    Blog Title
                  </label>
                  <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    title: e.target.value
                  })
                  }
                  placeholder="Give your story a title..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />

                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                    Workshop
                  </label>
                  <select
                  value={newPost.workshop}
                  onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    workshop: e.target.value
                  })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body bg-white">

                    <option value="">Select a workshop</option>
                    <option>Batik Workshop — Kandy</option>
                    <option>Pottery Class — Kelaniya</option>
                    <option>Wood Carving — Ambalangoda</option>
                    <option>Weaving — Jaffna</option>
                    <option>Lacquer Work — Kandy</option>
                    <option>Drumming — Kandy</option>
                    <option>Cooking — Colombo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                    Your Story
                  </label>
                  <textarea
                  value={newPost.content}
                  onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    content: e.target.value
                  })
                  }
                  placeholder="Describe your experience..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body resize-none" />

                </div>

                {/* Upload Area — images + videos up to 30MB */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                    Add Media
                    <span className="text-gray-400 font-normal ml-1">
                      (images or videos, up to 30MB)
                    </span>
                  </label>
                  <label
                  htmlFor="media-upload"
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${uploadedFile ? 'border-[#1A6B6B] bg-[#E8F4F4]' : 'border-gray-200 hover:border-[#C1440E]/40'}`}>

                    <input
                    id="media-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                    className="hidden"
                    onChange={handleFileChange} />

                    <UploadCloudIcon
                    className={`w-8 h-8 ${uploadedFile ? 'text-[#1A6B6B]' : 'text-gray-300'}`} />

                    {uploadedFile ?
                  <p
                    className="text-sm font-semibold font-body"
                    style={{
                      color: '#1A6B6B'
                    }}>

                        ✓ {uploadedFile.name}
                      </p> :

                  <>
                        <p className="text-sm text-gray-400 font-body">
                          Drop a file here or{' '}
                          <span
                        className="font-semibold"
                        style={{
                          color: '#C1440E'
                        }}>

                            browse
                          </span>
                        </p>
                        <p className="text-xs text-gray-300 font-body">
                          JPG, PNG, GIF, MP4, MOV, WEBM — max 30MB
                        </p>
                      </>
                  }
                  </label>
                  {uploadError &&
                <p className="text-xs text-red-500 mt-1.5 font-body">
                      {uploadError}
                    </p>
                }
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 font-body hover:bg-gray-50 transition-colors">

                    Cancel
                  </button>
                  <button
                  type="button"
                  className="flex-1 py-3 rounded-xl border text-sm font-semibold font-body transition-colors"
                  style={{
                    borderColor: '#1A6B6B',
                    color: '#1A6B6B'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1A6B6B';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1A6B6B';
                  }}>

                    Save as Draft
                  </button>
                  <motion.button
                  whileHover={{
                    scale: 1.01
                  }}
                  whileTap={{
                    scale: 0.98
                  }}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold font-body"
                  style={{
                    backgroundColor: '#C1440E'
                  }}>

                    Publish Story
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
interface BlogPost {
  id: number;
  img: string;
  imgHeight: string;
  workshopTag: string;
  title: string;
  excerpt: string;
  author: string;
  country: string;
  date: string;
  likes: number;
}
function BlogCard({
  post,
  liked,
  onLike,
  delay





}: {post: BlogPost;liked: boolean;onLike: () => void;delay: number;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        delay,
        duration: 0.4,
        ease: 'easeOut'
      }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <img
        src={post.img}
        alt={post.title}
        className={`w-full ${post.imgHeight} object-cover`} />

      <div className="p-4">
        <span
          className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full font-body mb-2"
          style={{
            backgroundColor: '#E8F4F4',
            color: '#1A6B6B'
          }}>

          {post.workshopTag}
        </span>
        <h3 className="font-display font-bold text-[#1E1E1E] text-base leading-snug mb-1.5">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 font-body leading-relaxed mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold font-body shrink-0"
            style={{
              backgroundColor: '#C1440E'
            }}>

            {post.author.charAt(0)}
          </div>
          <span className="text-xs font-medium text-[#1E1E1E] font-body">
            {post.author}
          </span>
          <span className="text-sm">{post.country}</span>
          <span className="text-xs text-gray-400 font-body ml-auto">
            {post.date}
          </span>
        </div>

        {/* Actions — like only + Read More */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 text-xs font-body transition-colors"
            style={{
              color: liked ? '#E11D48' : '#9CA3AF'
            }}>

            <HeartIcon className="w-4 h-4" fill={liked ? '#E11D48' : 'none'} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <a
            href="#"
            className="text-xs font-semibold font-body"
            style={{
              color: '#1A6B6B'
            }}>

            Read More →
          </a>
        </div>
      </div>
    </motion.div>);

}