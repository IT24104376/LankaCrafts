import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        backgroundColor: '#C65D3B'
      }}>

      {/* Batik-inspired SVG pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="batik"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse">

              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="white"
                strokeWidth="1" />

              <circle
                cx="40"
                cy="40"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="1" />

              <circle
                cx="40"
                cy="40"
                r="10"
                fill="none"
                stroke="white"
                strokeWidth="1" />

              <line
                x1="40"
                y1="10"
                x2="40"
                y2="70"
                stroke="white"
                strokeWidth="0.5" />

              <line
                x1="10"
                y1="40"
                x2="70"
                y2="40"
                stroke="white"
                strokeWidth="0.5" />

              <line
                x1="18"
                y1="18"
                x2="62"
                y2="62"
                stroke="white"
                strokeWidth="0.5" />

              <line
                x1="62"
                y1="18"
                x2="18"
                y2="62"
                stroke="white"
                strokeWidth="0.5" />

            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#batik)" />
        </svg>
      </div>

      {/* Decorative large circle */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          backgroundColor: '#A84D2E'
        }} />

      <div
        className="absolute -left-20 bottom-0 w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          backgroundColor: '#A84D2E'
        }} />


      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl">
          {/* Badge */}
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
              duration: 0.6
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-semibold tracking-widest uppercase"
            style={{
              backgroundColor: 'rgba(201, 162, 39, 0.25)',
              color: '#C9A227',
              border: '1px solid rgba(201,162,39,0.4)'
            }}>

            <span>✦</span>
            <span>Sri Lanka Tourism Board</span>
            <span>✦</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              delay: 0.15
            }}
            className="text-white leading-[0.95] mb-6"
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
              fontWeight: 900,
              fontStyle: 'italic'
            }}>

            Discover the
            <br />
            <span
              style={{
                color: '#C9A227'
              }}>

              Soul
            </span>{' '}
            of
            <br />
            Sri Lanka
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.7,
              delay: 0.35
            }}
            className="text-white/85 text-xl md:text-2xl mb-10 max-w-xl leading-relaxed"
            style={{
              fontFamily: 'Inter, sans-serif'
            }}>

            Centuries of craft, colour, and culture —<br />
            woven into every piece.
          </motion.p>

          {/* CTAs */}
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
              duration: 0.6,
              delay: 0.5
            }}
            className="flex flex-wrap gap-4">

            <a
              href="#crafts"
              className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#C65D3B',
                fontFamily: 'Inter, sans-serif'
              }}>

              Explore Crafts
            </a>
            <Link
              to="/browse"
              className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '2px solid rgba(255,255,255,0.7)',
                fontFamily: 'Inter, sans-serif'
              }}>

              Meet the Artisans
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              duration: 0.8,
              delay: 0.7
            }}
            className="flex flex-wrap gap-10 mt-16 pt-10"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}>

            {[
            {
              num: '2,500+',
              label: 'Artisans'
            },
            {
              num: '18',
              label: 'Craft Traditions'
            },
            {
              num: '9',
              label: 'Regions'
            },
            {
              num: '3,000',
              label: 'Years of History'
            }].
            map((stat) =>
            <div key={stat.label}>
                <div
                className="text-3xl font-bold text-white"
                style={{
                  fontFamily: 'Fraunces, serif'
                }}>

                  {stat.num}
                </div>
                <div
                className="text-white/60 text-sm mt-1"
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}>

                  {stat.label}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full">

          <path
            d="M0 80 L0 40 Q360 0 720 40 Q1080 80 1440 40 L1440 80 Z"
            fill="#F6F3EE" />

        </svg>
      </div>
    </section>);

}