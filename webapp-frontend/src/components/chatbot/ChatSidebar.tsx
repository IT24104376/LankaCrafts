import React from 'react';
import { Search, MessageSquare, MapPin, Clock } from 'lucide-react';
export function ChatSidebar() {
  const recentChats = [
  {
    id: 1,
    title: 'Pottery in Kandy',
    time: '2h ago'
  },
  {
    id: 2,
    title: 'Batik Workshops',
    time: '1d ago'
  },
  {
    id: 3,
    title: 'Galle Fort Guide',
    time: '3d ago'
  }];

  const savedTrips = [
  {
    id: 1,
    title: 'Kandy Craft Tour',
    items: 4
  },
  {
    id: 2,
    title: 'Southern Coast',
    items: 2
  }];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full hidden md:flex">
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-forest" />

        </div>
      </div>

      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Recent
          </h3>
          <div className="space-y-1">
            {recentChats.map((chat) =>
            <button
              key={chat.id}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-left group">

                <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-forest" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {chat.title}
                  </p>
                  <p className="text-[10px] text-gray-400">{chat.time}</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Saved Trips */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Saved Trips
          </h3>
          <div className="space-y-1">
            {savedTrips.map((trip) =>
            <button
              key={trip.id}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-left group">

                <MapPin className="w-4 h-4 text-terracotta group-hover:text-terracotta-dark" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {trip.title}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {trip.items} saved locations
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>);

}