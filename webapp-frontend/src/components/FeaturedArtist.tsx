import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
export function FeaturedArtist() {
  return (
    <section
      className="py-24 px-6"
      style={{
        backgroundColor: '#2F5D50'
      }}>

      <div className="max-w-7xl mx-auto">
        {/* Section label */}
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
          }}
          transition={{
            duration: 0.6
          }}
          className="text-center mb-12">

          <span
            className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(201,162,39,0.2)',
              color: '#C9A227'
            }}>

            ✦ Artist of the Week ✦
          </span>
        </motion.div>

        {/* Main Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: '#F6F3EE',
            borderLeft: '8px solid #C9A227',
            boxShadow: '0 24px 80px rgba(0,0,0,0.3)'
          }}>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Text Side */}
            <motion.div
              initial={{
                opacity: 0,
                x: -50
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="p-10 md:p-14 flex flex-col justify-center">

              <p
                className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
                style={{
                  color: '#C9A227',
                  fontFamily: 'Inter, sans-serif'
                }}>

                Master Craftsman · Kandy
              </p>
              <h2
                className="font-black mb-2 leading-tight"
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: '#1a1a1a'
                }}>

                Nimal Perera
              </h2>
              <p
                className="text-xl mb-6 italic"
                style={{
                  fontFamily: 'Fraunces, serif',
                  color: '#C65D3B'
                }}>

                Master of Kandyan Lacquerwork
              </p>
              <p
                className="text-gray-600 leading-relaxed mb-8 text-base"
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}>

                For over four decades, Nimal Perera has kept the ancient art of
                Kandyan lacquerwork alive in his hilltop workshop above Kandy.
                Recognised by UNESCO as a Living Heritage Practitioner, his
                turned-wood pieces — adorned with intricate geometric patterns —
                are held in collections across 30 countries. Every piece begins
                with a prayer and ends with a story.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                {
                  value: '40+',
                  label: 'Years of Craft'
                },
                {
                  value: 'UNESCO',
                  label: 'Recognized'
                },
                {
                  value: '500+',
                  label: 'Pieces Created'
                }].
                map((stat) =>
                <div
                  key={stat.label}
                  className="px-5 py-3 rounded-xl text-center"
                  style={{
                    border: '2px solid #C9A227',
                    backgroundColor: 'rgba(201,162,39,0.06)'
                  }}>

                    <div
                    className="text-xl font-black"
                    style={{
                      fontFamily: 'Fraunces, serif',
                      color: '#2F5D50'
                    }}>

                      {stat.value}
                    </div>
                    <div
                    className="text-xs text-gray-500 mt-0.5"
                    style={{
                      fontFamily: 'Inter, sans-serif'
                    }}>

                      {stat.label}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                to="/artist/1"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base w-fit transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: '#C9A227',
                  color: '#2F5D50',
                  fontFamily: 'Inter, sans-serif'
                }}>

                Visit the Workshop
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round" />

                </svg>
              </Link>
            </motion.div>

            {/* Image Side */}
            <motion.div
              initial={{
                opacity: 0,
                x: 50
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="relative min-h-[400px] lg:min-h-0">

              {/* Gradient placeholder */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                  'linear-gradient(135deg, #C65D3B 0%, #C9A227 50%, #2F5D50 100%)'
                }}>

                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-20">
                  <svg
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg">

                    <defs>
                      <pattern
                        id="lacquer"
                        x="0"
                        y="0"
                        width="60"
                        height="60"
                        patternUnits="userSpaceOnUse">

                        <circle
                          cx="30"
                          cy="30"
                          r="20"
                          fill="none"
                          stroke="white"
                          strokeWidth="1" />

                        <circle
                          cx="30"
                          cy="30"
                          r="12"
                          fill="none"
                          stroke="white"
                          strokeWidth="1" />

                        <circle
                          cx="30"
                          cy="30"
                          r="4"
                          fill="white"
                          opacity="0.5" />

                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#lacquer)" />
                  </svg>
                </div>

                {/* Artisan silhouette */}
                <svg
                  width="180"
                  height="220"
                  viewBox="0 0 180 220"
                  fill="none"
                  className="relative z-10 opacity-40">

                  <circle cx="90" cy="45" r="30" fill="white" />
                  <path
                    d="M40 220 Q40 140 90 130 Q140 140 140 220"
                    fill="white" />

                  <path
                    d="M50 160 Q30 140 20 120 Q40 110 60 130"
                    fill="white"
                    opacity="0.7" />

                  <path
                    d="M130 160 Q150 140 160 120 Q140 110 120 130"
                    fill="white"
                    opacity="0.7" />

                  <ellipse
                    cx="90"
                    cy="170"
                    rx="20"
                    ry="10"
                    fill="white"
                    opacity="0.5" />

                </svg>

                {/* Badge overlay */}
                <div
                  className="absolute bottom-6 left-6 px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)'
                  }}>

                  <p
                    className="text-white text-sm font-bold"
                    style={{
                      fontFamily: 'Fraunces, serif'
                    }}>

                    Kandy, Sri Lanka
                  </p>
                  <p
                    className="text-white/70 text-xs"
                    style={{
                      fontFamily: 'Inter, sans-serif'
                    }}>

                    Workshop open Mon–Sat
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>);

}