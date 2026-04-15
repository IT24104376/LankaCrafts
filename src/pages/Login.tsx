import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { User, Lock } from 'lucide-react';
export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (formData.username && formData.password) {
      navigate('/dashboard');
    } else {
      setError('Please enter both username and password');
    }
  };
  return (
    <div className="min-h-screen bg-offwhite font-body flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-forest mb-2 font-display">
              Artist Login
            </h1>
            <p className="text-gray-600">
              Welcome back! Please login to your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error &&
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            }

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value
                  })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none"
                  placeholder="Enter your username" />

              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none"
                  placeholder="Enter your password" />

              </div>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="text-center mt-4">
              <a
                href="#"
                className="text-sm text-forest font-bold hover:underline">

                Forgot Password?
              </a>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>);

}