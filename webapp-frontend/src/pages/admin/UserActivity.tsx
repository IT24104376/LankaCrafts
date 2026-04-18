import React, { useState, Component } from 'react';
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
// ─── Types ────────────────────────────────────────────────────────────────────
interface LiveUser {
  id: number;
  name: string;
  initials: string;
  color: string;
  country: string;
  flag: string;
  page: string;
  duration: string;
  device: 'mobile' | 'desktop' | 'tablet';
  action: string;
  actionTime: string;
}
interface SessionEvent {
  id: number;
  type:
  'login' |
  'logout' |
  'booking' |
  'search' |
  'view' |
  'register' |
  'review';
  user: string;
  initials: string;
  color: string;
  description: string;
  page: string;
  time: string;
  country: string;
}
// ─── Data (connect telemetry / backend when available) ─────────────────────────
const LIVE_USERS: LiveUser[] = [];
const SESSION_EVENTS: SessionEvent[] = [];
const TOP_PAGES: {
  page: string;
  label: string;
  views: number;
  change: string;
  up: boolean;
}[] = [];
const DEVICE_STATS: {
  device: string;
  pct: number;
  count: number;
  color: string;
  icon: React.ReactNode;
}[] = [];

const EVENT_ICONS: Record<string, React.ReactNode> = {
  login: <LogInIcon className="w-3.5 h-3.5" />,
  logout: <LogOutIcon className="w-3.5 h-3.5" />,
  booking: <ShoppingBagIcon className="w-3.5 h-3.5" />,
  search: <SearchIcon className="w-3.5 h-3.5" />,
  view: <EyeIcon className="w-3.5 h-3.5" />,
  register: <UserCheckIcon className="w-3.5 h-3.5" />,
  review: <StarIcon className="w-3.5 h-3.5" />
};
const EVENT_COLORS: Record<string, string> = {
  login: '#2F5D50',
  logout: '#94a3b8',
  booking: '#C9A227',
  search: '#6366f1',
  view: '#C65D3B',
  register: '#10b981',
  review: '#f59e0b'
};
const DEVICE_ICONS = {
  mobile: <SmartphoneIcon className="w-3.5 h-3.5" />,
  desktop: <MonitorIcon className="w-3.5 h-3.5" />,
  tablet: <TabletIcon className="w-3.5 h-3.5" />
};
// ─── Mini Sparkline ───────────────────────────────────────────────────────────
function Sparkline({ values, color }: {values: number[];color: string;}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 80;
  const H = 28;
  const step = W / (values.length - 1);
  const points = values.
  map((v, i) => `${i * step},${H - (v - min) / range * H}`).
  join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" />

    </svg>);

}
// ─── Main Component ───────────────────────────────────────────────────────────
export function UserActivity() {
  const [lastRefresh] = useState('—');
  const [activeTab, setActiveTab] = useState<'live' | 'sessions' | 'pages'>(
    'live'
  );
  const KPI_METRICS = [
  {
    label: 'Live Users',
    value: '0',
    change: '—',
    up: true,
    icon: <WifiIcon className="w-5 h-5" />,
    color: '#2F5D50',
    bg: 'bg-forest/10',
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0],
    pulse: false
  },
  {
    label: 'Avg. Session Duration',
    value: '—',
    change: '—',
    up: true,
    icon: <ClockIcon className="w-5 h-5" />,
    color: '#C9A227',
    bg: 'bg-mustard/10',
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0],
    pulse: false
  },
  {
    label: 'Page Views Today',
    value: '0',
    change: '—',
    up: true,
    icon: <EyeIcon className="w-5 h-5" />,
    color: '#C65D3B',
    bg: 'bg-terracotta/10',
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0],
    pulse: false
  },
  {
    label: 'Bounce Rate',
    value: '—',
    change: '—',
    up: false,
    icon: <MousePointerIcon className="w-5 h-5" />,
    color: '#6366f1',
    bg: 'bg-indigo-50',
    sparkline: [0, 0, 0, 0, 0, 0, 0, 0],
    pulse: false
  }];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-display mb-1">
            User Activity Monitoring
          </h1>
          <p className="text-gray-500 text-sm">
            Real-time session data and platform engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>Live · Updated {lastRefresh}</span>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
            <RefreshCwIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_METRICS.map((metric, i) =>
        <motion.div
          key={metric.label}
          initial={{
            opacity: 0,
            y: 16
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: i * 0.07
          }}
          className="bg-white rounded-2xl border border-gray-200 p-5 relative overflow-hidden">

            <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{
              backgroundColor: metric.color
            }} />

            <div className="flex items-start justify-between mb-3">
              <div
              className={`w-10 h-10 ${metric.bg} rounded-xl flex items-center justify-center`}
              style={{
                color: metric.color
              }}>

                {metric.icon}
              </div>
              {metric.pulse &&
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </div>
            }
              {!metric.pulse &&
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${metric.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>

                  {metric.up ?
              <TrendingUpIcon className="w-3 h-3" /> :

              <TrendingDownIcon className="w-3 h-3" />
              }
                  {metric.change}
                </div>
            }
            </div>
            <p className="text-2xl font-black text-gray-900 font-display mb-0.5">
              {metric.value}
            </p>
            <p className="text-xs font-semibold text-gray-500 mb-3">
              {metric.label}
            </p>
            <Sparkline values={metric.sparkline} color={metric.color} />
          </motion.div>
        )}
      </div>

      {/* Device Distribution */}
      <motion.div
        initial={{
          opacity: 0,
          y: 16
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.3
        }}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <h2 className="font-bold text-gray-900 font-display mb-4 flex items-center gap-2">
          <MonitorIcon className="w-4.5 h-4.5 text-forest" />
          Device Distribution
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Bar */}
          <div className="flex-1 w-full">
            <div className="flex rounded-full overflow-hidden h-4 mb-3">
              {DEVICE_STATS.map((d) =>
              <div
                key={d.device}
                className="h-full transition-all"
                style={{
                  width: `${d.pct}%`,
                  backgroundColor: d.color
                }} />

              )}
            </div>
            <div className="flex gap-6">
              {DEVICE_STATS.map((d) =>
              <div key={d.device} className="flex items-center gap-2">
                  <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: d.color
                  }} />

                  <span className="text-xs text-gray-600">{d.device}</span>
                  <span className="text-xs font-bold text-gray-900">
                    {d.pct}%
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Stat cards */}
          <div className="flex gap-3 shrink-0">
            {DEVICE_STATS.map((d) =>
            <div
              key={d.device}
              className="text-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">

                <div
                className="flex justify-center mb-1"
                style={{
                  color: d.color
                }}>

                  {d.icon}
                </div>
                <p className="text-lg font-black text-gray-900">{d.count}</p>
                <p className="text-[10px] text-gray-400">{d.device}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tab Section */}
      <motion.div
        initial={{
          opacity: 0,
          y: 16
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.4
        }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* Tab Header */}
        <div className="flex items-center gap-1 px-6 pt-5 pb-0 border-b border-gray-100">
          {[
          {
            id: 'live' as const,
            label: 'Live Users',
            icon: <WifiIcon className="w-3.5 h-3.5" />
          },
          {
            id: 'sessions' as const,
            label: 'Session Events',
            icon: <ActivityIcon className="w-3.5 h-3.5" />
          },
          {
            id: 'pages' as const,
            label: 'Top Pages',
            icon: <EyeIcon className="w-3.5 h-3.5" />
          }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${activeTab === tab.id ? 'border-forest text-forest' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

              {tab.icon}
              {tab.label}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Live Users Tab ── */}
          {activeTab === 'live' &&
          <motion.div
            key="live"
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -8
            }}
            transition={{
              duration: 0.2
            }}>

              <div className="px-6 py-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-xs font-semibold text-emerald-700">
                  {LIVE_USERS.length} users currently active on the platform
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                {LIVE_USERS.map((user, i) =>
              <motion.div
                key={user.id}
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
                className="flex items-center gap-4 px-6 py-3.5">

                    <div className="relative shrink-0">
                      <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{
                      backgroundColor: user.color
                    }}>

                        {user.initials}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <span className="text-xs">{user.flag}</span>
                        <span className="text-xs text-gray-400">
                          {user.country}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate font-mono">
                        {user.page}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-gray-700">
                        {user.action}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {user.actionTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                      {DEVICE_ICONS[user.device]}
                      <span className="text-xs text-gray-400">
                        {user.duration}
                      </span>
                    </div>
                  </motion.div>
              )}
              </div>
            </motion.div>
          }

          {/* ── Session Events Tab ── */}
          {activeTab === 'sessions' &&
          <motion.div
            key="sessions"
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -8
            }}
            transition={{
              duration: 0.2
            }}
            className="divide-y divide-gray-50">

              {SESSION_EVENTS.map((event, i) =>
            <motion.div
              key={event.id}
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
              className="flex items-center gap-4 px-6 py-3.5">

                  <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{
                  backgroundColor: EVENT_COLORS[event.type]
                }}>

                    {EVENT_ICONS[event.type]}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    backgroundColor: event.color
                  }}>

                      {event.initials}
                    </div>
                    <span className="text-xs">{event.country}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {event.user}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {event.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono text-gray-400">
                      {event.page}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {event.time}
                    </p>
                  </div>
                </motion.div>
            )}
            </motion.div>
          }

          {/* ── Top Pages Tab ── */}
          {activeTab === 'pages' &&
          <motion.div
            key="pages"
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -8
            }}
            transition={{
              duration: 0.2
            }}>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Views Today
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TOP_PAGES.map((page, i) =>
                <motion.tr
                  key={page.page}
                  initial={{
                    opacity: 0,
                    y: 6
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: i * 0.05
                  }}
                  className="hover:bg-gray-50/50 transition-colors">

                      <td className="px-6 py-3.5">
                        <p className="text-sm font-semibold text-gray-900">
                          {page.label}
                        </p>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                          {page.page}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">
                            {page.views.toLocaleString()}
                          </span>
                          <div className="flex-1 max-w-[120px] bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                          className="h-full rounded-full bg-forest"
                          initial={{
                            width: 0
                          }}
                          animate={{
                            width: `${page.views / 1842 * 100}%`
                          }}
                          transition={{
                            delay: i * 0.05 + 0.2,
                            duration: 0.5
                          }} />

                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${page.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>

                          {page.up ?
                      <TrendingUpIcon className="w-3 h-3" /> :

                      <TrendingDownIcon className="w-3 h-3" />
                      }
                          {page.change}
                        </div>
                      </td>
                    </motion.tr>
                )}
                </tbody>
              </table>
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>

      {/* Engagement Summary */}
      <motion.div
        initial={{
          opacity: 0,
          y: 16
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.5
        }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {[
        {
          label: 'New Users Today',
          value: '284',
          icon: <UserCheckIcon className="w-4 h-4" />,
          color: '#2F5D50',
          bg: 'bg-forest/10'
        },
        {
          label: 'Returning Users',
          value: '964',
          icon: <UsersIcon className="w-4 h-4" />,
          color: '#C65D3B',
          bg: 'bg-terracotta/10'
        },
        {
          label: 'Bookings Today',
          value: '47',
          icon: <ShoppingBagIcon className="w-4 h-4" />,
          color: '#C9A227',
          bg: 'bg-mustard/10'
        },
        {
          label: 'Avg. Pages / Session',
          value: '4.8',
          icon: <EyeIcon className="w-4 h-4" />,
          color: '#6366f1',
          bg: 'bg-indigo-50'
        }].
        map((stat, i) =>
        <motion.div
          key={stat.label}
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: 0.5 + i * 0.07
          }}
          className="bg-white rounded-xl border border-gray-200 p-4">

            <div
            className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}
            style={{
              color: stat.color
            }}>

              {stat.icon}
            </div>
            <p className="text-2xl font-black text-gray-900 font-display">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        )}
      </motion.div>
    </div>);

}