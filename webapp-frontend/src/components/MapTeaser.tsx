import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const samplePinpoints = [
  { id: 1, position: [6.9271, 79.8612], label: "Colombo - Cooking Workshop" },
  { id: 2, position: [7.2906, 80.6337], label: "Kandy - Batik Workshop" },
  { id: 3, position: [6.0535, 80.2210], label: "Galle - Mask Carving" },
  { id: 4, position: [9.6615, 80.0255], label: "Jaffna - Weaving Class" },
  { id: 5, position: [7.9403, 81.0188], label: "Polonnaruwa - Pottery Class" }
];

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

            <div className="relative w-full max-w-md mx-auto aspect-[4/5] bg-blue-50/50 rounded-3xl border-4 border-white shadow-2xl overflow-hidden z-20">
              <MapContainer
                center={[7.8731, 80.7718]}
                zoom={7}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {samplePinpoints.map((pin) => (
                  <Marker key={pin.id} position={pin.position as [number, number]}>
                    <Popup>{pin.label}</Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Floating Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white z-[1000] pointer-events-none">
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