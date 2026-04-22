import React, { useEffect, useState } from 'react';
import { getArtisans, updateArtisanStatus } from '../../api/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MapPinIcon,
  StarIcon,
  ChevronDownIcon,
  XIcon,
  UserIcon,
  CalendarIcon,
  AwardIcon,
  PhoneIcon,
  MailIcon } from
'lucide-react';
type ArtisanStatus = 'pending' | 'verified' | 'rejected';
interface Artisan {
  id: string;
  name: string;
  craft: string;
  region: string;
  email: string;
  phone: string;
  submittedDate: string;
  status: ArtisanStatus;
  rating: number;
  experience: string;
  bio: string;
  initials: string;
  color: string;
  certifications: string[];
  workshops: number;
}

const STATUS_CONFIG: Record<
  ArtisanStatus,
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
  verified: {
    label: 'Verified',
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
interface ArtisanVerificationProps {
  onNavigate?: (section: string) => void;
}
export function ArtisanVerification({ onNavigate }: ArtisanVerificationProps) {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ArtisanStatus | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    getArtisans().then(res => {
      const list = (res.data.data || []).map((a: any) => ({
        id: a._id,
        name: a.name || a.fullName || '',
        craft: a.craft || a.craftType || '',
        region: a.region || a.location?.formattedAddress || '',
        email: a.email || '',
        phone: a.phone || '',
        submittedDate: a.submittedDate || a.createdAt || '',
        status: a.status || 'pending',
        rating: a.rating || 0,
        experience: a.experience || '',
        bio: a.bio || '',
        initials: a.initials || (a.name || a.fullName || 'A').split(' ').map((n: string) => n[0]).join('').slice(0, 2),
        color: a.color || '#2F5D50',
        certifications: a.certifications || [],
        workshops: a.workshops || 0,
      }));
      setArtisans(list);
    }).catch(() => {});
  }, []);

  const regions = ['all', ...Array.from(new Set(artisans.map((a) => a.region)))];
  const filtered = artisans.filter((a) => {
    const matchSearch =
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchRegion = regionFilter === 'all' || a.region === regionFilter;
    return matchSearch && matchStatus && matchRegion;
  });
  const handleApprove = async (id: string) => {
    try {
      await updateArtisanStatus(id, 'verified');
      setArtisans(prev => prev.map(a => a.id === id ? { ...a, status: 'verified' as ArtisanStatus } : a));
      if (selectedArtisan?.id === id) setSelectedArtisan(prev => prev ? { ...prev, status: 'verified' } : null);
    } catch {}
  };
  const handleReject = async (id: string) => {
    try {
      await updateArtisanStatus(id, 'rejected');
      setArtisans(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as ArtisanStatus } : a));
      if (selectedArtisan?.id === id) setSelectedArtisan(prev => prev ? { ...prev, status: 'rejected' } : null);
    } catch {}
  };
  const counts = {
    all: artisans.length,
    pending: artisans.filter((a) => a.status === 'pending').length,
    verified: artisans.filter((a) => a.status === 'verified').length,
    rejected: artisans.filter((a) => a.status === 'rejected').length
  };
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 font-display mb-1">
          Artisan Verification
        </h1>
        <p className="text-gray-500 text-sm">
          Review and manage artisan registration requests
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'pending', 'verified', 'rejected'] as const).map((status) =>
        <button
          key={status}
          onClick={() => setStatusFilter(status)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize flex items-center gap-2 ${statusFilter === status ? 'bg-forest text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-forest/30'}`}>

            {status !== 'all' &&
          <span
            className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status as ArtisanStatus].dot}`} />

          }
            {status === 'all' ?
          'All Artisans' :
          STATUS_CONFIG[status as ArtisanStatus].label}
            <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${statusFilter === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>

              {counts[status]}
            </span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, craft, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40 transition-all" />

        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-forest/30 transition-all">

            <FilterIcon className="w-4 h-4" />
            Region: {regionFilter === 'all' ? 'All' : regionFilter}
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          {showFilterDropdown &&
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px] py-1">
              {regions.map((r) =>
            <button
              key={r}
              onClick={() => {
                setRegionFilter(r);
                setShowFilterDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-50 transition-colors ${regionFilter === r ? 'text-forest font-semibold' : 'text-gray-600'}`}>

                  {r === 'all' ? 'All Regions' : r}
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
                  Artisan
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Craft
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Region
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Submitted
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
              {filtered.map((artisan, i) => {
                const statusCfg = STATUS_CONFIG[artisan.status];
                return (
                  <motion.tr
                    key={artisan.id}
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
                            backgroundColor: artisan.color
                          }}>

                          {artisan.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {artisan.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {artisan.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {artisan.craft}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
                        {artisan.region}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {artisan.submittedDate}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>

                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />

                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedArtisan(artisan)}
                          className="p-1.5 text-gray-400 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                          title="View Details">

                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {artisan.status !== 'verified' &&
                        <button
                          onClick={() => handleApprove(artisan.id)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Approve">

                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        }
                        {artisan.status !== 'rejected' &&
                        <button
                          onClick={() => handleReject(artisan.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject">

                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        }
                      </div>
                    </td>
                  </motion.tr>);

              })}
            </tbody>
          </table>
          {filtered.length === 0 &&
          <div className="text-center py-16 text-gray-400">
              <UserIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No artisans match your filters</p>
            </div>
          }
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedArtisan &&
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
            onClick={() => setSelectedArtisan(null)} />

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
                {/* Modal Header */}
                <div
                className="relative h-28 overflow-hidden"
                style={{
                  backgroundColor: selectedArtisan.color
                }}>

                  {/* Batik pattern */}
                  <div className="absolute inset-0 opacity-15">
                    <svg
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg">

                      <defs>
                        <pattern
                        id="modal-batik"
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

                          <circle
                          cx="15"
                          cy="15"
                          r="3"
                          fill="white"
                          opacity="0.5" />

                        </pattern>
                      </defs>
                      <rect
                      width="100%"
                      height="100%"
                      fill="url(#modal-batik)" />

                    </svg>
                  </div>
                  <button
                  onClick={() => setSelectedArtisan(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white transition-colors">

                    <XIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 pb-6">
                  {/* Avatar */}
                  <div className="flex items-end justify-between -mt-8 mb-4">
                    <div
                    className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-xl font-bold"
                    style={{
                      backgroundColor: selectedArtisan.color
                    }}>

                      {selectedArtisan.initials}
                    </div>
                    <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[selectedArtisan.status].bg} ${STATUS_CONFIG[selectedArtisan.status].text}`}>

                      <span
                      className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selectedArtisan.status].dot}`} />

                      {STATUS_CONFIG[selectedArtisan.status].label}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-gray-900 font-display mb-0.5">
                    {selectedArtisan.name}
                  </h2>
                  <p className="text-forest font-semibold text-sm mb-4">
                    {selectedArtisan.craft}
                  </p>

                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {selectedArtisan.bio}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-forest shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Region</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {selectedArtisan.region}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                      <AwardIcon className="w-4 h-4 text-mustard shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Experience</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {selectedArtisan.experience}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {selectedArtisan.email}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {selectedArtisan.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  {selectedArtisan.certifications.length > 0 &&
                <div className="mb-5">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Certifications
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedArtisan.certifications.map((cert) =>
                    <span
                      key={cert}
                      className="px-3 py-1 bg-mustard/10 text-mustard-dark text-xs font-semibold rounded-full">

                            {cert}
                          </span>
                    )}
                      </div>
                    </div>
                }

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    {selectedArtisan.status !== 'verified' &&
                  <button
                    onClick={() => handleApprove(selectedArtisan.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-colors">

                        <CheckCircleIcon className="w-4 h-4" />
                        Approve
                      </button>
                  }
                    {selectedArtisan.status !== 'rejected' &&
                  <button
                    onClick={() => handleReject(selectedArtisan.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors">

                        <XCircleIcon className="w-4 h-4" />
                        Reject
                      </button>
                  }
                    {selectedArtisan.status === 'verified' &&
                  <button
                    onClick={() => handleReject(selectedArtisan.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors">

                        <XCircleIcon className="w-4 h-4" />
                        Revoke Verification
                      </button>
                  }
                    {selectedArtisan.status === 'rejected' &&
                  <button
                    onClick={() => handleApprove(selectedArtisan.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm transition-colors">

                        <CheckCircleIcon className="w-4 h-4" />
                        Re-approve
                      </button>
                  }
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </div>);

}