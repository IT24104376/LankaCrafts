import { MapPin, MessageSquare, Search } from 'lucide-react';

export function ChatSidebar() {
  const recentChats = [
    {
      id: 1,
      title: 'How to book a workshop',
      time: '2h ago'
    },
    {
      id: 2,
      title: 'Batik workshop ideas',
      time: '1d ago'
    },
    {
      id: 3,
      title: 'How to save favorites',
      time: '3d ago'
    }
  ];

  const savedTrips = [
    {
      id: 1,
      title: 'Kandy craft picks',
      items: 4
    },
    {
      id: 2,
      title: 'Beginner workshops',
      items: 2
    }
  ];

  return (
    <div className="hidden h-full w-64 flex-col border-r border-gray-200 bg-gray-50 md:flex">
      <div className="border-b border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-forest focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Recent
          </h3>
          <div className="space-y-1">
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                className="group w-full rounded-lg p-2 text-left transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-gray-400 group-hover:text-forest" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">{chat.title}</p>
                    <p className="text-[10px] text-gray-400">{chat.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Saved
          </h3>
          <div className="space-y-1">
            {savedTrips.map((trip) => (
              <button
                key={trip.id}
                className="group w-full rounded-lg p-2 text-left transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-terracotta group-hover:text-terracotta-dark" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">{trip.title}</p>
                    <p className="text-[10px] text-gray-400">{trip.items} saved workshops</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
