import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getArtists } from '../services/api';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
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
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await getArtists(1, 6); // Fetch top 6 for the grid
        const artistsWithStyles = (response.data.artists || []).map((artist: any, index: number) => ({
          ...artist,
          name: artist.businessName || artist.fullName || 'Artisan',
          craft: artist.craftType || 'Craft Master',
          region: artist.address?.city || artist.address?.district || 'Sri Lanka',
          years: artist.yearsExperience ? `${artist.yearsExperience} years` : 'Experienced',
          gradient: ['linear-gradient(135deg, #C65D3B 0%, #C9A227 100%)', 'linear-gradient(135deg, #2F5D50 0%, #C65D3B 100%)', 'linear-gradient(135deg, #C9A227 0%, #2F5D50 100%)'][index % 3],
          accent: ['#C65D3B', '#2F5D50', '#C9A227'][index % 3]
        }));
        setArtists(artistsWithStyles);
      } catch (error) {
        console.error('Error fetching artists for grid:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#2F5D50' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(201,162,39,0.2)', color: '#C9A227' }}>
            The People Behind the Craft
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Fraunces, serif', lineHeight: 1.05 }}>
            Meet Our Artisans
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Masters of their craft, keepers of tradition
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist, i) => (
              <motion.div
                key={artist._id || artist.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="rounded-2xl overflow-hidden cursor-pointer group"
                style={{ backgroundColor: '#F6F3EE', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'transform 300ms ease, box-shadow 300ms ease, border-left 300ms ease' }}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
              >
                <Link to={`/artist/${artist._id || artist.id}`}>
                  <div className="h-52 relative flex items-center justify-center overflow-hidden" style={{ background: artist.gradient, backgroundImage: artist.profilePicUrl ? `url(${artist.profilePicUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute inset-0 opacity-15">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id={`p-${i}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="12" fill="none" stroke="white" strokeWidth="1" /><circle cx="20" cy="20" r="4" fill="white" opacity="0.5" /></pattern></defs>
                        <rect width="100%" height="100%" fill={`url(#p-${i})`} />
                      </svg>
                    </div>
                    {!artist.profilePicUrl && (
                      <svg width="80" height="100" viewBox="0 0 80 100" fill="none" className="relative z-10 opacity-50"><circle cx="40" cy="22" r="16" fill="white" /><path d="M15 100 Q15 62 40 58 Q65 62 65 100" fill="white" /></svg>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(0,0,0,0.35)', color: 'white', backdropFilter: 'blur(4px)' }}>{artist.years}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif', color: '#1a1a1a' }}>{artist.name}</h3>
                    <p className="text-sm font-semibold mb-3" style={{ color: '#2F5D50', fontFamily: 'Inter, sans-serif' }}>{artist.craft}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(201,162,39,0.15)', color: '#A8871F' }}>{artist.region}</span>
                      <span className="text-sm font-semibold flex items-center gap-1 transition-colors duration-200 group-hover:text-terracotta" style={{ color: '#C65D3B', fontFamily: 'Inter, sans-serif' }}>
                        View Profile
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Link to="/browse-artists" className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-xl" style={{ backgroundColor: '#C9A227', color: '#2F5D50', fontFamily: 'Inter, sans-serif' }}>
            View All Artisans
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}