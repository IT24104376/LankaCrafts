import { useState, useEffect } from 'react';
import { MapPin, Clock, Star, MessageCircle, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { ReviewSection } from '../components/ReviewSection';
import { getArtistById, getCrafts } from '../services/api';

// Types for artist data
interface ArtistData {
  id: string;
  name: string;
  initials: string;
  craft: string;
  location: string;
  bio: string;
  specialties: string[];
  schedule: { day: string; slots: string[] }[];
  craftId?: string;
  artisanId?: string;
}

// // Mock data fallback (until API is properly connected)
// const ARTISTS_DATA: Record<string, ArtistData> = {
//   '1': {
//     id: '1',
//     name: 'Kamala Wijesinghe',
//     initials: 'KW',
//     craft: 'Batik Master',
//     location: 'Kandy, Sri Lanka',
//     bio: 'Kamala has been practicing the ancient art of Batik for over 40 years, learning from her grandmother who was a royal batik artist. Her work combines traditional Sinhalese patterns with contemporary designs, earning international recognition.',
//     specialties: ['Traditional Batik', 'Hand-drawn Patterns', 'Natural Dyes'],
//     schedule: [
//       { day: 'Monday', slots: ['9:00 AM', '2:00 PM'] },
//       { day: 'Wednesday', slots: ['10:00 AM', '3:00 PM'] },
//       { day: 'Friday', slots: ['9:00 AM', '11:00 AM'] },
//     ],
//     craftId: 'batik-1',
//     artisanId: '1',
//   },
// };

export function ArtistProfile() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [crafts, setCrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtist() {
      if (!id) {
        navigate('/artists')
        return;
      }
      try {
        const data = await getArtistById(id);
        setArtist(data.data?.artist || null);
      } catch (error) {
        console.error('Failed to load artist:', error);
        setArtist(null);
      }
      setLoading(false);
    }
    loadArtist();
  }, [id]);

  // Use fallback data if artist is not loaded yet
  const displayArtist = artist;
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite font-body">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-forest text-xl">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!displayArtist) {
    return (
      <div className="min-h-screen bg-offwhite font-body">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-forest text-xl font-bold mb-2">Artist not found</div>
            <Button
              onClick={() => navigate('/artists')}
              className="text-terracotta hover:underline">
              Back to Artists
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleBookWorkshop = () => {
    navigate(`/book?craft=${displayArtist.craftId}&artisan=${displayArtist.artisanId}`);
  };
  const handleMessage = () => {
    navigate('/inbox');
  };
  return (
    <div className="min-h-screen bg-offwhite font-body">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-[400px] bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="profile-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse">

                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#profile-pattern)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest to-transparent" />

        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-terracotta shadow-xl flex items-center justify-center text-white text-4xl font-display font-bold">
              {displayArtist.initials}
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-2 text-mustard font-bold uppercase tracking-wider text-sm">
                <Star className="w-4 h-4 fill-current" />
                Master Artisan
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-display mb-2">
                {displayArtist.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-lg">
                <span className="font-semibold">{displayArtist.craft}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {displayArtist.location}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="gap-2"
                onClick={handleBookWorkshop}>

                <Calendar className="w-4 h-4" /> Book Workshop
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-forest gap-2"
                onClick={handleMessage}>

                <MessageCircle className="w-4 h-4" /> Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Bio & Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-3xl font-bold text-forest mb-6 font-display">
                About the Artisan
              </h2>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {displayArtist.bio}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {displayArtist.specialties.map((tag: string) =>
                  <span
                    key={tag}
                    className="px-4 py-2 bg-offwhite rounded-lg text-sm font-semibold text-forest-dark">

                      {tag}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Available Crafts */}
            <section>
              <h2 className="text-3xl font-bold text-forest mb-6 font-display">
                Available Crafts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(crafts.length > 0 ? crafts : [{ id: 1 }, { id: 2 }, { id: 3 }]).map((item) =>
                <div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">

                    <div className="h-48 bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <span className="font-display text-4xl opacity-20">
                          {item}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 font-display">
                        Hand-turned Lacquer Vase
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Traditional red and yellow geometric patterns.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-terracotta text-lg">
                          $45.00
                        </span>
                        <button className="text-sm font-bold text-forest hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <ReviewSection context="artisan" artisanName={displayArtist.name} />
          </div>

          {/* Right Column: Schedule & Location */}
          <div className="space-y-8">
            {/* Workshop Schedule */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-forest mb-4 font-display flex items-center gap-2">
                <Clock className="w-5 h-5" /> Workshop Availability
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Book a hands-on session to learn the craft directly from{' '}
                {displayArtist.name.split(' ')[0]}.
              </p>

              <div className="space-y-3">
                {displayArtist.schedule.map((day: { day: string; slots: string[] }) =>
                <div
                  key={day.day}
                  className="flex items-start border-b border-gray-50 pb-3 last:border-0">

                    <span className="w-12 font-bold text-gray-900 pt-1">
                      {day.day}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map((slot: string) =>
                    <span
                      key={slot}
                      className="px-2 py-1 bg-green-50 text-forest-dark text-xs font-bold rounded">

                          {slot}
                        </span>
                    )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <Button className="w-full" onClick={handleBookWorkshop}>
                  Request Booking
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleMessage}>

                  <MessageCircle className="w-4 h-4" /> Send Message
                </Button>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-forest mb-4 font-display flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Location
              </h3>
              <div className="aspect-square bg-blue-50 rounded-xl mb-4 relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
                  <path d="M20 20 L80 20 L80 80 L20 80 Z" fill="#E5E7EB" />
                  <circle cx="50" cy="50" r="4" fill="#C65D3B" />
                  <circle cx="50" cy="50" r="10" fill="#C65D3B" opacity="0.2" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                124 Temple Road, Pilimathalawa, Kandy
              </p>
              <a
                href="#"
                className="text-xs text-terracotta font-bold mt-2 inline-block hover:underline">

                Get Directions
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>);

}