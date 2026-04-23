import React from 'react';
import { Navbar } from '../components/Navbar';
import { TouristInboxPanel } from '../components/inbox/TouristInboxPanel';

export function Inbox() {
  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#FAF6F0' }}>
      <Navbar />

      <div className="pt-16 h-screen flex flex-col">
        <div
          className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 flex gap-0 overflow-hidden"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          <TouristInboxPanel />
        </div>
      </div>
    </div>
  );
}
