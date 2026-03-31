import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
const crafts = [
{
  name: 'Batik Textiles',
  description:
  'Intricate wax-resist dyeing on silk and cotton, a living art form from the heart of Kandy.',
  region: 'Kandy',
  accent: '#C65D3B',
  icon:
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path
      d="M8 40 Q16 20 24 24 Q32 28 40 8"
      stroke="#C65D3B"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none" />

        <path
      d="M8 32 Q16 12 24 16 Q32 20 40 0"
      stroke="#C65D3B"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.5" />

        <circle cx="24" cy="24" r="4" fill="#C65D3B" opacity="0.3" />
      </svg>

},
{
  name: 'Lacquerwork',
  description:
  'Vibrant turned-wood pieces adorned with geometric patterns, a Kandy highland tradition.',
  region: 'Kandy',
  accent: '#C9A227',
  icon:
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle
      cx="24"
      cy="24"
      r="16"
      stroke="#C9A227"
      strokeWidth="2.5"
      fill="none" />

        <circle
      cx="24"
      cy="24"
      r="10"
      stroke="#C9A227"
      strokeWidth="1.5"
      fill="none"
      opacity="0.6" />

        <circle cx="24" cy="24" r="4" fill="#C9A227" opacity="0.4" />
        <path
      d="M24 8 L24 16 M24 32 L24 40 M8 24 L16 24 M32 24 L40 24"
      stroke="#C9A227"
      strokeWidth="2"
      strokeLinecap="round" />

      </svg>

},
{
  name: 'Brasswork',
  description:
  'Ancient metalsmithing traditions forging ceremonial vessels, lamps, and temple artifacts.',
  region: 'Colombo',
  accent: '#C9A227',
  icon:
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path
      d="M16 36 L14 42 L34 42 L32 36"
      stroke="#C9A227"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none" />

        <path
      d="M16 36 Q12 28 14 20 Q16 12 24 10 Q32 12 34 20 Q36 28 32 36 Z"
      stroke="#C9A227"
      strokeWidth="2.5"
      fill="none" />

        <ellipse
      cx="24"
      cy="20"
      rx="6"
      ry="4"
      stroke="#C9A227"
      strokeWidth="1.5"
      fill="none"
      opacity="0.5" />

      </svg>

},
{
  name: 'Mask Carving',
  description:
  'Ceremonial kolam masks hand-carved from kaduru wood, used in healing rituals and dance.',
  region: 'Ambalangoda',
  accent: '#2F5D50',
  icon:
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <ellipse
      cx="24"
      cy="26"
      rx="14"
      ry="16"
      stroke="#2F5D50"
      strokeWidth="2.5"
      fill="none" />

        <circle
      cx="18"
      cy="22"
      r="3"
      stroke="#2F5D50"
      strokeWidth="2"
      fill="none" />

        <circle
      cx="30"
      cy="22"
      r="3"
      stroke="#2F5D50"
      strokeWidth="2"
      fill="none" />

        <path
      d="M18 32 Q24 36 30 32"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none" />

        <path
      d="M14 16 Q24 8 34 16"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none" />

      </svg>

},
{
  name: 'Pottery',
  description:
  'Unglazed earthenware shaped by hand on ancient wheels — functional beauty from Kelaniya.',
  region: 'Kelaniya',
  accent: '#C65D3B',
  icon:
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path
      d="M18 10 Q14 18 14 26 Q14 36 24 38 Q34 36 34 26 Q34 18 30 10 Z"
      stroke="#C65D3B"
      strokeWidth="2.5"
      fill="none" />

        <path
      d="M18 10 Q24 8 30 10"
      stroke="#C65D3B"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none" />

        <path
      d="M16 24 Q24 22 32 24"
      stroke="#C65D3B"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.5" />

      </svg>

},
{
  name: 'Handloom Weaving',
  description:
  'Dumbara mats and Dumbara weaving — geometric patterns passed through generations in Kandy.',
  region: 'Dumbara',
  accent: '#2F5D50',
  icon:
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <line
      x1="8"
      y1="12"
      x2="40"
      y2="12"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round" />

        <line
      x1="8"
      y1="20"
      x2="40"
      y2="20"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round" />

        <line
      x1="8"
      y1="28"
      x2="40"
      y2="28"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round" />

        <line
      x1="8"
      y1="36"
      x2="40"
      y2="36"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round" />

        <line
      x1="16"
      y1="8"
      x2="16"
      y2="40"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5" />

        <line
      x1="24"
      y1="8"
      x2="24"
      y2="40"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5" />

        <line
      x1="32"
      y1="8"
      x2="32"
      y2="40"
      stroke="#2F5D50"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5" />

      </svg>

}];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};
export function CraftCategories() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-80px'
  });
  return (
    <section
      id="crafts"
      className="py-24 px-6"
      style={{
        backgroundColor: '#F6F3EE'
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
              backgroundColor: 'rgba(201,162,39,0.15)',
              color: '#C9A227'
            }}>

            Living Traditions
          </span>
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{
              fontFamily: 'Fraunces, serif',
              color: '#2F5D50',
              lineHeight: 1.05
            }}>

            Our Living Traditions
          </h2>
          <p
            className="text-lg text-gray-500 max-w-xl mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif'
            }}>

            From ancient temples to modern homes — Sri Lankan craft endures
          </p>
        </motion.div>

        {/* Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {crafts.map((craft, i) =>
          <motion.div
            key={craft.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover={{
              scale: 1.03,
              y: -4
            }}
            className="rounded-2xl p-7 cursor-pointer group transition-shadow duration-300"
            style={{
              backgroundColor: '#F6F3EE',
              borderTop: `4px solid ${craft.accent}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.boxShadow =
              '0 12px 40px rgba(0,0,0,0.14)';
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.boxShadow =
              '0 2px 12px rgba(0,0,0,0.06)';
            }}>

              <div className="mb-5">{craft.icon}</div>
              <h3
              className="text-xl font-bold mb-2"
              style={{
                fontFamily: 'Fraunces, serif',
                color: '#1a1a1a'
              }}>

                {craft.name}
              </h3>
              <p
              className="text-gray-500 text-sm leading-relaxed mb-4"
              style={{
                fontFamily: 'Inter, sans-serif'
              }}>

                {craft.description}
              </p>
              <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(201,162,39,0.15)',
                color: '#A8871F'
              }}>

                {craft.region}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}