import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TouristNavbar } from './TouristNavbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBlogs, getBookings, getMockUpcomingWorkshops, MockWorkshop } from '../../services/api';
import { INTEREST_MAP, REGIONS_MAP } from '../../constants/touristConstants';
import {
  CalendarIcon,
  HeartIcon,
  BookOpenIcon,
  StarIcon,
  EditIcon
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const COUNTRY_FLAGS: Record<string, string> = {
  India: '🇮🇳', 'United Kingdom': '🇬🇧', UK: '🇬🇧', USA: '🇺🇸', 'United States': '🇺🇸',
  France: '🇫🇷', Germany: '🇩🇪', Japan: '🇯🇵', Australia: '🇦🇺',
  Canada: '🇨🇦', China: '🇨🇳', Italy: '🇮🇹', Spain: '🇪🇸', Brazil: '🇧🇷',
  'Sri Lanka': '🇱🇰',
};

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? '🌍';
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

export function TouristProfile() {
  const { tourist, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<MockWorkshop[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!tourist) return;
    setDataLoading(true);

    const fetchData = async () => {
      try {
        const [blogsRes, bookingsRes, mockWorkshops] = await Promise.all([
          getMyBlogs(),
          getBookings().catch(() => ({ data: { bookings: [] } })),
          getMockUpcomingWorkshops()
        ]);

        setBlogs(blogsRes.data.blogs || []);

        setBookings(bookingsRes.data.bookings || []);

        // Mock wishlist using savedWorkshops IDs to pick from mock data
        const savedIds = tourist.savedWorkshops?.map(Number) || [];
        const myWishlist = mockWorkshops.filter(w => savedIds.includes(w.id));
        setWishlist(myWishlist);
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [tourist]);

  const isLoading = authLoading || dataLoading;

  const callingName = tourist?.callingName ?? 'Traveller';
  const fullName = tourist?.fullName ?? '';
  const country = tourist?.country ?? '';
  const languages = tourist?.preferredLanguages ?? [];
  const interests = (tourist?.interests ?? []).map((id: string) => {
    const item = INTEREST_MAP[id];
    return item ? `${item.label} ${item.emoji}` : id;
  });
  const regions = (tourist?.preferredRegions ?? []).map((id: string) => {
    const item = REGIONS_MAP[id];
    return item ? `${item.label} ${item.emoji}` : id;
  });
  const userProfilePic = tourist?.profilePicUrl ?? '';
  const userInitials = tourist?.initials ?? 'LC';

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#FAF6F0' }}>
      <TouristNavbar activeTab="profile" />

      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="show">

            {/* Banner Section */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl overflow-hidden p-10 text-white"
              style={{ background: 'linear-gradient(135deg, #1A6B6B 0%, #0D4D4D 100%)' }}>

              {/* Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="profile-banner" width="50" height="50" patternUnits="userSpaceOnUse">
                      <polygon points="25,3 47,25 25,47 3,25" fill="none" stroke="white" strokeWidth="1.5" />
                      <circle cx="25" cy="25" r="4" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#profile-banner)" />
                </svg>
              </div>

              <div className="relative z-10 flex items-start justify-between gap-6">
                <div>
                  {isLoading ? (
                    <>
                      <SkeletonBlock className="h-8 w-64 mb-3 bg-white/30" />
                      <SkeletonBlock className="h-4 w-48 mb-5 bg-white/20" />
                      <div className="flex gap-2">
                        <SkeletonBlock className="h-7 w-20 rounded-full bg-white/20" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 rounded-full bg-white text-[#1A6B6B] flex items-center justify-center text-2xl font-body font-display shadow-lg overflow-hidden">
                          {userProfilePic ? (
                            <img src={userProfilePic} alt={callingName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{userInitials}</span>
                          )}
                        </div>
                        <div>
                          <h1 className="text-3xl font-display font-bold">
                            {fullName}
                          </h1>
                          <p className="text-white/75 text-sm font-body">
                            Known as {callingName}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {country && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border border-white/30 bg-white/10">
                            {getFlag(country)} {country}
                          </span>
                        )}
                        {languages.map((lang: string) => (
                          <span key={lang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border border-white/30 bg-white/10">
                            🗣️ {lang}
                          </span>
                        ))}
                      </div>

                      <div className='mt-6 mb-2'>
                        <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-1.5">
                          Preferred Regions
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {regions.map((regions: string) => (
                            <span key={regions} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border border-white/30 bg-white/10">
                              {regions}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <Link
                    to="/tourist/profile/edit"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#1A6B6B] rounded-xl text-sm font-bold shadow hover:bg-gray-100 transition-colors">
                    <EditIcon className="w-4 h-4" /> Edit Profile
                  </Link>

                  <div className="hidden md:flex flex-col items-end gap-2 mt-2">
                    <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-1">
                      Your Interests
                    </p>
                    {isLoading ? (
                      <SkeletonBlock className="h-7 w-28 rounded-full bg-white/20" />
                    ) : interests.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 justify-items-end">
                        {interests.map((craft: string) => (
                          <span key={craft} className="px-3 py-1.5 rounded-full text-xs font-semibold font-body border border-white/30 bg-white/15 text-white whitespace-nowrap">
                            {craft}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full text-xs font-body border border-white/20 bg-white/10 text-white/50">
                        No interests set
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* My Bookings Section */}
            <motion.section variants={itemVariants} id="myBookings">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5" style={{ color: '#1A6B6B' }} />
                <h2 className="text-xl font-display font-bold text-[#1E1E1E]">My Bookings</h2>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[120px] flex items-center justify-center">
                {isLoading ? (
                  <SkeletonBlock className="h-10 w-full" />
                ) : bookings.length > 0 ? (
                  <div className="w-full space-y-4">
                    {bookings.map((b: any) => (
                      <div key={b._id} className="flex justify-between items-center p-4 border rounded-xl hover:shadow-sm transition-shadow">
                        <div>
                          <p className="font-bold text-[#1E1E1E]">{b.workshop?.title || 'Workshop'}</p>
                          <p className="text-sm text-gray-500">Scheduled on: {new Date(b.date).toLocaleDateString()}</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No bookings yet. <Link to="/book" className="text-[#C1440E] font-bold">Find a workshop</Link></p>
                )}
              </div>
            </motion.section>

            {/* My Wishlist Section */}
            <motion.section variants={itemVariants} id="myWishlist">
              <div className="flex items-center gap-2 mb-4">
                <HeartIcon className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-display font-bold text-[#1E1E1E]">My Wishlist</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoading ? (
                  [1, 2, 3].map(i => <SkeletonBlock key={i} className="h-40 w-full" />)
                ) : wishlist.length > 0 ? (
                  wishlist.map(w => (
                    <div key={w.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                      <img src={w.img} alt={w.name} className="h-28 w-full object-cover" />
                      <div className="p-3">
                        <p className="font-bold text-sm text-[#1E1E1E] truncate">{w.name}</p>
                        <p className="text-xs text-gray-500">{w.artisan}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center min-h-[120px]">
                    <p className="text-gray-400 text-sm">Your wishlist is empty.</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* My Blogs Section */}
            <motion.section variants={itemVariants} id="myBlogs">
              <div className="flex items-center gap-2 mb-4">
                <BookOpenIcon className="w-5 h-5" style={{ color: '#C1440E' }} />
                <h2 className="text-xl font-display font-bold text-[#1E1E1E]">My Blogs</h2>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  [1, 2].map(i => <SkeletonBlock key={i} className="h-24 w-full" />)
                ) : blogs.length > 0 ? (
                  blogs.map((b: any) => (
                    <div key={b._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row items-stretch hover:shadow-md transition-shadow">
                      {/* Show first media item from media[] array only — no legacy fallback */}
                      {b.media && b.media.length > 0 && (() => {
                        const sorted = [...b.media].sort((x: any, y: any) => x.order - y.order);
                        const first = sorted[0];
                        const extraCount = sorted.length - 1;
                        return (
                          <div className="relative w-40 h-32 shrink-0 bg-gray-100">
                            {first.mediaType === 'video' ? (
                              <video
                                src={first.url}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                autoPlay
                                loop
                              />
                            ) : (
                              <img src={first.url} alt={b.title} className="w-full h-full object-cover" />
                            )}
                            {extraCount > 0 && (
                              <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                +{extraCount}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                      <div className="p-4 flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${b.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                {b.status}
                              </span>
                              <span className="text-xs text-gray-400 font-body">
                                {new Date(b.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="font-bold text-base text-[#1E1E1E] mb-1 truncate">{b.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{b.content.replace(/<[^>]+>/g, '')}</p>
                          </div>
                          <Link
                            to={`/tourist/blogs/edit/${b._id}`}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors shrink-0">
                            <EditIcon className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[120px]">
                    <p className="text-gray-400 text-sm mb-2">You haven't posted any blogs yet.</p>
                    <Link to="/tourist/blogs/create" className="text-sm font-bold px-4 py-2 bg-[#C1440E] text-white rounded-xl">Write a Story</Link>
                  </div>
                )}
              </div>
            </motion.section>

            {/* My Reviews Section (Placeholder) */}
            <motion.section variants={itemVariants} id="myReviews">
              <div className="flex items-center gap-2 mb-4">
                <StarIcon className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-display font-bold text-[#1E1E1E]">My Reviews</h2>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[120px] flex items-center justify-center">
                <p className="text-gray-400 text-sm">You haven't written any reviews yet.</p>
              </div>
            </motion.section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
