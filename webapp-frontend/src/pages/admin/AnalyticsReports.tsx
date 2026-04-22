import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUpIcon,
  StarIcon,
  UsersIcon,
  ActivityIcon,
  GlobeIcon,
} from 'lucide-react';
import {
  getActivityChart,
  getTopArtisans,
  getTouristDemographics,
  getWorkshopPopularity,
  getAnalyticsOverview
} from '../../api/adminApi';

// ─── SVG Chart Components (Keep as they are for now, but they use the passed data) ───────────────────────

function LineChart({
  data,
  color = '#2F5D50',
  secondColor = '#C65D3B'
}: { data: { label: string; users: number; bookings: number; }[]; color?: string; secondColor?: string; }) {
  if (!data.length) {
    return (
      <div className="flex h-full min-h-[120px] items-center justify-center rounded-lg bg-slate-50 text-sm text-gray-400">
        No activity data
      </div>
    );
  }
  const W = 560;
  const H = 180;
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxUsers = Math.max(...data.map((d) => d.users));
  const maxBookings = Math.max(...data.map((d) => d.bookings));
  const maxVal = Math.max(maxUsers, maxBookings, 1) * 1.15;
  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW / 2;
  const yScale = (v: number) => chartH - (v / maxVal) * chartH;

  const usersPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${PAD.left + i * xStep} ${PAD.top + yScale(d.users)}`).join(' ');
  const bookingsPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${PAD.left + i * xStep} ${PAD.top + yScale(d.bookings)}`).join(' ');
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
      {yTicks.map((tick, i) => {
        const y = PAD.top + chartH - (tick / maxVal) * chartH;
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{tick}</text>
          </g>
        );
      })}
      <path d={usersFill} fill="url(#usersGrad)" />
      <path d={bookingsFill} fill="url(#bookingsGrad)" />
      <path d={usersPath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={bookingsPath} fill="none" stroke={secondColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3" />
      {data.map((d, i) => (
        <text key={i} x={PAD.left + i * xStep} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.label.slice(-5)}</text>
      ))}
      {data.map((d, i) => (
        <circle key={i} cx={PAD.left + i * xStep} cy={PAD.top + yScale(d.users)} r="3.5" fill="white" stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string; }[]; }) {
  if (!data.length) return <div className="py-10 text-center text-gray-400">No data</div>;
  const W = 400;
  const H = 160;
  const PAD = { top: 12, right: 12, bottom: 28, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1) * 1.1;
  const barW = (chartW / data.length) * 0.55;
  const gap = chartW / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const x = PAD.left + i * gap + (gap - barW) / 2;
        const y = PAD.top + chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={d.color} />
            <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.label}</text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function HorizontalBar({ data }: { data: { name: string; bookings: number; color: string; }[]; }) {
  const maxVal = Math.max(...data.map((d) => d.bookings), 1);
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <p className="text-xs text-gray-600 w-36 shrink-0 truncate font-medium">{item.name}</p>
          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(item.bookings / maxVal) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="text-xs font-bold text-gray-700 w-10 text-right">{item.bookings}</p>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: { country: string; pct: number; color: string; tourists?: number; }[]; }) {
  const R = 70, CX = 90, CY = 90;
  let cumulative = 0;
  const slices = data.map((d) => {
    const start = cumulative;
    cumulative += d.pct;
    return { ...d, start, end: cumulative };
  });

  const describeArc = (cx: number, cy: number, r: number, startPct: number, endPct: number) => {
    const startAngle = (startPct / 100) * 360, endAngle = (endPct / 100) * 360;
    const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
      const rad = (deg - 90) * Math.PI / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };
    const start = polarToCartesian(cx, cy, r, endAngle), end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
  };

  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      {slices.map((s, i) => (
        <path key={i} d={describeArc(CX, CY, R, s.start, s.end)} fill={s.color} stroke="white" strokeWidth="2" />
      ))}
      <circle cx={CX} cy={CY} r={42} fill="white" />
    </svg>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string; }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 bg-forest/10 rounded-xl flex items-center justify-center text-forest shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-900 font-display">{title}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AnalyticsReports() {
  const [activityPeriod, setActivityPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [activityData, setActivityData] = useState<any[]>([]);
  const [userStatusData, setUserStatusData] = useState<any[]>([]);
  const [topArtisans, setTopArtisans] = useState<any[]>([]);
  const [workshopPopularity, setWorkshopPopularity] = useState<any[]>([]);
  const [touristCountries, setTouristCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [actRes, topArtRes, countriesRes, popRes, overviewRes] = await Promise.all([
          getActivityChart(activityPeriod),
          getTopArtisans(),
          getTouristDemographics(),
          getWorkshopPopularity(),
          getAnalyticsOverview()
        ]);

        setActivityData(actRes.data.data || []);

        const overview = overviewRes.data.data;
        setUserStatusData([
          { label: 'Active', value: overview.totalArtisans, color: '#2F5D50' },
          { label: 'Tourist', value: overview.totalTourists, color: '#C65D3B' },
          { label: 'Pending', value: overview.pendingVerifications, color: '#C9A227' }
        ]);

        setTopArtisans(topArtRes.data.data.map((a: any, i: number) => ({
          rank: i + 1,
          name: a.fullName || a.businessName,
          craft: a.craftType,
          region: a.location?.formattedAddress?.split(',')[0] || 'Unknown',
          rating: a.rating || 0,
          reviews: a.reviewsCount || 0,
          bookings: a.workshopsConducted || 0,
          initials: (a.fullName || 'A').split(' ').map((n: any) => n[0]).join('').slice(0, 2),
          color: '#2F5D50'
        })));

        setWorkshopPopularity(popRes.data.data.map((p: any) => ({
          name: p.name,
          bookings: p.bookings,
          color: '#C65D3B'
        })));

        const countriesRaw = countriesRes.data.data || [];
        const totalTourists = countriesRaw.reduce((s: number, c: any) => s + c.count, 0);
        setTouristCountries(countriesRaw.map((c: any) => ({
          country: c.country,
          tourists: c.count,
          pct: totalTourists ? (c.count / totalTourists) * 100 : 0,
          color: '#2F5D50'
        })));

      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activityPeriod]);

  if (loading) return <div className="py-20 text-center text-forest font-bold">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-display mb-1">Analytics & Reports</h1>
          <p className="text-gray-500 text-sm">Platform performance and user insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader icon={<ActivityIcon className="w-5 h-5" />} title="Activity Trends" subtitle="Bookings over time" />
          <div className="h-44"><LineChart data={activityData} /></div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader icon={<UsersIcon className="w-5 h-5" />} title="User Distribution" subtitle="Role breakdown" />
          <div className="h-44"><BarChart data={userStatusData} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workshop Popularity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader icon={<TrendingUpIcon className="w-5 h-5" />} title="Workshop Popularity" subtitle="Most booked crafts" />
          <HorizontalBar data={workshopPopularity} />
        </div>

        {/* Tourist Demographics */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SectionHeader icon={<GlobeIcon className="w-5 h-5" />} title="Tourist Demographics" subtitle="Visitor origin" />
          <div className="flex items-center gap-8">
            <div className="w-40 h-40"><DonutChart data={touristCountries} /></div>
            <div className="flex-1 space-y-2">
              {touristCountries.slice(0, 4).map(c => (
                <div key={c.country} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{c.country}</span>
                  <span className="font-bold text-gray-700">{c.pct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Artisans Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 font-display">Top Performing Artisans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-400">
                <th className="px-6 py-3 font-bold">Artisan</th>
                <th className="px-6 py-3 font-bold">Rating</th>
                <th className="px-6 py-3 font-bold">Bookings</th>
                <th className="px-6 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topArtisans.map(art => (
                <tr key={art.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs">{art.initials}</div>
                    <div><p className="font-bold text-gray-800">{art.name}</p><p className="text-xs text-gray-400">{art.craft}</p></div>
                  </td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1 text-mustard font-bold"><StarIcon className="w-3 h-3 fill-current" />{art.rating}</div></td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{art.bookings}</td>
                  <td className="px-6 py-4 text-right"><button className="text-forest hover:underline font-bold">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}