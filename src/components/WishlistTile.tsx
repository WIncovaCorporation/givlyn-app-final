import { Gift, Lock, Users, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistTileProps {
  id: string;
  name: string;
  itemCount: number;
  coverImage?: string | null;
  accessType?: string;
  onClick?: () => void;
  onAddClick?: () => void;
}

const defaultCovers = [
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop"
];

export function WishlistTile({ 
  id, 
  name, 
  itemCount, 
  coverImage, 
  accessType = "personal",
  onClick 
}: WishlistTileProps) {
  const hashIndex = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % defaultCovers.length;
  const backgroundImage = coverImage || defaultCovers[hashIndex];

  const getAccessIcon = () => {
    switch (accessType) {
      case 'shared':
        return <Share2 className="w-3 h-3" />;
      case 'group':
        return <Users className="w-3 h-3" />;
      default:
        return <Lock className="w-3 h-3" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className="group w-full text-left focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:ring-offset-2 rounded-xl"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
        <img
          src={backgroundImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultCovers[0];
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
          <Gift className="w-5 h-5 text-gray-700" />
        </div>

        <div className="absolute top-3 right-3 min-w-[28px] h-7 bg-[#1ABC9C] text-white rounded-full flex items-center justify-center px-2 text-sm font-semibold shadow-lg">
          {itemCount}
        </div>

        {accessType !== 'personal' && (
          <div className="absolute top-3 left-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            {getAccessIcon()}
          </div>
        )}
      </div>

      <h3 className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-[#1ABC9C] transition-colors">
        {name}
      </h3>
    </button>
  );
}

export function AddWishlistTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:ring-offset-2 rounded-xl"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-2 border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center group-hover:border-[#1ABC9C] group-hover:bg-[#1ABC9C]/5 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-[#1ABC9C] transition-colors">
          <span className="text-2xl text-gray-400 group-hover:text-white transition-colors">+</span>
        </div>
      </div>
      <h3 className="font-medium text-gray-500 text-sm group-hover:text-[#1ABC9C] transition-colors">
        Nueva lista
      </h3>
    </button>
  );
}
