import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  MailIcon,
  LockIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MapPinIcon,
  HomeIcon,
  BuildingIcon,
  MapIcon,
  PhoneIcon,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Save,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  registerArtist as registerArtistApi,
  updateArtistProfile,
  createCraft,
  getMyCrafts,
  updateCraft,
  deleteCraft,
} from '../../services/api';

const CRAFT_TYPES = [
  'Batik',
  'Lacquerwork',
  'Wood Carving',
  'Pottery',
  'Mask Making',
  'Brasswork',
  'Jewelry Making',
  'Textile Weaving',
  'Handloom',
  'Other',
];

const PROVINCES = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province',
];

const DISTRICTS: Record<string, string[]> = {
  'Western Province': ['Colombo', 'Gampaha', 'Kalutara'],
  'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Southern Province': ['Galle', 'Matara', 'Hambantota'],
  'Northern Province': ['Jaffna', 'Kilinochchi', 'Mullaitivu', 'Vanni'],
  'Eastern Province': ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western Province': ['Kurunegala', 'Puttalam'],
  'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
  'Uva Province': ['Badulla', 'Monaragala'],
  'Sabaragamuwa Province': ['Ratnapura', 'Kegalle'],
};

const STEP_LABELS = ['Account Setup', 'Address & Location', 'Your Crafts'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOTS = ['morning', 'afternoon', 'evening'] as const;

export function ArtistRegister() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [step1, setStep1] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    craftType: '',
  });

  const [step2, setStep2] = useState({
    number: '',
    street: '',
    village: '',
    city: '',
    district: '',
    province: '',
    postalCode: '',
  });

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    formattedAddress: string;
  } | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');

  const [availability, setAvailability] = useState<Record<string, Record<string, boolean>>>(
    DAYS.reduce((acc, day) => {
      acc[day] = { morning: false, afternoon: false, evening: false };
      return acc;
    }, {} as Record<string, Record<string, boolean>>)
  );

  const [step3, setStep3] = useState({
    bio: '',
    specialtys: [] as string[],
  });

  const { registerArtist } = useAuth();
  const navigate = useNavigate();

  const districts = step2.province ? DISTRICTS[step2.province] || [] : [];

  const geocodeAddress = async () => {
    const address = `${step2.number} ${step2.street}, ${step2.city}, ${step2.district}, ${step2.province}, Sri Lanka`;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'LankaCrafts/1.0',
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        setLocation({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          formattedAddress: result.display_name,
        });
        return { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
    return null;
  };

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;

    const loadLeaflet = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (mapRef.current) return;

      mapRef.current = L.map(mapContainerRef.current).setView([7.8731, 80.7718], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      markerRef.current = L.marker([7.8731, 80.7718], { icon }).addTo(mapRef.current);
    };

    loadLeaflet();
    setMapLoaded(true);
  }, [mapLoaded]);

  useEffect(() => {
    if (!location || !mapRef.current || !markerRef.current) return;

    mapRef.current.setView([location.lat, location.lng], 15);
    markerRef.current.setLatLng([location.lat, location.lng]);
  }, [location]);

  const toggleAvailability = (day: string, slot: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: !prev[day][slot],
      },
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (s: string) => {
    setSpecialties(specialties.filter((item) => item !== s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setApiError('');

    try {
      const coords = await geocodeAddress();

      await registerArtist(step1.email, step1.password, {
        fullName: step1.fullName,
        phone: step1.phone,
        craftType: step1.craftType,
        bio: step3.bio,
        address: {
          number: step2.number,
          street: step2.street,
          village: step2.village,
          city: step2.city,
          district: step2.district,
          province: step2.province,
          postalCode: step2.postalCode,
        },
        location: coords
          ? {
              type: 'Point',
              coordinates: [coords.lng, coords.lat],
              formattedAddress: location?.formattedAddress || '',
            }
          : undefined,
        specialties,
        availability,
      });

      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } }; message?: string })
          ?.response?.data?.error ||
        (err as { message?: string })?.message ||
        'Registration failed.';
      if (msg.includes('email-already-in-use')) {
        setApiError('An account with this email already exists.');
      } else {
        setApiError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = () => {
    const p = step1.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strength = passwordStrength();
  const progressWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%';

  return (
    <div className="min-h-screen flex font-body relative" style={{ backgroundColor: '#ddede7' }}>
      <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="batik-bg-register" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#2F5D50" strokeWidth="1.5" />
              <circle cx="30" cy="30" r="3" fill="#2F5D50" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#batik-bg-register)" />
        </svg>
      </div>

      <div className="hidden lg:flex w-[40%] relative overflow-hidden flex-col z-10">
        <img
          src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&auto=format&fit=crop"
          alt="Sri Lankan cultural artisan"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(47,93,80,0.85) 0%, rgba(30,30,30,0.9) 100%)' }} />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <ellipse cx="16" cy="8" rx="4" ry="7" fill="white" opacity="0.9" />
              <ellipse cx="24" cy="16" rx="7" ry="4" fill="white" opacity="0.75" />
              <ellipse cx="16" cy="24" rx="4" ry="7" fill="white" opacity="0.6" />
              <ellipse cx="8" cy="16" rx="7" ry="4" fill="white" opacity="0.75" />
              <circle cx="16" cy="16" r="3.5" fill="white" />
            </svg>
            <span className="text-xl font-display font-bold text-white">LankaCrafts</span>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-white leading-tight mb-8">Share Your Craft with the World</h2>
            <div className="space-y-4">
              {STEP_LABELS.map((label, idx) => {
                const stepNum = idx + 1;
                const isComplete = step > stepNum;
                const isCurrent = step === stepNum;
                return (
                  <div key={label} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${isComplete ? 'bg-green-400 text-white' : isCurrent ? 'bg-white text-[#2F5D50]' : 'bg-white/20 text-white/60'}`}>
                      {isComplete ? <CheckIcon className="w-4 h-4" /> : stepNum}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold font-body ${isCurrent ? 'text-white' : isComplete ? 'text-white/80' : 'text-white/40'}`}>{label}</p>
                      <p className={`text-xs font-body ${isCurrent ? 'text-white/70' : 'text-white/30'}`}>Step {stepNum} of 3</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-xl mx-auto px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold font-body uppercase tracking-wider" style={{ color: '#2F5D50' }}>Step {step} of 3</span>
              <span className="text-xs text-gray-400 font-body">{STEP_LABELS[step - 1]}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div animate={{ width: progressWidth }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="h-full rounded-full" style={{ backgroundColor: '#2F5D50' }} />
            </div>
          </div>

          {apiError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-body">
              {apiError}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl font-display font-bold text-[#1E1E1E] mb-1">Create Your Artist Account</h1>
                <p className="text-sm text-gray-400 mb-8 font-body">Join our community of master craftsmen</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" required value={step1.fullName} onChange={(e) => setStep1({ ...step1, fullName: e.target.value })} placeholder="Kamala Wijesinghe" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Email Address</label>
                    <div className="relative">
                      <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" required value={step1.email} onChange={(e) => setStep1({ ...step1, email: e.target.value })} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Password</label>
                      <div className="relative">
                        <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type={showPassword ? 'text' : 'password'} required value={step1.password} onChange={(e) => setStep1({ ...step1, password: e.target.value })} placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                      </div>
                      {step1.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < strength ? strengthColors[strength - 1] : 'bg-gray-200'}`} />)}
                          </div>
                          <p className="text-xs text-gray-400 font-body">{strength > 0 ? strengthLabels[strength - 1] : ''}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Confirm Password</label>
                      <div className="relative">
                        <CheckIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="password" required value={step1.confirmPassword} onChange={(e) => setStep1({ ...step1, confirmPassword: e.target.value })} placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                      </div>
                      {step1.confirmPassword && <p className={`text-xs mt-1 font-body ${step1.password === step1.confirmPassword ? 'text-green-500' : 'text-red-400'}`}>{step1.password === step1.confirmPassword ? '✓ Passwords match' : '✗ Do not match'}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Phone Number</label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="tel" required value={step1.phone} onChange={(e) => setStep1({ ...step1, phone: e.target.value })} placeholder="+94 77 123 4567" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Craft Type</label>
                    <div className="relative">
                      <BuildingIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select required value={step1.craftType} onChange={(e) => setStep1({ ...step1, craftType: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body bg-white appearance-none">
                        <option value="">Select your craft...</option>
                        {CRAFT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronRightIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <motion.button type="button" onClick={() => setStep(2)} disabled={!step1.fullName || !step1.email || !step1.password || !step1.confirmPassword || !step1.phone || !step1.craftType || step1.password !== step1.confirmPassword} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl text-white font-semibold text-sm font-body transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#2F5D50' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A4D45'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F5D50'}>
                    Continue <ArrowRightIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl font-display font-bold text-[#1E1E1E] mb-1">Workshop Location</h1>
                <p className="text-sm text-gray-400 mb-8 font-body">Enter your workshop address for customers to find you</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">House Number</label>
                      <div className="relative">
                        <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" required value={step2.number} onChange={(e) => setStep2({ ...step2, number: e.target.value })} placeholder="No. 123" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Street</label>
                      <div className="relative">
                        <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" required value={step2.street} onChange={(e) => setStep2({ ...step2, street: e.target.value })} placeholder="Main Street" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Village (Optional)</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={step2.village} onChange={(e) => setStep2({ ...step2, village: e.target.value })} placeholder="Kandy" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">City</label>
                      <div className="relative">
                        <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" required value={step2.city} onChange={(e) => setStep2({ ...step2, city: e.target.value })} placeholder="Kandy" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Postal Code</label>
                      <input type="text" value={step2.postalCode} onChange={(e) => setStep2({ ...step2, postalCode: e.target.value })} placeholder="20000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">District</label>
                      <div className="relative">
                        <BuildingIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select required value={step2.district} onChange={(e) => setStep2({ ...step2, district: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body bg-white appearance-none">
                          <option value="">Select district...</option>
                          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronRightIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Province</label>
                      <div className="relative">
                        <BuildingIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select required value={step2.province} onChange={(e) => setStep2({ ...step2, province: e.target.value, district: '' })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body bg-white appearance-none">
                          <option value="">Select province...</option>
                          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronRightIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Map Location</label>
                    <p className="text-xs text-gray-400 mb-2 font-body">Your workshop marker will be placed automatically based on your address</p>
                    <div ref={mapContainerRef} className="h-64 rounded-xl border border-gray-200 overflow-hidden" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 font-body hover:bg-gray-50 transition-colors"><ChevronLeftIcon className="w-4 h-4" /> Back</button>
                    <motion.button type="button" onClick={async () => {
                      await geocodeAddress();
                      setStep(3);
                    }} disabled={!step2.number || !step2.street || !step2.city || !step2.district || !step2.province} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm font-body transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#2F5D50' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A4D45'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F5D50'}>
                      Continue <ChevronRightIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl font-display font-bold text-[#1E1E1E] mb-1">About Your Craft</h1>
                <p className="text-sm text-gray-400 mb-8 font-body">Tell customers about your craft and set your availability</p>
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Bio / Story</label>
                    <textarea rows={4} value={step3.bio} onChange={(e) => setStep3({ ...step3, bio: e.target.value })} placeholder="Tell us about your craft, your journey, and what makes your work unique..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body resize-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1 font-body">Specialties</label>
                    <p className="text-xs text-gray-400 mb-2.5 font-body">What specific items do you create?</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {specialties.map((s) => (
                        <span key={s} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium font-body border border-gray-200 bg-gray-50">
                          {s}
                          <button type="button" onClick={() => removeSpecialty(s)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} placeholder="e.g. Ceremonial Masks" className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent outline-none text-sm font-body" />
                      <button type="button" onClick={addSpecialty} className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-3 font-body">Workshop Availability</label>
                    <p className="text-xs text-gray-400 mb-3 font-body">Select times you're available for workshops</p>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[400px]">
                        <thead>
                          <tr>
                            <th className="text-left pb-3 text-gray-400 font-medium text-sm w-20">Day</th>
                            {SLOTS.map((slot) => (
                              <th key={slot} className="pb-3 text-gray-600 font-bold text-sm text-center capitalize">{slot}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {DAYS.map((day) => (
                            <tr key={day} className="border-b border-gray-100">
                              <td className="py-3 font-bold text-[#1E1E1E]">{day}</td>
                              {SLOTS.map((slot) => (
                                <td key={slot} className="py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={availability[day][slot]}
                                    onChange={() => toggleAvailability(day, slot)}
                                    className="w-5 h-5 rounded border-gray-300 text-[#2F5D50] focus:ring-[#2F5D50]"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 font-body hover:bg-gray-50 transition-colors"><ChevronLeftIcon className="w-4 h-4" /> Back</button>
                    <motion.button type="submit" disabled={!step3.bio || submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#2F5D50' }} onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#1A4D45'; }} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F5D50'}>
                      {submitting ? 'Creating Account...' : 'Complete Registration'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-400 mt-8 font-body">
            Already have an account?{' '}
            <Link to="/login" className="font-bold" style={{ color: '#2F5D50' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}