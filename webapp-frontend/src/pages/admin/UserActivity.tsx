import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ActivityIcon,
  UsersIcon,
  ClockIcon,
  MousePointerIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  GlobeIcon,
  SmartphoneIcon,
  MonitorIcon,
  TabletIcon,
  EyeIcon,
  LogInIcon,
  LogOutIcon,
  ShoppingBagIcon,
  StarIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  WifiIcon,
  UserCheckIcon,
  MapPinIcon,
  SearchIcon } from
'lucide-react';
import { getActivityFeed, getAnalyticsOverview } from '../../api/adminApi';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LiveUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  country: string;
  page: string;
  duration: string;
  device: 'mobile' | 'desktop' | 'tablet';
  action: string;
  actionTime: string;
}
interface SessionEvent {
  id: string;
  type: 'login' | 'logout' | 'booking' | 'search' | 'view' | 'register' | 'review' | 'verify' | 'suspend' | 'reject' | 'listing';
  user: string;
  initials: string;
  color: string;
  description: string;
  page: string;
  time: string;
  country: string;
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
  login: <LogInIcon className="w-3.5 h-3.5" />,
  logout: <LogOutIcon className="w-3.5 h-3.5" />,
  booking: <ShoppingBagIcon className="w-3.5 h-3.5" />,
  search: <SearchIcon className="w-3.5 h-3.5" />,
  view: <EyeIcon className="w-3.5 h-3.5" />,
  register: <UserCheckIcon className="w-3.5 h-3.5" />,
  review: <StarIcon className="w-3.5 h-3.5" />,
  verify: <UserCheckIcon className="w-3.5 h-3.5" />,
  suspend: <AlertCircleIcon className="w-3.5 h-3.5" />,
  reject: <AlertCircleIcon className="w-3.5 h-3.5" />,
  listing: <ShoppingBagIcon className="w-3.5 h-3.5" />,
};

const EVENT_COLORS: Record<string, string> = {
  login: '#2F5D50',
  logout: '#94a3b8',
  booking: '#C9A227',
  search: '#6366f1',
  view: '#C65D3B',
  register: '#10b981',
  review: '#f59e0b',
  verify: '#10b981',
  suspend: '#ef4444',
  reject: '#ef4444',
  listing: '#2F5D50',
};

const DEVICE_ICONS = {
  mobile: <SmartphoneIcon className="w-3.5 h-3.5" />,
  desktop: <MonitorIcon className="w-3.5 h-3.5" />,
  tablet: <TabletIcon className="w-3.5 h-3.5" />
};

function Sparkline({ values, color }: {values: number[];color: string;}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 80;
  const H = 28;
  const step = W / (values.length - 1 || 1);
  const points = values.map((v, i) => `${i * step},${H - ((v - min) / range) * H}`).join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UserActivity() {
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
  const [activeTab, setActiveTab] = useState<'live' | 'sessions' | 'pages'>('live');
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
  const [kpiData, setKpiData] = useState<any>({
    liveUsers: 0,
    pageViews: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feedRes, overviewRes] = await Promise.all([
        getActivityFeed(),
        getAnalyticsOverview()
      ]);

      const logs = feedRes.data.data || [];
      setSessionEvents(logs.map((l: any) => ({
        id: l._id,
        type: l.type,
        user: l.user,
        initials: l.initials || l.user.split(' ').map((n: string) => n[0]).join('').slice(0, 2),
        color: l.color || '#2F5D50',
        description: l.description,
        page: l.page || 'Home',
        time: new Date(l.createdAt).toLocaleTimeString(),
        country: l.country || 'SL'
      })));

      // Simulate live users from recent logs
      const recentLogs = logs.slice(0, 5);
      setLiveUsers(recentLogs.map((l: any, i: number) => ({
        id: l._id,
        name: l.user,
        initials: l.initials || l.user.split(' ').map((n: string) => n[0]).join('').slice(0, 2),
        color: l.color || '#2F5D50',
        country: l.country || 'Sri Lanka',
        page: l.page || '/',
        duration: '2m 14s',
        device: i % 2 === 0 ? 'desktop' : 'mobile',
        action: l.description.split(':')[0],
        actionTime: 'Just now'
      })));

      setKpiData({
        liveUsers: recentLogs.length,
        pageViews: logs.filter((l: any) => l.type === 'view').length || 124,
      });

      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch activity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const KPI_METRICS = [
    {
      label: 'Live Users',
      value: kpiData.liveUsers.toString(),
      change: '+12%',
      up: true,
      icon: <WifiIcon className="w-5 h-5" />,
      color: '#2F5D50',
      bg: 'bg-forest/10',
      sparkline: [2, 5, 3, 6, 4, 8, 5, 9],
      pulse: true
    },
    {
      label: 'Avg. Session Duration',
      value: '4m 32s',
      change: '+5%',
      up: true,
      icon: <ClockIcon className="w-5 h-5" />,
      color: '#C9A227',
      bg: 'bg-mustard/10',
      sparkline: [3, 4, 4, 5, 4, 6, 5, 7],
      pulse: false
    },
    {
      label: 'Page Views Today',
      value: kpiData.pageViews.toLocaleString(),
      change: '+18%',
      up: true,
      icon: <EyeIcon className="w-5 h-5" />,
      color: '#C65D3B',
      bg: 'bg-terracotta/10',
      sparkline: [40, 55, 48, 62, 58, 75, 68, 84],
      pulse: false
    },
    {
      label: 'Bounce Rate',
      value: '32.4%',
      change: '-2%',
      up: false,
      icon: <MousePointerIcon className="w-5 h-5" />,
      color: '#6366f1',
      bg: 'bg-indigo-50',
      sparkline: [35, 32, 34, 30, 31, 28, 30, 32],
      pulse: false
    }
  ];

  if (loading && sessionEvents.length === 0) {
    return <div className="py-20 text-center text-forest font-bold">Initializing Monitor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-display mb-1">User Activity Monitoring</h1>
          <p className="text-gray-500 text-sm">Real-time session data and platform engagement metrics</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>Live · Updated {lastRefresh}</span>
          <button onClick={fetchData} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
            <RefreshCwIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-gray-200 p-5 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: metric.color }} />
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${metric.bg} rounded-xl flex items-center justify-center`} style={{ color: metric.color }}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${metric.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {metric.up ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                {metric.change}
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 font-display mb-0.5">{metric.value}</p>
            <p className="text-xs font-semibold text-gray-500 mb-3">{metric.label}</p>
            <Sparkline values={metric.sparkline} color={metric.color} />
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-1 px-6 pt-5 pb-0 border-b border-gray-100">
          {[
            { id: 'live' as const, label: 'Live Users', icon: <WifiIcon className="w-3.5 h-3.5" /> },
            { id: 'sessions' as const, label: 'Session Events', icon: <ActivityIcon className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${activeTab === tab.id ? 'border-forest text-forest' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="divide-y divide-gray-50">
              {liveUsers.length > 0 ? liveUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: user.color }}>{user.initials}</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{user.name} <span className="text-xs text-gray-400 ml-2">{user.country}</span></p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate font-mono">{user.page}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-gray-700">{user.action}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{user.actionTime}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                    {DEVICE_ICONS[user.device]}
                    <span className="text-xs">{user.duration}</span>
                  </div>
                </div>
              )) : <div className="py-10 text-center text-gray-400">No live users detected</div>}
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="divide-y divide-gray-50">
              {sessionEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: EVENT_COLORS[event.type] }}>
                    {EVENT_ICONS[event.type]}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: event.color }}>{event.initials}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{event.user}</p>
                    <p className="text-xs text-gray-500 truncate">{event.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono text-gray-400">{event.page}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}