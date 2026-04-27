import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TouristNavbar } from './TouristNavbar';
import { BatikBackground } from '../../components/BatikBackground';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBlogs, getReviews, getSavedWorkshops, getArtistById } from '../../services/api';
import { bookingApi } from '../../api/index';
import { INTEREST_MAP, REGIONS_MAP, COUNTRY_CODES } from '../../constants/touristConstants';
import ReactCountryFlag from 'react-country-flag';

import {
  CalendarIcon,
  HeartIcon,
  BookOpenIcon,
  StarIcon,
  EditIcon,
  ChevronRightIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

function getFlag(country: string) {
  const code = COUNTRY_CODES[country];
  if (!code) return <span className="mr-1">🌍</span>;
  return <ReactCountryFlag countryCode={code} svg className="mr-1" style={{ width: '1.2em', height: '1.2em' }} title={country} />;
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

interface UpcomingWorkshop {
  id: string | number;
  img?: string;
  artisanName: string;
  craftName: string;
  bookingDate: string;
  bookingTime: string;
  location: string;
  status: 'Confirmed' | 'Pending' | string;
}

export function TouristProfile() {
  const { tourist, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<UpcomingWorkshop[]>([]);
  const [wishlist, setWishlist] = useState<{ id: string; img: string; name: string; artisan: string; craftType: string; location: string }[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);


  useEffect(() => {
    if (!tourist) return;
    setDataLoading(true);

    const fetchData = async () => {
      try {
        const [blogsRes, bookingsRes, reviewsRes] = await Promise.all([
          getMyBlogs(),
          bookingApi.getBookingsByEmail(tourist.email),
          getReviews({ mine: true }).catch(() => ({ data: { reviews: [] } }))
        ]);

        setBlogs(blogsRes.data.blogs || []);

        setBookings(bookingsRes.data || []);

        setReviews(reviewsRes.data.reviews || tourist.reviews || []);

        // Fetch wishlist: savedWorkshops stores artist IDs
        try {
          const savedRes = await getSavedWorkshops();
          const savedIds: string[] = savedRes.data.savedWorkshops || [];
          if (savedIds.length > 0) {
            const artistPromises = savedIds.map(id =>
              getArtistById(id).then(res => res.data?.artist).catch(() => null)
            );
            const artists = await Promise.all(artistPromises);
            const wishlistItems = artists
              .filter(Boolean)
              .map((a: any) => ({
                id: a._id || a.id,
                img: a.profilePicUrl || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop',
                name: `${(a.craftType || 'Art').charAt(0).toUpperCase() + (a.craftType || 'Art').slice(1)} Workshop`,
                artisan: a.fullName || 'Artisan',
                craftType: a.craftType || '',
                location: a.address?.city || a.address?.district || 'Sri Lanka',
              }));
            setWishlist(wishlistItems);
          } else {
            setWishlist([]);
          }
        } catch {
          setWishlist([]);
        }
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

  useEffect(() => {
    const fetchUpcoming = async () => {
      if (authLoading) return;

      if (tourist?.id) {
        try {
          const data = await bookingApi.getBookingsByEmail(tourist.email);
          setBookings(data || []);
        } catch (err) {
          console.error("API Error:", err);
        }
      }
    };

    fetchUpcoming();
  }, [tourist?.id, authLoading]);


  if (!tourist) {
    return (
      <div className="min-h-screen bg-white font-body flex flex-col relative overflow-hidden">
        <div className="relative z-20">
          <TouristNavbar />
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <BatikBackground />
        </div>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 relative z-10">
          <div className="w-20 h-20 bg-[#FDF0EB] rounded-full flex items-center justify-center mb-6 text-[#C1440E]">
            <UserIcon className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black text-[#1E1E1E] mb-4 font-display text-center">
            Tourist Login Required
          </h2>

          <p className="text-gray-600 mb-8 max-w-md text-center">
            You need to be logged in with a tourist account to access your profile and manage your blogs, bookings and wishlist.
          </p>

          <Link
            to="/tourist/login"
            className="px-8 py-3 bg-[#C1440E] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Go to Login
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body relative">
      <BatikBackground />
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

                <div className="shrink-0 flex flex-col items-end gap-4">

                  {/* Edit Button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/tourist/profile/edit"
                      className="flex items-center gap-2 px-4 py-2 bg-[#E8F4F4] text-[#1A6B6B] rounded-xl text-sm font-bold shadow-sm hover:bg-[#FAF6F0] hover:text-[#C1440E] transition-all border border-[#1A6B6B]/10">
                      <EditIcon className="w-4 h-4" /> Edit Profile
                    </Link>
                  </motion.div>

                  {/* Interests */}
                  <div className="hidden md:flex flex-col items-end gap-2 mt-2">
                    <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-1">
                      Your Interests
                    </p>

                    {isLoading ? (
                      <SkeletonBlock className="h-7 w-28 rounded-full bg-white/20" />
                    ) : interests.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 justify-items-end">
                        {interests.map((craft: string) => (
                          <span
                            key={craft}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold font-body border border-white/30 bg-white/15 text-white whitespace-nowrap">
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

            {/* My Bookings */}
            <motion.section variants={itemVariants} id="myBookings">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5" style={{ color: '#1A6B6B' }} />
                <h2 className="text-xl font-display font-bold text-[#1E1E1E]">My Bookings</h2>
              </div>

              <div className="bg-white rounded-2xl p-2 md:p-4 border border-gray-100 shadow-sm min-h-[120px]">
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    <SkeletonBlock className="h-16 w-full rounded-xl" />
                    <SkeletonBlock className="h-16 w-full rounded-xl" />
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="w-full space-y-2">
                    {bookings.map((b: any) => (
                      <div
                        key={b._id || b.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                      >
                        {/* Left: Workshop & Artisan Info */}
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#fdf8f6] flex items-center justify-center text-[#C1440E]">
                            <ClockIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1E1E1E] leading-tight">
                              {b.craftName || 'Traditional Workshop'}
                            </p>
                            <p className="text-sm text-[#1A6B6B] font-medium">
                              with {b.artisanName || 'Master Artisan'}
                            </p>
                          </div>
                        </div>

                        {/* Middle: Date & Time Details */}
                        <div className="flex items-center gap-6 mt-3 md:mt-0 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span>{b.bookingDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            <span>{b.location}</span>
                          </div>
                        </div>

                        {/* Right: Status & Action */}
                        <div className="flex items-center justify-between md:justify-end gap-4 mt-3 md:mt-0">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${b.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                            }`}>
                            {b.status}
                          </span>
                          <Link
                            to="/my-bookings"
                            className="p-2 border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50 transition-all shrink-0">
                            <EditIcon className="w-4 h-4" />
                          </Link>
                          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                            <ChevronRightIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-400 text-sm mb-2">No bookings yet.</p>
                    <Link to="/book" className="text-[#C1440E] font-bold hover:underline flex items-center gap-1">
                      Find a workshop <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
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
                    <Link key={w.id} to={`/artist/${w.id}`} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                      <img src={w.img} alt={w.name} className="h-28 w-full object-cover" />
                      <div className="p-3">
                        <p className="font-bold text-sm text-[#1E1E1E] truncate">{w.name}</p>
                        <p className="text-xs text-gray-500">{w.artisan}</p>
                        <p className="text-[10px] text-[#1A6B6B] font-semibold mt-1">{w.location}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[120px]">
                    <p className="text-gray-400 text-sm mb-2">Your wishlist is empty.</p>
                    <Link to="/tourist/dashboard" className="text-[#C1440E] font-bold text-sm hover:underline">Browse workshops to save some ❤️</Link>
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
                      {/* Show first media item from media[] array only */}
                      {b.media && b.media.length >= 0 && (() => {
                        const sorted = [...b.media].sort((x: any, y: any) => x.order - y.order);
                        const first = sorted[0] || { url: "https://res.cloudinary.com/dv5axw4kb/image/upload/v1775051320/No-media_lq9t0c.png", mediaType: "image" };
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
                            className="p-2 border border-gray-200 rounded-lg hover:bg-[#FAF6F0] hover:text-[#C1440E] transition-all shrink-0">
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

            {/* My Reviews Section */}
            <motion.section variants={itemVariants} id="myReviews">
              <div className="flex items-center gap-2 mb-4">
                <StarIcon className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-display font-bold text-[#1E1E1E]">My Reviews</h2>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  [1, 2].map(i => <SkeletonBlock key={i} className="h-24 w-full" />)
                ) : reviews && reviews.length > 0 ? (
                  reviews.map((r: any) => (
                    <div key={r._id || r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-4 h-4 ${i < (r.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 font-body">
                          {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#1E1E1E] mb-1">
                        {r.artisanName ? `${r.artisanName} Review` : 'Workshop Review'}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-3">{r.text || 'No text content provided.'}</p>
                      {r.artisanReply && (
                        <div className="mt-3 p-3 bg-[#F6F3EE] rounded-lg border-l-4 border-[#C1440E]">
                          <p className="text-[10px] font-bold text-[#C1440E] uppercase mb-1">Artisan Reply</p>
                          <p className="text-xs text-gray-600 italic">"{r.artisanReply.text}"</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center min-h-[120px]">
                    <p className="text-gray-400 text-sm">You haven't written any reviews yet.</p>
                  </div>
                )}
              </div>
            </motion.section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
