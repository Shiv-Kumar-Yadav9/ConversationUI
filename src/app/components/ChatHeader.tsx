import { Phone, Video, Info } from 'lucide-react';
import { User } from '../App';

interface ChatHeaderProps {
  user: User;
  activeMinutesAgo?: number;
}

export function ChatHeader({ user, activeMinutesAgo = 0 }: ChatHeaderProps) {
  const formatLastSeen = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Active just now';
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    return `Active ${Math.floor(diffHours / 24)}d ago`;
  };

  const getActiveStatus = () => {
    if (user.isOnline) {
      if (activeMinutesAgo === 0) {
        return 'Active now';
      } else {
        return `Active ${activeMinutesAgo}m ago`;
      }
    } else {
      return formatLastSeen(user.lastSeen);
    }
  };

  return (
    <div className="bg-white border-b border-zinc-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {user.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-zinc-900 truncate">{user.name}</h2>
            <p className="text-xs text-zinc-500">
              {getActiveStatus()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-blue-500 hover:text-blue-600 transition-colors">
            <Phone size={20} />
          </button>
          <button className="text-blue-500 hover:text-blue-600 transition-colors">
            <Video size={20} />
          </button>
          <button className="text-blue-500 hover:text-blue-600 transition-colors">
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}