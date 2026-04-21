import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { hover, motion } from 'framer-motion';
import {
  GraduationCapIcon,
  PenLineIcon,
  StarIcon,
  CalendarIcon,
  ChevronRightIcon,
  UserIcon,
  BookOpenIcon,
  HeartIcon,
  ChevronLeftIcon,
  ClockIcon,
  MapPinIcon
} from 'lucide-react';
import { TouristNavbar } from './TouristNavbar';
import { BatikBackground } from '../../components/BatikBackground';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../../context/AuthContext';
import { getStats, getSavedWorkshops, addSavedWorkshop, removeSavedWorkshop, getArtists, getFeaturedArtist } from '../../services/api';
import { bookingApi } from '../../api/index'
import { INTEREST_MAP, COUNTRY_CODES } from '../../constants/touristConstants';
import ReactCountryFlag from 'react-country-flag';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut'
    }
  }
};

// ------------------  MAP -----------------------------

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;



// ── Country flag helper ─────────────────────────────────────────────────────

function getFlag(country: string) {
  const code = COUNTRY_CODES[country];
  if (!code) return <span className="mr-1">🌍</span>;
  return <ReactCountryFlag countryCode={code} svg className="mr-1" style={{ width: '1.2em', height: '1.2em' }} title={country} />;
}

// ── Mini Calendar ──────────────────────────────────────────────
function MiniCalendar({ workshops = [] }: { workshops?: UpcomingWorkshop[] }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const getDateKey = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeftIcon className="w-4 h-4 text-gray-400" />
        </button>
        <span className="text-sm font-bold text-[#1E1E1E] font-body">
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 font-body py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;

          const key = getDateKey(day);
          const isToday = key === todayKey;
          const hasWorkshop = workshops?.some(w => w.bookingDate === key);

          return (
            <div key={key} className="relative flex items-center justify-center h-8">

              {hasWorkshop && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <StarIcon
                    className="w-7 h-7 fill-[#ffe600dc] text-[#ffe600dc]"
                    strokeWidth={1}
                  />
                </motion.div>
              )}

              <div
                className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full text-xs font-body transition-all ${isToday
                  ? 'text-white font-bold shadow-md'
                  : hasWorkshop
                    ? 'text-[#1E1E1E] font-bold' // Darker text if there's a star
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                style={isToday ? { backgroundColor: '#C1440E' } : {}}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ── Skeleton Loader ─────────────────────────────────────────────
function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}



// ── Main Dashboard ─────────────────────────────────────────────
interface Stats {
  workshopsAttended: number;
  blogsPosted: number;
  reviewsGiven: number;
}

interface UpcomingWorkshop {
  _id: string;
  artisanId: string;
  img?: string;
  artisanName: string;
  craftName: string;
  bookingDate: string;
  bookingTime: string;
  location: string;
  status: 'Confirmed' | 'Pending' | string;
}

export function TouristDashboard() {
  const { tourist, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [upcomingWorkshops, setUpcomingWorkshops] = useState<UpcomingWorkshop[]>([]);
  const [savedWorkshops, setSavedWorkshops] = useState<string[]>([]);

  const [mapPinpoints, setMapPinpoints] = useState<{ id: string, position: [number, number], label: string }[]>([]);
  const [recommendedWorkshops, setRecommendedWorkshops] = useState<any[]>([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      if (tourist?.id) {
        try {
          const data = await bookingApi.getBookingsByUid(tourist.id);
          setUpcomingWorkshops(data || []);
        } catch (err) {
          console.error("API Error:", err);
        }
      }
    };

    fetchUpcoming();
  }, [tourist?.id]);

  // Fetch saved workshops real data from backend
  useEffect(() => {
    if (!tourist) return;
    getSavedWorkshops().then(res => {
      const saved: string[] = res.data.savedWorkshops || [];
      setSavedWorkshops(saved);
    }).catch(console.error);
  }, [tourist]);

  const toggleSave = async (id: string) => {
    const isSaved = savedWorkshops.includes(id);
    try {
      if (isSaved) {
        setSavedWorkshops((prev) => prev.filter((i) => i !== id));
        await removeSavedWorkshop(id);
      } else {
        setSavedWorkshops((prev) => [...prev, id]);
        await addSavedWorkshop(id);
      }
    } catch (err) {
      console.error('Failed to update saved workshops', err);
      if (isSaved) setSavedWorkshops((prev) => [...prev, id]);
      else setSavedWorkshops((prev) => prev.filter((i) => i !== id));
    }
  };

  // Fetch dashboard stats
  useEffect(() => {
    if (!tourist) return;
    setStatsLoading(true);
    getStats()
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, [tourist]);

  // Fetch map pinpoints and recommended workshops
  useEffect(() => {
    const fetchArtistsData = async () => {
      try {
        const [artistsRes, featuredRes] = await Promise.all([
          getArtists(1, 100),
          getFeaturedArtist().catch(() => null)
        ]);

        const allArtists = artistsRes.data?.artists || [];
        const featured = featuredRes?.data?.artist || null;

        // 1. Calculate map pinpoints globally or filtered by regions
        const regions = tourist?.preferredRegions ?? [];
        let mapArtists = allArtists;

        if (regions.length > 0) {
          const filtered = allArtists.filter((a: any) =>
            regions.some((r: string) =>
              r.toLowerCase() === a.address?.city?.toLowerCase() ||
              r.toLowerCase() === a.address?.district?.toLowerCase() ||
              r.toLowerCase() === a.address?.province?.toLowerCase()
            )
          );
          if (filtered.length > 0) {
            mapArtists = filtered;
          }
        }

        const pins = mapArtists
          .filter((a: any) => a.location?.coordinates && a.location.coordinates.length === 2 && a.location.coordinates[0] !== 0)
          .map((a: any) => ({
            id: a._id || a.id,
            position: [a.location.coordinates[1], a.location.coordinates[0]],
            label: a.fullName
          }));

        if (pins.length === 0) {
          // fallback to overall artists if no pins found after filter
          const fallbackPins = allArtists
            .filter((a: any) => a.location?.coordinates && a.location.coordinates.length === 2 && a.location.coordinates[0] !== 0)
            .slice(0, 10)
            .map((a: any) => ({
              id: a._id || a.id,
              position: [a.location.coordinates[1], a.location.coordinates[0]],
              label: a.fullName
            }));
          setMapPinpoints(fallbackPins);
        } else {
          setMapPinpoints(pins);
        }

        // 2. Calculate recommended workshops
        const maxRecs = 3;
        const recList = [];

        if (featured) {
          recList.push(featured);
        }

        const interests = tourist?.interests ?? [];
        for (const a of allArtists) {
          if (recList.length >= maxRecs) break;
          // Ignore if already added
          if (!recList.find((r) => r.id === a.id || r._id === a._id)) {
            if (interests.includes(a.craftType)) {
              recList.push(a);
            }
          }
        }

        // Fills the leftover slots if there is not enough matching artists
        for (const a of allArtists) {
          if (recList.length >= maxRecs) break;
          if (!recList.find((r) => r.id === a.id || r._id === a._id)) {
            recList.push(a);
          }
        }

        const formattedRecs = recList.map(w => ({
          id: w._id || w.id,
          img: w.profilePicUrl || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop',
          category: INTEREST_MAP[w.craftType]?.label ? `${INTEREST_MAP[w.craftType].emoji} ${INTEREST_MAP[w.craftType].label}` : (w.craftType || 'Art'),
          name: `${(w.craftType || 'Art').charAt(0).toUpperCase() + (w.craftType || 'Art').slice(1)} Workshop`,
          artisan: w.fullName,
          location: w.address?.city || w.address?.district || 'Sri Lanka',
          rating: w.rating || 4.5,
          reviews: w.reviewCount || 0,
          price: 'Book via Profile',
        }));

        setRecommendedWorkshops(formattedRecs);

      } catch (err) {
        console.error("Failed to fetch artists data", err);
      }
    };

    if (!authLoading && tourist) {
      fetchArtistsData();
    }
  }, [tourist, authLoading]);

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
            You need to be logged in with a tourist account to access your dashboard and manage your workshops.
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

  // // Load mock upcoming workshops
  // useEffect(() => {
  //   getMockUpcomingWorkshops().then(setUpcomingWorkshops);
  // }, []);

  const isLoading = authLoading || statsLoading;

  // Derive display values from live profile
  // const fullName = tourist?.fullName ?? 'Traveller';
  const callingName = tourist?.callingName ?? 'Traveller';
  const country = tourist?.country ?? '';
  const languages = tourist?.preferredLanguages ?? [];
  const interests = (tourist?.interests ?? []).map(id => {
    const item = INTEREST_MAP[id];
    return item ? `${item.label} ${item.emoji}` : id;
  });

  const statCards = [
    { icon: GraduationCapIcon, label: 'Workshops Attended', value: stats?.workshopsAttended ?? 0, color: '#062e9aff', border: '#062e9aff', hover: '#4e74e6' },
    { icon: PenLineIcon, label: 'Blogs Posted', value: stats?.blogsPosted ?? 0, color: '#c1320eff', border: '#c1320eff', hover: '#ef5e3b' },
    { icon: StarIcon, label: 'Reviews Given', value: stats?.reviewsGiven ?? 0, color: '#D97706', border: '#D97706', hover: '#f59e0b' },
    { icon: CalendarIcon, label: 'Upcoming Bookings', value: upcomingWorkshops.length ?? 0, color: '#e6d100', border: '#e6d100', hover: '#ffe600dc' },
  ];

  return (
    <div className="min-h-screen font-body relative">
      <BatikBackground />
      <TouristNavbar activeTab="dashboard" />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">
          {/* ── MAIN CONTENT ── */}
          <motion.div
            className="flex-1 min-w-0 space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="show">

            {/* Welcome Banner */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl overflow-hidden p-10 text-white"
              style={{ background: 'linear-gradient(135deg, #C1440E 0%, #8B2E08 100%)' }}>

              {/* Batik pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="dash-banner" width="50" height="50" patternUnits="userSpaceOnUse">
                      <polygon points="25,3 47,25 25,47 3,25" fill="none" stroke="white" strokeWidth="1.5" />
                      <circle cx="25" cy="25" r="4" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dash-banner)" />
                </svg>
              </div>

              <div className="relative z-10 flex items-start justify-between gap-6">
                {/* Left: greeting + stats */}
                <div>
                  {isLoading ? (
                    <>
                      <SkeletonBlock className="h-8 w-64 mb-3 bg-white/30" />
                      <SkeletonBlock className="h-4 w-48 mb-5 bg-white/20" />
                      <div className="flex gap-3 mb-5">
                        <SkeletonBlock className="h-8 w-28 rounded-full bg-white/20" />
                        <SkeletonBlock className="h-8 w-24 rounded-full bg-white/20" />
                      </div>
                      <div className="flex gap-2">
                        <SkeletonBlock className="h-7 w-20 rounded-full bg-white/20" />
                        <SkeletonBlock className="h-7 w-20 rounded-full bg-white/20" />
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl font-display font-bold mb-1">
                        Welcome back, {callingName}! 👋
                      </h1>
                      <p className="text-white/75 text-base font-body mb-5">
                        Your Cultural Journey Continues
                      </p>

                      {/* Live stat pills */}
                      <div className="flex gap-3 flex-wrap mb-5">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium font-body" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
                          🎨 {stats?.workshopsAttended ?? 0} Workshops
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium font-body" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
                          ✍️ {stats?.blogsPosted ?? 0} Blogs
                        </span>
                      </div>

                      {/* Country + languages */}
                      <div className="flex flex-wrap gap-2">
                        {country && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border border-white/30 bg-white/10">
                            {getFlag(country)} {country}
                          </span>
                        )}
                        {languages.map((lang) => (
                          <span key={lang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border border-white/30 bg-white/10">
                            🗣️ {lang}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Right: interests */}
                <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                  <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-1">
                    Your Interests
                  </p>
                  {isLoading ? (
                    <>
                      <SkeletonBlock className="h-7 w-28 rounded-full bg-white/20" />
                      <SkeletonBlock className="h-7 w-24 rounded-full bg-white/20" />
                      <SkeletonBlock className="h-7 w-20 rounded-full bg-white/20" />
                    </>
                  ) : interests.length > 0 ? (
                    interests.map((craft) => (
                      <span
                        key={craft}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold font-body border border-white/30 bg-white/15 text-white whitespace-nowrap">
                        {craft}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1.5 rounded-full text-xs font-body border border-white/20 bg-white/10 text-white/50">
                      No interests set
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {statCards.map(({ icon: Icon, label, value, color, border, hover }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    '--card-color': color,
                    '--card-hover': hover
                  } as React.CSSProperties}
                  className="relative bg-white rounded-2xl shadow-sm p-6 border border-gray-100 overflow-hidden group cursor-pointer"
                >
                  {/* Expanding border background */}
                  <div
                    className="absolute inset-0 left-0 w-1 transition-all duration-300 ease-out group-hover:w-full z-0 opacity-10"
                    style={{ backgroundColor: border }}
                  />

                  <div
                    className="absolute top-0 bottom-0 left-0 w-1 z-10"
                    style={{ backgroundColor: border }}
                  />

                  <div className="relative z-20">
                    <Icon
                      className="w-5 h-5 mb-3 transition-colors duration-300 text-[var(--card-color)] group-hover:fill-[var(--card-hover)]"
                    />

                    {isLoading ? (
                      <>
                        <SkeletonBlock className="h-8 w-12 mb-2" />
                        <SkeletonBlock className="h-3 w-24" />
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-display font-bold text-[#1E1E1E] transition-colors duration-300">
                          {value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-body transition-colors duration-300 group-hover:text-gray-900">
                          {label}
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Upcoming Workshops — powered by mock API */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-display font-bold text-[#1E1E1E]">Your Upcoming Workshops</h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">Don't miss these scheduled sessions</p>
                </div>
                {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/book" className="text-sm font-semibold font-body flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E8F4F4] text-[#1A6B6B] hover:bg-[#FAF6F0] hover:text-[#C1440E] transition-all border border-[#1A6B6B] hover:border-[#C1440E]">
                    View All <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </motion.div> */}
              </div>

              <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
                {upcomingWorkshops.map((w) => (
                  <div
                    key={w._id}
                    className="bg-white rounded-2xl overflow-hidden shrink-0 w-80 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                        src={w.img || 'https://res.cloudinary.com/dv5axw4kb/image/upload/v1775051320/No-media_lq9t0c.png'}
                        className="w-full h-44 object-cover"
                        alt={w.artisanName}
                      />
                      <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full font-body ${w.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {w.status}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display font-bold text-[#1E1E1E] text-base mb-1">
                        {w.artisanName}
                      </h3>
                      <p className="text-sm font-body mb-4" style={{ color: '#1A6B6B' }}>
                        {w.craftName}
                      </p>

                      {/* Info Grid: Date, Time, and Location */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          {w.bookingDate}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          {(() => {
                            const timeMap: Record<string, string> = {
                              t1: "9:00 AM",
                              t2: "11:00 AM",
                              t3: "2:00 PM",
                              t4: "4:00 PM"
                            };
                            // Return the mapped time, or the original string if no match is found
                            return timeMap[w.bookingTime as keyof typeof timeMap] || w.bookingTime;
                          })()}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 font-body">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          {w.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Nearby Workshops Map */}
            <motion.div variants={itemVariants}>
              <div className='mb-5 z-' >
                <h2 className="text-2xl font-display font-bold text-[#1E1E1E]">Discover Workshops Near You</h2>
                <p className="text-xs text-gray-400 font-body mt-0.5">Plan your experience around Sri Lanka</p>
              </div>
              {/*  <NearbyWorkshopsMap /> */}
              <div style={{ height: '500px', width: '100%' }}>
                <MapContainer
                  center={[6.9271, 79.8612]} // Initial center [lat, lng]
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {mapPinpoints.map((pin) => (
                    <Marker key={pin.id} position={pin.position as [number, number]}>
                      <Popup>
                        {pin.label}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </motion.div>

            {/* Recommended For You — uses mock workshops filtered by interests */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-display font-bold text-gray-600">Recommended For You</h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">Based on your interests</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/browse" className="text-sm font-semibold font-body flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E8F4F4] text-[#1A6B6B] hover:bg-[#FAF6F0] hover:text-[#C1440E] transition-all border border-[#1A6B6B] hover:border-[#C1440E]">
                    Explore All <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedWorkshops.map((w) => (
                  <div
                    key={w.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="relative">
                      <img src={w.img} alt={w.name} className="w-full h-32 object-cover" />
                      <span
                        className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full text-white font-body"
                        style={{ backgroundColor: '#1A6B6B' }}>
                        {w.category}
                      </span>
                      <button
                        onClick={() => toggleSave(w.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                        <HeartIcon
                          className="w-3.5 h-3.5 transition-colors"
                          style={{ color: savedWorkshops.includes(w.id) ? '#E11D48' : '#9CA3AF' }}
                          fill={savedWorkshops.includes(w.id) ? '#E11D48' : 'none'} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-[#1E1E1E] text-sm font-body mb-0.5">{w.name}</h3>
                      <p className="text-xs text-gray-400 font-body mb-1">{w.artisan}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-semibold text-[#1E1E1E] font-body">{w.rating}</span>
                          <span className="text-xs text-gray-400 font-body">({w.reviews})</span>
                        </div>
                        <span className="font-bold text-xs font-body" style={{ color: '#C1440E' }}>{w.price}</span>
                      </div>
                      <Link
                        to={`/artist/${w.id}`}
                        className="mt-2.5 w-full py-1.5 rounded-lg border text-xs font-semibold font-body transition-colors text-center block"
                        style={{ borderColor: '#C1440E', color: '#C1440E' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#C1440E';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#C1440E';
                        }}>
                        Go to the Artisan
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── SIDEBAR ── */}
          <aside className="hidden xl:block w-60 shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-[#1E1E1E] font-body mb-3 uppercase tracking-wider">
                  Quick Links
                </h3>
                <div className="space-y-1 relative z-10">
                  <HashLink smooth to="/tourist/profile/edit" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#E8F4F4] hover:text-[#1A6B6B] transition-all duration-200 font-body group">
                    <UserIcon className="w-4 h-4 shrink-0 group-hover:scale-110 group-hover:fill-[#35d4d4] transition-transform" style={{ color: '#1A6B6B' }} /> Edit Profile </HashLink>
                  <HashLink smooth to="/tourist/profile#myWishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#E8F4F4] hover:text-[#1A6B6B] transition-all duration-200 font-body group">
                    <HeartIcon className="w-4 h-4 shrink-0 group-hover:scale-110 group-hover:fill-[#35d4d4] transition-transform" style={{ color: '#1A6B6B' }} /> My Wishlist </HashLink>
                  <HashLink smooth to="/tourist/profile#myBookings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#E8F4F4] hover:text-[#1A6B6B] transition-all duration-200 font-body group">
                    <CalendarIcon className="w-4 h-4 shrink-0 group-hover:scale-110 group-hover:fill-[#35d4d4] transition-transform" style={{ color: '#1A6B6B' }} /> My Bookings </HashLink>
                  <HashLink smooth to="/tourist/profile#myBlogs" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#E8F4F4] hover:text-[#1A6B6B] transition-all duration-200 font-body group">
                    <BookOpenIcon className="w-4 h-4 shrink-0 group-hover:scale-110 group-hover:fill-[#35d4d4] transition-transform" style={{ color: '#1A6B6B' }} /> My Blogs </HashLink>
                </div>
              </div>

              {/* Mini Calendar */}
              {!isLoading && (
                <MiniCalendar workshops={upcomingWorkshops} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}