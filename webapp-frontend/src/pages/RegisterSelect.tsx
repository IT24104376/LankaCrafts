import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CompassIcon,
  PaletteIcon,
  ShieldCheckIcon,
  ArrowRightIcon } from
'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
export function RegisterSelect() {
  return (
    <div
      className="min-h-screen flex flex-col font-body"
      style={{
        backgroundColor: '#F6F3EE'
      }}>

      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="max-w-5xl w-full">
          {/* Header */}
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
              duration: 0.5
            }}
            className="text-center mb-14">

            {/* Decorative motif */}
            <div className="flex justify-center mb-6">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="#C9A227" opacity="0.15" />
                <path
                  d="M16 4 C10 4 6 10 6 16 C6 22 10 28 16 28 C22 28 26 22 26 16 C26 10 22 4 16 4Z"
                  fill="#C9A227"
                  opacity="0.5" />

                <path
                  d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z"
                  fill="#C9A227" />

              </svg>
            </div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{
                backgroundColor: '#C9A227',
                color: '#2F5D50'
              }}>

              Join Lanka Craft
            </span>
            <h1
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                fontFamily: 'Fraunces, serif',
                color: '#2F5D50'
              }}>

              How would you like to join?
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Choose your role to get started. Each account type gives you a
              tailored experience on the platform.
            </p>
          </motion.div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tourist */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.1
              }}
              className="bg-white rounded-3xl p-8 border-2 border-transparent hover:border-terracotta shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: '#FEF0EB'
                }}>

                <CompassIcon
                  className="w-8 h-8"
                  style={{
                    color: '#C65D3B'
                  }} />

              </div>
              <div className="mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: '#FEF0EB',
                    color: '#C65D3B'
                  }}>

                  Explorer
                </span>
              </div>
              <h2
                className="text-2xl font-black mt-3 mb-3"
                style={{
                  fontFamily: 'Fraunces, serif',
                  color: '#2F5D50'
                }}>

                Tourist
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Discover Sri Lankan crafts, book hands-on workshops with master
                artisans, and share your cultural journey through blogs and
                reviews.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#C65D3B'
                    }} />

                  Browse & book workshops
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#C65D3B'
                    }} />

                  Message artisans directly
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#C65D3B'
                    }} />

                  Write travel blogs
                </li>
              </ul>
              <Link
                to="/tourist/register"
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2 transition-all duration-200 group-hover:gap-3"
                style={{
                  backgroundColor: '#C65D3B',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#A84D2E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#C65D3B';
                }}>

                Register as Tourist <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Artist */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.2
              }}
              className="bg-white rounded-3xl p-8 border-2 border-transparent hover:border-forest shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative">

              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className="text-xs font-bold px-4 py-1 rounded-full text-white shadow-md"
                  style={{
                    backgroundColor: '#2F5D50'
                  }}>

                  Most Popular
                </span>
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: '#EBF4F1'
                }}>

                <PaletteIcon
                  className="w-8 h-8"
                  style={{
                    color: '#2F5D50'
                  }} />

              </div>
              <div className="mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: '#EBF4F1',
                    color: '#2F5D50'
                  }}>

                  Artisan
                </span>
              </div>
              <h2
                className="text-2xl font-black mt-3 mb-3"
                style={{
                  fontFamily: 'Fraunces, serif',
                  color: '#2F5D50'
                }}>

                Artist
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Showcase your craft to the world, host workshops for tourists,
                manage your schedule, and grow your artisan business on Lanka
                Crafts.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#2F5D50'
                    }} />

                  Create your artisan profile
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#2F5D50'
                    }} />

                  Host & manage workshops
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#2F5D50'
                    }} />

                  Chat with tourists
                </li>
              </ul>
              <Link
                to="/artist/register"
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2 transition-all duration-200 group-hover:gap-3 text-white"
                style={{
                  backgroundColor: '#2F5D50'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E3D35';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2F5D50';
                }}>

                Register as Artist <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Admin */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: 0.3
              }}
              className="bg-white rounded-3xl p-8 border-2 border-transparent hover:border-mustard shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: '#FDF8E7'
                }}>

                <ShieldCheckIcon
                  className="w-8 h-8"
                  style={{
                    color: '#C9A227'
                  }} />

              </div>
              <div className="mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: '#FDF8E7',
                    color: '#A8871F'
                  }}>

                  Platform
                </span>
              </div>
              <h2
                className="text-2xl font-black mt-3 mb-3"
                style={{
                  fontFamily: 'Fraunces, serif',
                  color: '#2F5D50'
                }}>

                Admin
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Manage the Lanka Crafts platform, verify artisans and workshops,
                oversee user activity, and maintain platform integrity.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#C9A227'
                    }} />

                  Verify artisan profiles
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#C9A227'
                    }} />

                  Manage platform users
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: '#C9A227'
                    }} />

                  Analytics & reports
                </li>
              </ul>
              <Link
                to="/admin/register"
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2 transition-all duration-200 group-hover:gap-3 border-2"
                style={{
                  borderColor: '#C9A227',
                  color: '#A8871F'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C9A227';
                  e.currentTarget.style.color = '#2F5D50';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#A8871F';
                }}>

                Register as Admin <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Already have account */}
          <motion.p
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.5
            }}
            className="text-center text-sm text-gray-400 mt-10 font-body">

            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold hover:underline"
              style={{
                color: '#C65D3B'
              }}>

              Sign in here
            </Link>
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>);

}