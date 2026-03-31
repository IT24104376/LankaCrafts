import React from 'react';
import {
  ArrowLeft,
  Menu,
  Search,
  MapPin,
  Star,
  User,
  Calendar,
  MessageCircle,
  ChevronRight } from
'lucide-react';
import { Link } from 'react-router-dom';
export function MobileScreens() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 font-body overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 font-display">
              Mobile App Mockups
            </h1>
            <p className="text-gray-500">
              Visual design for the Lanka Craft mobile experience.
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-forest font-bold hover:underline">

            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory">
          {/* Screen 1: Splash */}
          <PhoneFrame title="Splash Screen">
            <div className="h-full w-full bg-terracotta flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg">

                  <defs>
                    <pattern
                      id="mobile-batik"
                      x="0"
                      y="0"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse">

                      <circle
                        cx="20"
                        cy="20"
                        r="10"
                        fill="none"
                        stroke="white"
                        strokeWidth="1" />

                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mobile-batik)" />
                </svg>
              </div>
              <div className="z-10 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl mx-auto">
                  <span className="text-4xl">🇱🇰</span>
                </div>
                <h1 className="text-3xl font-black text-white font-display mb-2">
                  Lanka Craft
                </h1>
                <p className="text-white/80 text-sm tracking-widest uppercase">
                  Discover the Soul
                </p>
              </div>
              <div className="absolute bottom-12 left-0 right-0 text-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              </div>
            </div>
          </PhoneFrame>

          {/* Screen 2: Home Feed */}
          <PhoneFrame title="Home Feed">
            <div className="h-full w-full bg-offwhite flex flex-col">
              {/* Header */}
              <div className="bg-white p-4 flex justify-between items-center shadow-sm z-10">
                <Menu className="w-6 h-6 text-gray-700" />
                <span className="font-display font-bold text-lg text-forest">
                  Lanka Craft
                </span>
                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                  <User className="w-5 h-5 m-1.5 text-gray-500" />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Search */}
                <div className="bg-white rounded-full p-3 flex items-center gap-2 shadow-sm border border-gray-100">
                  <Search className="w-4 h-4 text-gray-400 ml-1" />
                  <span className="text-gray-400 text-sm">
                    Find artisans, crafts...
                  </span>
                </div>

                {/* Featured Card */}
                <div className="bg-forest rounded-2xl p-5 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-mustard rounded-bl-full opacity-20" />
                  <span className="text-xs font-bold text-mustard uppercase tracking-wider mb-2 block">
                    Featured
                  </span>
                  <h2 className="text-2xl font-display font-bold mb-1">
                    Nimal Perera
                  </h2>
                  <p className="text-white/70 text-sm mb-4">
                    Master of Lacquerwork
                  </p>
                  <button className="bg-white text-forest px-4 py-2 rounded-full text-xs font-bold">
                    View Profile
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                    {['Batik', 'Masks', 'Gems', 'Pottery'].map((cat) =>
                    <div
                      key={cat}
                      className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm font-medium whitespace-nowrap shadow-sm">

                        {cat}
                      </div>
                    )}
                  </div>
                </div>

                {/* Feed */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Nearby Workshops</h3>
                  {[1, 2].map((i) =>
                  <div
                    key={i}
                    className="bg-white p-3 rounded-xl flex gap-3 shadow-sm border border-gray-100">

                      <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">
                          Kandy Batik Center
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">
                          Textiles · 2km away
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-mustard fill-current" />
                          <span className="text-xs font-bold">4.8</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </PhoneFrame>

          {/* Screen 3: Map */}
          <PhoneFrame title="Map View">
            <div className="h-full w-full bg-gray-200 relative">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-[#E5E7EB] flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
                  <path
                    d="M20 20 L80 40 L60 80 L30 70 Z"
                    fill="white"
                    stroke="#ccc" />

                  <circle cx="50" cy="50" r="2" fill="#C65D3B" />
                  <circle cx="60" cy="30" r="2" fill="#2F5D50" />
                </svg>
              </div>

              {/* Floating Search */}
              <div className="absolute top-12 left-4 right-4 bg-white rounded-full p-3 shadow-lg flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  Search area...
                </span>
              </div>

              {/* Bottom Drawer */}
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-terracotta rounded-xl shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg font-display">
                      Rohan's Pottery
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Kelaniya · Pottery
                    </p>
                    <button className="bg-forest text-white px-4 py-1.5 rounded-full text-xs font-bold">
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </PhoneFrame>

          {/* Screen 4: Profile */}
          <PhoneFrame title="Artist Profile">
            <div className="h-full w-full bg-white flex flex-col relative">
              {/* Header Image */}
              <div className="h-48 bg-forest relative shrink-0">
                <button className="absolute top-12 left-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="-mt-6 bg-white rounded-t-3xl p-6 flex-1 overflow-y-auto pb-24 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold font-display">
                      Nimal Perera
                    </h2>
                    <p className="text-forest font-medium text-sm">
                      Lacquerwork Master
                    </p>
                  </div>
                  <div className="bg-mustard/10 text-mustard-dark px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> 4.9
                  </div>
                </div>

                <div className="flex gap-4 mb-6 border-b border-gray-100 pb-6">
                  <div className="text-center flex-1">
                    <div className="font-bold text-lg">40+</div>
                    <div className="text-xs text-gray-400">Years</div>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div className="text-center flex-1">
                    <div className="font-bold text-lg">124</div>
                    <div className="text-xs text-gray-400">Reviews</div>
                  </div>
                  <div className="w-px bg-gray-100" />
                  <div className="text-center flex-1">
                    <div className="font-bold text-lg">Kandy</div>
                    <div className="text-xs text-gray-400">Region</div>
                  </div>
                </div>

                <h3 className="font-bold text-sm mb-2">About</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Master craftsman specializing in traditional Kandyan
                  lacquerwork. Keeping the ancient art alive...
                </p>

                <h3 className="font-bold text-sm mb-3">Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-square bg-gray-100 rounded-xl" />
                  <div className="aspect-square bg-gray-100 rounded-xl" />
                </div>
              </div>

              {/* Sticky Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3">
                <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
                <button className="flex-[2] bg-mustard text-forest py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-mustard/20">
                  <Calendar className="w-4 h-4" /> Book Workshop
                </button>
              </div>
            </div>
          </PhoneFrame>

          {/* Screen 5: Registration */}
          <PhoneFrame title="Registration">
            <div className="h-full w-full bg-offwhite flex flex-col">
              <div className="p-6 pt-12">
                <button className="mb-6">
                  <ArrowLeft className="w-6 h-6 text-gray-900" />
                </button>
                <h2 className="text-2xl font-bold font-display text-forest mb-2">
                  Create Profile
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  Step 2 of 4: Craft Details
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Craft Type
                    </label>
                    <div className="w-full bg-white p-3 rounded-xl border border-gray-200 text-sm flex justify-between items-center">
                      Select craft...{' '}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Bio
                    </label>
                    <textarea
                      className="w-full bg-white p-3 rounded-xl border border-gray-200 text-sm h-24 resize-none"
                      placeholder="Tell your story..." />

                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Region
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {['Kandy', 'Galle', 'Colombo'].map((r) =>
                      <div
                        key={r}
                        className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">

                          {r}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-6 bg-white border-t border-gray-100">
                <button className="w-full bg-forest text-white py-3 rounded-xl font-bold shadow-lg shadow-forest/20">
                  Continue
                </button>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>);

}
function PhoneFrame({
  children,
  title



}: {children: React.ReactNode;title: string;}) {
  return (
    <div className="snap-center shrink-0">
      <div className="text-center mb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">
        {title}
      </div>
      <div className="w-[320px] h-[640px] bg-black rounded-[3rem] p-3 shadow-2xl relative border-4 border-gray-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20" />
        {/* Screen Content */}
        <div className="w-full h-full bg-white rounded-[2.25rem] overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>);

}