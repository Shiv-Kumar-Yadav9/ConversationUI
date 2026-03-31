import { X } from 'lucide-react';

interface BackgroundSelectorProps {
  currentBackground: string;
  onSelectBackground: (bg: string) => void;
  onClose: () => void;
}

export function BackgroundSelector({
  currentBackground,
  onSelectBackground,
  onClose,
}: BackgroundSelectorProps) {
  const backgrounds = [
    { id: 'default', name: 'Default', preview: 'bg-white' },
    { id: 'gradient1', name: 'Purple Pink', preview: 'bg-gradient-to-br from-purple-50 to-pink-50' },
    { id: 'gradient2', name: 'Blue Cyan', preview: 'bg-gradient-to-br from-blue-50 to-cyan-50' },
    { id: 'gradient3', name: 'Orange Yellow', preview: 'bg-gradient-to-br from-orange-50 to-yellow-50' },
    { id: 'dark', name: 'Dark', preview: 'bg-zinc-900' },
    { id: 'pattern', name: 'Pattern', preview: 'bg-zinc-100' },
  ];

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <h3 className="font-semibold text-lg">Chat Backgrounds</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => {
                  onSelectBackground(bg.id);
                  onClose();
                }}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  currentBackground === bg.id
                    ? 'border-blue-500 scale-95'
                    : 'border-zinc-200 hover:border-blue-300'
                }`}
              >
                <div className={`h-24 ${bg.preview}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    {bg.name}
                  </span>
                </div>
                {currentBackground === bg.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
