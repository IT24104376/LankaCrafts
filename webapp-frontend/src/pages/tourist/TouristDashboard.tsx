import React, { useState, Children } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCapIcon,
  PenLineIcon,
  StarIcon,
  CalendarIcon,
  MapPinIcon,
  ChevronRightIcon,
  UserIcon,
  BookOpenIcon,
  HeartIcon,
  SettingsIcon,
  ChevronLeftIcon } from
'lucide-react';
import { TouristNavbar } from './TouristNavbar';
import { Link } from 'react-router-dom';
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
// ── Mini Calendar ──────────────────────────────────────────────
const WORKSHOP_DATES: Record<
  string,
  {
    name: string;
    status: string;
  }> =
{
  '2025-03-15': {
    name: 'Batik Textile Workshop',
    status: 'Confirmed'
  },
  '2025-03-22': {
    name: 'Traditional Pottery Class',
    status: 'Pending'
  },
  '2025-04-05': {
    name: 'Lacquerwork Masterclass',
    status: 'Confirmed'
  }
};
function MiniCalendar() {
  const [viewYear, setViewYear] = useState(2025);
  const [viewMonth, setViewMonth] = useState(2); // 0-indexed, 2 = March
  const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };
  const cells: (number | null)[] = [
  ...Array(firstDay).fill(null),
  ...Array.from(
    {
      length: daysInMonth
    },
    (_, i) => i + 1
  )];

  const getDateKey = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };
  const [tooltip, setTooltip] = useState<string | null>(null);
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

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) =>
        <div
          key={d}
          className="text-center text-[10px] font-bold text-gray-400 font-body py-1">

            {d}
          </div>
        )}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5 relative">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const key = getDateKey(day);
          const workshop = WORKSHOP_DATES[key];
          const isMarked = !!workshop;
          const isConfirmed = workshop?.status === 'Confirmed';
          return (
            <div
              key={key}
              className="relative flex items-center justify-center"
              onMouseEnter={() => isMarked && setTooltip(key)}
              onMouseLeave={() => setTooltip(null)}>

              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-body cursor-default transition-all ${isMarked ? isConfirmed ? 'text-white font-bold' : 'text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                style={
                isMarked ?
                {
                  backgroundColor: isConfirmed ? '#C1440E' : '#D97706'
                } :
                {}
                }>

                {day}
              </div>
              {/* Tooltip */}
              {tooltip === key &&
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 w-40 bg-[#1E1E1E] text-white text-xs rounded-xl px-3 py-2 shadow-xl font-body pointer-events-none">
                  <p className="font-semibold leading-snug">{workshop?.name}</p>
                  <p
                  className={`mt-0.5 ${isConfirmed ? 'text-green-400' : 'text-amber-400'}`}>

                    {workshop?.status}
                  </p>
                </div>
              }
            </div>);

        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: '#C1440E'
            }} />

          <span className="text-[10px] text-gray-400 font-body">Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-[10px] text-gray-400 font-body">Pending</span>
        </div>
      </div>
    </div>);

}
// ── Sri Lanka Map with Workshop Pins ──────────────────────────
function NearbyWorkshopsMap() {
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);
  const pins = [
  {
    id: 1,
    x: 112,
    y: 118,
    name: 'Batik Art Workshop',
    artisan: 'Kamala Wijesinghe',
    city: 'Kandy',
    color: '#C1440E'
  },
  {
    id: 2,
    x: 95,
    y: 195,
    name: 'Clay Pottery Class',
    artisan: 'Rohan De Silva',
    city: 'Kelaniya',
    color: '#1A6B6B'
  },
  {
    id: 3,
    x: 80,
    y: 240,
    name: 'Lacquer Masterclass',
    artisan: 'Nimal Perera',
    city: 'Colombo',
    color: '#C1440E'
  },
  {
    id: 4,
    x: 130,
    y: 265,
    name: 'Wood Carving',
    artisan: 'Suresh Fernando',
    city: 'Ambalangoda',
    color: '#1A6B6B'
  }];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-[#1E1E1E]">
            Workshops Near You
          </h2>
          <p className="text-xs text-gray-400 font-body mt-0.5">
            Based on your saved regions
          </p>
        </div>
        <Link
          to="/map"
          className="text-sm font-semibold font-body flex items-center gap-1"
          style={{
            color: '#1A6B6B'
          }}>

          Full Map <ChevronRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div
        className="relative mx-6 mb-6 rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#E8F4F4',
          height: 320
        }}>

        {/* Sri Lanka SVG outline */}
        <svg
          viewBox="0 0 200 360"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg">

          {/* Simplified Sri Lanka island shape */}
          <path
            d="M100,20 C115,18 128,25 138,38 C150,52 155,70 153,88 C158,105 162,122 160,140 C165,158 163,175 158,190 C155,205 148,218 140,228 C132,240 122,250 115,262 C108,274 105,288 100,298 C95,288 92,274 85,262 C78,250 68,240 60,228 C52,218 45,205 42,190 C37,175 35,158 40,140 C38,122 42,105 47,88 C45,70 50,52 62,38 C72,25 85,18 100,20Z"
            fill="#D4EDE8"
            stroke="#1A6B6B"
            strokeWidth="1.5"
            opacity="0.7" />

          {/* Interior texture lines */}
          <path
            d="M80,80 Q100,90 120,80"
            fill="none"
            stroke="#1A6B6B"
            strokeWidth="0.5"
            opacity="0.3" />

          <path
            d="M70,130 Q100,145 130,130"
            fill="none"
            stroke="#1A6B6B"
            strokeWidth="0.5"
            opacity="0.3" />

          <path
            d="M65,180 Q100,195 135,180"
            fill="none"
            stroke="#1A6B6B"
            strokeWidth="0.5"
            opacity="0.3" />

          <path
            d="M72,230 Q100,242 128,230"
            fill="none"
            stroke="#1A6B6B"
            strokeWidth="0.5"
            opacity="0.3" />

        </svg>

        {/* Workshop Pins */}
        {pins.map((pin) =>
        <div
          key={pin.id}
          className="absolute"
          style={{
            left: `${pin.x / 200 * 100}%`,
            top: `${pin.y / 360 * 100}%`,
            transform: 'translate(-50%, -100%)'
          }}
          onMouseEnter={() => setHoveredPin(pin.id)}
          onMouseLeave={() => setHoveredPin(null)}>

            {/* Pin */}
            <motion.div
            animate={
            hoveredPin === pin.id ?
            {
              scale: 1.2,
              y: -2
            } :
            {
              scale: 1,
              y: 0
            }
            }
            transition={{
              duration: 0.15
            }}
            className="cursor-pointer">

              <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              style={{
                backgroundColor: pin.color
              }}>

                <MapPinIcon className="w-4 h-4 text-white" />
              </div>
              <div
              className="w-2 h-2 mx-auto -mt-0.5 rotate-45"
              style={{
                backgroundColor: pin.color
              }} />

            </motion.div>

            {/* Tooltip */}
            {hoveredPin === pin.id &&
          <motion.div
            initial={{
              opacity: 0,
              y: 4
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-[#1E1E1E] text-white rounded-xl px-3 py-2.5 shadow-xl z-20 pointer-events-none">

                <p className="text-xs font-bold font-body leading-snug">
                  {pin.name}
                </p>
                <p className="text-[10px] font-body mt-0.5 opacity-70">
                  {pin.artisan}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPinIcon className="w-3 h-3 opacity-60" />
                  <span className="text-[10px] font-body opacity-70">
                    {pin.city}
                  </span>
                </div>
              </motion.div>
          }
          </div>
        )}

        {/* Map attribution */}
        <div className="absolute bottom-2 right-3">
          <span className="text-[9px] text-[#1A6B6B]/50 font-body">
            Sri Lanka
          </span>
        </div>
      </div>
    </div>);

}
// ── Main Dashboard ─────────────────────────────────────────────
export function TouristDashboard() {
  const [savedWorkshops, setSavedWorkshops] = useState<number[]>([]);
  const toggleSave = (id: number) => {
    setSavedWorkshops((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const userCrafts = ['🎨 Batik', '⚱️ Pottery', '🪵 Wood Carving'];
  return (
    <div
      className="min-h-screen font-body"
      style={{
        backgroundColor: '#FAF6F0'
      }}>

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
              style={{
                background: 'linear-gradient(135deg, #C1440E 0%, #8B2E08 100%)'
              }}>

              {/* Batik pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern
                      id="dash-banner"
                      width="50"
                      height="50"
                      patternUnits="userSpaceOnUse">

                      <polygon
                        points="25,3 47,25 25,47 3,25"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5" />

                      <circle
                        cx="25"
                        cy="25"
                        r="4"
                        fill="none"
                        stroke="white"
                        strokeWidth="1" />

                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dash-banner)" />
                </svg>
              </div>

              <div className="relative z-10 flex items-start justify-between gap-6">
                {/* Left: greeting + stats */}
                <div>
                  <h1 className="text-3xl font-display font-bold mb-1">
                    Welcome back, Arjun! 👋
                  </h1>
                  <p className="text-white/75 text-base font-body mb-5">
                    Your Cultural Journey Continues
                  </p>

                  {/* Stats pills */}
                  <div className="flex gap-3 flex-wrap mb-5">
                    {[
                    {
                      label: '8 Workshops',
                      icon: '🎨'
                    },
                    {
                      label: '3 Blogs',
                      icon: '✍️'
                    }].
                    map(({ label, icon }) =>
                    <span
                      key={label}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium font-body"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.18)'
                      }}>

                        {icon} {label}
                      </span>
                    )}
                  </div>

                  {/* User meta */}
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border border-white/30 bg-white/10">
                      🇮🇳 India
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border border-white/30 bg-white/10">
                      🗣️ English
                    </span>
                  </div>
                </div>

                {/* Right: craft interest pills */}
                <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                  <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-1">
                    Your Interests
                  </p>
                  {userCrafts.map((craft) =>
                  <span
                    key={craft}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold font-body border border-white/30 bg-white/15 text-white whitespace-nowrap">

                      {craft}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-5">

              {[
              {
                icon: GraduationCapIcon,
                label: 'Workshops Attended',
                value: '8',
                color: '#1A6B6B',
                border: '#1A6B6B'
              },
              {
                icon: PenLineIcon,
                label: 'Blogs Posted',
                value: '3',
                color: '#C1440E',
                border: '#C1440E'
              },
              {
                icon: StarIcon,
                label: 'Reviews Given',
                value: '5',
                color: '#D97706',
                border: '#D97706'
              },
              {
                icon: CalendarIcon,
                label: 'Upcoming Bookings',
                value: '2',
                color: '#1A6B6B',
                border: '#1A6B6B'
              }].
              map(({ icon: Icon, label, value, color, border }) =>
              <div
                key={label}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4"
                style={{
                  borderLeftColor: border
                }}>

                  <Icon
                  className="w-5 h-5 mb-3"
                  style={{
                    color
                  }} />

                  <p className="text-3xl font-display font-bold text-[#1E1E1E]">
                    {value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-body">
                    {label}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Upcoming Workshops — highlighted */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-display font-bold text-[#1E1E1E]">
                    Your Upcoming Workshops
                  </h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">
                    Don't miss these scheduled sessions
                  </p>
                </div>
                <Link
                  to="/book"
                  className="text-sm font-semibold font-body flex items-center gap-1 hover:gap-2 transition-all"
                  style={{
                    color: '#1A6B6B'
                  }}>

                  View All <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
                {[
                {
                  id: 1,
                  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
                  name: 'Batik Textile Workshop',
                  artisan: 'Kamala Wijesinghe',
                  date: 'Mar 15, 2025',
                  status: 'Confirmed',
                  isNext: true
                },
                {
                  id: 2,
                  img: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&auto=format&fit=crop',
                  name: 'Traditional Pottery Class',
                  artisan: 'Rohan De Silva',
                  date: 'Mar 22, 2025',
                  status: 'Pending',
                  isNext: false
                },
                {
                  id: 3,
                  img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&auto=format&fit=crop',
                  name: 'Lacquerwork Masterclass',
                  artisan: 'Nimal Perera',
                  date: 'Apr 5, 2025',
                  status: 'Confirmed',
                  isNext: false
                }].
                map((w) =>
                <div
                  key={w.id}
                  className={`bg-white rounded-2xl overflow-hidden shrink-0 w-80 border transition-shadow duration-200 ${w.isNext ? 'border-[#C1440E] shadow-lg shadow-[#C1440E]/10' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>

                    <div className="relative">
                      <img
                      src={w.img}
                      alt={w.name}
                      className="w-full h-44 object-cover" />

                      {w.isNext &&
                    <span className="absolute top-3 left-3 bg-[#C1440E] text-white text-xs font-bold px-2.5 py-1 rounded-full font-body uppercase tracking-wide">
                          Next Up
                        </span>
                    }
                      <span
                      className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full font-body ${w.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>

                        {w.status}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-[#1E1E1E] text-base mb-1">
                        {w.name}
                      </h3>
                      <p
                      className="text-sm font-body mb-3"
                      style={{
                        color: '#1A6B6B'
                      }}>

                        {w.artisan}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400 font-body">
                        <CalendarIcon className="w-4 h-4" />
                        {w.date}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Nearby Workshops Map */}
            <motion.div variants={itemVariants}>
              <NearbyWorkshopsMap />
            </motion.div>

            {/* Recommended For You — compact */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-display font-bold text-gray-600">
                    Recommended For You
                  </h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">
                    Based on your interests
                  </p>
                </div>
                <Link
                  to="/browse"
                  className="text-sm font-semibold font-body flex items-center gap-1"
                  style={{
                    color: '#1A6B6B'
                  }}>

                  Explore All <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                {
                  id: 10,
                  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
                  category: '🎨 Batik',
                  name: 'Batik Art Workshop',
                  artisan: 'Kamala Wijesinghe',
                  location: 'Kandy',
                  rating: 4.9,
                  reviews: 128,
                  price: '$45'
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
                  price: '$38'
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
                  price: '$52'
                }].
                map((w) =>
                <div
                  key={w.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">

                    <div className="relative">
                      <img
                      src={w.img}
                      alt={w.name}
                      className="w-full h-32 object-cover" />

                      <span
                      className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full text-white font-body"
                      style={{
                        backgroundColor: '#1A6B6B'
                      }}>

                        {w.category}
                      </span>
                      <button
                      onClick={() => toggleSave(w.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform">

                        <HeartIcon
                        className="w-3.5 h-3.5 transition-colors"
                        style={{
                          color: savedWorkshops.includes(w.id) ?
                          '#E11D48' :
                          '#9CA3AF'
                        }}
                        fill={
                        savedWorkshops.includes(w.id) ? '#E11D48' : 'none'
                        } />

                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-[#1E1E1E] text-sm font-body mb-0.5">
                        {w.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-body mb-1">
                        {w.artisan}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-semibold text-[#1E1E1E] font-body">
                            {w.rating}
                          </span>
                          <span className="text-xs text-gray-400 font-body">
                            ({w.reviews})
                          </span>
                        </div>
                        <span
                        className="font-bold text-xs font-body"
                        style={{
                          color: '#C1440E'
                        }}>

                          {w.price}
                        </span>
                      </div>
                      <Link
                      to={`/artist/${w.id}`}
                      className="mt-2.5 w-full py-1.5 rounded-lg border text-xs font-semibold font-body transition-colors text-center block"
                      style={{
                        borderColor: '#C1440E',
                        color: '#C1440E'
                      }}
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
                )}
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
                  {[
                  {
                    icon: UserIcon,
                    label: 'Edit Profile',
                    href: '#'
                  },
                  {
                    icon: HeartIcon,
                    label: 'My Wishlist',
                    href: '#'
                  },
                  {
                    icon: CalendarIcon,
                    label: 'My Bookings',
                    href: '/book'
                  },
                  {
                    icon: BookOpenIcon,
                    label: 'My Blogs',
                    href: '/tourist/blogs'
                  }].
                  map(({ icon: Icon, label, href }) =>
                  <Link
                    key={label}
                    to={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#1E1E1E] hover:bg-[#FAF6F0] transition-colors font-body">

                      <Icon
                      className="w-4 h-4 shrink-0"
                      style={{
                        color: '#1A6B6B'
                      }} />

                      {label}
                    </Link>
                  )}
                </div>
              </div>

              {/* Mini Calendar */}
              <MiniCalendar />
            </div>
          </aside>
        </div>
      </div>
    </div>);

}