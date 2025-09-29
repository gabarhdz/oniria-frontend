import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Filter, 
  ChevronDown, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Star
} from 'lucide-react';
import type { User, FilterType, SortType, AvatarSize } from './types';

// Filter Dropdown Component con Portal - Responsivo
export const FilterDropdown: React.FC<{
  filterBy: FilterType;
  setFilterBy: (value: FilterType) => void;
  sortOrder: SortType;
  setSortOrder: (value: SortType) => void;
  currentUser?: User;
}> = ({ filterBy, setFilterBy, sortOrder, setSortOrder, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Cerrar dropdown al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Calcular posición del dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  const filterOptions = [
    { value: 'all', label: 'Todas las comunidades', icon: Users },
    { value: 'member', label: 'Soy miembro', icon: CheckCircle },
    { value: 'non-member', label: 'No soy miembro', icon: XCircle },
    { value: 'created-asc', label: 'Más antiguas primero', icon: Clock },
    { value: 'created-desc', label: 'Más recientes primero', icon: Clock },
    { value: 'members-asc', label: 'Menos miembros primero', icon: Users },
    { value: 'members-desc', label: 'Más miembros primero', icon: Users },
  ];

  const getActiveFilter = () => {
    if (filterBy === 'member') return filterOptions[1];
    if (filterBy === 'non-member') return filterOptions[2];
    if (sortOrder === 'created-asc') return filterOptions[3];
    if (sortOrder === 'created-desc') return filterOptions[4];
    if (sortOrder === 'members-asc') return filterOptions[5];
    if (sortOrder === 'members-desc') return filterOptions[6];
    return filterOptions[0];
  };

  const handleOptionClick = (option: typeof filterOptions[0]) => {
    if (option.value === 'member' || option.value === 'non-member') {
      setFilterBy(option.value as FilterType);
      setSortOrder('created-desc');
    } else if (option.value === 'all') {
      setFilterBy('all');
      setSortOrder('created-desc');
    } else {
      setFilterBy('all');
      setSortOrder(option.value as SortType);
    }
    setIsOpen(false);
  };

  const activeFilter = getActiveFilter();
  const IconComponent = activeFilter.icon;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-oniria_lightpink hover:bg-white/20 transition-all duration-300 min-w-[160px] sm:min-w-[200px] w-full sm:w-auto text-left"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Filter className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium truncate flex-1">{activeFilter.label}</span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown usando Portal - Responsivo */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999]">
          {/* Overlay para cerrar */}
          <div 
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown content */}
          <div 
            className="absolute bg-gradient-to-br from-white/98 to-white/95 backdrop-blur-xl rounded-xl border border-white/30 shadow-2xl overflow-hidden animate-dropdown-enter"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: Math.max(dropdownPosition.width, 200),
              zIndex: 99999
            }}
          >
            {filterOptions.map((option) => {
              const OptionIcon = option.icon;
              const isActive = activeFilter.value === option.value;
              const isDisabled = !currentUser && (option.value === 'member' || option.value === 'non-member');
              
              return (
                <button
                  key={option.value}
                  onClick={() => !isDisabled && handleOptionClick(option)}
                  disabled={isDisabled}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-left transition-all duration-200 text-xs sm:text-sm ${
                    isActive 
                      ? 'bg-gradient-to-r from-oniria_purple/20 to-oniria_pink/20 text-oniria_darkblue border-l-2 border-oniria_purple' 
                      : isDisabled
                      ? 'text-gray-400 cursor-not-allowed opacity-50'
                      : 'text-oniria_darkblue hover:bg-white/70 hover:text-oniria_purple'
                  }`}
                >
                  <OptionIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium flex-1 truncate">{option.label}</span>
                  {isActive && <div className="w-2 h-2 bg-oniria_purple rounded-full flex-shrink-0" />}
                  {isDisabled && <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:inline">(Login requerido)</span>}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Función auxiliar para obtener iniciales
export const getUserInitials = (username: string): string => {
  return username
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ProfileAvatar Component - Responsivo
export const ProfileAvatar: React.FC<{ 
  user: User; 
  size: AvatarSize; 
  showRing?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ user, size, showRing = false, onClick, className = "" }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: 'w-6 h-6 sm:w-8 sm:h-8',
    medium: 'w-8 h-8 sm:w-10 sm:h-10',
    large: 'w-12 h-12 sm:w-16 sm:h-16'
  }[size];

  const textSize = {
    small: 'text-xs',
    medium: 'text-xs sm:text-sm',
    large: 'text-sm sm:text-lg'
  }[size];

  const ringClasses = showRing ? 'ring-2 ring-oniria_purple/30' : '';

  const handleImageError = () => setImageError(true);

  const AvatarContent = () => (
    <div className={`${sizeClasses} ${ringClasses} rounded-full overflow-hidden bg-gradient-to-br from-oniria_purple/40 via-oniria_pink/30 to-oniria_lightpink/20 flex items-center justify-center relative ${className}`}>
      {user.profile_pic && !imageError ? (
        <img 
          src={user.profile_pic}
          alt={`Avatar de ${user.username}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className={`text-white font-semibold ${textSize} select-none`}>
          {getUserInitials(user.username)}
        </span>
      )}
      {/* Badge para psicólogo */}
      {user.is_psychologist && size === 'large' && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
          <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="transition-all duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-oniria_purple/50 rounded-full"
        title={`Ver perfil de ${user.username}`}
      >
        <AvatarContent />
      </button>
    );
  }

  return <AvatarContent />;
};