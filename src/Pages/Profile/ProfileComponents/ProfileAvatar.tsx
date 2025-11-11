// src/Pages/Profile/ProfileComponents/ProfileAvatar.tsx
import React from 'react';
import { Camera, User as UserIcon } from 'lucide-react';
import { useBase64Image } from '../../../hooks/useBase64Image';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  description?: string;
  profile_pic?: string;
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

  // Determinar qué imagen usar
  // Prioridad: 1) Preview local, 2) profile_pic_url del usuario, 3) profile_pic del usuario
  const imageToUse = previewUrl || user?.profile_pic_url || user?.profile_pic || null;
  
  // Usar el hook para procesar la imagen
  const { imageUrl, isLoading, hasError } = useBase64Image(imageToUse, {
    fallbackInitials: user?.username ? (getUserInitialsProp || getUserInitials)(user.username) : 'NA'
  });

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${sizeClasses} group flex-shrink-0`}>
      {/* Avatar principal */}
      <div className={`${sizeClasses} rounded-full overflow-hidden bg-gradient-to-br from-[#9675bc]/40 via-[#f1b3be]/30 to-[#ffe0db]/20 border-4 border-[#ffe0db]/20 shadow-2xl flex items-center justify-center relative transition-all duration-500 group-hover:scale-105 group-hover:shadow-[#f1b3be]/50`}>
        
        {isLoading ? (
          // Loader mientras carga
          <div className="absolute inset-0 flex items-center justify-center bg-[#9675bc]/20 animate-pulse">
            <UserIcon className="w-8 h-8 text-[#ffe0db]/50" />
          </div>
        ) : imageUrl && !hasError ? (
          // Mostrar imagen
          <img
            src={imageUrl}
            alt={`Avatar de ${user?.username || 'Usuario'}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onError={(e) => {
              console.error('Error loading avatar image');
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          // Fallback: mostrar initials o placeholder
          <span className={`text-[#ffe0db] font-bold ${textSize} select-none`}>
            {user?.username ? (getUserInitialsProp || getUserInitials)(user.username) : '??'}
          </span>
        )}
        
        {/* Overlay de edición */}
        {editable && isEditing && !viewOnly && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
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