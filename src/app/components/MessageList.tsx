import { useEffect, useRef } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../App';

interface MessageListProps {
  messages: Message[];
  currentUserAvatar: string;
  isZoomMode?: boolean;
}

export function MessageList({ messages, currentUserAvatar, isZoomMode = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDateSeparatorText = (date: Date): string => {
    const now = new Date();
    const messageDate = new Date(date);
    
    // Reset hours to compare just the date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    
    const diffTime = today.getTime() - msgDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1) return `${diffDays} days ago`;
    
    // Future date (shouldn't happen normally)
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const shouldShowDateSeparator = (currentMessage: Message, previousMessage: Message | undefined): boolean => {
    if (!previousMessage) return true; // Show for first message
    
    const currentDate = new Date(currentMessage.timestamp);
    const previousDate = new Date(previousMessage.timestamp);
    
    // Check if dates are on different days
    return currentDate.toDateString() !== previousDate.toDateString();
  };

  const getStatusIcon = (status: Message['status'], isSent: boolean) => {
    if (!isSent) return null;

    switch (status) {
      case 'sent':
        return <Check size={14} className="text-zinc-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-zinc-400" />;
      case 'seen':
        return <CheckCheck size={14} className="text-blue-500" />;
    }
  };

  return (
    <div className={`h-full overflow-y-auto px-4 flex flex-col gap-1 ${isZoomMode ? 'justify-center py-0' : 'py-4'}`}>
      {messages.map((message, index) => {
        const previousMessage = index > 0 ? messages[index - 1] : undefined;
        const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
        
        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <div className="bg-zinc-200/80 text-zinc-700 text-xs px-3 py-1 rounded-full">
                  {getDateSeparatorText(message.timestamp)}
                </div>
              </div>
            )}
            
            <div
              className={`flex items-end gap-2 ${
                message.isSent ? 'justify-end' : 'justify-start'
              } mb-0.5`}
            >
              {!message.isSent && (
                <div className="w-6 h-6 flex-shrink-0">
                  <img
                    src={currentUserAvatar}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[70%] ${
                  message.isSent ? 'order-1' : 'order-2'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-3xl ${
                    message.isSent
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-zinc-200 text-zinc-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm break-words">{message.text}</p>
                </div>
                
                <div
                  className={`flex items-center gap-1 mt-0.5 px-2 ${
                    message.isSent ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span className="text-xs text-zinc-500">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.isSent && getStatusIcon(message.status, message.isSent)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}