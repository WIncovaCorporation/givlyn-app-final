import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileHeaderProps {
  name: string;
  email?: string;
  avatarUrl?: string | null;
  wishCount: number;
  listCount: number;
  friendCount?: number;
}

export function UserProfileHeader({
  name,
  email,
  avatarUrl,
  wishCount,
  listCount,
  friendCount = 0
}: UserProfileHeaderProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-6 py-8">
      <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
        <AvatarImage src={avatarUrl || undefined} alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] text-white text-2xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900">{wishCount}</span>
            <span className="text-gray-500">deseos</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900">{listCount}</span>
            <span className="text-gray-500">listas</span>
          </div>

          {friendCount > 0 && (
            <button className="flex items-center gap-1.5 text-[#1ABC9C] hover:text-[#16A085] transition-colors">
              <Users className="w-4 h-4" />
              <span className="font-medium">amigos</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
