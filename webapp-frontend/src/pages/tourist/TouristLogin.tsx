import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export function TouristLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <div
      className="min-h-screen flex font-body"
      style={{
        backgroundColor: '#FAF6F0'
      }}>

      {/* LEFT PANEL */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 relative overflow-hidden">
        {/* Batik SVG background pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true">

          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="batik"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse">

                {/* Diamond */}
                <polygon
                  points="30,4 56,30 30,56 4,30"
                  fill="none"
                  stroke="#C1440E"
                  strokeWidth="1"
                  opacity="0.12" />

                {/* Inner diamond */}
                <polygon
                  points="30,14 46,30 30,46 14,30"
                  fill="none"
                  stroke="#C1440E"
                  strokeWidth="0.8"
                  opacity="0.08" />

                {/* Center dot */}
                <circle cx="30" cy="30" r="2.5" fill="#C1440E" opacity="0.07" />
                {/* Corner petals */}
                <circle
                  cx="0"
                  cy="0"
                  r="5"
                  fill="none"
                  stroke="#1A6B6B"
                  strokeWidth="0.8"
                  opacity="0.06" />

                <circle
                  cx="60"
                  cy="0"
                  r="5"
                  fill="none"
                  stroke="#1A6B6B"
                  strokeWidth="0.8"
                  opacity="0.06" />

                <circle
                  cx="0"
                  cy="60"
                  r="5"
                  fill="none"
                  stroke="#1A6B6B"
                  strokeWidth="0.8"
                  opacity="0.06" />

                <circle
                  cx="60"
                  cy="60"
                  r="5"
                  fill="none"
                  stroke="#1A6B6B"
                  strokeWidth="0.8"
                  opacity="0.06" />

              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#batik)" />
          </svg>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut'
          }}
          className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-3">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <ellipse
                  cx="16"
                  cy="8"
                  rx="4"
                  ry="7"
                  fill="#C1440E"
                  opacity="0.9" />

                <ellipse
                  cx="24"
                  cy="16"
                  rx="7"
                  ry="4"
                  fill="#C1440E"
                  opacity="0.75" />

                <ellipse
                  cx="16"
                  cy="24"
                  rx="4"
                  ry="7"
                  fill="#C1440E"
                  opacity="0.6" />

                <ellipse
                  cx="8"
                  cy="16"
                  rx="7"
                  ry="4"
                  fill="#C1440E"
                  opacity="0.75" />

                <circle cx="16" cy="16" r="3.5" fill="#C1440E" />
              </svg>
              <span
                className="text-2xl font-display font-bold"
                style={{
                  color: '#C1440E'
                }}>

                LankaCrafts
              </span>
            </div>
            <p className="text-sm text-gray-400 text-center font-body tracking-wide">
              Discover. Experience. Share Sri Lanka.
            </p>
          </div>

          <div className="border-t border-gray-100 mb-7" />

          <h1 className="text-2xl font-display font-bold text-[#1E1E1E] mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-400 mb-7 font-body">
            Sign in to continue your cultural journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                Email Address
              </label>
              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body transition-shadow" />

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C1440E] focus:border-transparent outline-none text-sm font-body transition-shadow" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">

                  {showPassword ?
                  <EyeOffIcon className="w-5 h-5" /> :

                  <EyeIcon className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            {/* Forgot Password — centered */}
            <div className="flex justify-center pt-1">
              <a
                href="#"
                className="text-sm font-semibold font-body"
                style={{
                  color: '#C1440E'
                }}>

                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.01
              }}
              whileTap={{
                scale: 0.98
              }}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm font-body transition-colors mt-2"
              style={{
                backgroundColor: '#C1440E'
              }}
              onMouseEnter={(e) =>
              e.currentTarget.style.backgroundColor = '#A33A0C'
              }
              onMouseLeave={(e) =>
              e.currentTarget.style.backgroundColor = '#C1440E'
              }>

              Login
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-6 font-body">
            Don't have an account?{' '}
            <Link
              to="/tourist/register"
              className="font-bold"
              style={{
                color: '#C1440E'
              }}>

              Register here
            </Link>
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL — Artisan Image */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop"
          alt="Sri Lankan artisan workshop"
          className="absolute inset-0 w-full h-full object-cover" />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
            'linear-gradient(to bottom, rgba(26,107,107,0.3) 0%, rgba(30,30,30,0.75) 100%)'
          }} />

        {/* Quote */}
        <div className="absolute bottom-16 left-10 right-10 z-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.4,
              duration: 0.6
            }}>

            <div className="w-10 h-0.5 bg-white/60 mb-4" />
            <p className="text-white text-2xl font-display italic leading-snug mb-3">
              "Handcrafted with heart,
              <br />
              shared with the world."
            </p>
            <p className="text-white/60 text-sm font-body">
              — Sri Lankan Artisan Heritage
            </p>
          </motion.div>
        </div>
      </div>
    </div>);

}