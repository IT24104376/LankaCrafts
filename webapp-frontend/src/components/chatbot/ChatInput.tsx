import { useRef, useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
interface ChatInputProps {
  onSend: (message: string) => void;
}
export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
      inputRef.current?.focus();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
        <Paperclip className="w-5 h-5" />
      </button>

      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the website..."
          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all" />

        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
          <Smile className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className="p-2.5 bg-forest text-white rounded-full hover:bg-forest-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95">

        <Send className="w-4 h-4" />
      </button>
    </div>);

}
