import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export function TouristLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setResetSent(false);
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      const msg = err.message || 'Failed to send password reset email.';
      if (msg.includes('user-not-found') || msg.includes('invalid-credential')) {
        setError('No account found with this email.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/tourist/dashboard');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Login failed.';
      if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('Invalid email or password.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex font-body relative"
      style={{ backgroundColor: '#ddede7' }}>

      {/* Batik SVG background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="batik-bg-login" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#2F5D50" strokeWidth="1.5" />
              <circle cx="30" cy="30" r="3" fill="#2F5D50" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#batik-bg-login)" />
        </svg>
      </div>

      {/* LEFT PANEL */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 relative overflow-hidden z-10">

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-3">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <ellipse cx="16" cy="8" rx="4" ry="7" fill="#C1440E" opacity="0.9" />
                <ellipse cx="24" cy="16" rx="7" ry="4" fill="#C1440E" opacity="0.75" />
                <ellipse cx="16" cy="24" rx="4" ry="7" fill="#C1440E" opacity="0.6" />
                <ellipse cx="8" cy="16" rx="7" ry="4" fill="#C1440E" opacity="0.75" />
                <circle cx="16" cy="16" r="3.5" fill="#C1440E" />
              </svg>
              <span className="text-2xl font-display font-bold" style={{ color: '#C1440E' }}>
                Lanka Crafts
              </span>
            </div>
            <p className="text-sm text-gray-400 text-center font-body tracking-wide">
              Discover. Experience. Share Sri Lanka.
            </p>
          </div>

          <div className="border-t border-gray-100 mb-7" />

          <h1 className="text-2xl font-display font-bold text-[#1E1E1E] mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-400 mb-7 font-body">Sign in to continue your cultural journey</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Email Address</label>
              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              <label className="block text-sm font-semibold text-[#1E1E1E] mb-1.5 font-body">Password</label>
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
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-center pt-1 flex-col items-center">
              <button type="button" onClick={handleForgotPassword} disabled={loading} className="text-sm font-semibold font-body hover:underline" style={{ color: '#C1440E' }}>
                Forgot Password?
              </button>
              {resetSent && (
                <span className="text-xs text-green-600 mt-2 font-body text-center">
                  Password reset email sent! Check your inbox.
                </span>
              )}
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm font-body transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#C1440E' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#A33A0C'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C1440E'; }}>
              {loading ? 'Signing in…' : 'Login'}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-6 font-body">
            Don't have an account?{' '}
            <Link to="/tourist/register" className="font-bold" style={{ color: '#C1440E' }}>
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
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(26,107,107,0.3) 0%, rgba(30,30,30,0.75) 100%)' }} />
        <div className="absolute bottom-16 left-10 right-10 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}>
            <div className="w-10 h-0.5 bg-white/60 mb-4" />
            <p className="text-white text-2xl font-display italic leading-snug mb-3">
              "Handcrafted with heart,<br />shared with the world."
            </p>
            <p className="text-white/60 text-sm font-body">— Sri Lankan Artisan Heritage</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
