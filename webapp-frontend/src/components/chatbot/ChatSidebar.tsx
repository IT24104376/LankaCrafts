import React from 'react';
import { FolderOpen, MessageSquare, Search } from 'lucide-react';
import { CHAT_FAQS } from './chatFaq';

export function ChatSidebar() {
  const groupedFaqs = CHAT_FAQS.reduce<Record<string, number>>((groups, faq) => {
    groups[faq.category] = (groups[faq.category] || 0) + 1;
    return groups;
  }, {});

  return (
    <div className="hidden h-full w-64 flex-col border-r border-gray-200 bg-gray-50 md:flex">
      <div className="border-b border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Browse topics..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-forest focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Popular Questions
          </h3>
          <div className="space-y-1">
            {CHAT_FAQS.slice(0, 5).map((faq) => (
              <button
                key={faq.id}
                className="group w-full rounded-lg p-2 text-left transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-gray-400 group-hover:text-forest" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">{faq.question}</p>
                    <p className="text-[10px] text-gray-400">{faq.category}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Categories
          </h3>
          <div className="space-y-1">
            {Object.entries(groupedFaqs).map(([category, count]) => (
              <button
                key={category}
                className="group w-full rounded-lg p-2 text-left transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-4 w-4 text-terracotta group-hover:text-terracotta-dark" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">{category}</p>
                    <p className="text-[10px] text-gray-400">{count} FAQ entries</p>
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
