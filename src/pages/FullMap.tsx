import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
const workshops = [
{
  id: 1,
  name: 'Nimal Perera',
  craft: 'Lacquerwork',
  region: 'Kandy',
  x: 95,
  y: 130,
  color: '#C65D3B'
},
{
  id: 2,
  name: 'Kamala Wijesinghe',
  craft: 'Batik',
  region: 'Kandy',
  x: 98,
  y: 125,
  color: '#2F5D50'
},
{
  id: 3,
  name: 'Suresh Fernando',
  craft: 'Masks',
  region: 'Ambalangoda',
  x: 80,
  y: 230,
  color: '#C9A227'
},
{
  id: 4,
  name: 'Anura Dissanayake',
  craft: 'Brasswork',
  region: 'Colombo',
  x: 65,
  y: 155,
  color: '#C9A227'
},
{
  id: 5,
  name: 'Priya Rajapaksa',
  craft: 'Weaving',
  region: 'Jaffna',
  x: 85,
  y: 40,
  color: '#2F5D50'
},
{
  id: 6,
  name: 'Nilmini Senanayake',
  craft: 'Gems',
  region: 'Ratnapura',
  x: 85,
  y: 185,
  color: '#C65D3B'
},
{
  id: 7,
  name: 'Rohan De Silva',
  craft: 'Pottery',
  region: 'Kelaniya',
  x: 70,
  y: 150,
  color: '#C65D3B'
},
{
  id: 8,
  name: 'Sunil Gunawardena',
  craft: 'Wood Carving',
  region: 'Galle',
  x: 82,
  y: 225,
  color: '#2F5D50'
}];

export function FullMap() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<
    (typeof workshops)[0] | null>(
    null);
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="h-screen w-full bg-[#E5E7EB] relative overflow-hidden font-body">
      {/* Header / Search Bar */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-full shadow-lg p-2 flex items-center gap-2 max-w-md w-full">
          <Link
            to="/"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">

            <ArrowRight className="w-5 h-5 rotate-180 text-gray-500" />
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search workshops..."
              className="w-full pl-9 pr-4 py-2 rounded-full text-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-full flex items-center justify-center p-4 md:p-12">
        <svg
          viewBox="0 0 180 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full max-h-[800px] w-auto drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))'
          }}>

          {/* Island Shape */}
          <path
            d="M85 8 C100 8 118 18 125 35 C132 52 130 70 128 88 C126 106 130 120 128 138 C126 156 120 172 115 188 C110 204 105 218 98 230 C91 242 82 250 75 248 C68 246 62 236 58 222 C54 208 52 192 50 176 C48 160 44 144 44 128 C44 112 46 96 50 82 C54 68 60 56 68 44 C76 32 80 8 85 8Z"
            fill="#F6F3EE"
            stroke="white"
            strokeWidth="1.5" />


          {/* Pins */}
          {workshops.map((workshop) =>
          <g
            key={workshop.id}
            onClick={() => setSelectedWorkshop(workshop)}
            className="cursor-pointer group"
            style={{
              transformOrigin: `${workshop.x}px ${workshop.y}px`
            }}>

              <circle
              cx={workshop.x}
              cy={workshop.y}
              r={selectedWorkshop?.id === workshop.id ? 8 : 4}
              fill={workshop.color}
              stroke="white"
              strokeWidth="1"
              className="transition-all duration-300 ease-out" />

              {selectedWorkshop?.id === workshop.id &&
            <circle
              cx={workshop.x}
              cy={workshop.y}
              r="12"
              fill={workshop.color}
              opacity="0.2"
              className="animate-pulse" />

            }
            </g>
          )}
        </svg>
      </div>

      {/* Popup Card */}
      <AnimatePresence>
        {selectedWorkshop &&
        <motion.div
          initial={{
            y: 100,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          exit={{
            y: 100,
            opacity: 0
          }}
          className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white rounded-2xl shadow-2xl p-5 z-30 border border-gray-100">

            <button
            onClick={() => setSelectedWorkshop(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">

              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div
              className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-xl"
              style={{
                backgroundColor: selectedWorkshop.color
              }}>

                {selectedWorkshop.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 font-display text-lg leading-tight mb-1">
                  {selectedWorkshop.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-2">
                  {selectedWorkshop.craft} · {selectedWorkshop.region}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                  <MapPin className="w-3 h-3" /> 2.4 km away
                </div>
              </div>
            </div>

            <Link
            to={`/artist/${selectedWorkshop.id}`}
            className="mt-2 w-full py-2.5 rounded-xl bg-forest text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-forest-dark transition-colors">

              View Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        }
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white hidden md:block">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
          Craft Types
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span className="w-3 h-3 rounded-full bg-terracotta" /> Textiles &
            Gems
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span className="w-3 h-3 rounded-full bg-forest" /> Wood & Weaving
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span className="w-3 h-3 rounded-full bg-mustard" /> Metal & Masks
          </div>
        </div>
      </div>
    </div>);

}