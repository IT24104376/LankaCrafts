import React, { useState, useRef, Children, memo, Component } from 'react';
import { motion } from 'framer-motion';
import {
  DownloadIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  StarIcon,
  UsersIcon,
  ActivityIcon,
  ServerIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  GlobeIcon,
  BarChart2Icon,
  RefreshCwIcon,
  FileTextIcon,
  TableIcon } from
'lucide-react';
// ─── Mock Data ────────────────────────────────────────────────────────────────
const DAILY_ACTIVITY = [
{
  label: 'Mon',
  users: 320,
  bookings: 48
},
{
  label: 'Tue',
  users: 410,
  bookings: 62
},
{
  label: 'Wed',
  users: 380,
  bookings: 55
},
{
  label: 'Thu',
  users: 520,
  bookings: 78
},
{
  label: 'Fri',
  users: 490,
  bookings: 71
},
{
  label: 'Sat',
  users: 610,
  bookings: 94
},
{
  label: 'Sun',
  users: 445,
  bookings: 67
}];

const WEEKLY_ACTIVITY = [
{
  label: 'W1',
  users: 2100,
  bookings: 310
},
{
  label: 'W2',
  users: 2450,
  bookings: 368
},
{
  label: 'W3',
  users: 2280,
  bookings: 342
},
{
  label: 'W4',
  users: 2890,
  bookings: 435
},
{
  label: 'W5',
  users: 3120,
  bookings: 468
},
{
  label: 'W6',
  users: 2760,
  bookings: 414
}];

const MONTHLY_ACTIVITY = [
{
  label: 'Jul',
  users: 8200,
  bookings: 1230
},
{
  label: 'Aug',
  users: 9400,
  bookings: 1410
},
{
  label: 'Sep',
  users: 8800,
  bookings: 1320
},
{
  label: 'Oct',
  users: 10200,
  bookings: 1530
},
{
  label: 'Nov',
  users: 11500,
  bookings: 1725
},
{
  label: 'Dec',
  users: 13200,
  bookings: 1980
}];

const USER_STATUS_DATA = [
{
  label: 'Active',
  value: 17891,
  color: '#2F5D50'
},
{
  label: 'Inactive',
  value: 3420,
  color: '#C9A227'
},
{
  label: 'Suspended',
  value: 529,
  color: '#C65D3B'
}];

const TOP_ARTISANS = [
{
  rank: 1,
  name: 'Nimal Perera',
  craft: 'Kandyan Lacquerwork',
  region: 'Kandy',
  rating: 4.9,
  reviews: 124,
  bookings: 312,
  initials: 'NP',
  color: '#C65D3B'
},
{
  rank: 2,
  name: 'Priya Rajapaksa',
  craft: 'Palmyra Weaving',
  region: 'Jaffna',
  rating: 4.9,
  reviews: 98,
  bookings: 287,
  initials: 'PR',
  color: '#2F5D50'
},
{
  rank: 3,
  name: 'Kamala Wijesinghe',
  craft: 'Batik Textiles',
  region: 'Kandy',
  rating: 4.8,
  reviews: 156,
  bookings: 264,
  initials: 'KW',
  color: '#C9A227'
},
{
  rank: 4,
  name: 'Rohan De Silva',
  craft: 'Pottery',
  region: 'Kelaniya',
  rating: 4.8,
  reviews: 89,
  bookings: 198,
  initials: 'RD',
  color: '#C65D3B'
},
{
  rank: 5,
  name: 'Suresh Fernando',
  craft: 'Mask Carving',
  region: 'Ambalangoda',
  rating: 4.7,
  reviews: 112,
  bookings: 176,
  initials: 'SF',
  color: '#2F5D50'
},
{
  rank: 6,
  name: 'Nilmini Senanayake',
  craft: 'Gem Polishing',
  region: 'Ratnapura',
  rating: 4.5,
  reviews: 67,
  bookings: 143,
  initials: 'NS',
  color: '#C9A227'
}];

const WORKSHOP_POPULARITY = [
{
  name: 'Batik Textiles',
  bookings: 842,
  color: '#2F5D50'
},
{
  name: 'Kandyan Lacquerwork',
  bookings: 718,
  color: '#C65D3B'
},
{
  name: 'Mask Carving',
  bookings: 634,
  color: '#C9A227'
},
{
  name: 'Pottery',
  bookings: 521,
  color: '#2F5D50'
},
{
  name: 'Palmyra Weaving',
  bookings: 489,
  color: '#C65D3B'
},
{
  name: 'Gem Polishing',
  bookings: 312,
  color: '#C9A227'
},
{
  name: 'Brasswork',
  bookings: 287,
  color: '#2F5D50'
}];

const TOURIST_COUNTRIES = [
{
  country: 'United Kingdom',
  code: 'GB',
  tourists: 4820,
  bookings: 724,
  pct: 26,
  color: '#2F5D50'
},
{
  country: 'Germany',
  code: 'DE',
  tourists: 3210,
  bookings: 481,
  pct: 17,
  color: '#C65D3B'
},
{
  country: 'Australia',
  code: 'AU',
  tourists: 2890,
  bookings: 433,
  pct: 16,
  color: '#C9A227'
},
{
  country: 'France',
  code: 'FR',
  tourists: 2340,
  bookings: 351,
  pct: 13,
  color: '#6366f1'
},
{
  country: 'Japan',
  code: 'JP',
  tourists: 1980,
  bookings: 297,
  pct: 11,
  color: '#ec4899'
},
{
  country: 'Others',
  code: '--',
  tourists: 3180,
  bookings: 477,
  pct: 17,
  color: '#94a3b8'
}];

const SYSTEM_METRICS = [
{
  label: 'Uptime',
  value: '99.97%',
  status: 'good',
  icon: <CheckCircleIcon className="w-4 h-4" />,
  color: '#2F5D50',
  bg: 'bg-emerald-50',
  text: 'text-emerald-700'
},
{
  label: 'Avg Response',
  value: '142ms',
  status: 'good',
  icon: <ActivityIcon className="w-4 h-4" />,
  color: '#C9A227',
  bg: 'bg-mustard/10',
  text: 'text-mustard-dark'
},
{
  label: 'Error Rate',
  value: '0.08%',
  status: 'good',
  icon: <AlertTriangleIcon className="w-4 h-4" />,
  color: '#C65D3B',
  bg: 'bg-red-50',
  text: 'text-red-600'
},
{
  label: 'Active Sessions',
  value: '1,284',
  status: 'good',
  icon: <UsersIcon className="w-4 h-4" />,
  color: '#6366f1',
  bg: 'bg-indigo-50',
  text: 'text-indigo-600'
}];

const RESPONSE_TIME_DATA = [
{
  label: '00:00',
  value: 128
},
{
  label: '03:00',
  value: 95
},
{
  label: '06:00',
  value: 108
},
{
  label: '09:00',
  value: 187
},
{
  label: '12:00',
  value: 210
},
{
  label: '15:00',
  value: 195
},
{
  label: '18:00',
  value: 168
},
{
  label: '21:00',
  value: 142
}];

const ERROR_LOGS = [
{
  id: 1,
  type: 'Warning',
  message: 'High memory usage detected on API server',
  time: '14:32',
  resolved: false
},
{
  id: 2,
  type: 'Error',
  message: 'Payment gateway timeout (3 occurrences)',
  time: '12:18',
  resolved: true
},
{
  id: 3,
  type: 'Info',
  message: 'Scheduled backup completed successfully',
  time: '10:00',
  resolved: true
},
{
  id: 4,
  type: 'Warning',
  message: 'Image CDN response time elevated',
  time: '09:45',
  resolved: true
},
{
  id: 5,
  type: 'Error',
  message: 'Failed login attempts from IP 192.168.x.x',
  time: '08:12',
  resolved: false
}];

// ─── SVG Chart Components ─────────────────────────────────────────────────────
function LineChart({
  data,
  color = '#2F5D50',
  secondColor = '#C65D3B'








}: {data: {label: string;users: number;bookings: number;}[];color?: string;secondColor?: string;}) {
  const W = 560;
  const H = 180;
  const PAD = {
    top: 16,
    right: 16,
    bottom: 32,
    left: 48
  };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxUsers = Math.max(...data.map((d) => d.users));
  const maxBookings = Math.max(...data.map((d) => d.bookings));
  const maxVal = Math.max(maxUsers, maxBookings) * 1.15;
  const xStep = chartW / (data.length - 1);
  const yScale = (v: number) => chartH - v / maxVal * chartH;
  const usersPath = data.
  map(
    (d, i) =>
    `${i === 0 ? 'M' : 'L'} ${PAD.left + i * xStep} ${PAD.top + yScale(d.users)}`
  ).
  join(' ');
  const bookingsPath = data.
  map(
    (d, i) =>
    `${i === 0 ? 'M' : 'L'} ${PAD.left + i * xStep} ${PAD.top + yScale(d.bookings)}`
  ).
  join(' ');
  const usersFill = `${usersPath} L ${PAD.left + (data.length - 1) * xStep} ${PAD.top + chartH} L ${PAD.left} ${PAD.top + chartH} Z`;
  const bookingsFill = `${bookingsPath} L ${PAD.left + (data.length - 1) * xStep} ${PAD.top + chartH} L ${PAD.left} ${PAD.top + chartH} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxVal * t));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={secondColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={secondColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick, i) => {
        const y = PAD.top + chartH - tick / maxVal * chartH;
        return (
          <g key={i}>
            <line
              x1={PAD.left}
              y1={y}
              x2={PAD.left + chartW}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1" />

            <text
              x={PAD.left - 6}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#94a3b8">

              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </text>
          </g>);

      })}

      {/* Fill areas */}
      <path d={usersFill} fill="url(#usersGrad)" />
      <path d={bookingsFill} fill="url(#bookingsGrad)" />

      {/* Lines */}
      <path
        d={usersPath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round" />

      <path
        d={bookingsPath}
        fill="none"
        stroke={secondColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 3" />


      {/* X-axis labels */}
      {data.map((d, i) =>
      <text
        key={i}
        x={PAD.left + i * xStep}
        y={H - 6}
        textAnchor="middle"
        fontSize="10"
        fill="#94a3b8">

          {d.label}
        </text>
      )}

      {/* Dots */}
      {data.map((d, i) =>
      <circle
        key={i}
        cx={PAD.left + i * xStep}
        cy={PAD.top + yScale(d.users)}
        r="3.5"
        fill="white"
        stroke={color}
        strokeWidth="2" />

      )}
    </svg>);

}
function BarChart({
  data






}: {data: {label: string;value: number;color: string;}[];}) {
  const W = 400;
  const H = 160;
  const PAD = {
    top: 12,
    right: 12,
    bottom: 28,
    left: 40
  };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.1;
  const barW = chartW / data.length * 0.55;
  const gap = chartW / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {data.map((d, i) => {
        const barH = d.value / maxVal * chartH;
        const x = PAD.left + i * gap + (gap - barW) / 2;
        const y = PAD.top + chartH - barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={PAD.top + chartH}
              width={barW}
              height={0}
              fill={d.color}
              rx="4"
              opacity="0.15" />

            <motion.rect
              x={x}
              y={y}
              width={barW}
              rx="4"
              fill={d.color}
              initial={{
                height: 0,
                y: PAD.top + chartH
              }}
              animate={{
                height: barH,
                y
              }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }} />

            <text
              x={x + barW / 2}
              y={H - 6}
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8">

              {d.label}
            </text>
            <text
              x={x + barW / 2}
              y={y - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#64748b"
              fontWeight="600">

              {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
            </text>
          </g>);

      })}
      {/* Y axis */}
      <line
        x1={PAD.left}
        y1={PAD.top}
        x2={PAD.left}
        y2={PAD.top + chartH}
        stroke="#e2e8f0"
        strokeWidth="1" />

    </svg>);

}
function HorizontalBar({
  data






}: {data: {name: string;bookings: number;color: string;}[];}) {
  const maxVal = Math.max(...data.map((d) => d.bookings));
  return (
    <div className="space-y-3">
      {data.map((item, i) =>
      <div key={i} className="flex items-center gap-3">
          <p className="text-xs text-gray-600 w-36 shrink-0 truncate font-medium">
            {item.name}
          </p>
          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: item.color
            }}
            initial={{
              width: 0
            }}
            animate={{
              width: `${item.bookings / maxVal * 100}%`
            }}
            transition={{
              delay: i * 0.07,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }} />

          </div>
          <p className="text-xs font-bold text-gray-700 w-10 text-right shrink-0">
            {item.bookings}
          </p>
        </div>
      )}
    </div>);

}
function DonutChart({
  data






}: {data: {country: string;pct: number;color: string;}[];}) {
  const R = 70;
  const CX = 90;
  const CY = 90;
  let cumulative = 0;
  const slices = data.map((d) => {
    const start = cumulative;
    cumulative += d.pct;
    return {
      ...d,
      start,
      end: cumulative
    };
  });
  const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number) =>
  {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };
  const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startPct: number,
  endPct: number) =>
  {
    const startAngle = startPct / 100 * 360;
    const endAngle = endPct / 100 * 360;
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
  };
  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      {slices.map((s, i) =>
      <motion.path
        key={i}
        d={describeArc(CX, CY, R, s.start, s.end)}
        fill={s.color}
        stroke="white"
        strokeWidth="2"
        initial={{
          opacity: 0,
          scale: 0.8
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          delay: i * 0.08,
          duration: 0.4
        }}
        style={{
          transformOrigin: `${CX}px ${CY}px`
        }} />

      )}
      {/* Center hole */}
      <circle cx={CX} cy={CY} r={42} fill="white" />
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        fontSize="18"
        fontWeight="800"
        fill="#1e293b">

        18k
      </text>
      <text x={CX} y={CY + 12} textAnchor="middle" fontSize="9" fill="#94a3b8">
        Tourists
      </text>
    </svg>);

}
function ResponseTimeChart({
  data





}: {data: {label: string;value: number;}[];}) {
  const W = 500;
  const H = 120;
  const PAD = {
    top: 12,
    right: 16,
    bottom: 28,
    left: 44
  };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxVal = 300;
  const xStep = chartW / (data.length - 1);
  const yScale = (v: number) => chartH - v / maxVal * chartH;
  const linePath = data.
  map(
    (d, i) =>
    `${i === 0 ? 'M' : 'L'} ${PAD.left + i * xStep} ${PAD.top + yScale(d.value)}`
  ).
  join(' ');
  const fillPath = `${linePath} L ${PAD.left + (data.length - 1) * xStep} ${PAD.top + chartH} L ${PAD.left} ${PAD.top + chartH} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="rtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 100, 200, 300].map((tick) => {
        const y = PAD.top + chartH - tick / maxVal * chartH;
        return (
          <g key={tick}>
            <line
              x1={PAD.left}
              y1={y}
              x2={PAD.left + chartW}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1" />

            <text
              x={PAD.left - 6}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#94a3b8">

              {tick}ms
            </text>
          </g>);

      })}
      <path d={fillPath} fill="url(#rtGrad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round" />

      {data.map((d, i) =>
      <g key={i}>
          <text
          x={PAD.left + i * xStep}
          y={H - 6}
          textAnchor="middle"
          fontSize="9"
          fill="#94a3b8">

            {d.label}
          </text>
          <circle
          cx={PAD.left + i * xStep}
          cy={PAD.top + yScale(d.value)}
          r="3"
          fill="white"
          stroke="#6366f1"
          strokeWidth="2" />

        </g>
      )}
    </svg>);

}
// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  icon,
  title,
  subtitle




}: {icon: React.ReactNode;title: string;subtitle: string;}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 bg-forest/10 rounded-xl flex items-center justify-center text-forest shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-900 font-display">
          {title}
        </h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>);

}
// ─── Main Component ───────────────────────────────────────────────────────────
export function AnalyticsReports() {
  const [activityPeriod, setActivityPeriod] = useState<
    'daily' | 'weekly' | 'monthly'>(
    'daily');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const activityData =
  activityPeriod === 'daily' ?
  DAILY_ACTIVITY :
  activityPeriod === 'weekly' ?
  WEEKLY_ACTIVITY :
  MONTHLY_ACTIVITY;
  const handleExport = (format: 'pdf' | 'csv') => {
    alert(`Exporting report as ${format.toUpperCase()}... (demo)`);
  };
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 16
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6">

      {/* ── Page Header ── */}
      <motion.div
        variants={cardVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-black text-gray-900 font-display mb-1">
            Analytics & Reports
          </h1>
          <p className="text-gray-500 text-sm">
            Platform performance, user insights, and system health
          </p>
        </div>

        {/* Date Range + Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-xs text-gray-600 outline-none bg-transparent" />

            <span className="text-gray-300 text-xs">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-xs text-gray-600 outline-none bg-transparent" />

          </div>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 px-3 py-2 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-xs font-bold transition-colors shadow-sm">

            <FileTextIcon className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-3 py-2 bg-forest hover:bg-forest-dark text-white rounded-xl text-xs font-bold transition-colors shadow-sm">

            <TableIcon className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </motion.div>

      {/* ── Section 1: Platform Activity Analytics ── */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <SectionHeader
            icon={<ActivityIcon className="w-5 h-5" />}
            title="Platform Activity Analytics"
            subtitle="User engagement and booking trends over time" />

          {/* Period Switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 shrink-0">
            {(['daily', 'weekly', 'monthly'] as const).map((p) =>
            <button
              key={p}
              onClick={() => setActivityPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${activityPeriod === p ? 'bg-white text-forest shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

                {p}
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-forest rounded" />
            <span className="text-xs text-gray-500">Active Users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-0.5 bg-terracotta rounded border-dashed"
              style={{
                borderTop: '2px dashed #C65D3B',
                background: 'none'
              }} />

            <span className="text-xs text-gray-500">Bookings</span>
          </div>
        </div>

        <div className="h-44">
          <LineChart data={activityData} />
        </div>

        {/* Summary stats row */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xl font-black text-gray-900 font-display">
              {activityPeriod === 'daily' ?
              '3,175' :
              activityPeriod === 'weekly' ?
              '15,600' :
              '61,300'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Total Users</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-xl font-black text-gray-900 font-display">
              {activityPeriod === 'daily' ?
              '475' :
              activityPeriod === 'weekly' ?
              '2,337' :
              '9,195'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Total Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-gray-900 font-display flex items-center justify-center gap-1">
              <TrendingUpIcon className="w-4 h-4 text-emerald-500" /> +18%
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Growth Rate</p>
          </div>
        </div>
      </motion.div>

      {/* Active vs Inactive Users */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <SectionHeader
          icon={<UsersIcon className="w-5 h-5" />}
          title="User Status Distribution"
          subtitle="Active, inactive, and suspended account breakdown" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-36">
            <BarChart
              data={USER_STATUS_DATA.map((d) => ({
                label: d.label,
                value: d.value,
                color: d.color
              }))} />

          </div>
          <div className="space-y-3">
            {USER_STATUS_DATA.map((item) =>
            <div
              key={item.label}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">

                <div className="flex items-center gap-2.5">
                  <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: item.color
                  }} />

                  <span className="text-sm font-medium text-gray-700">
                    {item.label} Users
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {item.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(item.value / 21840 * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Section 2: Top Artisans & Popular Workshops ── */}
      {/* Top 3 Highlight Cards */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-mustard/10 rounded-xl flex items-center justify-center text-mustard shrink-0">
            <StarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 font-display">
              Top Rated Artisans
            </h2>
            <p className="text-xs text-gray-400">
              Highest rated and most booked artisans on the platform
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {TOP_ARTISANS.slice(0, 3).map((artisan, i) =>
          <motion.div
            key={artisan.rank}
            variants={cardVariants}
            className="bg-white rounded-2xl border border-gray-200 p-5 relative overflow-hidden">

              {/* Rank badge */}
              <div
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
              style={{
                backgroundColor:
                i === 0 ? '#C9A227' : i === 1 ? '#94a3b8' : '#C65D3B',
                color: 'white'
              }}>

                #{artisan.rank}
              </div>
              {/* Subtle color bar */}
              <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{
                backgroundColor: artisan.color
              }} />


              <div className="flex items-center gap-3 mb-3">
                <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{
                  backgroundColor: artisan.color
                }}>

                  {artisan.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">
                    {artisan.name}
                  </p>
                  <p className="text-xs text-gray-400">{artisan.craft}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) =>
              <StarIcon
                key={s}
                className={`w-3.5 h-3.5 ${s <= Math.floor(artisan.rating) ? 'text-mustard fill-mustard' : 'text-gray-200 fill-gray-200'}`} />

              )}
                <span className="text-xs font-bold text-gray-700 ml-1">
                  {artisan.rating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg py-2">
                  <p className="text-sm font-black text-gray-900">
                    {artisan.reviews}
                  </p>
                  <p className="text-[10px] text-gray-400">Reviews</p>
                </div>
                <div className="bg-gray-50 rounded-lg py-2">
                  <p className="text-sm font-black text-gray-900">
                    {artisan.bookings}
                  </p>
                  <p className="text-[10px] text-gray-400">Bookings</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Full Ranked Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <p className="text-sm font-bold text-gray-700">
              Full Artisan Rankings
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Artisan
                </th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Craft
                </th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Region
                </th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="text-right px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Bookings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_ARTISANS.map((a, i) =>
              <motion.tr
                key={a.rank}
                initial={{
                  opacity: 0,
                  x: -8
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: i * 0.05
                }}
                className="hover:bg-gray-50/50 transition-colors">

                  <td className="px-6 py-3.5">
                    <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white inline-flex"
                    style={{
                      backgroundColor:
                      i === 0 ?
                      '#C9A227' :
                      i === 1 ?
                      '#94a3b8' :
                      i === 2 ?
                      '#C65D3B' :
                      '#e2e8f0',
                      color: i < 3 ? 'white' : '#64748b'
                    }}>

                      {a.rank}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: a.color
                      }}>

                        {a.initials}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {a.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-600">
                    {a.craft}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">
                    {a.region}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-3.5 h-3.5 text-mustard fill-mustard" />
                      <span className="text-sm font-bold text-gray-800">
                        {a.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-600">
                    {a.reviews}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="text-sm font-bold text-forest">
                      {a.bookings}
                    </span>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Workshop Popularity */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <SectionHeader
          icon={<BarChart2Icon className="w-5 h-5" />}
          title="Workshop Popularity"
          subtitle="Total bookings by craft type" />

        <HorizontalBar data={WORKSHOP_POPULARITY} />
      </motion.div>

      {/* ── Section 3: Tourist Demographics ── */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <SectionHeader
          icon={<GlobeIcon className="w-5 h-5" />}
          title="Tourist Demographics"
          subtitle="Geographic distribution of platform visitors" />


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Donut Chart + Legend */}
          <div className="flex items-center gap-6">
            <div className="w-44 h-44 shrink-0">
              <DonutChart data={TOURIST_COUNTRIES} />
            </div>
            <div className="space-y-2 flex-1">
              {TOURIST_COUNTRIES.map((c) =>
              <div key={c.country} className="flex items-center gap-2">
                  <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: c.color
                  }} />

                  <span className="text-xs text-gray-600 flex-1 truncate">
                    {c.country}
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {c.pct}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Country Stats Table */}
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tourists
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TOURIST_COUNTRIES.map((c, i) =>
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: c.color
                        }} />

                        <span className="text-sm text-gray-700 font-medium">
                          {c.country}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">
                      {c.tourists.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-forest">
                      {c.bookings.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                          className="h-full rounded-full"
                          style={{
                            width: `${c.pct}%`,
                            backgroundColor: c.color
                          }} />

                        </div>
                        <span className="text-xs font-bold text-gray-600 w-8 text-right">
                          {c.pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ── Section 4: System Performance Monitoring ── */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <SectionHeader
          icon={<ServerIcon className="w-5 h-5" />}
          title="System Performance Monitoring"
          subtitle="Real-time platform health and infrastructure metrics" />


        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {SYSTEM_METRICS.map((m, i) =>
          <motion.div
            key={m.label}
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: i * 0.07
            }}
            className={`${m.bg} rounded-xl p-4 border border-gray-100`}>

              <div className={`flex items-center gap-2 mb-2 ${m.text}`}>
                {m.icon}
                <span className="text-xs font-semibold">{m.label}</span>
              </div>
              <p className="text-2xl font-black text-gray-900 font-display">
                {m.value}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircleIcon className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-600 font-medium">
                  Healthy
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Response Time Chart */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700">
              Response Time (Last 24h)
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-0.5 bg-indigo-500 rounded" />
              <span>Avg: 142ms</span>
            </div>
          </div>
          <div className="h-28">
            <ResponseTimeChart data={RESPONSE_TIME_DATA} />
          </div>
        </div>

        {/* Error Logs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700">Error Log Summary</p>
            <button className="flex items-center gap-1.5 text-xs text-forest font-semibold hover:text-forest-dark transition-colors">
              <RefreshCwIcon className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          <div className="space-y-2">
            {ERROR_LOGS.map((log, i) =>
            <motion.div
              key={log.id}
              initial={{
                opacity: 0,
                x: -8
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: i * 0.06
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${log.resolved ? 'bg-gray-50 border-gray-100' : 'bg-amber-50/50 border-amber-100'}`}>

                <div
                className={`w-2 h-2 rounded-full shrink-0 ${log.type === 'Error' ? 'bg-red-500' : log.type === 'Warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />

                <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${log.type === 'Error' ? 'bg-red-100 text-red-600' : log.type === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'}`}>

                  {log.type}
                </span>
                <p className="text-xs text-gray-700 flex-1">{log.message}</p>
                <span className="text-xs text-gray-400 shrink-0">
                  {log.time}
                </span>
                <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${log.resolved ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>

                  {log.resolved ? 'Resolved' : 'Open'}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Export Panel ── */}
      <motion.div
        variants={cardVariants}
        className="bg-forest rounded-2xl p-6 relative overflow-hidden">

        {/* Batik pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="export-batik"
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse">

                <circle
                  cx="16"
                  cy="16"
                  r="9"
                  fill="none"
                  stroke="white"
                  strokeWidth="1" />

                <circle cx="16" cy="16" r="3" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#export-batik)" />
          </svg>
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold font-display text-lg mb-1">
              Export Full Report
            </h3>
            <p className="text-white/60 text-sm">
              Download a complete analytics report for the selected date range
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-sm font-bold transition-colors shadow-md">

              <FileTextIcon className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-5 py-2.5 bg-mustard hover:bg-mustard-dark text-forest rounded-xl text-sm font-bold transition-colors shadow-md">

              <TableIcon className="w-4 h-4" /> Download CSV
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>);

}