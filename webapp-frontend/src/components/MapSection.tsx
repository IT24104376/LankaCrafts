import React, { useState } from 'react';
import { motion } from 'framer-motion';
const regions = [
{
  id: 'kandy',
  name: 'Kandy',
  craft: 'Lacquerwork & Batik',
  description:
  'The cultural capital — home to the Temple of the Tooth and centuries of highland craft.',
  artisans: 340,
  cx: 95,
  cy: 130,
  color: '#C65D3B'
},
{
  id: 'galle',
  name: 'Galle',
  craft: 'Lace & Gem Cutting',
  description:
  'Dutch colonial fort town where intricate needle lace and precious gemstones meet the sea.',
  artisans: 210,
  cx: 80,
  cy: 230,
  color: '#2F5D50'
},
{
  id: 'colombo',
  name: 'Colombo',
  craft: 'Brasswork & Silverware',
  description:
  'The vibrant capital where traditional metalsmithing workshops thrive alongside modernity.',
  artisans: 180,
  cx: 65,
  cy: 155,
  color: '#C9A227'
},
{
  id: 'jaffna',
  name: 'Jaffna',
  craft: 'Palmyra Weaving',
  description:
  'The northern peninsula where palmyra palm is woven into baskets, mats, and fans.',
  artisans: 120,
  cx: 85,
  cy: 40,
  color: '#2F5D50'
},
{
  id: 'ratnapura',
  name: 'Ratnapura',
  craft: 'Gem Polishing',
  description:
  "The City of Gems — sapphires, rubies, and cat's eye stones polished by master craftsmen.",
  artisans: 95,
  cx: 85,
  cy: 185,
  color: '#C65D3B'
}];

export function MapSection() {
  const [activeRegion, setActiveRegion] = useState(regions[0]);
  return (
    <section
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
              backgroundColor: 'rgba(47,93,80,0.1)',
              color: '#2F5D50'
            }}>

            Explore by Region
          </span>
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{
              fontFamily: 'Fraunces, serif',
              color: '#1a1a1a',
              lineHeight: 1.05
            }}>

            Craft Regions of
            <br />
            Sri Lanka
          </h2>
          <p
            className="text-lg text-gray-500 max-w-xl mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif'
            }}>

            Each region holds a unique tradition passed through generations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* SVG Map */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8
            }}
            className="flex justify-center">

            <div className="relative">
              <svg
                width="280"
                height="340"
                viewBox="0 0 180 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">

                {/* Sri Lanka island shape */}
                <path
                  d="M85 8 C100 8 118 18 125 35 C132 52 130 70 128 88 C126 106 130 120 128 138 C126 156 120 172 115 188 C110 204 105 218 98 230 C91 242 82 250 75 248 C68 246 62 236 58 222 C54 208 52 192 50 176 C48 160 44 144 44 128 C44 112 46 96 50 82 C54 68 60 56 68 44 C76 32 80 8 85 8Z"
                  fill="#2F5D50"
                  opacity="0.85" />

                {/* Texture lines */}
                <path
                  d="M70 60 Q90 55 110 65"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                  fill="none" />

                <path
                  d="M60 100 Q90 95 120 105"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                  fill="none" />

                <path
                  d="M55 140 Q88 135 118 145"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                  fill="none" />

                <path
                  d="M55 180 Q85 175 112 183"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                  fill="none" />


                {/* Region dots */}
                {regions.map((region) =>
                <g
                  key={region.id}
                  onClick={() => setActiveRegion(region)}
                  className="cursor-pointer">

                    {/* Pulse ring */}
                    {activeRegion.id === region.id &&
                  <motion.circle
                    cx={region.cx}
                    cy={region.cy}
                    r="14"
                    fill={region.color}
                    opacity="0.25"
                    animate={{
                      r: [10, 18, 10],
                      opacity: [0.3, 0, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }} />

                  }
                    <circle
                    cx={region.cx}
                    cy={region.cy}
                    r="7"
                    fill={
                    activeRegion.id === region.id ? region.color : '#C9A227'
                    }
                    stroke="white"
                    strokeWidth="2" />

                    {/* Label */}
                    <text
                    x={region.cx + 12}
                    y={region.cy + 4}
                    fill="white"
                    fontSize="9"
                    fontFamily="Inter, sans-serif"
                    fontWeight="600">

                      {region.name}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </motion.div>

          {/* Region Cards */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40
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
              delay: 0.1
            }}
            className="flex flex-col gap-3">

            {regions.map((region) =>
            <div
              key={region.id}
              onClick={() => setActiveRegion(region)}
              className="p-5 rounded-2xl cursor-pointer transition-all duration-300"
              style={{
                backgroundColor:
                activeRegion.id === region.id ? 'white' : 'transparent',
                borderLeft: `4px solid ${activeRegion.id === region.id ? region.color : 'transparent'}`,
                boxShadow:
                activeRegion.id === region.id ?
                '0 4px 20px rgba(0,0,0,0.1)' :
                'none',
                border:
                activeRegion.id === region.id ?
                `1px solid rgba(0,0,0,0.06)` :
                '1px solid transparent',
                borderLeftColor:
                activeRegion.id === region.id ?
                region.color :
                'transparent',
                borderLeftWidth: '4px'
              }}>

                <div className="flex items-start justify-between">
                  <div>
                    <h3
                    className="font-bold text-lg mb-0.5"
                    style={{
                      fontFamily: 'Fraunces, serif',
                      color:
                      activeRegion.id === region.id ? '#1a1a1a' : '#666'
                    }}>

                      {region.name}
                    </h3>
                    <p
                    className="text-sm font-semibold mb-1"
                    style={{
                      color: region.color,
                      fontFamily: 'Inter, sans-serif'
                    }}>

                      {region.craft}
                    </p>
                    {activeRegion.id === region.id &&
                  <motion.p
                    initial={{
                      opacity: 0,
                      height: 0
                    }}
                    animate={{
                      opacity: 1,
                      height: 'auto'
                    }}
                    className="text-sm text-gray-500 mt-2"
                    style={{
                      fontFamily: 'Inter, sans-serif'
                    }}>

                        {region.description}
                      </motion.p>
                  }
                  </div>
                  <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ml-3"
                  style={{
                    backgroundColor: 'rgba(201,162,39,0.15)',
                    color: '#A8871F'
                  }}>

                    {region.artisans} artisans
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>);

}