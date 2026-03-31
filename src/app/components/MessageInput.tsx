import { useState } from 'react';
import { Send, Smile, Image, Mic, Camera, Plus } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white border-t border-zinc-200 px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600 transition-colors"
          title="Add more"
        >
          <Plus size={24} />
        </button>
        
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600 transition-colors"
          title="Camera"
        >
          <Camera size={24} />
        </button>
        
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600 transition-colors"
          title="Photo & Video Library"
        >
          <Image size={24} />
        </button>
        
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600 transition-colors"
          title="Stickers"
        >
          <Smile size={24} />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-zinc-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {message.trim() ? (
          <button
            type="submit"
            className="text-blue-500 hover:text-blue-600 transition-colors font-semibold"
          >
            <Send size={24} className="fill-blue-500" />
          </button>
        ) : (
          <button
            type="button"
            className="text-blue-500 hover:text-blue-600 transition-colors"
            title="Voice message"
          >
            <Mic size={24} />
          </button>
        )}
      </form>
    </div>
  );
}