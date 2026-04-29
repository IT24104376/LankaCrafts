import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboardIcon,
  UsersIcon,
  BuildingIcon,
  UserCheckIcon,
  ActivityIcon,
  BarChart3Icon,
  ShieldIcon,
  SettingsIcon,
  BellIcon,
  SearchIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseCircleIcon,
  EyeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  MapPinIcon,
  ClockIcon,
  AlertCircleIcon,
  UserIcon,
  MessageSquareIcon
} from
  'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArtisanVerification } from './admin/ArtisanVerification';
import { TouristManagement } from './admin/TouristManagement';
import { AnalyticsReports } from './admin/AnalyticsReports';
import { WorkshopVerification } from './admin/WorkshopVerification';
import { UserActivity } from './admin/UserActivity';
import { ReviewMonitoring } from './admin/ReviewMonitoring';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsOverview, getRecentActivity, getArtisans, updateArtisanStatus } from '../api/adminApi';

type Section =
  'overview' |
  'artisan-verification' |
  'workshop-verification' |
  'tourist-management' |
  'user-activity' |
  'analytics' |
  'review-monitoring' |
  'role-management' |
  'settings';

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    icon: <LayoutDashboardIcon className="w-4.5 h-4.5" />
  },
  {
    id: 'artisan-verification',
    label: 'Artisan Verification',
    icon: <UserCheckIcon className="w-4.5 h-4.5" />,
    badge: 3
  },
  {
    id: 'workshop-verification',
    label: 'Workshop Verification',
    icon: <BuildingIcon className="w-4.5 h-4.5" />,
    badge: 1
  },
  {
    id: 'tourist-management',
    label: 'Tourist Management',
    icon: <UsersIcon className="w-4.5 h-4.5" />
  },
  {
    id: 'user-activity',
    label: 'User Activity Monitoring',
    icon: <ActivityIcon className="w-4.5 h-4.5" />
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    icon: <BarChart3Icon className="w-4.5 h-4.5" />
  },
  {
    id: 'review-monitoring',
    label: 'Review Monitoring',
    icon: <MessageSquareIcon className="w-4.5 h-4.5" />,
    badge: 2
  },
  {
    id: 'role-management',
    label: 'Role Management',
    icon: <ShieldIcon className="w-4.5 h-4.5" />
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon className="w-4.5 h-4.5" />
  }];

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  register: <UserIcon className="w-3.5 h-3.5" />,
  booking: <ClockIcon className="w-3.5 h-3.5" />,
  verify: <CheckCircleIcon className="w-3.5 h-3.5" />,
  suspend: <PauseCircleIcon className="w-3.5 h-3.5" />,
  listing: <BuildingIcon className="w-3.5 h-3.5" />,
  reject: <XCircleIcon className="w-3.5 h-3.5" />
};

function DashboardOverview({
  onNavigate
}: { onNavigate: (s: Section) => void; }) {
  const [kpiData, setKpiData] = useState<{
    totalArtisans: number;
    totalTourists: number;
    activeWorkshops: number;
    pendingVerifications: number;
  } | null>(null);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<any[]>([]);
  const [loadingKpi, setLoadingKpi] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    getAnalyticsOverview()
      .then(res => setKpiData(res.data.data))
      .catch(() => { })
      .finally(() => setLoadingKpi(false));

    getRecentActivity()
      .then(res => setActivityFeed(res.data.data || []))
      .catch(() => { })
      .finally(() => setLoadingActivity(false));

    getArtisans({ status: 'pending' })
      .then(res => setVerificationRequests(res.data.data || []))
      .catch(() => { })
      .finally(() => setLoadingRequests(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateArtisanStatus(id, 'verified');
      setVerificationRequests(prev => prev.filter(r => r._id !== id));
    } catch { }
  };

  const handleReject = async (id: string) => {
    try {
      await updateArtisanStatus(id, 'rejected');
      setVerificationRequests(prev => prev.filter(r => r._id !== id));
    } catch { }
  };

  const kpiCards = kpiData ? [
    {
      title: 'Total Artisans',
      value: kpiData.totalArtisans.toLocaleString(),
      change: '+12%',
      trend: 'up' as const,
      icon: <UserCheckIcon className="w-5 h-5" />,
      color: '#2F5D50',
      bg: 'bg-forest/10',
      desc: 'Registered artisans'
    },
    {
      title: 'Total Tourists',
      value: kpiData.totalTourists.toLocaleString(),
      change: '+24%',
      trend: 'up' as const,
      icon: <UsersIcon className="w-5 h-5" />,
      color: '#C65D3B',
      bg: 'bg-terracotta/10',
      desc: 'Platform visitors'
    },
    {
      title: 'Active Workshops',
      value: kpiData.activeWorkshops.toLocaleString(),
      change: '+8%',
      trend: 'up' as const,
      icon: <BuildingIcon className="w-5 h-5" />,
      color: '#C9A227',
      bg: 'bg-mustard/10',
      desc: 'Running this month'
    },
    {
      title: 'Pending Verifications',
      value: kpiData.pendingVerifications.toLocaleString(),
      change: '-5%',
      trend: 'down' as const,
      icon: <AlertCircleIcon className="w-5 h-5" />,
      color: '#6366f1',
      bg: 'bg-indigo-50',
      desc: 'Awaiting review'
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loadingKpi ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse h-32" />
          ))
        ) : (
          kpiCards.map((card, i) =>
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-200 p-5 relative overflow-hidden">

              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ backgroundColor: card.color }} />

              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}
                  style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${card.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {card.trend === 'up' ?
                    <TrendingUpIcon className="w-3 h-3" /> :
                    <TrendingDownIcon className="w-3 h-3" />
                  }
                  {card.change}
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1 font-display">
                {card.value}
              </p>
              <p className="text-sm font-semibold text-gray-700">{card.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
            </motion.div>
          )
        )}
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Requests Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900 font-display">
                Pending Verification Requests
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {verificationRequests.length} requests awaiting review
              </p>
            </div>
            <button
              onClick={() => onNavigate('artisan-verification')}
              className="text-xs font-semibold text-forest hover:text-forest-dark flex items-center gap-1 transition-colors">
              View All <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {loadingRequests ? (
              <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
            ) : verificationRequests.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <CheckCircleIcon className="w-10 h-10 mx-auto mb-2 text-emerald-300" />
                <p className="font-medium text-sm">
                  All caught up! No pending requests.
                </p>
              </div>
            ) : (
              verificationRequests.map((req) =>
                <div key={req._id} className="flex items-center gap-4 px-6 py-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: req.color || '#2F5D50' }}>
                    {req.initials || (req.name || '').split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {req.name}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 bg-forest/10 text-forest">
                        Artisan
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>{req.craft}</span>
                      <span>·</span>
                      <MapPinIcon className="w-3 h-3" />
                      <span>{req.region}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors">
                      <CheckCircleIcon className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors">
                      <XCircleIcon className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900 font-display">
                Recent Activity
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Platform events</p>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {loadingActivity ? (
              <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
            ) : activityFeed.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">No recent activity</div>
            ) : (
              activityFeed.map((item, i) =>
                <motion.div
                  key={item._id || i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3 px-6 py-3.5">

                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: item.color || '#2F5D50' }}>
                    {ACTIVITY_ICONS[item.type] || <ActivityIcon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {item.user}
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 p-6">

        <h2 className="font-bold text-gray-900 font-display mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('artisan-verification')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
            <CheckCircleIcon className="w-4 h-4" /> Approve Pending
          </button>
          <button
            onClick={() => onNavigate('artisan-verification')}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
            <XCircleIcon className="w-4 h-4" /> Reject Requests
          </button>
          <button
            onClick={() => onNavigate('tourist-management')}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
            <PauseCircleIcon className="w-4 h-4" /> Suspend User
          </button>
          <button
            onClick={() => onNavigate('artisan-verification')}
            className="flex items-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
            <EyeIcon className="w-4 h-4" /> View Details
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
            <BarChart3Icon className="w-4 h-4" /> View Reports
          </button>
        </div>
      </motion.div>
    </div>);

}

function PlaceholderSection({
  title,
  description,
  icon
}: { title: string; description: string; icon: React.ReactNode; }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center text-forest mb-4">
        {icon}
      </div>
      <h2 className="text-2xl font-black text-gray-900 font-display mb-2">
        {title}
      </h2>
      <p className="text-gray-400 max-w-sm">{description}</p>
      <div className="mt-6 px-6 py-3 bg-forest/5 border border-forest/20 rounded-xl text-sm text-forest font-medium">
        Module coming soon
      </div>
    </div>);

}

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifCount] = useState(5);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const activeNav = NAV_ITEMS.find((n) => n.id === activeSection);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  // Derive initials from admin name
  const adminInitials = admin?.name
    ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview onNavigate={setActiveSection} />;
      case 'artisan-verification':
        return <ArtisanVerification />;
      case 'tourist-management':
        return <TouristManagement />;
      case 'workshop-verification':
        return <WorkshopVerification />;
      case 'user-activity':
        return <UserActivity />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'review-monitoring':
        return <ReviewMonitoring />;
      case 'role-management':
        return (
          <PlaceholderSection
            title="Role Management"
            description="Manage admin roles, permissions, and access control for platform administrators."
            icon={<ShieldIcon className="w-8 h-8" />} />);

      case 'settings':
        return (
          <PlaceholderSection
            title="Settings"
            description="Configure platform settings, notification preferences, and system parameters."
            icon={<SettingsIcon className="w-8 h-8" />} />);

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F3EE] overflow-hidden font-body">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen &&
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-forest flex flex-col shrink-0 overflow-hidden h-full z-20">

            {/* Sidebar Header */}
            <div className="relative px-5 py-5 border-b border-white/10 shrink-0 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="sidebar-batik" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                      <circle cx="12" cy="12" r="7" fill="none" stroke="white" strokeWidth="1" />
                      <circle cx="12" cy="12" r="3" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#sidebar-batik)" />
                </svg>
              </div>
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse cx="16" cy="8" rx="4" ry="7" fill="#C9A227" opacity="0.9" />
                    <ellipse cx="24" cy="16" rx="7" ry="4" fill="#C9A227" opacity="0.75" />
                    <ellipse cx="16" cy="24" rx="4" ry="7" fill="#C9A227" opacity="0.6" />
                    <ellipse cx="8" cy="16" rx="7" ry="4" fill="#C9A227" opacity="0.75" />
                    <circle cx="16" cy="16" r="3.5" fill="#C9A227" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm font-display leading-tight">
                    Lanka Crafts
                  </p>
                  <p className="text-white/50 text-[10px] uppercase tracking-widest">
                    Admin Panel
                  </p>
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">
                Navigation
              </p>
              <div className="space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/8'}`}>

                      {isActive &&
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-mustard rounded-r-full" />
                      }
                      <span
                        className={`shrink-0 transition-colors ${isActive ? 'text-mustard' : 'text-white/50 group-hover:text-white/80'}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left truncate">
                        {item.label}
                      </span>
                      {item.badge &&
                        <span className="bg-terracotta text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          {item.badge}
                        </span>
                      }
                    </button>);

                })}
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="px-3 py-4 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                <div className="w-8 h-8 bg-mustard rounded-full flex items-center justify-center text-forest text-xs font-bold shrink-0">
                  {adminInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">
                    {admin?.name || 'Admin User'}
                  </p>
                  <p className="text-white/40 text-[10px] truncate capitalize">
                    {admin?.role?.replace('_', ' ') || 'Administrator'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white/40 hover:text-white transition-colors"
                  title="Logout">
                  <LogOutIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        }
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center gap-4 shrink-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MenuIcon className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Admin</span>
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300" />
            <span className="font-semibold text-gray-800">
              {activeNav?.label}
            </span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-56">
            <SearchIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none text-gray-600 placeholder-gray-400 w-full" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <BellIcon className="w-5 h-5" />
            {notifCount > 0 &&
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full" />
            }
          </button>

          {/* Admin Avatar */}
          <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center text-white text-xs font-bold">
            {adminInitials}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full">
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>);

}
