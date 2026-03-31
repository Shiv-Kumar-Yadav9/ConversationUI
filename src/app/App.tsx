import { useState, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
  status: 'sent' | 'delivered' | 'seen';
}

export interface User {
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface ChatMessage {
  Sender: number;
  Message: string;
  Sent: number;
  MessageDeltaTime: number;
  Delay: number;
  Active: number;
  Zoom: number;
  ZoomLag: number;
}

interface Conversation {
  Name: string;
  Photo: string;
  BackgroundPhoto: string;
  ZoomBackground: string;
  StartDateAndTime: string;
  Chat: ChatMessage[];
}

interface ChatData {
  conversation: Conversation[];
}

const getChatData = (): ChatData => {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");

  if (data) {
    try {
      return JSON.parse(decodeURIComponent(data));
    } catch (e) {
      console.error("Invalid JSON", e);
    }
  }

  return { conversation: [] };
};

function App() {
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [background, setBackground] = useState<string>('default');
  const [zoomBackground, setZoomBackground] = useState<string>('#000000');
  const [activeMinutesAgo, setActiveMinutesAgo] = useState(0);
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [zoomMessageCount, setZoomMessageCount] = useState(0);
  
  const SPEED = Number(new URLSearchParams(window.location.search).get("speed")) || 1;

  const chatData = getChatData();
  
  useEffect(() => {
  (window as any).__CHAT_READY__ = true;

  processConversations().then(() => {
    (window as any).__CHAT_DONE__ = true;
  });
  }, []);

  const processConversations = async () => {
    for (let i = 0; i < chatData.conversation.length; i++) {
      await processConversation(chatData.conversation[i]);
      
      // Wait 3 seconds before next conversation
      if (i < chatData.conversation.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000 / SPEED));
        setCurrentConversationIndex(i + 1);
      }
    }
  };

  const processConversation = async (conversation: Conversation) => {
    // Reset state for new conversation
    setMessages([]);
    setIsZoomMode(false);
    setZoomMessageCount(0);

    // Set user info
    const user: User = {
      name: conversation.Name,
      username: conversation.Name.toLowerCase().replace(' ', ''),
      avatar: conversation.Photo,
      isOnline: true,
    };
    setCurrentUser(user);

    // Set background
    setBackground(conversation.BackgroundPhoto || 'default');
    setZoomBackground(conversation.ZoomBackground || '#000000');

    const startTime = new Date(conversation.StartDateAndTime);

    // Process each message
    for (let i = 0; i < conversation.Chat.length; i++) {
      const chatMsg = conversation.Chat[i];

      // Wait for delay
      await new Promise(resolve => setTimeout(resolve, chatMsg.Delay / SPEED));

      // Update active status
      if (chatMsg.Active === 0) {
        setCurrentUser(prev => prev ? { ...prev, isOnline: true } : null);
        setActiveMinutesAgo(0);
        
        // When user becomes active (online), mark all previous sent messages as seen (blue tick)
        setMessages(prev => 
          prev.map(msg => 
            msg.isSent ? { ...msg, status: 'seen' } : msg
          )
        );
      } else {
        setCurrentUser(prev => prev ? { ...prev, isOnline: true } : null);
        setActiveMinutesAgo(chatMsg.Active);
      }

      // Add message
      const messageTimestamp = new Date(startTime.getTime() + chatMsg.MessageDeltaTime);
      const newMessage: Message = {
        id: `${i}`,
        text: chatMsg.Message,
        timestamp: messageTimestamp,
        isSent: chatMsg.Sender === 0,
        status: getStatusFromSent(chatMsg.Sent),
      };

      setMessages(prev => [...prev, newMessage]);

      // Handle zoom
      if (chatMsg.Zoom > 0) {
        await new Promise(resolve => setTimeout(resolve, chatMsg.ZoomLag / SPEED));
        setIsZoomMode(true);
        setZoomMessageCount(chatMsg.Zoom);
      }
    }
  };

  const getStatusFromSent = (sent: number): 'sent' | 'delivered' | 'seen' => {
    switch (sent) {
      case 1:
        return 'sent';
      case 2:
        return 'delivered';
      case 3:
        return 'seen';
      default:
        return 'sent';
    }
  };

  const getBackgroundStyle = () => {
    // If BackgroundPhoto is a URL, use it as background image
    if (background.startsWith('http')) {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    // Otherwise use predefined themes
    switch (background) {
      case 'gradient1':
        return 'bg-gradient-to-br from-purple-50 to-pink-50';
      case 'gradient2':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50';
      case 'gradient3':
        return 'bg-gradient-to-br from-orange-50 to-yellow-50';
      case 'dark':
        return 'bg-zinc-900';
      case 'pattern':
        return 'bg-zinc-100';
      default:
        return 'bg-white';
    }
  };

  const displayMessages = isZoomMode && zoomMessageCount > 0
    ? messages.slice(-zoomMessageCount)
    : messages;

  const backgroundClass = typeof getBackgroundStyle() === 'string' 
    ? getBackgroundStyle() 
    : '';
  const backgroundInlineStyle = typeof getBackgroundStyle() === 'object' 
    ? getBackgroundStyle() as React.CSSProperties
    : undefined;

  const handleSendMessage = (text: string) => {
    // Message sending functionality (disabled in this demo)
    console.log('Message sent:', text);
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-50">
      {/* 9:16 aspect ratio container */}
      <div 
        className="relative bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '450px',
          height: '100vh',
          maxHeight: '800px',
          aspectRatio: '9 / 16',
        }}
      >
        {!isZoomMode && (
          <ChatHeader
            user={currentUser}
            activeMinutesAgo={activeMinutesAgo}
          />
        )}
        
        {/* Zoom mode: Add black bars at top and bottom */}
        {isZoomMode ? (
          <div className="flex-1 flex flex-col" style={{ backgroundColor: zoomBackground }}>
            {/* Top bar */}
            <div className="flex-1" style={{ backgroundColor: zoomBackground }}></div>
            
            {/* Messages container */}
            <div 
              className={`${backgroundClass}`}
              style={backgroundInlineStyle}
            >
              <MessageList 
                messages={displayMessages} 
                currentUserAvatar={currentUser.avatar}
                isZoomMode={isZoomMode}
              />
            </div>
            
            {/* Bottom bar */}
            <div className="flex-1" style={{ backgroundColor: zoomBackground }}></div>
          </div>
        ) : (
          <div 
            className={`flex-1 overflow-hidden ${backgroundClass}`}
            style={backgroundInlineStyle}
          >
            <MessageList 
              messages={displayMessages} 
              currentUserAvatar={currentUser.avatar}
              isZoomMode={isZoomMode}
            />
          </div>
        )}
        
        {!isZoomMode && (
          <MessageInput onSendMessage={handleSendMessage} />
        )}
      </div>
    </div>
  );
}

export default App;