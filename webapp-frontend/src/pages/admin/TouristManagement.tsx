import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  XIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  GlobeIcon,
  ShieldOffIcon,
  ShieldCheckIcon,
  EyeIcon,
  ClockIcon } from
'lucide-react';
type AccountStatus = 'active' | 'suspended';
interface WorkshopAttendance {
  id: number;
  workshop: string;
  artisan: string;
  date: string;
  craft: string;
}
interface Tourist {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  joinedDate: string;
  status: AccountStatus;
  initials: string;
  color: string;
  workshopsAttended: WorkshopAttendance[];
  totalBookings: number;
  lastActive: string;
}
const TOURISTS: Tourist[] = [];

const CRAFT_COLORS: Record<string, string> = {
  Lacquerwork: '#C65D3B',
  Batik: '#2F5D50',
  'Mask Carving': '#C9A227',
  Pottery: '#C65D3B',
  Weaving: '#2F5D50',
  Brasswork: '#C9A227',
  Gems: '#C65D3B'
};
export function TouristManagement() {
  const [tourists, setTourists] = useState<Tourist[]>(TOURISTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filtered = tourists.filter((t) => {
    const matchSearch =
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const handleToggleStatus = (id: number) => {
    setTourists((prev) =>
    prev.map((t) =>
    t.id === id ?
    {
      ...t,
      status: t.status === 'active' ? 'suspended' : 'active'
    } :
    t
    )
    );
    if (selectedTourist?.id === id) {
      setSelectedTourist((prev) =>
      prev ?
      {
        ...prev,
        status: prev.status === 'active' ? 'suspended' : 'active'
      } :
      null
      );
    }
  };
  const counts = {
    all: tourists.length,
    active: tourists.filter((t) => t.status === 'active').length,
    suspended: tourists.filter((t) => t.status === 'suspended').length
  };
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 font-display mb-1">
          Tourist Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage registered tourists and their workshop activity
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-forest" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{counts.all}</p>
            <p className="text-xs text-gray-500">Total Tourists</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{counts.active}</p>
            <p className="text-xs text-gray-500">Active Accounts</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <ShieldOffIcon className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">
              {counts.suspended}
            </p>
            <p className="text-xs text-gray-500">Suspended</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40 transition-all" />

        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-forest/30 transition-all">

            <FilterIcon className="w-4 h-4" />
            Status:{' '}
            {statusFilter === 'all' ?
            'All' :
            statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          {showFilterDropdown &&
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px] py-1">
              {(['all', 'active', 'suspended'] as const).map((s) =>
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setShowFilterDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-50 transition-colors ${statusFilter === s ? 'text-forest font-semibold' : 'text-gray-600'}`}>

                  {s === 'all' ?
              'All Status' :
              s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
            )}
            </div>
          }
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tourist
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Country
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Workshops
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tourist, i) =>
              <motion.tr
                key={tourist.id}
                initial={{
                  opacity: 0,
                  y: 8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: i * 0.04
                }}
                className="hover:bg-gray-50/50 transition-colors">

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{
                        backgroundColor: tourist.color
                      }}>

                        {tourist.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {tourist.name}
                        </p>
                        <p className="text-xs text-gray-400">{tourist.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <GlobeIcon className="w-3.5 h-3.5 text-gray-400" />
                      {tourist.country}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900">
                        {tourist.totalBookings}
                      </span>
                      <span className="text-xs text-gray-400">attended</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                      {tourist.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${tourist.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>

                      <span
                      className={`w-1.5 h-1.5 rounded-full ${tourist.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />

                      {tourist.status.charAt(0).toUpperCase() +
                    tourist.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                      onClick={() => setSelectedTourist(tourist)}
                      className="p-1.5 text-gray-400 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                      title="View Details">

                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => handleToggleStatus(tourist.id)}
                      className={`p-1.5 rounded-lg transition-colors ${tourist.status === 'active' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                      title={
                      tourist.status === 'active' ? 'Suspend' : 'Activate'
                      }>

                        {tourist.status === 'active' ?
                      <ShieldOffIcon className="w-4 h-4" /> :

                      <ShieldCheckIcon className="w-4 h-4" />
                      }
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
          {filtered.length === 0 &&
          <div className="text-center py-16 text-gray-400">
              <UserIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No tourists match your filters</p>
            </div>
          }
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedTourist &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedTourist(null)} />

            <motion.div
            initial={{
              x: '100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '100%'
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">

              {/* Drawer Header */}
              <div
              className="relative h-32 shrink-0 overflow-hidden"
              style={{
                backgroundColor: selectedTourist.color
              }}>

                <div className="absolute inset-0 opacity-15">
                  <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg">

                    <defs>
                      <pattern
                      id="drawer-pattern"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                      patternUnits="userSpaceOnUse">

                        <circle
                        cx="12"
                        cy="12"
                        r="6"
                        fill="none"
                        stroke="white"
                        strokeWidth="1" />

                      </pattern>
                    </defs>
                    <rect
                    width="100%"
                    height="100%"
                    fill="url(#drawer-pattern)" />

                  </svg>
                </div>
                <button
                onClick={() => setSelectedTourist(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white transition-colors">

                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 pb-6">
                  {/* Avatar & Name */}
                  <div className="flex items-end justify-between -mt-8 mb-4">
                    <div
                    className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-xl font-bold"
                    style={{
                      backgroundColor: selectedTourist.color
                    }}>

                      {selectedTourist.initials}
                    </div>
                    <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${selectedTourist.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>

                      <span
                      className={`w-1.5 h-1.5 rounded-full ${selectedTourist.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />

                      {selectedTourist.status.charAt(0).toUpperCase() +
                    selectedTourist.status.slice(1)}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-gray-900 font-display mb-0.5">
                    {selectedTourist.name}
                  </h2>
                  <p className="text-gray-500 text-sm mb-5 flex items-center gap-1">
                    <GlobeIcon className="w-3.5 h-3.5" />{' '}
                    {selectedTourist.country}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MailIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-800">
                          {selectedTourist.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-800">
                          {selectedTourist.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Member Since</p>
                        <p className="text-sm font-medium text-gray-800">
                          {selectedTourist.joinedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Workshop Attendance */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-forest" />
                      Workshop Attendance (
                      {selectedTourist.workshopsAttended.length})
                    </h3>
                    {selectedTourist.workshopsAttended.length > 0 ?
                  <div className="space-y-2">
                        {selectedTourist.workshopsAttended.map((ws) =>
                    <div
                      key={ws.id}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">

                            <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{
                          backgroundColor:
                          CRAFT_COLORS[ws.craft] || '#2F5D50'
                        }}>

                              {ws.craft.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {ws.workshop}
                              </p>
                              <p className="text-xs text-gray-400">
                                with {ws.artisan} · {ws.date}
                              </p>
                            </div>
                          </div>
                    )}
                      </div> :

                  <div className="text-center py-6 bg-gray-50 rounded-xl">
                        <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                          No workshops attended yet
                        </p>
                      </div>
                  }
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 shrink-0">
                <button
                onClick={() => handleToggleStatus(selectedTourist.id)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${selectedTourist.status === 'active' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>

                  {selectedTourist.status === 'active' ?
                <>
                      <ShieldOffIcon className="w-4 h-4" /> Suspend Account
                    </> :

                <>
                      <ShieldCheckIcon className="w-4 h-4" /> Activate Account
                    </>
                }
                </button>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </div>);

}