import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../api';
import { getArtists } from '../services/api';
import { INTEREST_MAP } from '../constants/touristConstants';
import {
  Calendar,
  Users,
  Clock,
  Check,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { ReviewSection } from '../components/ReviewSection';


export function BookWorkshop() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedCraft, setSelectedCraft] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const { tourist, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    groupSize: 1
  });

  useEffect(() => {
    if (tourist) {
      setFormData(prev => ({
        ...prev,
        id: tourist.id || '',
        name: tourist.fullName || '',
        email: tourist.email || ''
      }));
    }
  }, [tourist]);

  // Dynamic data from API
  const [allArtists, setAllArtists] = useState<any[]>([]);
  const [craftCategories, setCraftCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(true);

  // Fetch artists from API on mount
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await getArtists(1, 100);
        const artists = res.data?.artists || [];
        setAllArtists(artists);

        // Derive unique craft categories from artists
        const craftSet = new Map<string, { id: string; name: string; icon: string }>();
        for (const a of artists) {
          if (a.craftType && !craftSet.has(a.craftType)) {
            const mapped = INTEREST_MAP[a.craftType];
            craftSet.set(a.craftType, {
              id: a.craftType,
              name: mapped?.label || a.craftType.charAt(0).toUpperCase() + a.craftType.slice(1),
              icon: mapped?.emoji || '🎨',
            });
          }
        }
        setCraftCategories(Array.from(craftSet.values()));
      } catch (err) {
        console.error('Failed to fetch artists:', err);
      } finally {
        setArtistsLoading(false);
      }
    };
    fetchArtists();
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    if (!formData.name || formData.name.length < 3) {
      alert("Name must be at least 3 characters");
      return false;
    }

    if (!formData.email.includes("@")) {
      alert("Invalid email");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Phone must be 10 digits");
      return false;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return false;
    }

    if (!selectedArtisan || !selectedCraft) {
      alert("Missing booking details");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (artistsLoading || allArtists.length === 0) return;
    const craftParam = searchParams.get('craft');
    const artisanParam = searchParams.get('artisan');
    if (craftParam && craftCategories.find((c) => c.id === craftParam)) {
      setSelectedCraft(craftParam);
      if (artisanParam) {
        const artisan = allArtists.find(
          (a) => (a._id === artisanParam || a.id === artisanParam) && a.craftType === craftParam
        );
        if (artisan) {
          setSelectedArtisan(artisan._id || artisan.id);
          setStep(3);
        } else {
          setStep(2);
        }
      } else {
        setStep(2);
      }
    }
  }, [searchParams, artistsLoading, allArtists, craftCategories]);

  // Filter artisans based on selected craft
  const filteredArtisans = allArtists.filter((a) => a.craftType === selectedCraft);
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // 1. Find the selected artisan and craft objects
    const artisanData = allArtists.find((a) => (a._id || a.id) === selectedArtisan);
    const craftData = craftCategories.find((c) => c.id === selectedCraft);

    // 2. Build the payload including the extra info
    const bookingPayload = {
      artisanId: selectedArtisan as string,
      artisanName: artisanData?.fullName || 'Unknown Artisan',
      location: artisanData?.address?.city || artisanData?.address?.district || 'Unknown Location',
      craftId: selectedCraft,
      craftName: craftData?.name || 'Unknown Craft',
      touristId: tourist?.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: selectedDate,
      time: selectedTime,
      groupSize: formData.groupSize
    };

    try {
      await bookingApi.createBooking(bookingPayload);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Failed to save booking or server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-offwhite font-body flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-24">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,

              scale: 1
            }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-forest mb-4 font-display">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you, {formData.name}. Your workshop with{' '}
              {allArtists.find((a) => (a._id || a.id) === selectedArtisan)?.fullName || 'the artisan'} has been
              booked. We've sent a confirmation email to {formData.email}.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Date</span>
                <span className="font-bold text-forest">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Time</span>
                <span className="font-bold text-forest">
                  {AVAILABLE_TIMES.find((t) => t.id === selectedTime)?.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Group Size</span>
                <span className="font-bold text-forest">
                  {formData.groupSize} People
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 mb-8 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Your Entry Pass
              </p>

              <QRCodeSVG
                value={`Booking:${formData.name}|Artisan:${selectedArtisan}|Date:${selectedDate}`}
                size={160}
                level={"H"}
                includeMargin={true}
              />

              <p className="text-xs text-gray-500 mt-4 text-center">
                Present this QR code to the artisan upon arrival
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full">

              Return Home
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>);

  }

  if (!authLoading && !tourist) {
    return (
      <div className="min-h-screen bg-offwhite font-body flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
          <div className="w-20 h-20 bg-mustard/10 rounded-full flex items-center justify-center mb-6 text-mustard">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-forest mb-4 font-display">Tourist Login Required</h2>
          <p className="text-gray-600 mb-8 max-w-md text-center">
            You need to be logged in with a tourist account to book a workshop. Please log in or create an account to continue.
          </p>
          <Button onClick={() => window.location.href = '/login'} className="w-full max-w-xs">
            Go to Login
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite font-body flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-forest pt-32 pb-20 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse">

                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1" />

              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black font-display mb-6">
            Book a Workshop
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Immerse yourself in Sri Lanka's living heritage. Learn directly from
            master artisans.
          </p>
        </div>
      </div>

      <main className="flex-1 -mt-10 px-6 pb-24 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar / Progress */}
            <div className="bg-gray-50 p-8 md:w-1/3 border-r border-gray-100">
              <div className="space-y-8">
                <div
                  className={`flex gap-4 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${step > 1 ? 'bg-green-500 text-white' : step === 1 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'}`}>

                    {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <div>
                    <h3 className="font-bold text-forest">Select Craft</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedCraft ?
                        craftCategories.find((c) => c.id === selectedCraft)?.name :
                        'Choose a workshop type'}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex gap-4 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${step > 2 ? 'bg-green-500 text-white' : step === 2 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'}`}>

                    {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </div>
                  <div>
                    <h3 className="font-bold text-forest">Choose Artisan</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedArtisan ?
                        allArtists.find((a) => (a._id || a.id) === selectedArtisan)?.fullName :
                        'Select your mentor'}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex gap-4 ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${step > 3 ? 'bg-green-500 text-white' : step === 3 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'}`}>

                    {step > 3 ? <Check className="w-4 h-4" /> : '3'}
                  </div>
                  <div>
                    <h3 className="font-bold text-forest">Date & Time</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedDate && selectedTime ?
                        `${selectedDate} at ${AVAILABLE_TIMES.find((t) => t.id === selectedTime)?.time}` :
                        'Schedule your visit'}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex gap-4 ${step >= 4 ? 'opacity-100' : 'opacity-50'}`}>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${step === 4 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'}`}>

                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-forest">Your Details</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Contact information
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Card (visible only when selections are made) */}
              {selectedCraft &&
                <div className="mt-12 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">
                    Booking Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Workshop</span>
                      <span className="font-medium text-right">
                        {craftCategories.find((c) => c.id === selectedCraft)?.name}
                      </span>
                    </div>
                    {selectedArtisan &&
                      <div className="flex justify-between">
                        <span className="text-gray-500">Artisan</span>
                        <span className="font-medium text-right">
                          {allArtists.find((a) => (a._id || a.id) === selectedArtisan)?.fullName}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Step 1: Select Craft */}
                {step === 1 &&
                  <motion.div
                    key="step1"
                    initial={{
                      opacity: 0,
                      x: 20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -20
                    }}
                    className="h-full flex flex-col">

                    <h2 className="text-2xl font-bold font-display text-forest mb-6">
                      What would you like to learn?
                    </h2>
                    {artistsLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-forest animate-spin" />
                        <span className="ml-3 text-gray-500">Loading workshops...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {craftCategories.map((craft) =>
                          <button
                            key={craft.id}
                            onClick={() => {
                              setSelectedCraft(craft.id);
                              setSelectedArtisan(null);
                              handleNext();
                            }}
                            className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md flex items-center gap-4 group ${selectedCraft === craft.id ? 'border-mustard bg-mustard/5' : 'border-gray-100 bg-white hover:border-mustard/50'}`}>

                            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                              {craft.icon}
                            </span>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {craft.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                2-3 hour session
                              </p>
                            </div>
                            <ChevronRight
                              className={`ml-auto w-5 h-5 text-gray-300 group-hover:text-mustard transition-colors ${selectedCraft === craft.id ? 'text-mustard' : ''}`} />

                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                }

                {/* Step 2: Select Artisan */}
                {step === 2 &&
                  <motion.div
                    key="step2"
                    initial={{
                      opacity: 0,
                      x: 20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -20
                    }}
                    className="h-full flex flex-col">

                    <div className="flex items-center gap-2 mb-6">
                      <button
                        onClick={handleBack}
                        className="text-sm text-gray-400 hover:text-forest font-bold">

                        Back
                      </button>
                      <span className="text-gray-300">/</span>
                      <h2 className="text-2xl font-bold font-display text-forest">
                        Choose your Artisan
                      </h2>
                    </div>

                    {filteredArtisans.length > 0 ?
                      <div className="grid grid-cols-1 gap-4">
                        {filteredArtisans.map((artisan) => {
                          const artisanId = artisan._id || artisan.id;
                          const artisanLocation = artisan.address?.city || artisan.address?.district || 'Sri Lanka';
                          return (
                            <button
                              key={artisanId}
                              onClick={() => {
                                setSelectedArtisan(artisanId);
                                handleNext();
                              }}
                              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md flex items-center gap-4 group ${selectedArtisan === artisanId ? 'border-mustard bg-mustard/5' : 'border-gray-100 bg-white hover:border-mustard/50'}`}>

                              <div
                                className="w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-gray-200 flex items-center justify-center">
                                {artisan.profilePicUrl ? (
                                  <img src={artisan.profilePicUrl} alt={artisan.fullName} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl font-bold text-gray-400">{artisan.initials || artisan.fullName?.[0] || 'A'}</span>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-bold text-gray-900 text-lg">
                                    {artisan.fullName}
                                  </h3>
                                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-xs font-bold text-green-700">
                                    <span>★</span> {artisan.rating || 'New'}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                  <MapPin className="w-3 h-3" />{' '}
                                  {artisanLocation}
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 text-gray-300 group-hover:text-mustard transition-colors ${selectedArtisan === artisanId ? 'text-mustard' : ''}`} />

                            </button>
                          );
                        })}
                      </div> :

                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          No artisans available for this craft yet.
                        </p>
                        <button
                          onClick={handleBack}
                          className="text-mustard font-bold mt-2 hover:underline">

                          Choose another craft
                        </button>
                      </div>
                    }
                  </motion.div>
                }

                {/* Step 3: Date & Time */}
                {step === 3 &&
                  <motion.div
                    key="step3"
                    initial={{
                      opacity: 0,
                      x: 20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -20
                    }}
                    className="h-full flex flex-col">

                    <div className="flex items-center gap-2 mb-6">
                      <button
                        onClick={handleBack}
                        className="text-sm text-gray-400 hover:text-forest font-bold">

                        Back
                      </button>
                      <span className="text-gray-300">/</span>
                      <h2 className="text-2xl font-bold font-display text-forest">
                        Select Date & Time
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none"
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)} />

                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Available Slots
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {AVAILABLE_TIMES.map((slot) =>
                            <button
                              key={slot.id}
                              onClick={() => setSelectedTime(slot.id)}
                              className={`p-3 rounded-xl border-2 text-center transition-all ${selectedTime === slot.id ? 'border-mustard bg-mustard text-forest font-bold' : 'border-gray-100 bg-white text-gray-600 hover:border-mustard/50'}`}>

                              <div className="text-lg">{slot.time}</div>
                              <div
                                className={`text-xs ${selectedTime === slot.id ? 'text-forest/80' : 'text-gray-400'}`}>

                                {slot.label}
                              </div>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          onClick={handleNext}
                          disabled={!selectedDate || !selectedTime}
                          className="w-full">

                          Continue
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                }

                {/* Step 4: Details */}
                {step === 4 &&
                  <motion.div
                    key="step4"
                    initial={{
                      opacity: 0,
                      x: 20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -20
                    }}
                    className="h-full flex flex-col">

                    <div className="flex items-center gap-2 mb-6">
                      <button
                        onClick={handleBack}
                        className="text-sm text-gray-400 hover:text-forest font-bold">

                        Back
                      </button>
                      <span className="text-gray-300">/</span>
                      <h2 className="text-2xl font-bold font-display text-forest">
                        Your Details
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            required
                            readOnly
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name: e.target.value
                              })
                            }
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none bg-gray-100 cursor-not-allowed text-gray-500"
                            placeholder="John Doe" />

                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              required
                              readOnly
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value
                                })
                              }
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none bg-gray-100 cursor-not-allowed text-gray-500"
                              placeholder="john@example.com" />

                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value
                                })
                              }
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none"
                              placeholder="+94 77 123 4567" />

                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Group Size
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            value={formData.groupSize}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                groupSize: parseInt(e.target.value)
                              })
                            }
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none bg-white">

                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) =>
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'Person' : 'People'}
                              </option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="pt-6">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full text-lg py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1">

                          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                        </Button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                          By booking, you agree to our Terms of Service and
                          Cancellation Policy.
                        </p>
                      </div>
                    </form>
                  </motion.div>
                }
              </AnimatePresence>
            </div>
          </div>

          {/* Reviews Section — below booking wizard */}
          <div className="mt-16">
            <ReviewSection
              context="workshop"
              workshopName={
                selectedCraft ?
                  craftCategories.find((c) => c.id === selectedCraft)?.name :
                  'This Workshop'
              } />

          </div>
        </div>
      </main>
      <Footer />
    </div>);

}

// ARTISANS and CRAFTS are now fetched dynamically from the API in the component.
const AVAILABLE_TIMES = [
  {
    id: 't1',
    time: '09:00 AM',
    label: 'Morning Session'
  },
  {
    id: 't2',
    time: '11:00 AM',
    label: 'Late Morning'
  },
  {
    id: 't3',
    time: '02:00 PM',
    label: 'Afternoon Session'
  },
  {
    id: 't4',
    time: '04:00 PM',
    label: 'Evening Session'
  }];