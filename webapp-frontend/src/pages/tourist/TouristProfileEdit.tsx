import React, { useState, useEffect } from 'react';
import { TouristNavbar } from './TouristNavbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, uploadProfilePic } from '../../services/api';
import { INTERESTS, REGIONS } from '../../constants/touristConstants';
import {
  UserIcon, ContactIcon, GlobeIcon,
  CreditCardIcon, CalendarIcon,
  HomeIcon, MapPinIcon, CheckIcon, AlertCircleIcon,
  Trash2Icon, UploadCloudIcon
} from 'lucide-react';

const COUNTRIES = ['Sri Lanka', 'India', 'United Kingdom', 'United States', 'Australia', 'Germany', 'France', 'Japan', 'Canada', 'Singapore', 'Other'];
const LANGUAGES = ['English', 'Sinhala', 'Tamil', 'Other'];

export function TouristProfileEdit() {
  const { tourist, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentMediaUrl, setCurrentMediaUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    callingName: '',
    country: '',
    idNumber: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: ''
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB limit.');
      return;
    }
    setUploadError('');
    setUploadingImage(true);

    try {
      const payload = new FormData();
      payload.append('profilePic', file);

      const response = await uploadProfilePic(payload);
      setCurrentMediaUrl(response.data.profilePicUrl);
      setSuccess('Profile picture updated successfully!');

      // Clear success message after 3 seconds so it's not permanently stuck there
      setTimeout(() => setSuccess(''), 3000);

      if (refreshUser) {
        await refreshUser();
      }
    } catch (err: any) {
      setUploadError(err.response?.data?.error || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };


  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (tourist) {
      setFormData({
        fullName: tourist.fullName || '',
        callingName: tourist.callingName || '',
        country: tourist.country || '',
        idNumber: tourist.idNumber || '',
        dateOfBirth: tourist.dateOfBirth ? new Date(tourist.dateOfBirth).toISOString().split('T')[0] : '',
        addressLine1: tourist.address?.line1 || '',
        addressLine2: tourist.address?.line2 || '',
        city: tourist.address?.city || '',
        postalCode: tourist.address?.postalCode || ''
      });
      setSelectedInterests(tourist.interests || []);
      setSelectedRegions(tourist.preferredRegions || []);
      setSelectedLanguages(tourist.preferredLanguages || []);
      setCurrentMediaUrl(tourist.profilePicUrl || '');
    }
  }, [tourist]);

  const toggleInterest = (id: string) => setSelectedInterests(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleRegion = (id: string) => setSelectedRegions(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleLanguage = (lang: string) => setSelectedLanguages(p => p.includes(lang) ? p.filter(l => l !== lang) : [...p, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await updateProfile({
        ...formData,
        address: {
          line1: formData.addressLine1,
          line2: formData.addressLine2,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        preferredLanguages: selectedLanguages,
        interests: selectedInterests,
        preferredRegions: selectedRegions,
      });

      setSuccess('Profile updated!');
      setTimeout(() => navigate('/tourist/profile'), 500);
    } catch (err) {
      setError('Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? You will be logged out and unable to login until reactivated.')) return;

    setDeactivating(true);
    try {
      await updateProfile({ status: 'deactivated' });
      handleLogout();
      window.location.href = '/tourist/login';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to deactivate account.');
      setDeactivating(false);
    }
  };

  if (!tourist) return null;

  const isSriLankan = formData.country === 'Sri Lanka';

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#FAF6F0' }}>
      <TouristNavbar activeTab="profile" />

      <div className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-display font-bold text-[#1E1E1E] mb-2">Edit Profile</h1>
            <p className="text-sm text-gray-500 mb-8">Update your personal information and preferences.</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                <CheckIcon className="w-4 h-4 shrink-0" /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Account Details */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#1E1E1E] border-b pb-2">Account Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Calling Name</label>
                    <div className="relative">
                      <ContactIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" required value={formData.callingName} onChange={e => setFormData({ ...formData, callingName: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Country</label>
                    <div className="relative">
                      <GlobeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select required value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm bg-white">
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map(lang => {
                      const selected = selectedLanguages.includes(lang);
                      return (
                        <button key={lang} type="button" onClick={() => toggleLanguage(lang)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${selected ? 'bg-[#1A6B6B] text-white border-[#1A6B6B]' : 'bg-white border-gray-200 text-[#1E1E1E] hover:border-[#1A6B6B]/40'}`}>
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Personal Info */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#1E1E1E] border-b pb-2">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">{isSriLankan ? 'NIC Number' : 'Passport Number'}</label>
                    <div className="relative">
                      <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" required value={formData.idNumber} onChange={e => setFormData({ ...formData, idNumber: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Date of Birth</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="date" required value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5">Home Address</label>
                  <div className="relative">
                    <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" required value={formData.addressLine1} onChange={e => setFormData({ ...formData, addressLine1: e.target.value })} placeholder="Line 1" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm" />
                  </div>
                  <input type="text" value={formData.addressLine2} onChange={e => setFormData({ ...formData, addressLine2: e.target.value })} placeholder="Line 2 (optional)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="City" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm" />
                    </div>
                    <input type="text" value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} placeholder="Postal Code" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent outline-none text-sm" />
                  </div>
                </div>
              </section>

              {/* Interests */}
              <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#1E1E1E] border-b pb-2">Interests & Regions</h2>
                <div>
                  <p className="text-sm font-semibold mb-2">Crafts</p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map(({ id, label, emoji }) => {
                      const selected = selectedInterests.includes(id);
                      return (
                        <button key={id} type="button" onClick={() => toggleInterest(id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${selected ? 'bg-[#C1440E] text-white border-[#C1440E]' : 'bg-white border-gray-200'}`}>
                          <span>{emoji}</span>{label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Regions</p>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map(({ id, label, emoji }) => {
                      const selected = selectedRegions.includes(id);
                      return (
                        <button key={id} type="button" onClick={() => toggleRegion(id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${selected ? 'bg-[#1A6B6B] text-white border-[#1A6B6B]' : 'bg-white border-gray-200'}`}>
                          <span>{emoji}</span>{label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Profile Picture */}
              <section>
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                    Profile Picture
                  </label>
                  <label
                    htmlFor="media-upload"
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${uploadingImage ? 'border-[#1A6B6B] bg-[#E8F4F4] opacity-70' : 'border-gray-200 hover:border-[#C1440E]/40'
                      }`}>
                    {currentMediaUrl && !uploadingImage && (
                      <div className="mb-3 relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img src={currentMediaUrl} alt="Current media" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      id="media-upload"
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploadingImage} />
                    <UploadCloudIcon className={`w-8 h-8 ${uploadingImage ? 'text-[#1A6B6B] animate-pulse' : 'text-gray-300'}`} />
                    {uploadingImage ? (
                      <p className="text-sm font-semibold font-body" style={{ color: '#1A6B6B' }}>Uploading...</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-400 font-body">
                          Drop a file here or{' '}
                          <span className="font-semibold" style={{ color: '#C1440E' }}>browse</span>
                        </p>
                        <p className="text-xs text-gray-300 font-body">JPG, PNG — max 5MB</p>
                      </>
                    )}
                  </label>
                  {uploadError && <p className="text-xs text-red-500 mt-1.5 font-body">{uploadError}</p>}
                </div>
              </section>

              {/* Actions */}
              <div className="pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-3 w-full sm:w-auto">
                  <button type="button" onClick={() => navigate('/tourist/profile')} className="px-6 py-3 rounded-xl border bg-white font-semibold text-gray-600 hover:bg-gray-50 flex-1 sm:flex-none">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-8 py-3 rounded-xl bg-[#1A6B6B] text-white font-semibold hover:bg-[#135454] disabled:opacity-50 flex-1 sm:flex-none">
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                <button type="button" onClick={handleDeactivate} disabled={deactivating} className="flex items-center gap-2 text-red-500 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto justify-center">
                  <Trash2Icon className="w-4 h-4" />
                  {deactivating ? 'Deactivating...' : 'Deactivate Account'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
