import React, { useRef, useState } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }

    onSend(input);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
      <button className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
        <Paperclip className="h-5 w-5" />
      </button>

      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about bookings, artists, workshops..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm transition-all focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
        />

        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
          <Smile className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className="rounded-full bg-forest p-2.5 text-white shadow-sm transition-all hover:bg-forest-dark hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
