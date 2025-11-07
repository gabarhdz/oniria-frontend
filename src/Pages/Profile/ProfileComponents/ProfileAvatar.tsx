// src/Pages/Profile/ProfileComponents/ProfileAvatar.tsx
import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  description?: string;
  profile_pic_url?: string;
  is_psychologist: boolean;
  date_joined?: string;
}

interface ProfileAvatarProps {
  size: 'small' | 'medium' | 'large';
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
  const [imageError, setImageError] = useState(false);

  // Definir tamaños según el prop
  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-28 h-28',
    large: 'w-32 h-32'
  }[size];

  const textSize = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  }[size];

  const iconSize = {
    small: 'w-6 h-6',
    medium: 'w-7 h-7',
    large: 'w-8 h-8'
  }[size];

  // Prioridad de imagen: preview local > base64 del servidor > iniciales
  let imageUrl = previewUrl;
  if (!imageUrl && user?.profile_pic_url && !imageError) {
    imageUrl = user.profile_pic_url;
  }

  // Usar la función de iniciales proporcionada o la local
  const getInitials = getUserInitialsProp || getUserInitials;

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageError = () => {
    console.warn('Error loading profile image');
    setImageError(true);
  };

  return (
    <div className={`relative ${sizeClasses} group`}>
      {/* Avatar principal */}
      <div className={`${sizeClasses} rounded-full overflow-hidden bg-gradient-to-br from-[#9675bc]/40 via-[#f1b3be]/30 to-[#ffe0db]/20 border-4 border-[#ffe0db]/20 shadow-2xl flex items-center justify-center relative transition-all duration-500 group-hover:scale-105 group-hover:shadow-[#f1b3be]/50`}>
        
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={`Avatar de ${user?.username || 'Usuario'}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <span className={`text-[#ffe0db] font-bold ${textSize} select-none`}>
            {user?.username ? getInitials(user.username) : '??'}
          </span>
        )}
        
        {/* Overlay de edición */}
        {editable && isEditing && !viewOnly && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={handleEditClick}
          >
            <Camera className={`${iconSize} text-[#ffe0db]`} />
          </div>
        )}
      </div>

      {/* Indicador de estado (online) */}
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#ffe0db] flex items-center justify-center">
        <div className="w-3 h-3 bg-[#ffe0db] rounded-full animate-pulse"></div>
      </div>

      {/* Decoraciones flotantes */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#f1b3be] to-[#9675bc] rounded-full opacity-60 animate-pulse"></div>
      <div 
        className="absolute -bottom-1 -left-3 w-4 h-4 bg-gradient-to-br from-[#ffe0db] to-[#f1b3be] rounded-full opacity-40 animate-bounce" 
        style={{animationDelay: '0.5s'}}
      ></div>
    </div>
  );
};

export default ProfileAvatar;


