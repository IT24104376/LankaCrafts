import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { artistsApi, type ArtistListItem } from '../services/artistsApi';
const regions = ['All', 'Kandy', 'Galle', 'Colombo', 'Jaffna', 'Ratnapura'];
const crafts = [
'All',
'Batik',
'Lacquerwork',
'Masks',
'Pottery',
'Brasswork',
'Weaving'];

type ArtistCard = ArtistListItem & { gradient: string; accent: string };

export function BrowseArtists() {
  const [artists, setArtists] = useState<ArtistCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const { artists } = await artistsApi.getArtists();
        const gradients = [
          'linear-gradient(135deg, #2F5D50 0%, #C65D3B 100%)',
          'linear-gradient(135deg, #1A6B6B 0%, #C9A227 100%)',
          'linear-gradient(135deg, #C1440E 0%, #8B2E08 100%)'
        ];
        setArtists(
          artists.map((a, i) => ({
            ...a,
            gradient: gradients[i % gradients.length],
            accent: '#C9A227'
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artists');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const filteredArtists = artists.filter((artist) => {
    const matchesRegion =
    selectedRegion === 'All' || artist.region === selectedRegion;
    const matchesCraft =
    selectedCraft === 'All' || artist.craft.includes(selectedCraft);
    const matchesSearch =
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.craft.toLowerCase().includes(searchQuery.toLowerCase());
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
          {error && <p className="text-sm text-red-500 text-center mb-6">{error}</p>}
          {loading && <p className="text-sm text-gray-500 text-center mb-6">Loading artists...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist, i) =>
            <motion.div
              key={artist.id}
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
                to={`/artist/${artist.id}`}
                className="block group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                  {/* Image Placeholder */}
                  <div
                  className="h-64 relative overflow-hidden"
                  style={{
                    background: artist.gradient
                  }}>

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

                    {/* Silhouette */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <svg
                      width="120"
                      height="120"
                      viewBox="0 0 24 24"
                      fill="white">

                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>

                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {artist.years}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-mustard/10 text-mustard-dark mb-3">
                        {artist.region}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 font-display group-hover:text-terracotta transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-forest font-medium mb-4">
                      {artist.craft}
                    </p>

                    <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-terracotta transition-colors">
                      View Profile <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
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
        </div>
      </main>
      <Footer />
    </div>);

}