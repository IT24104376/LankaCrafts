import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  PaletteIcon,
  ShieldCheckIcon
} from
  'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
type Role = 'tourist' | 'artist' | 'admin';

// Mock credentials for demo (no backend)
const MOCK_CREDENTIALS: Record<Role, { email: string; password: string }> = {
  tourist: { email: 'tourist@lankacrafts.lk', password: 'tourist123' },
  artist: { email: 'artist@lankacrafts.lk', password: 'artist123' },
  admin: { email: 'admin@lankacrafts.lk', password: 'admin123' },
};

const ROLE_CONFIG = {
  tourist: {
    label: 'Tourist',
    icon: UserIcon,
    color: '#C65D3B',
    bg: '#FEF0EB',
    redirect: '/tourist/login',
    description: 'Explore crafts & book workshops'
  },
  artist: {
    label: 'Artist',
    icon: PaletteIcon,
    color: '#2F5D50',
    bg: '#EBF4F1',
    redirect: '/dashboard',
    description: 'Manage your artisan profile'
  },
  admin: {
    label: 'Admin',
    icon: ShieldCheckIcon,
    color: '#C9A227',
    bg: '#FDF8E7',
    redirect: '/admin',
    description: 'Platform management'
  }
};
export function UnifiedLogin() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const config = ROLE_CONFIG[selectedRole];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const creds = MOCK_CREDENTIALS[selectedRole];
    if (email !== creds.email || password !== creds.password) {
      setError('Invalid credentials. Check the demo hints below.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(config.redirect);
    }, 1200);
  };
  return (
    <div
      className="min-h-screen flex flex-col font-body"
      style={{
        backgroundColor: '#F6F3EE'
      }}>

      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{
              opacity: 0,
              y: -16
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="flex flex-col items-center mb-10">

            <svg
              width="44"
              height="44"
              viewBox="0 0 32 32"
              fill="none"
              className="mb-3">

              <circle cx="16" cy="16" r="14" fill="#C9A227" opacity="0.2" />
              <path
                d="M16 4 C10 4 6 10 6 16 C6 22 10 28 16 28 C22 28 26 22 26 16 C26 10 22 4 16 4Z"
                fill="#C9A227"
                opacity="0.6" />

              <path
                d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z"
                fill="#C9A227" />

            </svg>
            <span
              className="text-2xl font-black"
              style={{
                fontFamily: 'Fraunces, serif',
                color: '#2F5D50'
              }}>

              Lanka Crafts
            </span>
            <p className="text-sm text-gray-400 mt-1">
              Sign in to continue your journey
            </p>
          </motion.div>

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
              delay: 0.1
            }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Role Selector */}
            <div className="p-6 pb-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Sign in as
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  Object.entries(ROLE_CONFIG) as [
                    Role,
                    (typeof ROLE_CONFIG)[Role]][]).

                  map(([role, cfg]) => {
                    const Icon = cfg.icon;
                    const isSelected = selectedRole === role;
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          setSelectedRole(role);
                          setError('');
                        }}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all duration-200 text-center"
                        style={{
                          borderColor: isSelected ? cfg.color : 'transparent',
                          backgroundColor: isSelected ? cfg.bg : '#F9FAFB'
                        }}>

                        <Icon
                          className="w-5 h-5"
                          style={{
                            color: isSelected ? cfg.color : '#9CA3AF'
                          }} />

                        <span
                          className="text-xs font-bold"
                          style={{
                            color: isSelected ? cfg.color : '#6B7280'
                          }}>

                          {cfg.label}
                        </span>
                      </button>);

                  })}
              </div>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{
                  opacity: 0,
                  y: 8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -8
                }}
                transition={{
                  duration: 0.2
                }}
                className="p-6 pt-5">

                {/* Role description */}
                <p className="text-xs text-gray-400 mb-5 font-body">
                  {config.description}
                </p>

                {selectedRole === 'tourist' ? (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700 text-center mb-6">
                      Hop into the Tourist Portal to explore!
                    </p>
                    <motion.button
                      onClick={() => navigate('/tourist/login')}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: config.color }}>
                      Go to Tourist Portal
                    </motion.button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error &&
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center border border-red-100">
                      {error}
                    </div>
                  }

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none text-sm transition-shadow"
                        style={
                          {
                            '--tw-ring-color': config.color
                          } as React.CSSProperties
                        }
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = config.color;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${config.color}22`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.boxShadow = 'none';
                        }} />

                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 outline-none text-sm transition-shadow"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = config.color;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${config.color}22`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.boxShadow = 'none';
                        }} />

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

                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="text-xs font-semibold hover:underline"
                      style={{
                        color: config.color
                      }}>

                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{
                      scale: 1.01
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: config.color
                    }}>

                    {isLoading ?
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none">

                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4" />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />

                        </svg>
                        Signing in...
                      </> :

                      `Sign in as ${config.label}`
                    }
                  </motion.button>
                </form>
                )}

                {selectedRole !== 'tourist' && (
                  <p className="text-center text-sm text-gray-400 mt-5">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="font-bold hover:underline"
                      style={{ color: config.color }}>
                      Register here
                    </Link>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* ── Demo Credentials Hint (remove before production) ── */}
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-72">
        <div className="px-4 py-2.5 border-b border-gray-100" style={{ backgroundColor: '#2F5D50' }}>
          <p className="text-xs font-bold text-white uppercase tracking-widest">🔐 Demo Credentials</p>
        </div>
        <div className="p-3 space-y-2">
          {((Object.entries(MOCK_CREDENTIALS) as [Role, { email: string; password: string }][]).filter(([role]) => role !== 'tourist')).map(([role, creds]) => {
            const cfg = ROLE_CONFIG[role];
            return (
              <div
                key={role}
                className="rounded-xl p-2.5 border cursor-pointer transition-all"
                style={{
                  backgroundColor: selectedRole === role ? cfg.bg : '#F9FAFB',
                  borderColor: selectedRole === role ? cfg.color : '#E5E7EB',
                }}
                onClick={() => { setSelectedRole(role); setEmail(creds.email); setPassword(creds.password); setError(''); }}
              >
                <p className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 font-mono">{creds.email}</p>
                <p className="text-[11px] text-gray-400 font-mono">{creds.password}</p>
              </div>
            );
          })}
          <p className="text-[10px] text-gray-400 text-center pt-1">Click a card to auto-fill credentials</p>
        </div>
      </div>

      <Footer />
    </div>);

}