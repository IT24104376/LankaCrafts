import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
export function JoinCTA() {
  return (
    <section
      className="py-24 px-6 relative overflow-hidden"
      style={{
        backgroundColor: '#C65D3B'
      }}>

      {/* Batik Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="batik-cta"
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

              <path
                d="M30 10 L30 50 M10 30 L50 30"
                stroke="white"
                strokeWidth="1" />

            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#batik-cta)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
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
          className="text-4xl md:text-6xl font-black text-white mb-6"
          style={{
            fontFamily: 'Fraunces, serif'
          }}>

          Share Your Craft with the World
        </motion.h2>
        <motion.p
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
            delay: 0.1
          }}
          className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">

          Join 2,500+ artisans showcasing Sri Lanka's living heritage to
          travelers worldwide.
        </motion.p>
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
            delay: 0.2
          }}>

          <Link
            to="/register"
            className="inline-block px-10 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl bg-white text-terracotta">

            Register Now
          </Link>
        </motion.div>
      </div>
    </section>);

}