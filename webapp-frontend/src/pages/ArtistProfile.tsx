import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Clock, Star, MessageCircle, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { ReviewSection } from '../components/ReviewSection';
import { artistsApi, chatApi, handleApiError } from '../config/api';
import { getStoredUser } from '../lib/auth';

type ArtistProfileData = {
  id: string;
  userId?: string;
  name: string;
  craft: string;
  location: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviews: number;
  initials: string;
  schedule: { day: string; slots: string[] }[];
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'AR';

const buildSchedule = (availability?: Record<string, { morning?: boolean; afternoon?: boolean; evening?: boolean }>) => {
  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const slotMap = {
    morning: '10:00 AM',
    afternoon: '2:00 PM',
    evening: '5:00 PM',
  } as const;

  return dayOrder.map((day) => {
    const config = availability?.[day] || {};
    const slots = (Object.keys(slotMap) as (keyof typeof slotMap)[])
      .filter((key) => Boolean(config[key]))
      .map((key) => slotMap[key]);
    return { day, slots };
  });
};

export function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const [artist, setArtist] = useState<ArtistProfileData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArtist = async () => {
      if (!id) return;

      try {
        setError('');
        setIsLoading(true);
        const response = await artistsApi.getById(id);
        const item = response.data.data;
        setArtist({
          id: item._id,
          userId: item.userId,
          name: item.username || item.email || 'Artist',
          craft: item.craftType || 'Artist',
          location: item.region || item.location?.address || 'Sri Lanka',
          bio:
            item.bio ||
            item.description ||
            'This artist has not added a public bio yet.',
          specialties: item.specialties?.length ? item.specialties : ['Traditional Craft'],
          rating: item.rating || 0,
          reviews: item.totalReviews || 0,
          initials: getInitials(item.username || item.email || 'Artist'),
          schedule: buildSchedule(item.availability),
        });
      } catch (err) {
        setError(handleApiError(err).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtist();
  }, [id]);

  const visibleSchedule = useMemo(
    () => artist?.schedule.filter((day) => day.slots.length > 0) || [],
    [artist]
  );

  const handleBookWorkshop = () => {
    if (!artist) return;
    navigate(`/book?artisan=${artist.id}`);
  };

  const handleMessage = async () => {
    if (!artist) return;

    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'tourist') {
      setError('Only tourist accounts can start a new conversation with an artist.');
      return;
    }

    try {
      await chatApi.createConversation({
        artistUserId: artist.userId,
        artistProfileId: artist.id,
      });
      navigate(`/tourist/inbox?artistProfileId=${artist.id}${artist.userId ? `&artistUserId=${artist.userId}` : ''}`);
    } catch (err) {
      setError(handleApiError(err).message);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite font-body">
      <Navbar />

      {isLoading && <p className="pt-32 text-center text-gray-500">Loading artist...</p>}
      {error && <p className="pt-32 text-center text-red-500">{error}</p>}

      {artist && (
        <>
          <div className="relative h-[400px] bg-forest overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="profile-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
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
                  {artist.initials}
                </div>
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-2 mb-2 text-mustard font-bold uppercase tracking-wider text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    Artisan
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black font-display mb-2">{artist.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/80 text-lg">
                    <span className="font-semibold">{artist.craft}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {artist.location}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="gap-2" onClick={handleBookWorkshop}>
                    <Calendar className="w-4 h-4" /> Book Workshop
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-forest gap-2"
                    onClick={handleMessage}
                  >
                    <MessageCircle className="w-4 h-4" /> Message
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <h2 className="text-3xl font-bold text-forest mb-6 font-display">About the Artisan</h2>
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-600 leading-relaxed text-lg">{artist.bio}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {artist.specialties.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-offwhite rounded-lg text-sm font-semibold text-forest-dark"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                <ReviewSection context="artisan" artisanName={artist.name} />
              </div>

              <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-forest mb-4 font-display flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Workshop Availability
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Book a hands-on session to learn the craft directly from {artist.name.split(' ')[0]}.
                  </p>

                  <div className="space-y-3">
                    {visibleSchedule.length ? (
                      visibleSchedule.map((day) => (
                        <div key={day.day} className="flex items-start border-b border-gray-50 pb-3 last:border-0">
                          <span className="w-12 font-bold text-gray-900 pt-1">{day.day}</span>
                          <div className="flex flex-wrap gap-2">
                            {day.slots.map((slot) => (
                              <span
                                key={slot}
                                className="px-2 py-1 bg-green-50 text-forest-dark text-xs font-bold rounded"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No availability published yet.</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-6">
                    <Button className="w-full" onClick={handleBookWorkshop}>
                      Request Booking
                    </Button>
                    <Button variant="outline" className="w-full gap-2" onClick={handleMessage}>
                      <MessageCircle className="w-4 h-4" /> Send Message
                    </Button>
                  </div>
                </div>

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
                  <p className="text-sm text-gray-600 font-medium">{artist.location}</p>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
      <Footer />
    </div>
  );
}
