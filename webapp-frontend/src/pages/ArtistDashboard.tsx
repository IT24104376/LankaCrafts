import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  Edit2,
  Calendar,
  MessageCircle,
  Settings,
  LogOut,
  MapPin,
  Star,
  Clock,
  Plus,
  X,
  Save,
  Trash2,
  Upload,
  BuildingIcon,
  PhoneIcon,
  MailIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getArtistProfile,
  updateArtistProfile,
  deleteArtistProfile,
  uploadArtistProfilePic,
  getMyCrafts,
  createCraft,
  updateCraft,
  deleteCraft,
} from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ReviewSection } from '../components/ReviewSection';

interface Craft {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  stock: number;
  isAvailable: boolean;
}

const CRAFT_CATEGORIES = [
  'Lacquerwork',
  'Batik',
  'Mask Carving',
  'Pottery',
  'Handloom',
  'Brasswork',
  'Wood Carving',
  'Jewellery',
  'Other',
];

function SidebarItem({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${active ? 'bg-[#2F5D50] text-white shadow-md translate-x-1' : 'text-gray-600 hover:bg-gray-50 hover:text-[#2F5D50]'}`}>
      <span className={active ? 'text-[#C9A227]' : 'text-gray-400'}>{icon}</span>
      {label}
      {badge !== undefined && (
        <span className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-[#C9A227] text-[#2F5D50]' : 'bg-[#C1440E] text-white'}`}>
          {badge}
        </span>
      )}
      {active && badge === undefined && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A227]" />}
    </button>
  );
}

export function ArtistDashboard() {
  const navigate = useNavigate();
  const { firebaseUser, logoutArtist, refreshArtist } = useAuth();
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'crafts' | 'reviews' | 'settings'>('view');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [artistData, setArtistData] = useState<any>(null);
  const [crafts, setCrafts] = useState<Craft[]>([]);

  const [editForm, setEditForm] = useState<any>({});
  const [newCraft, setNewCraft] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 1,
  });
  const [showAddCraft, setShowAddCraft] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!firebaseUser) {
      navigate('/artist/login');
      return;
    }
    loadData();
  }, [firebaseUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, craftsRes] = await Promise.all([
        getArtistProfile().catch(() => ({ data: {} })),
        getMyCrafts().catch(() => ({ data: { crafts: [] } })),
      ]);
      if (profileRes.data.artist) {
        setArtistData(profileRes.data.artist);
        setEditForm(profileRes.data.artist);
      }
      setCrafts(craftsRes.data.crafts || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutArtist();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await updateArtistProfile(editForm);
      setSuccess('Profile updated successfully!');
      setArtistData(editForm);
      setActiveTab('view');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteArtistProfile();
      await logoutArtist();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to delete profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      const response = await uploadArtistProfilePic(formData);
      setEditForm({ ...editForm, profilePicUrl: response.data.profilePicUrl });
      setSuccess('Profile picture updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  }

  const handleAddCraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCraft.name || !newCraft.price || !newCraft.category) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createCraft(newCraft);
      setSuccess('Craft added successfully!');
      setNewCraft({ name: '', description: '', price: '', category: '', stock: 1 });
      setShowAddCraft(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add craft');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCraft = async (craftId: string) => {
    if (!window.confirm('Are you sure you want to delete this craft?')) {
      return;
    }
    try {
      await deleteCraft(craftId);
      setCrafts(crafts.filter((c) => c._id !== craftId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete craft');
    }
  };

  const handleToggleCraftAvailability = async (craft: Craft) => {
    try {
      await updateCraft(craft._id, { isAvailable: !craft.isAvailable });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update craft');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F3EE] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#2F5D50] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EE] font-body flex flex-col">
      <Navbar artistMode />

      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-[#2F5D50] mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
                Artist Dashboard
              </h1>
              <p className="text-gray-600">Manage your profile and crafts</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-600">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                <div className="p-6 border-b border-gray-100 bg-[#2F5D50] text-white text-center">
                  <div className="w-20 h-20 bg-[#C9A227] rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-[#2F5D50] border-4 border-white/20">
                    {artistData?.profilePicUrl ? (
                      <img
                        src={artistData.profilePicUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      artistData?.initials
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{artistData?.fullName || 'Artist'}</h3>
                  <p className="text-white/70 text-sm">{artistData?.craftType || 'Craftsman'}</p>
                </div>
                <div className="p-2 space-y-1">
                  <SidebarItem icon={<EyeIcon className="w-4 h-4" />} label="View Profile" active={activeTab === 'view'} onClick={() => setActiveTab('view')} />
                  <SidebarItem icon={<Edit2 className="w-4 h-4" />} label="Edit Profile" active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} />
                  <SidebarItem icon={<BuildingIcon className="w-4 h-4" />} label="My Crafts" active={activeTab === 'crafts'} onClick={() => setActiveTab('crafts')} badge={crafts.length} />
                  <SidebarItem icon={<MessageCircle className="w-4 h-4" />} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
                  <SidebarItem icon={<Settings className="w-4 h-4" />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === 'view' && (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-[#2F5D50]/10 p-3 text-center text-[#2F5D50] text-sm font-bold border-b border-[#2F5D50]/20">
                      <EyeIcon className="w-4 h-4 inline-block mr-2" />
                      This is how customers see your profile
                    </div>
                    <div className="relative h-[300px] bg-[#2F5D50] overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%">
                          <defs>
                            <pattern id="profile-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                              <circle cx="20" cy="20" r="2" fill="white" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#profile-pattern)" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2F5D50] to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                          <div className="w-24 h-24 rounded-full border-4 border-white bg-[#C1440E] shadow-xl flex items-center justify-center text-white text-2xl font-bold">
                            {artistData?.profilePicUrl ? (
                              <img
                                src={artistData.profilePicUrl}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              artistData?.initials
                            )}
                          </div>
                          <div className="flex-1 text-white">
                            <div className="flex items-center gap-2 mb-2 text-[#C9A227] font-bold uppercase tracking-wider text-xs">
                              <Star className="w-3 h-3 fill-current" /> Master Artisan
                            </div>
                            <h1 className="text-3xl font-black mb-2">{artistData?.fullName || 'Artist Name'}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                              <span className="font-semibold">{artistData?.craftType || 'Craft Type'}</span>
                              <span className="w-1 h-1 rounded-full bg-white/40" />
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {artistData?.address?.city}, {artistData?.address?.province}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-8">
                        <section>
                          <h2 className="text-xl font-bold text-[#2F5D50] mb-4" style={{ fontFamily: 'Fraunces, serif' }}>About the Artisan</h2>
                          <p className="text-gray-600 leading-relaxed">{artistData?.bio || 'No bio yet.'}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {(artistData?.specialties || []).map((tag: string) => (
                              <span key={tag} className="px-3 py-1 bg-[#F6F3EE] rounded-lg text-xs font-semibold text-[#2F5D50]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </section>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-[#F6F3EE] p-5 rounded-xl border border-gray-200">
                          <h3 className="text-lg font-bold text-[#2F5D50] mb-3 flex items-center gap-2" style={{ fontFamily: 'Fraunces, serif' }}>
                            <Clock className="w-4 h-4" /> Contact
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MailIcon className="w-4 h-4" /> {artistData?.email || 'No email'}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <PhoneIcon className="w-4 h-4" /> {artistData?.phone || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'edit' && (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-[#2F5D50]" style={{ fontFamily: 'Fraunces, serif' }}>Edit Profile</h2>
                      <button onClick={handleSaveProfile} disabled={submitting} className="flex items-center gap-2 px-5 py-2.5 bg-[#2F5D50] text-white rounded-xl font-semibold text-sm hover:bg-[#1A4D45] transition-colors disabled:opacity-50">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={editForm.fullName || ''}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Craft Type</label>
                          <input
                            type="text"
                            value={editForm.craftType || ''}
                            onChange={(e) => setEditForm({ ...editForm, craftType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={editForm.email || ''}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                          <textarea
                            rows={4}
                            value={editForm.bio || ''}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Profile Picture</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadProfilePic}
                            disabled={uploadingImage}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200"
                          />
                          {uploadingImage && <p className="text-sm text-gray-500">Uploading...</p>}
                          {editForm.profilePicUrl && (
                            <img src={editForm.profilePicUrl} alt="Profile" className="w-20 h-20 rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'crafts' && (
                  <motion.div
                    key="crafts"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-[#2F5D50]" style={{ fontFamily: 'Fraunces, serif' }}>My Crafts</h2>
                        <p className="text-gray-500 text-sm">Manage your craft listings for sale</p>
                      </div>
                      <button
                        onClick={() => setShowAddCraft(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#2F5D50] text-white rounded-xl font-semibold text-sm hover:bg-[#1A4D45] transition-colors">
                        <Plus className="w-4 h-4" /> Add Craft
                      </button>
                    </div>

                    {showAddCraft && (
                      <div className="mb-8 p-6 bg-[#F6F3EE] rounded-xl border border-gray-200">
                        <h3 className="font-bold text-[#2F5D50] mb-4">Add New Craft</h3>
                        <form onSubmit={handleAddCraft} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                              <input
                                type="text"
                                required
                                value={newCraft.name}
                                onChange={(e) => setNewCraft({ ...newCraft, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm"
                                placeholder="Hand-carved Mask"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                              <select
                                required
                                value={newCraft.category}
                                onChange={(e) => setNewCraft({ ...newCraft, category: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm bg-white">
                                <option value="">Select category...</option>
                                {CRAFT_CATEGORIES.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Price (LKR) *</label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={newCraft.price}
                                onChange={(e) => setNewCraft({ ...newCraft, price: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm"
                                placeholder="5000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                              <input
                                type="number"
                                min="0"
                                value={newCraft.stock}
                                onChange={(e) => setNewCraft({ ...newCraft, stock: parseInt(e.target.value) })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                              <textarea
                                value={newCraft.description}
                                onChange={(e) => setNewCraft({ ...newCraft, description: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] outline-none text-sm"
                                rows={2}
                              />
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setShowAddCraft(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold">Cancel</button>
                            <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#2F5D50] text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                              {submitting ? 'Adding...' : 'Add Craft'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {crafts.length === 0 ? (
                      <div className="text-center py-12">
                        <BuildingIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No crafts yet. Add your first craft!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {crafts.map((craft) => (
                          <div key={craft._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {craft.images?.[0] ? (
                                <img src={craft.images[0]} alt={craft.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <BuildingIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[#1E1E1E]">{craft.name}</h4>
                              <p className="text-sm text-gray-500">{craft.category}</p>
                              <p className="text-sm font-bold text-[#2F5D50]">{craft.currency} {craft.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleCraftAvailability(craft)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${craft.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {craft.isAvailable ? 'Available' : 'Unavailable'}
                              </button>
                              <button
                                onClick={() => handleDeleteCraft(craft._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <ReviewSection context="artisan" artisanName={artistData?.businessName || artistData?.fullName} />
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-[#2F5D50] mb-6" style={{ fontFamily: 'Fraunces, serif' }}>Account Settings</h2>
                    <div>
                      <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" /> Danger Zone
                      </h3>
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                        <h4 className="font-bold text-red-900 mb-2">Delete Account</h4>
                        <p className="text-red-700 text-sm mb-6 max-w-xl">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                          onClick={handleDeleteProfile}
                          disabled={submitting}
                          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                          Delete My Profile
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}