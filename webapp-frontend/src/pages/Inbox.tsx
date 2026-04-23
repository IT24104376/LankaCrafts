import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArtistInboxPanel } from '../components/inbox/ArtistInboxPanel';
import { Navbar } from '../components/Navbar';
import { TouristInboxPanel } from '../components/inbox/TouristInboxPanel';

export function Inbox() {
  const { artist, tourist, loading } = useAuth();

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#FAF6F0' }}>
      <Navbar />

      <div className="pt-16 h-screen flex flex-col">
        <div
          className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 flex gap-0 overflow-hidden"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              Loading inbox...
            </div>
          ) : artist ? (
            <ArtistInboxPanel />
          ) : tourist ? (
            <TouristInboxPanel />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
              Sign in to access your inbox.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
