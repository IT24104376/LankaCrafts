import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { getArtists } from '../services/api';

const regions = ['All', 'Kandy', 'Galle', 'Colombo', 'Jaffna', 'Ratnapura'];
const crafts = [
  'All',
  'Batik',
  'Lacquerwork',
  'Masks',
  'Pottery',
  'Brasswork',
  'Weaving'
];

export function BrowseArtists() {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        // We'll fetch all and filter in frontend for now to match exactly what it did before
        // Since we don't have region filtering in backend API explicitly
        const response = await getArtists(1, 100); 
        // Need to add styling defaults if backend doesn't have them
        const artistsWithStyles = (response.data.artists || []).map((artist: any, index: number) => ({
          ...artist,
           gradient: artist.gradient || ['linear-gradient(135deg, #C65D3B 0%, #C9A227 100%)', 'linear-gradient(135deg, #2F5D50 0%, #C65D3B 100%)', 'linear-gradient(135deg, #C9A227 0%, #2F5D50 100%)'][index % 3],
           years: artist.yearsExperience ? `${artist.yearsExperience} years` : 'Experienced'
        }));
        setArtists(artistsWithStyles);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) => {
    const regionText = artist.address?.city || artist.address?.district || artist.address?.province || '';
    const matchesRegion =
      selectedRegion === 'All' || regionText.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesCraft =
      selectedCraft === 'All' || (artist.craftType || '').toLowerCase().includes(selectedCraft.toLowerCase());
    
    // Fallbacks since backend data structure might differ a bit
    const artistName = artist.businessName || artist.fullName || artist.name || '';
    const artistCraft = artist.craftType || artist.craft || '';

    const matchesSearch =
      artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artistCraft.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesCraft && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-offwhite font-body">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-forest mb-6 font-display">
              Meet Our Artisans
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the master craftsmen and women keeping Sri Lanka's
              ancient traditions alive.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12 space-y-8">
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by artist name or craft..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mustard focus:border-transparent shadow-sm text-lg" />

            </div>

            {/* Filter Chips */}
            <div className="flex flex-col gap-4 items-center">
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider py-2 mr-2">
                  Region:
                </span>
                {regions.map((region) =>
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedRegion === region ? 'bg-forest text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>

                    {region}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider py-2 mr-2">
                  Craft:
                </span>
                {crafts.map((craft) =>
                <button
                  key={craft}
                  onClick={() => setSelectedCraft(craft)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCraft === craft ? 'bg-terracotta text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>

                    {craft}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
             <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArtists.map((artist, i) => {
                  const artistName = artist.businessName || artist.fullName || 'Artist Name';
                  const artistCraft = artist.craftType || 'Craft Type';
                  const artistRegion = artist.address?.city || artist.address?.district || 'Sri Lanka';
                  
                  return (
                  <motion.div
                    key={artist._id || artist.id || i}
                    initial={{
                      opacity: 0,
                      y: 20
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      delay: i * 0.05
                    }}>

                      <Link
                      to={`/artist/${artist._id || artist.id}`}
                      className="block group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                        {/* Image Placeholder */}
                        <div
                        className="h-64 relative overflow-hidden"
                        style={{
                          background: artist.gradient,
                          backgroundImage: artist.profilePicUrl ? `url(${artist.profilePicUrl})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}>

                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                          
                          {/* Silhouette (only if no image) */}
                          {!artist.profilePicUrl && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                              <svg
                              width="120"
                              height="120"
                              viewBox="0 0 24 24"
                              fill="white">

                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}

                          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            {artist.years}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-mustard/10 text-mustard-dark mb-3">
                              {artistRegion}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1 font-display group-hover:text-terracotta transition-colors truncate">
                            {artistName}
                          </h3>
                          <p className="text-forest font-medium mb-4">
                            {artistCraft}
                          </p>

                          <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-terracotta transition-colors">
                            View Profile <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {filteredArtists.length === 0 &&
              <div className="text-center py-24">
                  <p className="text-xl text-gray-500">
                    No artisans found matching your criteria.
                  </p>
                  <button
                  onClick={() => {
                    setSelectedRegion('All');
                    setSelectedCraft('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 text-terracotta font-bold hover:underline">

                    Clear all filters
                  </button>
                </div>
              }
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>);
}