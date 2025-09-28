import React from 'react';
import { Camera } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  description?: string;
  profile_pic?: string;
  is_psychologist: boolean;
  date_joined?: string;
}

interface ProfileAvatarProps {
  size: 'small' | 'large';
  editable?: boolean;
  user?: UserProfile | null;
  previewUrl?: string | null;
  isEditing?: boolean;
  viewOnly?: boolean;
  onEditClick?: () => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  getUserInitials?: (username: string) => string;
}

const getUserInitials = (username: string): string => {
  return username.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
};

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  size, 
  editable = false,
  user,
  previewUrl,
  isEditing = false,
  viewOnly = false,
  onEditClick,
  fileInputRef,
  getUserInitials: getUserInitialsProp
}) => {
  const sizeClasses = size === 'small' ? 'w-20 h-20' : 'w-32 h-32';
  const textSize = size === 'small' ? 'text-lg' : 'text-3xl';

  const imageUrl = previewUrl || user?.profile_pic;

  // Usar la función pasada como prop o la función local
  const getInitials = getUserInitialsProp || getUserInitials;

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${sizeClasses} group`}>
      <div className={`${sizeClasses} rounded-full overflow-hidden bg-gradient-to-br from-[#9675bc]/40 via-[#f1b3be]/30 to-[#ffe0db]/20 border-4 border-[#ffe0db]/20 shadow-2xl flex items-center justify-center relative transition-all duration-500 group-hover:scale-105 group-hover:shadow-[#f1b3be]/50`}>
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={`Avatar de ${user?.username || 'Usuario'}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const nextSibling = (e.target as HTMLImageElement).nextElementSibling;
              if (nextSibling) {
                nextSibling.classList.remove('hidden');
              }
            }}
          />
        ) : (
          <span className={`text-[#ffe0db] font-bold ${textSize} select-none`}>
            {user?.username ? getInitials(user.username) : '??'}
          </span>
        )}
        
        <div className={`text-[#ffe0db] font-bold ${textSize} select-none ${imageUrl ? 'hidden' : ''}`}>
          {user?.username ? getInitials(user.username) : '??'}
        </div>
        
        {editable && isEditing && !viewOnly && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={handleEditClick}
          >
            <Camera className="w-8 h-8 text-[#ffe0db]" />
          </div>
        )}
      </div>

      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#ffe0db] flex items-center justify-center">
        <div className="w-3 h-3 bg-[#ffe0db] rounded-full animate-pulse"></div>
      </div>

      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#f1b3be] to-[#9675bc] rounded-full opacity-60 animate-pulse"></div>
      <div 
        className="absolute -bottom-1 -left-3 w-4 h-4 bg-gradient-to-br from-[#ffe0db] to-[#f1b3be] rounded-full opacity-40 animate-bounce" 
        style={{animationDelay: '0.5s'}}
      ></div>
    </div>
  );
};