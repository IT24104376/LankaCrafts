import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  DownloadIcon,
  CalendarIcon,
  TrendingUpIcon,
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
import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  getActivityChart,
  getTopArtisans,
  getTouristDemographics,
  getWorkshopPopularity
} from '../../api/adminApi';

// ─── Static / Fallback Data ───────────────────────────────────────────────────
const SYSTEM_METRICS = [
{
  label: 'Uptime',
  value: '99.97%',
  icon: <CheckCircleIcon className="w-4 h-4" />,
  color: '#2F5D50',
  bg: 'bg-emerald-50',
  text: 'text-emerald-700'
},
{
  label: 'Avg Response',
  value: '142ms',
  icon: <ActivityIcon className="w-4 h-4" />,
  color: '#C9A227',
  bg: 'bg-mustard/10',
  text: 'text-mustard-dark'
},
{
  label: 'Error Rate',
  value: '0.08%',
  icon: <AlertTriangleIcon className="w-4 h-4" />,
  color: '#C65D3B',
  bg: 'bg-red-50',
  text: 'text-red-600'
},
{
  label: 'Active Sessions',
  value: '1,284',
  icon: <UsersIcon className="w-4 h-4" />,
  color: '#6366f1',
  bg: 'bg-indigo-50',
  text: 'text-indigo-600'
}];

const RESPONSE_TIME_DATA = [
{ label: '00:00', value: 128 },
{ label: '03:00', value: 95 },
{ label: '06:00', value: 108 },
{ label: '09:00', value: 187 },
{ label: '12:00', value: 210 },
{ label: '15:00', value: 195 },
{ label: '18:00', value: 168 },
{ label: '21:00', value: 142 }];

const ERROR_LOGS = [
{ id: 1, type: 'Warning', message: 'High memory usage detected on API server', time: '14:32', resolved: false },
{ id: 2, type: 'Error', message: 'Payment gateway timeout (3 occurrences)', time: '12:18', resolved: true },
{ id: 3, type: 'Info', message: 'Scheduled backup completed successfully', time: '10:00', resolved: true },
{ id: 4, type: 'Warning', message: 'Image CDN response time elevated', time: '09:45', resolved: true },
{ id: 5, type: 'Error', message: 'Failed login attempts from IP 192.168.x.x', time: '08:12', resolved: false }];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
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

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{fmtNum(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AnalyticsReports() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [activityPeriod, setActivityPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');

  // API data states
  const [activityData, setActivityData] = useState<{label: string; users: number; bookings: number;}[]>([]);
  const [topArtisans, setTopArtisans] = useState<any[]>([]);
  const [demographics, setDemographics] = useState<{country: string; count: number; color: string;}[]>([]);
  const [workshopPopularity, setWorkshopPopularity] = useState<{name: string; bookings: number; color: string;}[]>([]);
  const [loadingCharts, setLoadingCharts] = useState(true);

  const PALETTE = ['#2F5D50', '#C65D3B', '#C9A227', '#6366f1', '#ec4899', '#94a3b8'];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingCharts(true);
        const [chartRes, artisansRes, demoRes, workshopsRes] = await Promise.all([
          getActivityChart(activityPeriod),
          getTopArtisans(),
          getTouristDemographics(),
          getWorkshopPopularity()
        ]);
        setActivityData(chartRes.data.data || []);
        setTopArtisans(artisansRes.data.data || []);
        setDemographics(
          (demoRes.data.data || []).map((d: any, i: number) => ({
            ...d,
            color: PALETTE[i % PALETTE.length]
          }))
        );
        setWorkshopPopularity(
          (workshopsRes.data.data || []).map((w: any, i: number) => ({
            ...w,
            color: PALETTE[i % PALETTE.length]
          }))
        );
      } catch (err) {
        console.error('Analytics fetch error', err);
      } finally {
        setLoadingCharts(false);
      }
    };
    fetchAll();
  }, [activityPeriod]);

  const handleExport = async (format: 'pdf' | 'csv') => {
    if (format === 'csv') {
      const rows = [
        ['Section', 'Label', 'Value'],
        ...activityData.map((d) => ['Activity', d.label, `Users: ${d.users}, Bookings: ${d.bookings}`]),
        ...topArtisans.map((a) => ['Top Artisans', a.name, `Rating: ${a.rating}, Workshops: ${a.workshops ?? a.bookings ?? 0}`]),
        ...demographics.map((d) => ['Demographics', d.country, `Tourists: ${d.count}`]),
        ...workshopPopularity.map((w) => ['Workshop Popularity', w.name, `Bookings: ${w.bookings}`]),
      ];
      const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lanka-craft-analytics-${dateFrom}-to-${dateTo}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (!reportRef.current) return;
    try {
      setExporting(true);
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * pageW) / canvas.width;

      let y = 0;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -y, imgW, imgH);
        y += pageH;
      }

      pdf.save(`lanka-craft-analytics-${dateFrom}-to-${dateTo}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
    } finally {
      setExporting(false);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
    }
  };

  // Compute summary totals from activity data
  const totalUsers = activityData.reduce((s, d) => s + d.users, 0);
  const totalBookings = activityData.reduce((s, d) => s + d.bookings, 0);

  // Total tourists from demographics
  const totalTourists = demographics.reduce((s, d) => s + d.count, 0);

  return (
    <motion.div
      ref={reportRef}
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
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">
            {exporting ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileTextIcon className="w-3.5 h-3.5" />}
            {exporting ? 'Exporting…' : 'PDF'}
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 bg-forest hover:bg-forest-dark disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">
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
            <div className="w-6 h-0.5 rounded" style={{ borderTop: '2px dashed #C65D3B', background: 'none' }} />
            <span className="text-xs text-gray-500">Bookings</span>
          </div>
        </div>

        {loadingCharts ? (
          <div className="h-44 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-forest/20 border-t-forest rounded-full animate-spin" />
          </div>
        ) : (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={activityData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={fmtNum} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" name="Users" stroke="#2F5D50" strokeWidth={2.5} dot={{ r: 3, fill: '#fff', stroke: '#2F5D50', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#C65D3B" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary stats row */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xl font-black text-gray-900 font-display">
              {fmtNum(totalUsers)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Total Users</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-xl font-black text-gray-900 font-display">
              {fmtNum(totalBookings)}
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

      {/* ── Section 2: Top Artisans ── */}
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

        {loadingCharts ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-forest/20 border-t-forest rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Top 3 Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {topArtisans.slice(0, 3).map((artisan, i) =>
              <motion.div
                key={artisan._id || artisan.name}
                variants={cardVariants}
                className="bg-white rounded-2xl border border-gray-200 p-5 relative overflow-hidden">

                  {/* Rank badge */}
                  <div
                  className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    backgroundColor: i === 0 ? '#C9A227' : i === 1 ? '#94a3b8' : '#C65D3B',
                    color: 'white'
                  }}>
                    #{i + 1}
                  </div>
                  {/* Color bar */}
                  <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />

                  <div className="flex items-center gap-3 mb-3">
                    <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: artisan.color || PALETTE[i % PALETTE.length] }}>
                      {artisan.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">{artisan.name}</p>
                      <p className="text-xs text-gray-400">{artisan.craft}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) =>
                  <StarIcon
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= Math.floor(artisan.rating) ? 'text-mustard fill-mustard' : 'text-gray-200 fill-gray-200'}`} />
                  )}
                    <span className="text-xs font-bold text-gray-700 ml-1">{artisan.rating}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg py-2">
                      <p className="text-sm font-black text-gray-900">{artisan.reviews ?? '—'}</p>
                      <p className="text-[10px] text-gray-400">Reviews</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg py-2">
                      <p className="text-sm font-black text-gray-900">{artisan.workshops ?? artisan.bookings ?? '—'}</p>
                      <p className="text-[10px] text-gray-400">Workshops</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Full Ranked Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <p className="text-sm font-bold text-gray-700">Full Artisan Rankings</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Artisan</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Craft</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Region</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Workshops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topArtisans.map((a, i) =>
                  <motion.tr
                    key={a._id || a.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors">

                      <td className="px-6 py-3.5">
                        <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black inline-flex"
                        style={{
                          backgroundColor: i === 0 ? '#C9A227' : i === 1 ? '#94a3b8' : i === 2 ? '#C65D3B' : '#e2e8f0',
                          color: i < 3 ? 'white' : '#64748b'
                        }}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: a.color || PALETTE[i % PALETTE.length] }}>
                            {a.initials}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-600">{a.craft}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-500">{a.region}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3.5 h-3.5 text-mustard fill-mustard" />
                          <span className="text-sm font-bold text-gray-800">{a.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="text-sm font-bold text-forest">{a.workshops ?? a.bookings ?? '—'}</span>
                      </td>
                    </motion.tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>

      {/* ── Workshop Popularity ── */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <SectionHeader
          icon={<BarChart2Icon className="w-5 h-5" />}
          title="Workshop Popularity"
          subtitle="Total bookings by craft type" />

        {loadingCharts ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-forest/20 border-t-forest rounded-full animate-spin" />
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={workshopPopularity} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={fmtNum} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" name="Bookings" radius={[0, 4, 4, 0]}>
                  {workshopPopularity.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* ── Tourist Demographics ── */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <SectionHeader
          icon={<GlobeIcon className="w-5 h-5" />}
          title="Tourist Demographics"
          subtitle="Geographic distribution of platform visitors" />

        {loadingCharts ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-forest/20 border-t-forest rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Pie Chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographics}
                    dataKey="count"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={2}>
                    {demographics.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Country Stats Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Country</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Tourists</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {demographics.map((c, i) => {
                    const pct = totalTourists > 0 ? Math.round(c.count / totalTourists * 100) : 0;
                    return (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                            <span className="text-sm text-gray-700 font-medium">{c.country}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {c.count.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                            </div>
                            <span className="text-xs font-bold text-gray-600 w-8 text-right">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── System Performance Monitoring ── */}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
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
                <span className="text-[10px] text-emerald-600 font-medium">Healthy</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Response Time Chart (Recharts) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700">Response Time (Last 24h)</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-0.5 bg-indigo-500 rounded" />
              <span>Avg: 142ms</span>
            </div>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={RESPONSE_TIME_DATA} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 300]} tickFormatter={(v) => `${v}ms`} width={40} />
                <Tooltip
                  formatter={(v: number) => [`${v}ms`, 'Response Time']}
                  contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e5e7eb' }}
                />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }} />
              </ReLineChart>
            </ResponsiveContainer>
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
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${log.resolved ? 'bg-gray-50 border-gray-100' : 'bg-amber-50/50 border-amber-100'}`}>

              <div
              className={`w-2 h-2 rounded-full shrink-0 ${log.type === 'Error' ? 'bg-red-500' : log.type === 'Warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />

              <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${log.type === 'Error' ? 'bg-red-100 text-red-600' : log.type === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'}`}>
                {log.type}
              </span>
              <p className="text-xs text-gray-700 flex-1">{log.message}</p>
              <span className="text-xs text-gray-400 shrink-0">{log.time}</span>
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
                <circle cx="16" cy="16" r="9" fill="none" stroke="white" strokeWidth="1" />
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
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors shadow-md">
              {exporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileTextIcon className="w-4 h-4" />}
              {exporting ? 'Generating PDF…' : 'Download PDF'}
            </button>
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-mustard hover:bg-mustard-dark disabled:opacity-60 text-forest rounded-xl text-sm font-bold transition-colors shadow-md">
              <TableIcon className="w-4 h-4" /> Download CSV
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>);
}
