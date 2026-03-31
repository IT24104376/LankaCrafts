import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
export function MapTeaser() {
  return (
    <section
      className="py-24 px-6 overflow-hidden relative"
      style={{
        backgroundColor: '#F6F3EE'
      }}>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}>

              <h2
                className="text-4xl md:text-5xl font-black text-forest mb-6"
                style={{
                  fontFamily: 'Fraunces, serif'
                }}>

                Discover Workshops Near You
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
                Explore our interactive map to find hidden gems, meet local
                artisans, and book authentic experiences across the island.
              </p>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: '#C9A227',
                  color: '#2F5D50',
                  fontFamily: 'Inter, sans-serif'
                }}>

                Explore All Workshops on Map
                <MapPin className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Map Preview */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8
            }}
            className="flex-1 relative">

            <div className="relative w-full max-w-md mx-auto aspect-[4/5] bg-blue-50/50 rounded-3xl border-4 border-white shadow-2xl overflow-hidden p-8">
              {/* Simplified Map SVG */}
              <svg
                viewBox="0 0 180 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-lg">

                <path
                  d="M85 8 C100 8 118 18 125 35 C132 52 130 70 128 88 C126 106 130 120 128 138 C126 156 120 172 115 188 C110 204 105 218 98 230 C91 242 82 250 75 248 C68 246 62 236 58 222 C54 208 52 192 50 176 C48 160 44 144 44 128 C44 112 46 96 50 82 C54 68 60 56 68 44 C76 32 80 8 85 8Z"
                  fill="#E5E7EB"
                  stroke="white"
                  strokeWidth="2" />

                {/* Decorative Pins */}
                {[
                {
                  x: 95,
                  y: 130,
                  c: '#C65D3B'
                },
                {
                  x: 80,
                  y: 230,
                  c: '#2F5D50'
                },
                {
                  x: 65,
                  y: 155,
                  c: '#C9A227'
                },
                {
                  x: 85,
                  y: 40,
                  c: '#2F5D50'
                },
                {
                  x: 85,
                  y: 185,
                  c: '#C65D3B'
                }].
                map((pin, i) =>
                <g key={i}>
                    <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="6"
                    fill={pin.c}
                    stroke="white"
                    strokeWidth="2" />

                    <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="12"
                    fill={pin.c}
                    opacity="0.2"
                    className="animate-pulse" />

                  </g>
                )}
              </svg>

              {/* Floating Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold">
                    9
                  </div>
                  <div>
                    <p className="font-bold text-forest text-sm">
                      Regions Active
                    </p>
                    <p className="text-xs text-gray-500">
                      2,500+ artisans registered
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}