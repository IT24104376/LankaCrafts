import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon, ContactIcon, MailIcon, LockIcon, CheckIcon, GlobeIcon,
  ChevronRightIcon, CreditCardIcon, CalendarIcon,
  HomeIcon, MapPinIcon, ArrowRightIcon, ArrowLeftIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { INTERESTS, REGIONS, COUNTRIES } from '../../constants/touristConstants';

const LANGUAGES = ['English', 'Sinhala', 'Tamil', 'Other'];
const STEP_LABELS = ['Account Setup', 'Personal Info', 'Your Interests'];

export function TouristRegister() {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [step1, setStep1] = useState({ fullName: '', callingName: '', email: '', password: '', confirmPassword: '', country: '' });
  const [step2, setStep2] = useState({ idNumber: '', dateOfBirth: '', addressLine1: '', addressLine2: '', city: '', postalCode: '' });

  const { register } = useAuth();
  const navigate = useNavigate();

  const isSriLankan = step1.country === 'Sri Lanka';
  const isValidNIC = !isSriLankan || !step2.idNumber || /^[0-9]{9}[vVxX]$/.test(step2.idNumber) || /^[0-9]{12}$/.test(step2.idNumber);

  const toggleInterest = (id: string) =>
    setSelectedInterests((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleRegion = (id: string) =>
    setSelectedRegions((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleLanguage = (lang: string) =>
    setSelectedLanguages((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    setApiError('');
    try {
      // Validate date of birth
      if (step2.dateOfBirth) {
        const dob = new Date(step2.dateOfBirth);
        if (isNaN(dob.getTime())) {
          setApiError('Invalid date of birth. Please select a valid date.');
          setSubmitting(false);
          return;
        }
      } else {
        setApiError('Date of birth is required.');
        setSubmitting(false);
        return;
      }
      await register(step1.email, step1.password, {
        fullName: step1.fullName,
        callingName: step1.callingName,
        country: step1.country,
        preferredLanguages: selectedLanguages,
        idNumber: step2.idNumber,
        dateOfBirth: step2.dateOfBirth || undefined,
        address: {
          line1: step2.addressLine1,
          line2: step2.addressLine2,
          city: step2.city,
          postalCode: step2.postalCode,
        },
        interests: selectedInterests,
        preferredRegions: selectedRegions,
      });
      navigate('/tourist/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error
        || (err as { message?: string })?.message
        || 'Registration failed.';
      if (msg.includes('email-already-in-use')) {
        setApiError('An account with this email already exists.');
      } else {
        setApiError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body relative" style={{ backgroundColor: '#ddede7' }}>
      {/* Subtle SVG background pattern */}
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

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[40%] relative overflow-hidden flex-col z-10">
        <img
          src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&auto=format&fit=crop"
          alt="Sri Lankan cultural artisan"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(193,68,14,0.55) 0%, rgba(26,107,107,0.7) 60%, rgba(30,30,30,0.85) 100%)' }} />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <ellipse cx="16" cy="8" rx="4" ry="7" fill="white" opacity="0.9" />
              <ellipse cx="24" cy="16" rx="7" ry="4" fill="white" opacity="0.75" />
              <ellipse cx="16" cy="24" rx="4" ry="7" fill="white" opacity="0.6" />
              <ellipse cx="8" cy="16" rx="7" ry="4" fill="white" opacity="0.75" />
              <circle cx="16" cy="16" r="3.5" fill="white" />
            </svg>
            <span className="text-xl font-display font-bold text-white">Lanka Crafts</span>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-white leading-tight mb-8">Begin Your Cultural Journey</h2>
            <div className="space-y-4">
              {STEP_LABELS.map((label, idx) => {
                const stepNum = idx + 1;
                const isComplete = step > stepNum;
                const isCurrent = step === stepNum;
                return (
                  <div key={label} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${isComplete ? 'bg-green-400 text-white' : isCurrent ? 'bg-white text-[#C1440E]' : 'bg-white/20 text-white/60'}`}>
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

      {/* RIGHT PANEL */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-xl mx-auto px-8 py-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold font-body uppercase tracking-wider" style={{ color: '#1A6B6B' }}>Step {step} of 3</span>
              <span className="text-xs text-gray-400 font-body">{STEP_LABELS[step - 1]}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div animate={{ width: progressWidth }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="h-full rounded-full" style={{ backgroundColor: '#C1440E' }} />
            </div>
          </div>

          {apiError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-body">
              {apiError}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl font-display font-bold text-[#1E1E1E] mb-1">Create Your Account</h1>
                <p className="text-sm text-gray-400 mb-8 font-body">Join thousands of cultural explorers from around the world</p>
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" required value={step1.fullName} onChange={(e) => setStep1({ ...step1, fullName: e.target.value })} placeholder="Arjun Tennakoon" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                  </div>
                  {/* Caliing Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Calling Name</label>
                    <div className="relative">
                      <ContactIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" required value={step1.callingName} onChange={(e) => setStep1({ ...step1, callingName: e.target.value })} placeholder="Arjun" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Email Address</label>
                    <div className="relative">
                      <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" required value={step1.email} onChange={(e) => setStep1({ ...step1, email: e.target.value })} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                  </div>
                  {/* Password */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Password</label>
                      <div className="relative">
                        <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type={showPassword ? 'text' : 'password'} required value={step1.password} onChange={(e) => setStep1({ ...step1, password: e.target.value })} placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
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
                        <input type="password" required value={step1.confirmPassword} onChange={(e) => setStep1({ ...step1, confirmPassword: e.target.value })} placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                      </div>
                      {step1.confirmPassword && <p className={`text-xs mt-1 font-body ${step1.password === step1.confirmPassword ? 'text-green-500' : 'text-red-400'}`}>{step1.password === step1.confirmPassword ? '✓ Passwords match' : '✗ Do not match'}</p>}
                    </div>
                  </div>
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Country</label>
                    <div className="relative">
                      <GlobeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select required value={step1.country} onChange={(e) => setStep1({ ...step1, country: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body bg-white appearance-none">
                        <option value="">Select your country</option>
                        {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronRightIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1 font-body">Preferred Language for Learning Crafts</label>
                    <p className="text-xs text-gray-400 mb-2.5 font-body">Select all languages you're comfortable learning in</p>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => {
                        const selected = selectedLanguages.includes(lang);
                        return (
                          <motion.button key={lang} type="button" onClick={() => toggleLanguage(lang)} whileTap={{ scale: 0.95 }} className={`px-4 py-2 rounded-full text-sm font-medium font-body border transition-all duration-150 ${selected ? 'text-white border-[#C1440E]' : 'bg-white border-gray-200 text-[#1E1E1E] hover:border-[#C1440E]/40'}`} style={selected ? { backgroundColor: '#C1440E' } : {}}>
                            {lang}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  <motion.button type="button" onClick={() => setStep(2)} disabled={!step1.fullName || !step1.email || !step1.password || !step1.country || step1.password !== step1.confirmPassword} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl text-white font-semibold text-sm font-body transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#C1440E' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A33A0C'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1440E'}>
                    Continue <ArrowRightIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl font-display font-bold text-[#1E1E1E] mb-1">Personal Information</h1>
                <p className="text-sm text-gray-400 mb-8 font-body">We need this to verify your identity and personalise your experience</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">{isSriLankan ? 'National Identity Card (NIC) Number' : 'Passport Number'}</label>
                    <div className="relative">
                      <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" required value={step2.idNumber} onChange={(e) => setStep2({ ...step2, idNumber: e.target.value })} placeholder={isSriLankan ? 'e.g. 199012345678' : 'e.g. A12345678'} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 font-body">{isSriLankan ? 'Enter your 12-digit NIC number or old 9-digit NIC with V/X' : 'Enter your passport number as it appears on your travel document'}</p>
                    {isSriLankan && step2.idNumber && !isValidNIC && (
                      <p className="text-xs text-red-500 mt-1.5 font-body">Invalid NIC format. Must be 12 digits or 9 digits followed by v or x.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Date of Birth</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="date" required value={step2.dateOfBirth} onChange={(e) => setStep2({ ...step2, dateOfBirth: e.target.value })} max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 font-body">You must be at least 18 years old to register</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Home Address</label>
                    <div className="space-y-3">
                      <div className="relative">
                        <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" required value={step2.addressLine1} onChange={(e) => setStep2({ ...step2, addressLine1: e.target.value })} placeholder="Address Line 1 (Street, House No.)" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                      </div>
                      <input type="text" value={step2.addressLine2} onChange={(e) => setStep2({ ...step2, addressLine2: e.target.value })} placeholder="Address Line 2 (Apartment, Suite — optional)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="text" required value={step2.city} onChange={(e) => setStep2({ ...step2, city: e.target.value })} placeholder="City / Town" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                        </div>
                        <input type="text" value={step2.postalCode} onChange={(e) => setStep2({ ...step2, postalCode: e.target.value })} placeholder="Postal Code" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 font-body hover:bg-gray-50 transition-colors"><ArrowLeftIcon className="w-4 h-4" /> Back</button>
                    <motion.button type="button" onClick={() => setStep(3)} disabled={!step2.idNumber || !step2.dateOfBirth || !step2.addressLine1 || !step2.city || !isValidNIC} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm font-body transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#C1440E' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A33A0C'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1440E'}>
                      Continue <ArrowRightIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h1 className="text-3xl font-display font-bold text-[#1E1E1E] mb-1">Your Interests</h1>
                <p className="text-sm text-gray-400 mb-8 font-body">Help us personalise your experience — select what excites you</p>
                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Cultural Interests */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1 font-body">Cultural Interests <span className="text-gray-400 font-normal">(select all that apply)</span></label>
                    <p className="text-xs text-gray-400 mb-3 font-body">What crafts and arts are you interested in?</p>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map(({ id, label, emoji }) => {
                        const selected = selectedInterests.includes(id);
                        return (
                          <motion.button key={id} type="button" onClick={() => toggleInterest(id)} whileTap={{ scale: 0.95 }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium font-body border transition-all duration-150 ${selected ? 'text-white border-[#C1440E]' : 'bg-white border-gray-200 text-[#1E1E1E] hover:border-[#C1440E]/40'}`} style={selected ? { backgroundColor: '#C1440E' } : {}}>
                            <span>{emoji}</span>{label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Region Interests */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1E1E] mb-1 font-body">Preferred Regions <span className="text-gray-400 font-normal">(select all that apply)</span></label>
                    <p className="text-xs text-gray-400 mb-3 font-body">Which parts of Sri Lanka would you like to explore?</p>
                    <div className="flex flex-wrap gap-2">
                      {REGIONS.map(({ id, label, emoji }) => {
                        const selected = selectedRegions.includes(id);
                        return (
                          <motion.button key={id} type="button" onClick={() => toggleRegion(id)} whileTap={{ scale: 0.95 }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium font-body border transition-all duration-150 ${selected ? 'text-white border-[#1A6B6B]' : 'bg-white border-gray-200 text-[#1E1E1E] hover:border-[#1A6B6B]/40'}`} style={selected ? { backgroundColor: '#1A6B6B' } : {}}>
                            <span>{emoji}</span>{label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded accent-[#C1440E]" />
                    <span className="text-sm text-gray-500 font-body">
                      I agree to the{' '}<a href="#" className="font-semibold" style={{ color: '#C1440E' }}>Terms of Service</a>{' '}and{' '}<a href="#" className="font-semibold" style={{ color: '#C1440E' }}>Privacy Policy</a>
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 font-body hover:bg-gray-50 transition-colors"><ArrowLeftIcon className="w-4 h-4" /> Back</button>
                    <motion.button type="submit" disabled={!agreed || submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#C1440E' }} onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#A33A0C'; }} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C1440E'}>
                      {submitting ? 'Creating Account…' : 'Create Account'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-400 mt-8 font-body">
            Already have an account?{' '}
            <Link to="/tourist/login" className="font-bold" style={{ color: '#C1440E' }}>Sign in</Link>
            <br />
            <Link to="/" className="font-bold" style={{ color: '#C1440E' }}>
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}