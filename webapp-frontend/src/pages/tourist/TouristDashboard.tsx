import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import {
  GraduationCapIcon,
  PenLineIcon,
  StarIcon,
  CalendarIcon,
  ChevronRightIcon,
  UserIcon,
  BookOpenIcon,
  HeartIcon,
  ChevronLeftIcon
} from 'lucide-react';
import { TouristNavbar } from './TouristNavbar';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../../context/AuthContext';
import { getStats, getMockUpcomingWorkshops, MockWorkshop, getSavedWorkshops, addSavedWorkshop, removeSavedWorkshop } from '../../services/api';
import { INTEREST_MAP } from '../../constants/touristConstants';

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

// Define your pinpoint data
const pinpoints = [
  { id: 1, position: [6.9271, 79.8612], label: "Location A" },
  { id: 2, position: [6.9000, 79.9000], label: "Location B" },
  { id: 3, position: [7.2906, 80.6337], label: "Location C" },
];

// ── Country flag helper ─────────────────────────────────────────────────────
const COUNTRY_FLAGS: Record<string, string> = {
  India: '🇮🇳',
  'United Kingdom': '🇬🇧',
  UK: '🇬🇧',
  USA: '🇺🇸',
  'United States': '🇺🇸',
  France: '🇫🇷',
  Germany: '🇩🇪',
  Japan: '🇯🇵',
  Australia: '🇦🇺',
  Canada: '🇨🇦',
  China: '🇨🇳',
  Italy: '🇮🇹',
  Spain: '🇪🇸',
  Brazil: '🇧🇷',
  'Sri Lanka': '🇱🇰',
};

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? '🌍';
}

// ── Mini Calendar ──────────────────────────────────────────────
function MiniCalendar() {
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
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const key = getDateKey(day);
          const isToday = key === todayKey;
          return (
            <div key={key} className="flex items-center justify-center">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-body cursor-default transition-all ${isToday ? 'text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                style={isToday ? { backgroundColor: '#C1440E' } : {}}>
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

// ── Recommended workshops (mock) ────────────────────────────────
const RECOMMENDED_WORKSHOPS = [
  {
    id: 10,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
    category: '🎨 Batik',
    name: 'Batik Art Workshop',
    artisan: 'Kamala Wijesinghe',
    location: 'Kandy',
    rating: 4.9,
    reviews: 128,
    price: '$45',
  },
  {
    id: 11,
    img: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&auto=format&fit=crop',
    category: '⚱️ Pottery',
    name: 'Clay & Wheel Pottery',
    artisan: 'Rohan De Silva',
    location: 'Kelaniya',
    rating: 4.8,
    reviews: 94,
    price: '$38',
  },
  {
    id: 12,
    img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&auto=format&fit=crop',
    category: '🪵 Wood Carving',
    name: 'Traditional Mask Carving',
    artisan: 'Suresh Fernando',
    location: 'Ambalangoda',
    rating: 4.7,
    reviews: 76,
    price: '$52',
  },
];

// ── Main Dashboard ─────────────────────────────────────────────
interface Stats {
  workshopsAttended: number;
  blogsPosted: number;
  reviewsGiven: number;
  upcomingBookings: number;
}

export function TouristDashboard() {
  const { tourist, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [upcomingWorkshops, setUpcomingWorkshops] = useState<MockWorkshop[]>([]);

  const [savedWorkshops, setSavedWorkshops] = useState<number[]>([]);

  // Fetch saved workshops real data from backend
  useEffect(() => {
    if (!tourist) return;
    getSavedWorkshops().then(res => {
      const saved = (res.data.savedWorkshops || []).map(Number);
      setSavedWorkshops(saved);
    }).catch(console.error);
  }, [tourist]);

  const toggleSave = async (id: number) => {
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

  // Load mock upcoming workshops
  useEffect(() => {
    getMockUpcomingWorkshops().then(setUpcomingWorkshops);
  }, []);

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
    { icon: GraduationCapIcon, label: 'Workshops Attended', value: stats?.workshopsAttended ?? 0, color: '#1A6B6B', border: '#1A6B6B' },
    { icon: PenLineIcon, label: 'Blogs Posted', value: stats?.blogsPosted ?? 0, color: '#C1440E', border: '#C1440E' },
    { icon: StarIcon, label: 'Reviews Given', value: stats?.reviewsGiven ?? 0, color: '#D97706', border: '#D97706' },
    { icon: CalendarIcon, label: 'Upcoming Bookings', value: stats?.upcomingBookings ?? 0, color: '#1A6B6B', border: '#1A6B6B' },
  ];

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#FAF6F0' }}>
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
              {statCards.map(({ icon: Icon, label, value, color, border }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4"
                  style={{ borderLeftColor: border }}>
                  <Icon className="w-5 h-5 mb-3" style={{ color }} />
                  {isLoading ? (
                    <>
                      <SkeletonBlock className="h-8 w-12 mb-2" />
                      <SkeletonBlock className="h-3 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-display font-bold text-[#1E1E1E]">{value}</p>
                      <p className="text-xs text-gray-400 mt-1 font-body">{label}</p>
                    </>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Upcoming Workshops — powered by mock API */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-display font-bold text-[#1E1E1E]">Your Upcoming Workshops</h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">Don't miss these scheduled sessions</p>
                </div>
                <Link to="/book" className="text-sm font-semibold font-body flex items-center gap-1 hover:gap-2 transition-all" style={{ color: '#1A6B6B' }}>
                  View All <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
                {upcomingWorkshops.map((w) => (
                  <div
                    key={w.id}
                    className={`bg-white rounded-2xl overflow-hidden shrink-0 w-80 border transition-shadow duration-200 ${w.isNext ? 'border-[#C1440E] shadow-lg shadow-[#C1440E]/10' : 'border-gray-100 shadow-sm hover:shadow-md'
                      }`}>
                    <div className="relative">
                      <img src={w.img} alt={w.name} className="w-full h-44 object-cover" />
                      {w.isNext && (
                        <span className="absolute top-3 left-3 bg-[#C1440E] text-white text-xs font-bold px-2.5 py-1 rounded-full font-body uppercase tracking-wide">
                          Next Up
                        </span>
                      )}
                      <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full font-body ${w.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {w.status}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-[#1E1E1E] text-base mb-1">{w.name}</h3>
                      <p className="text-sm font-body mb-3" style={{ color: '#1A6B6B' }}>{w.artisan}</p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400 font-body">
                        <CalendarIcon className="w-4 h-4" />
                        {w.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Nearby Workshops Map */}
            <motion.div variants={itemVariants}>
              <div className='mb-5' >
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

                  {pinpoints.map((pin) => (
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
                <Link to="/browse" className="text-sm font-semibold font-body flex items-center gap-1" style={{ color: '#1A6B6B' }}>
                  Explore All <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {RECOMMENDED_WORKSHOPS.map((w) => (
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
                <div className="space-y-1">
                  <HashLink smooth to="/tourist/profile/edit" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#FAF6F0] transition-colors font-body">
                    <UserIcon className="w-4 h-4 shrink-0" style={{ color: '#1A6B6B' }} /> Edit Profile </HashLink>
                  <HashLink smooth to="/tourist/profile#myWishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#FAF6F0] transition-colors font-body">
                    <HeartIcon className="w-4 h-4 shrink-0" style={{ color: '#1A6B6B' }} /> My Wishlist </HashLink>
                  <HashLink smooth to="/tourist/profile#myBookings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#FAF6F0] transition-colors font-body">
                    <CalendarIcon className="w-4 h-4 shrink-0" style={{ color: '#1A6B6B' }} /> My Bookings </HashLink>
                  <HashLink smooth to="/tourist/profile#myBlogs" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#FAF6F0] transition-colors font-body">
                    <BookOpenIcon className="w-4 h-4 shrink-0" style={{ color: '#1A6B6B' }} /> My Blogs </HashLink>
                </div>
              </div>

              {/* Mini Calendar */}
              <MiniCalendar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}