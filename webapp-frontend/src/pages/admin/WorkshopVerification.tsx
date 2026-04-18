import React, { useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MapPinIcon,
  ChevronDownIcon,
  XIcon,
  BuildingIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
  FilterIcon,
  UserIcon,
  GlobeIcon,
  PhoneIcon,
  MailIcon } from
'lucide-react';
// ─── Types ────────────────────────────────────────────────────────────────────
type WorkshopStatus = 'pending' | 'approved' | 'rejected';
interface Workshop {
  id: number;
  name: string;
  artisan: string;
  artisanInitials: string;
  artisanColor: string;
  craft: string;
  region: string;
  location: string;
  capacity: number;
  duration: string;
  price: number;
  submittedDate: string;
  status: WorkshopStatus;
  description: string;
  schedule: string;
  totalBookings: number;
  rating: number;
}
interface Booking {
  id: number;
  workshopId: number;
  workshopName: string;
  craft: string;
  artisan: string;
  artisanColor: string;
  tourist: string;
  touristInitials: string;
  touristColor: string;
  country: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  groupSize: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  region: string;
}
// ─── Data (load from backend when available) ─────────────────────────────────
const WORKSHOPS: Workshop[] = [];
const BOOKINGS: Booking[] = [];

const STATUS_CONFIG: Record<
  WorkshopStatus,
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
  }> =
{
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400'
  },
  approved: {
    label: 'Approved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500'
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500'
  }
};
const BOOKING_STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700'
  },
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700'
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-50',
    text: 'text-red-600'
  }
};
// ─── Workshop Detail Modal ────────────────────────────────────────────────────
function WorkshopModal({
  workshop,
  onClose,
  onApprove,
  onReject





}: {workshop: Workshop;onClose: () => void;onApprove: (id: number) => void;onReject: (id: number) => void;}) {
  const statusCfg = STATUS_CONFIG[workshop.status];
  return (
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose} />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }}
        transition={{
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.stopPropagation()}>

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
          {/* Header */}
          <div className="relative h-28 overflow-hidden bg-forest">
            <div className="absolute inset-0 opacity-10">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg">

                <defs>
                  <pattern
                    id="ws-modal-batik"
                    x="0"
                    y="0"
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse">

                    <circle
                      cx="15"
                      cy="15"
                      r="8"
                      fill="none"
                      stroke="white"
                      strokeWidth="1" />

                    <circle cx="15" cy="15" r="3" fill="white" opacity="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ws-modal-batik)" />
              </svg>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white transition-colors">

              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg bg-forest flex items-center justify-center text-white text-xl font-bold">
                <BuildingIcon className="w-7 h-7" />
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>

                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>

            <h2 className="text-xl font-black text-gray-900 font-display mb-0.5">
              {workshop.name}
            </h2>
            <p className="text-forest font-semibold text-sm mb-3">
              by {workshop.artisan}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              {workshop.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-forest shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {workshop.location}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-mustard shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Capacity</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {workshop.capacity} people
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {workshop.duration}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Schedule</p>
                  <p className="text-xs font-semibold text-gray-800 leading-tight">
                    {workshop.schedule}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-mustard/10 rounded-xl mb-5">
              <span className="text-sm font-semibold text-gray-700">
                Session Price
              </span>
              <span className="text-lg font-black text-forest">
                LKR {workshop.price.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              {workshop.status !== 'approved' &&
              <button
                onClick={() => {
                  onApprove(workshop.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-colors">

                  <CheckCircleIcon className="w-4 h-4" /> Approve
                </button>
              }
              {workshop.status !== 'rejected' &&
              <button
                onClick={() => {
                  onReject(workshop.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors">

                  <XCircleIcon className="w-4 h-4" /> Reject
                </button>
              }
            </div>
          </div>
        </div>
      </motion.div>
    </>);

}
// ─── Main Component ───────────────────────────────────────────────────────────
export function WorkshopVerification() {
  const [workshops, setWorkshops] = useState<Workshop[]>(WORKSHOPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkshopStatus | 'all'>(
    'all'
  );
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'verification' | 'bookings'>(
    'verification'
  );
  const [bookingSearch, setBookingSearch] = useState('');
  const [craftFilter, setCraftFilter] = useState('all');
  const [showCraftDropdown, setShowCraftDropdown] = useState(false);
  const crafts = ['all', ...Array.from(new Set(BOOKINGS.map((b) => b.craft)))];
  const handleApprove = (id: number) => {
    setWorkshops((prev) =>
    prev.map((w) =>
    w.id === id ?
    {
      ...w,
      status: 'approved' as WorkshopStatus
    } :
    w
    )
    );
  };
  const handleReject = (id: number) => {
    setWorkshops((prev) =>
    prev.map((w) =>
    w.id === id ?
    {
      ...w,
      status: 'rejected' as WorkshopStatus
    } :
    w
    )
    );
  };
  const filteredWorkshops = workshops.filter((w) => {
    const matchSearch =
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.craft.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filteredBookings = BOOKINGS.filter((b) => {
    const matchSearch =
    b.tourist.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.workshopName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.artisan.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchCraft = craftFilter === 'all' || b.craft === craftFilter;
    return matchSearch && matchCraft;
  });
  const pendingCount = workshops.filter((w) => w.status === 'pending').length;
  const approvedCount = workshops.filter((w) => w.status === 'approved').length;
  const rejectedCount = workshops.filter((w) => w.status === 'rejected').length;
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 font-display mb-1">
          Workshop Verification
        </h1>
        <p className="text-gray-500 text-sm">
          Review workshop listings and monitor tourist bookings
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center text-forest">
            <BuildingIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">
              {workshops.length}
            </p>
            <p className="text-xs text-gray-500">Total Workshops</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{pendingCount}</p>
            <p className="text-xs text-gray-500">Pending Review</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{approvedCount}</p>
            <p className="text-xs text-gray-500">Approved</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">
              {BOOKINGS.length}
            </p>
            <p className="text-xs text-gray-500">Total Bookings</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'verification' ? 'bg-white text-forest shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

          <BuildingIcon className="w-4 h-4" />
          Pending Verifications
          {pendingCount > 0 &&
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'verification' ? 'bg-terracotta text-white' : 'bg-gray-300 text-gray-600'}`}>

              {pendingCount}
            </span>
          }
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'bookings' ? 'bg-white text-forest shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

          <UsersIcon className="w-4 h-4" />
          Tourist Bookings
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── TAB 1: Workshop Verification ── */}
        {activeTab === 'verification' &&
        <motion.div
          key="verification"
          initial={{
            opacity: 0,
            x: 10
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -10
          }}
          transition={{
            duration: 0.2
          }}
          className="flex flex-col flex-1">

            {/* Filter Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(
                (s) =>
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${statusFilter === s ? 'bg-forest text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-forest/30'}`}>

                      {s !== 'all' &&
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s as WorkshopStatus].dot}`} />

                  }
                      {s === 'all' ?
                  'All' :
                  STATUS_CONFIG[s as WorkshopStatus].label}
                    </button>

              )}
              </div>
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                placeholder="Search workshops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40" />

              </div>
            </div>

            {/* Workshop Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredWorkshops.map((workshop, i) => {
              const statusCfg = STATUS_CONFIG[workshop.status];
              return (
                <motion.div
                  key={workshop.id}
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: i * 0.06
                  }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                    {/* Card top bar */}
                    <div
                    className="h-1.5 w-full"
                    style={{
                      backgroundColor: workshop.artisanColor
                    }} />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{
                            backgroundColor: workshop.artisanColor
                          }}>

                            {workshop.artisanInitials}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm leading-tight">
                              {workshop.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              by {workshop.artisan}
                            </p>
                          </div>
                        </div>
                        <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shrink-0 ${statusCfg.bg} ${statusCfg.text}`}>

                          <span
                          className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />

                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3" />
                          {workshop.region}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {workshop.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <UsersIcon className="w-3 h-3" />
                          Max {workshop.capacity}
                        </span>
                        <span className="font-semibold text-forest">
                          LKR {workshop.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                        onClick={() => setSelectedWorkshop(workshop)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors">

                          <EyeIcon className="w-3.5 h-3.5" /> View Details
                        </button>
                        {workshop.status !== 'approved' &&
                      <button
                        onClick={() => handleApprove(workshop.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors">

                            <CheckCircleIcon className="w-3.5 h-3.5" /> Approve
                          </button>
                      }
                        {workshop.status !== 'rejected' &&
                      <button
                        onClick={() => handleReject(workshop.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors">

                            <XCircleIcon className="w-3.5 h-3.5" /> Reject
                          </button>
                      }
                      </div>
                    </div>
                  </motion.div>);

            })}
            </div>
          </motion.div>
        }

        {/* ── TAB 2: Tourist Bookings ── */}
        {activeTab === 'bookings' &&
        <motion.div
          key="bookings"
          initial={{
            opacity: 0,
            x: 10
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -10
          }}
          transition={{
            duration: 0.2
          }}
          className="flex flex-col flex-1">

            {/* Search + Filter */}
            <div className="flex gap-3 mb-5">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                placeholder="Search by tourist, workshop, or artisan..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40" />

              </div>
              <div className="relative">
                <button
                onClick={() => setShowCraftDropdown(!showCraftDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-forest/30">

                  <FilterIcon className="w-4 h-4" />
                  {craftFilter === 'all' ? 'All Crafts' : craftFilter}
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                {showCraftDropdown &&
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[180px] py-1">
                    {crafts.map((c) =>
                <button
                  key={c}
                  onClick={() => {
                    setCraftFilter(c);
                    setShowCraftDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${craftFilter === c ? 'text-forest font-semibold' : 'text-gray-600'}`}>

                        {c === 'all' ? 'All Crafts' : c}
                      </button>
                )}
                  </div>
              }
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex-1">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Tourist
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Workshop
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Artisan
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Group
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredBookings.map((booking, i) => {
                    const bStatusCfg = BOOKING_STATUS_CONFIG[booking.status];
                    return (
                      <motion.tr
                        key={booking.id}
                        initial={{
                          opacity: 0,
                          y: 6
                        }}
                        animate={{
                          opacity: 1,
                          y: 0
                        }}
                        transition={{
                          delay: i * 0.04
                        }}
                        className="hover:bg-gray-50/50 transition-colors">

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{
                                backgroundColor: booking.touristColor
                              }}>

                                {booking.touristInitials}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {booking.tourist}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {booking.country}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 leading-tight">
                                {booking.workshopName}
                              </p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPinIcon className="w-3 h-3" />
                                {booking.region}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                              style={{
                                backgroundColor: booking.artisanColor
                              }}>

                                {booking.artisan.
                              split(' ').
                              map((n) => n[0]).
                              join('')}
                              </div>
                              <span className="text-sm text-gray-700">
                                {booking.artisan}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700 font-medium">
                              {booking.date}
                            </p>
                            <p className="text-xs text-gray-400">
                              {booking.time}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                              <UsersIcon className="w-3.5 h-3.5 text-gray-400" />
                              {booking.groupSize}{' '}
                              {booking.groupSize === 1 ? 'person' : 'people'}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${bStatusCfg.bg} ${bStatusCfg.text}`}>

                              {bStatusCfg.label}
                            </span>
                          </td>
                        </motion.tr>);

                  })}
                  </tbody>
                </table>
                {filteredBookings.length === 0 &&
              <div className="text-center py-16 text-gray-400">
                    <UsersIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No bookings match your search</p>
                  </div>
              }
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Workshop Detail Modal */}
      <AnimatePresence>
        {selectedWorkshop &&
        <WorkshopModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
          onApprove={handleApprove}
          onReject={handleReject} />

        }
      </AnimatePresence>
    </div>);

}