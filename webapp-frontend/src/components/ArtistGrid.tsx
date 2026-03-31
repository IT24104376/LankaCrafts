import React from 'react';
import { motion } from 'framer-motion';
const artists = [
{
  name: 'Nimal Perera',
  craft: 'Kandyan Lacquerwork',
  region: 'Kandy',
  years: '40 years',
  gradient: 'linear-gradient(135deg, #C65D3B 0%, #C9A227 100%)',
  accent: '#C65D3B'
},
{
  name: 'Kamala Wijesinghe',
  craft: 'Batik Textiles',
  region: 'Kandy',
  years: '28 years',
  gradient: 'linear-gradient(135deg, #2F5D50 0%, #C65D3B 100%)',
  accent: '#2F5D50'
},
{
  name: 'Suresh Fernando',
  craft: 'Mask Carving',
  region: 'Ambalangoda',
  years: '35 years',
  gradient: 'linear-gradient(135deg, #C9A227 0%, #2F5D50 100%)',
  accent: '#C9A227'
},
{
  name: 'Priya Rajapaksa',
  craft: 'Palmyra Weaving',
  region: 'Jaffna',
  years: '22 years',
  gradient: 'linear-gradient(135deg, #C65D3B 0%, #2F5D50 100%)',
  accent: '#C65D3B'
},
{
  name: 'Anura Dissanayake',
  craft: 'Brasswork',
  region: 'Colombo',
  years: '31 years',
  gradient: 'linear-gradient(135deg, #2F5D50 0%, #C9A227 100%)',
  accent: '#2F5D50'
},
{
  name: 'Nilmini Senanayake',
  craft: 'Gem Polishing',
  region: 'Ratnapura',
  years: '18 years',
  gradient: 'linear-gradient(135deg, #C9A227 0%, #C65D3B 100%)',
  accent: '#C9A227'
}];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};
export function ArtistGrid() {
  return (
    <section
      className="py-24 px-6"
      style={{
        backgroundColor: '#2F5D50'
      }}>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.7
          }}
          className="text-center mb-16">

          <span
            className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(201,162,39,0.2)',
              color: '#C9A227'
            }}>

            The People Behind the Craft
          </span>
          <h2
            className="text-5xl md:text-6xl font-black text-white mb-4"
            style={{
              fontFamily: 'Fraunces, serif',
              lineHeight: 1.05
            }}>

            Meet Our Artisans
          </h2>
          <p
            className="text-white/60 text-lg max-w-xl mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif'
            }}>

            Masters of their craft, keepers of tradition
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist, i) =>
          <motion.div
            key={artist.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-60px'
            }}
            className="rounded-2xl overflow-hidden cursor-pointer group"
            style={{
              backgroundColor: '#F6F3EE',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transition:
              'transform 300ms ease, box-shadow 300ms ease, border-left 300ms ease'
            }}
            whileHover={{
              y: -8,
              transition: {
                duration: 0.3,
                ease: 'easeOut'
              }
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
              el.style.borderLeft = `4px solid ${artist.accent}`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              el.style.borderLeft = '4px solid transparent';
            }}>

              {/* Image placeholder */}
              <div
              className="h-52 relative flex items-center justify-center overflow-hidden"
              style={{
                background: artist.gradient
              }}>

                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-15">
                  <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg">

                    <defs>
                      <pattern
                      id={`p-${i}`}
                      x="0"
                      y="0"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse">

                        <circle
                        cx="20"
                        cy="20"
                        r="12"
                        fill="none"
                        stroke="white"
                        strokeWidth="1" />

                        <circle
                        cx="20"
                        cy="20"
                        r="4"
                        fill="white"
                        opacity="0.5" />

                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#p-${i})`} />
                  </svg>
                </div>

                {/* Silhouette */}
                <svg
                width="80"
                height="100"
                viewBox="0 0 80 100"
                fill="none"
                className="relative z-10 opacity-50">

                  <circle cx="40" cy="22" r="16" fill="white" />
                  <path d="M15 100 Q15 62 40 58 Q65 62 65 100" fill="white" />
                </svg>

                {/* Years badge */}
                <div
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  color: 'white',
                  backdropFilter: 'blur(4px)'
                }}>

                  {artist.years}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                className="text-xl font-bold mb-1"
                style={{
                  fontFamily: 'Fraunces, serif',
                  color: '#1a1a1a'
                }}>

                  {artist.name}
                </h3>
                <p
                className="text-sm font-semibold mb-3"
                style={{
                  color: '#2F5D50',
                  fontFamily: 'Inter, sans-serif'
                }}>

                  {artist.craft}
                </p>
                <div className="flex items-center justify-between">
                  <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgba(201,162,39,0.15)',
                    color: '#A8871F'
                  }}>

                    {artist.region}
                  </span>
                  <a
                  href="#"
                  className="text-sm font-semibold flex items-center gap-1 transition-colors duration-200 hover:opacity-70"
                  style={{
                    color: '#C65D3B',
                    fontFamily: 'Inter, sans-serif'
                  }}>

                    View Profile
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                      d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round" />

                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
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
            duration: 0.6,
            delay: 0.3
          }}
          className="text-center mt-14">

          <a
            href="#"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: '#C9A227',
              color: '#2F5D50',
              fontFamily: 'Inter, sans-serif'
            }}>

            View All Artisans
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round" />

            </svg>
          </a>
        </motion.div>
      </div>
    </section>);

}