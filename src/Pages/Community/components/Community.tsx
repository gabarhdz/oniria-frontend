import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, MessageSquare, User, Calendar, ThumbsUp, ThumbsDown, Loader2, Edit2, Trash2, Camera, UserPlus, UserMinus, Reply, X, ArrowLeft, Send, Sparkles, Star, Heart, Eye, Zap, Crown, Filter, ChevronDown, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { DashboardFooter } from '../../Dashboard/components/DashboardFooter';

interface User {
  id: string;
  username: string;
  email: string;
  profile_image?: string;
  description?: string;
  is_psychologist?: boolean;
}

interface Community {
  id: string;
  name: string;
  description?: string;
  profile_image?: string;
  created_at: string;
  users: User[];
  owner: User;
}

interface Post {
  id: string;
  title: string;
  text: string;
  created_at: string;
  community: Community;
  parent_post?: Post;
  author: User;
  likes: User[];
  dislikes: User[];
}

// API Service usando Axios (MANTENIDO EXACTAMENTE IGUAL)
class ApiService {
  private baseURL = 'http://127.0.0.1:8000/api';
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
    });

    // Interceptor para agregar token automáticamente
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores de autenticación
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Communities API
  getCommunities = async (): Promise<Community[]> => {
    const response = await this.axiosInstance.get('/communities/');
    return response.data;
  };

  createCommunity = async (data: FormData): Promise<Community> => {
    const response = await this.axiosInstance.post('/communities/', data);
    return response.data;
  };

  updateCommunity = async (id: string, data: FormData): Promise<Community> => {
    const response = await this.axiosInstance.put(`/communities/specific/${id}/`, data);
    return response.data;
  };

  deleteCommunity = async (id: string): Promise<void> => {
    await this.axiosInstance.delete(`/communities/specific/${id}/`);
  };

  joinCommunity = async (id: string): Promise<void> => {
    await this.axiosInstance.patch(`/communities/join/${id}/`);
  };

  getSimilarCommunities = async (name: string): Promise<Community[]> => {
    const response = await this.axiosInstance.get(`/communities/${name}/`);
    return response.data;
  };

  // Posts API
  getPostsByCommunity = async (communityId: string): Promise<Post[]> => {
    const response = await this.axiosInstance.get(`/communities/post/community/${communityId}/`);
    return response.data;
  };

  createPost = async (data: { title: string; text: string; community: string; parent_post?: string }): Promise<void> => {
    await this.axiosInstance.post('/communities/post/', data);
  };

  updatePost = async (id: string, data: { title: string; text: string }): Promise<Post> => {
    const response = await this.axiosInstance.put(`/communities/post/${id}/`, data);
    return response.data;
  };

  deletePost = async (id: string): Promise<void> => {
    await this.axiosInstance.delete(`/communities/post/${id}/`);
  };

  likePost = async (postId: string): Promise<void> => {
    await this.axiosInstance.patch(`/communities/post/like/${postId}/`);
  };

  dislikePost = async (postId: string): Promise<void> => {
    await this.axiosInstance.patch(`/communities/post/dislike/${postId}/`);
  };
}

const api = new ApiService();

// Dummy Auth Context (MANTENIDO IGUAL)
const useAuth = () => {
  const userData = localStorage.getItem('user_data');
  let user: User | undefined = undefined;
  try {
    user = userData ? JSON.parse(userData) : undefined;
  } catch {
    user = undefined;
  }
  return { user };
};

// PANTALLA DE CARGA INICIAL - PANTALLA COMPLETA
const UniversalLoader: React.FC<{ message?: string }> = ({ message = 'Iniciando Noctiria...' }) => {
  const [loadingText, setLoadingText] = useState(message);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Bloquear scroll durante la carga inicial y forzar scroll al top
    const originalScrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    
    // Forzar scroll al top y bloquear scroll
    window.scrollTo(0, 0);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${originalScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const texts = [
      message,
      'Conectando con el reino de los sueños...',
      'Cargando comunidades oníricas...',
      'Preparando experiencia inmersiva...'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setLoadingText(texts[textIndex]);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    // Limpiar al desmontar el componente
    return () => {
      // Restaurar scroll y estilos originales
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = '';
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, originalScrollY);
      
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [message]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple relative overflow-hidden z-[99999]" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh'
    }}>
      {/* Enhanced background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          />
        ))}
        
        {/* Estrellas estáticas */}
        {Array.from({ length: 15 }, (_, i) => (
          <Star
            key={`star-${i}`}
            className="absolute text-oniria_lightpink/20 animate-pulse"
            style={{
              width: `${Math.random() * 12 + 8}px`,
              height: `${Math.random() * 12 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-8 relative z-10 px-4">
          {/* Logo container */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-oniria_purple via-oniria_pink to-oniria_lightpink rounded-full flex items-center justify-center shadow-xl">
              <MessageSquare className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
            
            {/* Rotating rings */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-full h-full rounded-full border border-oniria_pink/20 border-dashed" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-oniria_lightpink via-oniria_pink to-oniria_purple bg-clip-text text-transparent">
              Centro de Comunidades
            </h2>
            
            <div className="space-y-3">
              <p className="text-lg text-oniria_lightpink/90">{loadingText}</p>
              
              {/* Progress bar */}
              <div className="w-64 mx-auto">
                <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-oniria_purple via-oniria_pink to-oniria_lightpink rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-oniria_lightpink/60 mt-2">{Math.round(progress)}% completado</p>
              </div>
            </div>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-oniria_pink rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// ALERTA DE CARGA PARA ACCIONES - ESTILO MODAL COMPACTO
const ActionLoadingModal: React.FC<{ 
  isOpen: boolean; 
  message: string; 
}> = ({ isOpen, message }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Prevenir interacciones pero NO scroll (solo para esta modal)
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      {/* Partículas sutiles de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-float"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          />
        ))}
      </div>

      {/* Modal content - Más compacto y tipo alerta */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl text-center max-w-sm w-full relative overflow-hidden animate-modal-entrance">
        
        {/* Background gradient overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-oniria_purple/3 via-oniria_pink/3 to-oniria_lightpink/3 rounded-2xl" />
        
        <div className="relative z-10 space-y-4">
          {/* Logo más pequeño y simple */}
          <div className="relative mx-auto w-12 h-12">
            {/* Logo principal */}
            <div className="w-full h-full bg-gradient-to-br from-oniria_purple via-oniria_pink to-oniria_lightpink rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/img/Oniria.svg" 
                alt="NOCTIRIA Logo" 
                className="w-6 h-6 object-contain filter drop-shadow-sm animate-pulse" 
              />
            </div>
            
            {/* Solo un anillo giratorio */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-full h-full rounded-full border border-oniria_pink/30 border-dashed" />
            </div>
          </div>

          {/* Contenido compacto */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-oniria_purple via-oniria_pink to-oniria_lightpink bg-clip-text text-transparent">
              Noctiria
            </h3>
            
            <div className="space-y-1">
              <p className="text-sm text-oniria_darkblue font-medium">
                {message}{dots}
              </p>
              <p className="text-xs text-oniria_darkblue/60">
                Un momento por favor
              </p>
            </div>

            {/* Barra de progreso más delgada */}
            <div className="w-full max-w-xs mx-auto">
              <div className="w-full bg-oniria_purple/15 rounded-full h-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-oniria_purple via-oniria_pink to-oniria_lightpink rounded-full animate-loading-bar" />
              </div>
            </div>

            {/* Puntos de carga más pequeños */}
            <div className="flex justify-center space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          {/* Mensaje de proceso más discreto */}
          <div className="bg-gradient-to-r from-oniria_purple/5 via-oniria_pink/5 to-oniria_lightpink/5 rounded-lg p-2 border border-oniria_purple/10">
            <p className="text-xs text-oniria_darkblue/60 flex items-center justify-center space-x-1.5">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
              <span>Procesando...</span>
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// Enhanced Error Alert
const ErrorAlert: React.FC<{ 
  message: string; 
  onRetry?: () => void; 
  onClose: () => void 
}> = ({ message, onRetry, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-red-500/20 via-red-400/10 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30 shadow-2xl text-center max-w-md mx-4 relative overflow-hidden">
      
      <div className="relative z-10 space-y-6">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <span className="text-white text-2xl">⚠</span>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-oniria_lightpink">Error en Noctiria</h3>
          <p className="text-sm text-oniria_lightpink/80 leading-relaxed">{message}</p>
        </div>
        
        <div className="flex space-x-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              Reintentar
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-white/20 hover:bg-white/30 text-oniria_lightpink px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Confirmation Modal
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center max-w-md mx-4 relative overflow-hidden animate-modal-entrance">
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-oniria_lightpink">{title}</h3>
            <p className="text-sm text-oniria_lightpink/80 leading-relaxed">{message}</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium ${
                isDestructive 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                  : 'bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white'
              }`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white/20 hover:bg-white/30 text-oniria_lightpink px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Dropdown Component con Portal - SOLUCIÓN DEFINITIVA

import { createPortal } from 'react-dom';

const FilterDropdown: React.FC<{
  filterBy: string;
  setFilterBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
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
        top: rect.bottom + window.scrollY + 8, // 8px de margen
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
      setFilterBy(option.value);
      setSortOrder('created-desc');
    } else if (option.value === 'all') {
      setFilterBy('all');
      setSortOrder('created-desc');
    } else {
      setFilterBy('all');
      setSortOrder(option.value);
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
        className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-oniria_lightpink hover:bg-white/20 transition-all duration-300 min-w-[200px]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Filter className="w-4 h-4" />
        <IconComponent className="w-4 h-4" />
        <span className="text-sm font-medium">{activeFilter.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown usando Portal */}
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
              width: dropdownPosition.width,
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-oniria_purple/20 to-oniria_pink/20 text-oniria_darkblue border-l-2 border-oniria_purple' 
                      : isDisabled
                      ? 'text-gray-400 cursor-not-allowed opacity-50'
                      : 'text-oniria_darkblue hover:bg-white/70 hover:text-oniria_purple'
                  }`}
                >
                  <OptionIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1">{option.label}</span>
                  {isActive && <div className="w-2 h-2 bg-oniria_purple rounded-full flex-shrink-0" />}
                  {isDisabled && <span className="text-xs text-gray-400 flex-shrink-0">(Login requerido)</span>}
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

// Profile Avatar Component (Como en DashboardHeader)
const ProfileAvatar: React.FC<{ 
  user: User; 
  size: 'small' | 'medium' | 'large'; 
  showRing?: boolean 
}> = ({ user, size, showRing = false }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }[size];
  
  const textSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg'
  }[size];
  
  const ringClasses = showRing ? 'ring-2 ring-oniria_purple/30' : '';
  
  // Función para generar URL completa de la imagen de perfil
  const getProfileImageUrl = (profilePic?: string): string | null => {
    if (!profilePic) return null;
    
    // Si ya es una URL completa, la devolvemos tal como está
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
      return profilePic;
    }
    
    // Si es una ruta relativa, la construimos con el dominio del API
    const cleanPath = profilePic.startsWith('/') ? profilePic : `/${profilePic}`;
    return `http://127.0.0.1:8000${cleanPath}`;
  };
  
  // Función para obtener las iniciales del usuario
  const getUserInitials = (username: string): string => {
    return username.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const profileImageUrl = getProfileImageUrl(user.profile_image);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`${sizeClasses} ${ringClasses} rounded-full overflow-hidden bg-gradient-to-br from-oniria_purple/40 via-oniria_pink/30 to-oniria_lightpink/20 flex items-center justify-center relative`}>
      {profileImageUrl && !imageError ? (
        <img 
          src={profileImageUrl}
          alt={`Avatar de ${user.username}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className={`text-white font-semibold ${textSize} select-none`}>
          {getUserInitials(user.username)}
        </span>
      )}
    </div>
  );
};

// Members Modal Component
const MembersModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  community: Community;
}> = ({ isOpen, onClose, community }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-white/20 animate-modal-entrance mx-4">
        
        {/* Header */}
        <div className="p-6 border-b border-oniria_purple/20 bg-gradient-to-r from-oniria_purple/10 to-oniria_pink/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-oniria_purple" />
              <div>
                <h3 className="text-xl font-bold text-oniria_darkblue">Miembros de {community.name}</h3>
                <p className="text-sm text-oniria_darkblue/70">{community.users.length} miembros en total</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/50 hover:bg-white/70 text-oniria_darkblue transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {community.users.map((member, index) => (
              <div
                key={member.id}
                className={`flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/60 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProfileAvatar user={member} size="medium" showRing={member.id === community.owner?.id} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-oniria_darkblue truncate">{member.username}</h4>
                    {member.id === community.owner?.id && (
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-oniria_purple to-oniria_pink text-white text-xs px-2 py-1 rounded-lg">
                        <Crown className="w-3 h-3" />
                        <span>Propietario</span>
                      </div>
                    )}
                    {member.is_psychologist && (
                      <div className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-600 text-xs px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3" />
                        <span>Psicólogo</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-oniria_darkblue/70 truncate">{member.email}</p>
                  {member.description && (
                    <p className="text-xs text-oniria_darkblue/60 mt-1 truncate">{member.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-oniria_purple/20 bg-gradient-to-r from-oniria_purple/5 to-oniria_pink/5">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// COMMUNITY CARD CORREGIDA - MÁS ANCHA Y ACOMODANDO MEJOR EL TEXTO
const CommunityCard: React.FC<{ 
  community: Community; 
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onJoin?: () => void;
  onShowMembers?: () => void;
  currentUser?: User;
  index: number;
}> = ({ community, onClick, onEdit, onDelete, onJoin, onShowMembers, currentUser, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isMember = currentUser && community.users.some(user => user.id === currentUser.id);
  const isOwner = currentUser && community.owner && community.owner.id === currentUser.id;

  return (
    <div 
      className="group relative overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 h-[400px] w-full animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Enhanced glass border with particles - FONDO MÁS CLARO */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-oniria_purple/60 via-oniria_pink/50 to-oniria_lightpink/60 group-hover:from-oniria_purple/80 group-hover:via-oniria_pink/70 group-hover:to-oniria_lightpink/80 transition-all duration-500">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/40 via-white/35 to-white/30 backdrop-blur-xl shadow-inner flex flex-col relative overflow-hidden">
          
          {/* Floating particles inside card */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 3}s`,
                }}
              />
            ))}
            
            {/* Static stars */}
            {Array.from({ length: 4 }, (_, i) => (
              <Star
                key={`star-${i}`}
                className="absolute text-oniria_lightpink/30 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Content con altura fija */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center space-x-3 flex-shrink-0 mb-4">
          {community.profile_image ? (
            <div className="relative">
              <img src={community.profile_image} alt={community.name} className="w-14 h-14 rounded-xl border-2 border-oniria_pink/50 object-cover shadow-lg" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-oniria_purple/10 to-oniria_pink/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-bold text-lg">{community.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-oniria_darkblue group-hover:text-oniria_purple transition-colors duration-300 truncate">{community.name}</h3>
              {isOwner && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-oniria_purple to-oniria_pink text-white text-xs px-2 py-1 rounded-lg shadow-md flex-shrink-0">
                  <Crown className="w-3 h-3" />
                  <span>Propietario</span>
                </div>
              )}
              {isMember && !isOwner && (
                <div className="flex items-center space-x-1 bg-emerald-500/30 text-emerald-700 text-xs px-2 py-1 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                  <span>Miembro</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Description - Área expandible con altura fija */}
        <div className="flex-1 py-2 overflow-hidden min-h-[120px] max-h-[160px]">
          <p className="text-oniria_darkblue/90 group-hover:text-oniria_darkblue transition-colors duration-300 leading-relaxed text-sm">
            {community.description || 'Una comunidad esperando ser explorada...'}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-oniria_darkblue/70 group-hover:text-oniria_darkblue/80 transition-colors duration-300 flex-shrink-0 mb-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onShowMembers && onShowMembers(); 
              }}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition-all duration-300 hover:scale-105"
            >
              <Users className="w-3 h-3" />
              <span className="font-medium">{community.users.length} miembros</span>
            </button>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(community.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          {community.owner && (
            <div className="text-xs text-oniria_darkblue/60 truncate max-w-[100px]">
              Por: {community.owner.username}
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-oniria_darkblue/20 flex-shrink-0">
          <div className="flex space-x-2">
            {isOwner && onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-2 bg-blue-500/30 hover:bg-blue-500/40 text-blue-700 hover:text-blue-800 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                title="Editar comunidad"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {isOwner && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 bg-red-500/30 hover:bg-red-500/40 text-red-700 hover:text-red-800 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                title="Eliminar comunidad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {currentUser && onJoin && (
            <button
              onClick={(e) => { e.stopPropagation(); onJoin(); }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium ${
                isMember 
                  ? 'bg-red-500/30 hover:bg-red-500/40 text-red-700 hover:text-red-800'
                  : 'bg-green-500/30 hover:bg-green-500/40 text-green-700 hover:text-green-800'
              }`}
            >
              {isMember ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isMember ? 'Salir' : 'Unirse'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// POSTCARD - Usar ProfileAvatar en lugar de iniciales
const PostCard: React.FC<{
  post: Post;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onReply: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  currentUser?: User;
  isOwner?: boolean;
}> = React.memo(({ post, onLike, onDislike, onReply, onEdit, onDelete, currentUser, isOwner }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLiked = currentUser && post.likes.some(user => user.id === currentUser.id);
  const isDisliked = currentUser && post.dislikes.some(user => user.id === currentUser.id);

  return (
    <div 
      className="group relative mb-4 animate-message-entrance"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-300 hover:shadow-xl hover:bg-white/20">
        
        {/* Reply indicator */}
        {post.parent_post && (
          <div className="bg-gradient-to-r from-oniria_purple/20 to-oniria_pink/20 rounded-xl p-4 mb-4 border-l-4 border-oniria_pink backdrop-blur-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <Reply className="w-4 h-4 text-oniria_pink" />
                <p className="text-sm text-oniria_lightpink/70 font-medium">Respondiendo a:</p>
              </div>
              <p className="text-sm font-semibold text-oniria_lightpink mb-1">{post.parent_post.title}</p>
              <p className="text-xs text-oniria_lightpink/60">{post.parent_post.text.substring(0, 100)}...</p>
            </div>
          </div>
        )}
        
        {/* Post header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {/* Avatar usando ProfileAvatar - CORREGIDO */}
            <div className="relative flex-shrink-0">
              <ProfileAvatar user={post.author} size="medium" />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white/20 animate-pulse" />
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-semibold text-oniria_lightpink group-hover:text-white transition-colors duration-300">
                  {post.author.username}
                </span>
                <span className="text-oniria_lightpink/50 text-sm">•</span>
                <span className="text-oniria_lightpink/50 text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                {/* Badges */}
                {post.author.is_psychologist && (
                  <div className="flex items-center space-x-1 bg-oniria_purple/20 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-oniria_pink" />
                    <span className="text-xs text-oniria_lightpink/80">Psicólogo</span>
                  </div>
                )}
              </div>
              
              {/* Post title */}
              <h3 className="text-lg font-semibold text-oniria_lightpink group-hover:text-white transition-colors duration-300 leading-tight">
                {post.title}
              </h3>
              
              {/* Post content */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                <p className="text-oniria_lightpink/90 leading-relaxed break-words">{post.text}</p>
              </div>
            </div>
          </div>
          
          {/* Action menu for owner */}
          {isOwner && (
            <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(post)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-blue-100 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                  title="Editar post"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-100 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                  title="Eliminar post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Interaction bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-6">
            {/* Like button */}
            <button 
              onClick={() => onLike(post.id)} 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                isLiked 
                  ? 'text-oniria_pink bg-oniria_pink/20 shadow-lg' 
                  : 'text-oniria_lightpink/60 hover:text-oniria_pink hover:bg-oniria_pink/10'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="font-medium">{post.likes.length}</span>
            </button>
            
            {/* Dislike button */}
            <button 
              onClick={() => onDislike(post.id)} 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                isDisliked 
                  ? 'text-red-400 bg-red-400/20 shadow-lg' 
                  : 'text-oniria_lightpink/60 hover:text-red-400 hover:bg-red-400/10'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="font-medium">{post.dislikes.length}</span>
            </button>
            
            {/* Reply button */}
            <button 
              onClick={() => onReply(post)} 
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-oniria_lightpink/60 hover:text-oniria_lightpink hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <Reply className="w-4 h-4" />
              <span className="font-medium">Responder</span>
            </button>
          </div>
          
          {/* Timestamp */}
          <div className="text-xs text-oniria_lightpink/40">
            {new Date(post.created_at).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced Community Modal (WIDER)
const CommunityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; profile_image?: File }) => void;
  community?: Community;
  isEditing?: boolean;
}> = ({ isOpen, onClose, onSubmit, community, isEditing = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(community?.name || '');
      setDescription(community?.description || '');
      setImagePreview(community?.profile_image || null);
      setProfileImage(null);
    }
  }, [isOpen, community]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, profile_image: profileImage || undefined });
    setName('');
    setDescription('');
    setProfileImage(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-modal-entrance mx-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-oniria_darkblue mb-3">
            {isEditing ? 'Editar Comunidad' : 'Crear Nueva Comunidad'}
          </h2>
          <p className="text-base text-oniria_darkblue/70">
            {isEditing ? 'Actualiza la información de tu comunidad' : 'Dale vida a una nueva comunidad onírica'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Upload */}
          <div className="text-center">
            <label className="block text-base font-semibold text-oniria_darkblue mb-6">Imagen de Perfil</label>
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-oniria_purple/20 to-oniria_pink/20 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mx-auto">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-oniria_purple" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-oniria_pink to-oniria_purple rounded-full flex items-center justify-center shadow-xl cursor-pointer">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Form fields in grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="md:col-span-1">
              <label className="block text-base font-semibold text-oniria_darkblue mb-3">Nombre de la Comunidad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={30}
                className="w-full px-4 py-4 bg-white/50 border border-oniria_purple/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-oniria_pink focus:border-transparent text-oniria_darkblue placeholder-oniria_darkblue/50 backdrop-blur-sm transition-all duration-300 text-base"
                placeholder="Ej: Exploradores de Sueños"
              />
              <div className="text-sm text-oniria_darkblue/60 mt-2">{name.length}/30 caracteres</div>
            </div>
            
            {/* Description Field */}
            <div className="md:col-span-1">
              <label className="block text-base font-semibold text-oniria_darkblue mb-3">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={450}
                className="w-full px-4 py-4 bg-white/50 border border-oniria_purple/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-oniria_pink focus:border-transparent text-oniria_darkblue placeholder-oniria_darkblue/50 backdrop-blur-sm transition-all duration-300 resize-none text-base"
                placeholder="Describe el propósito de tu comunidad onírica..."
                rows={4}
              />
              <div className="text-sm text-oniria_darkblue/60 mt-2">{description.length}/450 caracteres</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
            >
              {isEditing ? 'Actualizar Comunidad' : 'Crear Comunidad'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/50 hover:bg-white/70 text-oniria_darkblue py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-base"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Chat-style Post Creation Component (CON BOTÓN TOGGLE)
const ChatPostCreator: React.FC<{
  onSubmit: (data: { title: string; text: string }) => void;
  placeholder?: string;
  parentPost?: Post;
  post?: Post;
  isEditing?: boolean;
}> = ({ onSubmit, placeholder = "Comparte tus pensamientos...", parentPost, post, isEditing = false }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [text, setText] = useState(post?.text || '');
  const [isExpanded, setIsExpanded] = useState(isEditing); // Expandido si está editando
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if (title.trim() && text.trim()) {
      onSubmit({ title, text });
      if (!isEditing) {
        setTitle('');
        setText('');
        setIsExpanded(false); // Colapsar después de enviar
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const handleCancel = () => {
    if (!isEditing) {
      setTitle('');
      setText('');
    }
    setIsExpanded(false);
  };

  return (
    <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-lg mb-6">
      
      {/* Parent post preview */}
      {parentPost && isExpanded && (
        <div className="bg-gradient-to-r from-oniria_purple/10 to-oniria_pink/10 rounded-xl p-4 mb-4 border-l-4 border-oniria_pink">
          <div className="flex items-center space-x-2 mb-2">
            <Reply className="w-4 h-4 text-oniria_pink" />
            <p className="text-sm text-oniria_lightpink/70 font-medium">Respondiendo a:</p>
          </div>
          <p className="text-sm font-semibold text-oniria_lightpink">{parentPost.title}</p>
          <p className="text-xs text-oniria_lightpink/60 mt-1">{parentPost.text.substring(0, 100)}...</p>
        </div>
      )}
      
      {!isExpanded ? (
        // Botón para expandir
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center space-x-3 px-4 py-4 text-left bg-gradient-to-r from-oniria_purple/10 via-oniria_pink/10 to-oniria_lightpink/10 hover:from-oniria_purple/20 hover:via-oniria_pink/20 hover:to-oniria_lightpink/20 rounded-xl border border-oniria_pink/20 hover:border-oniria_pink/40 transition-all duration-300 transform hover:scale-[1.01] group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-oniria_lightpink/90 group-hover:text-oniria_lightpink font-medium">
              {parentPost ? 'Responder a este mensaje...' : 'Crear nuevo mensaje...'}
            </p>
            <p className="text-sm text-oniria_lightpink/60 group-hover:text-oniria_lightpink/80">
              Comparte tus pensamientos con la comunidad
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-oniria_pink/60 group-hover:text-oniria_pink group-hover:animate-pulse" />
        </button>
      ) : (
        // Formulario expandido
        <div className="space-y-4">
          {/* Title input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={50}
              className="w-full px-0 py-2 bg-transparent border-none focus:outline-none text-oniria_lightpink placeholder-oniria_lightpink/50 text-lg font-semibold"
              placeholder="Título de tu mensaje..."
            />
            <div className="h-px bg-gradient-to-r from-oniria_purple/30 to-oniria_pink/30"></div>
          </div>
          
          {/* Text input */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={2500}
              className="w-full px-0 py-2 bg-transparent border-none focus:outline-none text-oniria_lightpink placeholder-oniria_lightpink/50 resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
              placeholder={placeholder}
              rows={2}
            />
            
            {/* Bottom bar */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center space-x-3 text-xs text-oniria_lightpink/60">
                <span>{title.length}/50</span>
                <span>•</span>
                <span>{text.length}/2500</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">⌘</kbd>
                  <span>+</span>
                  <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">Enter</kbd>
                  <span>para enviar</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-oniria_lightpink px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !text.trim()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isEditing ? 'Actualizar' : 'Enviar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Post Modal (Chat-like input)
const PostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; text: string; community: string; parent_post?: string }) => void;
  community: Community;
  parentPost?: Post;
  post?: Post;
  isEditing?: boolean;
}> = ({ isOpen, onClose, onSubmit, community, parentPost, post, isEditing = false }) => {
  const handleChatSubmit = (data: { title: string; text: string }) => {
    onSubmit({
      title: data.title,
      text: data.text,
      community: community.id,
      parent_post: parentPost?.id
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-modal-entrance mx-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-oniria_darkblue mb-2">
            {isEditing ? 'Editar Mensaje' : parentPost ? 'Responder Mensaje' : 'Nuevo Mensaje'}
          </h2>
          <p className="text-sm text-oniria_darkblue/70">
            Compartiendo en: <span className="font-semibold text-oniria_purple">{community.name}</span>
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple rounded-2xl p-6">
          <ChatPostCreator
            onSubmit={handleChatSubmit}
            parentPost={parentPost}
            post={post}
            isEditing={isEditing}
            placeholder="Comparte tus pensamientos, sueños y experiencias..."
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="bg-white/50 hover:bg-white/70 text-oniria_darkblue py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Community Component
const CommunityApp: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'communities' | 'community-posts'>('communities');
  
  // Filter states
  const [filterBy, setFilterBy] = useState('all');
  const [sortOrder, setSortOrder] = useState('created-desc');
  
  // Modal states
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [parentPost, setParentPost] = useState<Post | null>(null);
  
  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  
  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false
  });

  // Error handling
  const handleApiError = (error: any, defaultMessage: string): string => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return defaultMessage;
  };

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      setError(null);
      const communitiesData = await api.getCommunities();
      setCommunities(communitiesData);
    } catch (error: any) {
      console.error('Error loading initial data:', error);
      setError(handleApiError(error, 'Error al cargar las comunidades.'));
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Load posts for selected community
  const loadCommunityPosts = useCallback(async (communityId: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Cargando posts...');
      setError(null);
      const postsData = await api.getPostsByCommunity(communityId);
      setPosts(postsData);
    } catch (error: any) {
      console.error('Error loading community posts:', error);
      setError(handleApiError(error, 'Error al cargar los posts de la comunidad.'));
    } finally {
      setIsActionLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load posts when community is selected
  useEffect(() => {
    if (selectedCommunity && currentView === 'community-posts') {
      loadCommunityPosts(selectedCommunity.id);
    }
  }, [selectedCommunity, currentView, loadCommunityPosts]);

  // TODAS LAS FUNCIONES CRUD
  const handleCreateCommunity = async (data: { name: string; description: string; profile_image?: File }) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Creando comunidad...');
      setError(null);
      
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }
      
      await api.createCommunity(formData);
      const updatedCommunities = await api.getCommunities();
      setCommunities(updatedCommunities);
    } catch (error: any) {
      console.error('Error creating community:', error);
      setError(handleApiError(error, 'Error al crear la comunidad.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateCommunity = async (data: { name: string; description: string; profile_image?: File }) => {
    if (!editingCommunity) return;
    
    try {
      setIsActionLoading(true);
      setLoadingMessage('Actualizando comunidad...');
      setError(null);
      
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }
      
      await api.updateCommunity(editingCommunity.id, formData);
      const updatedCommunities = await api.getCommunities();
      setCommunities(updatedCommunities);
      
      if (selectedCommunity?.id === editingCommunity.id) {
        const updatedCommunity = updatedCommunities.find(c => c.id === editingCommunity.id);
        if (updatedCommunity) {
          setSelectedCommunity(updatedCommunity);
        }
      }
      
      setEditingCommunity(null);
    } catch (error: any) {
      console.error('Error updating community:', error);
      setError(handleApiError(error, 'Error al actualizar la comunidad.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCommunity = async (communityId: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Eliminando comunidad...');
      setError(null);
      
      await api.deleteCommunity(communityId);
      const updatedCommunities = await api.getCommunities();
      setCommunities(updatedCommunities);
      
      if (selectedCommunity?.id === communityId) {
        setSelectedCommunity(null);
        setCurrentView('communities');
      }
    } catch (error: any) {
      console.error('Error deleting community:', error);
      setError(handleApiError(error, 'Error al eliminar la comunidad.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  
const handleJoinCommunity = async (communityId: string) => {
  if (!user) return;
  
  const community = communities.find(c => c.id === communityId);
  if (!community) return;
  
  const isMember = community.users.some(u => u.id === user.id);
  const originalCommunities = [...communities];

  // Actualizar UI inmediatamente (optimistic update)
  setCommunities(prev => 
    prev.map(c => 
      c.id === communityId 
        ? {
            ...c,
            users: isMember 
              ? c.users.filter(u => u.id !== user.id) // Remover usuario
              : [...c.users, user] // Agregar usuario
          }
        : c
    )
  );

  // Si estamos viendo la comunidad, también actualizar selectedCommunity
  if (selectedCommunity?.id === communityId) {
    setSelectedCommunity(prev => prev ? {
      ...prev,
      users: isMember 
        ? prev.users.filter(u => u.id !== user.id)
        : [...prev.users, user]
    } : prev);
  }

  try {
    // Sincronizar con backend en segundo plano
    await api.joinCommunity(communityId);
    
    // Opcional: Recargar datos del servidor para asegurar consistencia
    // const updatedCommunities = await api.getCommunities();
    // setCommunities(updatedCommunities);
    
  } catch (error: any) {
    // En caso de error, revertir cambios
    setCommunities(originalCommunities);
    
    if (selectedCommunity?.id === communityId) {
      const originalCommunity = originalCommunities.find(c => c.id === communityId);
      if (originalCommunity) {
        setSelectedCommunity(originalCommunity);
      }
    }
    
    console.error('Error joining community:', error);
    setError(handleApiError(error, 'Error al actualizar la membresía.'));
  }
};

  
const handleCreatePost = async (data: { title: string; text: string; community: string; parent_post?: string }) => {
  if (!user || !selectedCommunity) return;
  
  // Crear post temporal para mostrar inmediatamente
  const tempPost: Post = {
    id: `temp-${Date.now()}`, // ID temporal
    title: data.title,
    text: data.text,
    created_at: new Date().toISOString(),
    community: selectedCommunity,
    parent_post: data.parent_post ? posts.find(p => p.id === data.parent_post) : undefined,
    author: user,
    likes: [],
    dislikes: []
  };

  // Actualizar UI inmediatamente
  setPosts(prev => [tempPost, ...prev]);
  setParentPost(null);

  try {
    // Sincronizar con backend en segundo plano
    await api.createPost(data);
    
    // Recargar posts para obtener el post real del servidor
    if (selectedCommunity) {
      await loadCommunityPosts(selectedCommunity.id);
    }
  } catch (error: any) {
    // En caso de error, remover el post temporal
    setPosts(prev => prev.filter(p => p.id !== tempPost.id));
    console.error('Error creating post:', error);
    setError(handleApiError(error, 'Error al crear el post.'));
  }
};

// ========== AC
  const handleUpdatePost = async (data: { title: string; text: string; community: string; parent_post?: string }) => {
    if (!editingPost) return;
    
    try {
      setIsActionLoading(true);
      setLoadingMessage('Actualizando post...');
      setError(null);
      
      await api.updatePost(editingPost.id, { title: data.title, text: data.text });
      
      if (selectedCommunity) {
        await loadCommunityPosts(selectedCommunity.id);
      }
      
      setEditingPost(null);
    } catch (error: any) {
      console.error('Error updating post:', error);
      setError(handleApiError(error, 'Error al actualizar el post.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  // ========== ACTUALIZACIÓN OPTIMISTA PARA ELIMINAR POSTS ==========

const handleDeletePost = async (postId: string) => {
  const originalPosts = [...posts];
  
  // Remover post inmediatamente de la UI
  setPosts(prev => prev.filter(p => p.id !== postId));
  
  try {
    await api.deletePost(postId);
  } catch (error: any) {
    // Revertir en caso de error
    setPosts(originalPosts);
    console.error('Error deleting post:', error);
    setError(handleApiError(error, 'Error al eliminar el post.'));
  }
};

  // Like/Dislike with optimistic updates
  const handleLikePost = async (postId: string) => {
    if (!user) {
      setError('Debes iniciar sesión para dar like a un post.');
      return;
    }

    const originalPosts = [...posts];
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes.some(u => u.id === user.id) 
                ? post.likes.filter(u => u.id !== user.id)
                : [...post.likes, user],
              dislikes: post.dislikes.filter(u => u.id !== user.id),
            }
          : post
      )
    );

    try {
      await api.likePost(postId);
    } catch (error: any) {
      console.error('Error liking post:', error);
      setPosts(originalPosts);
      setError(handleApiError(error, 'Error al dar like al post.'));
    }
  };

  const handleDislikePost = async (postId: string) => {
    if (!user) {
      setError('Debes iniciar sesión para dar dislike a un post.');
      return;
    }

    const originalPosts = [...posts];
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              dislikes: post.dislikes.some(u => u.id === user.id)
                ? post.dislikes.filter(u => u.id !== user.id)
                : [...post.dislikes, user],
              likes: post.likes.filter(u => u.id !== user.id),
            }
          : post
      )
    );

    try {
      await api.dislikePost(postId);
    } catch (error: any) {
      console.error('Error disliking post:', error);
      setPosts(originalPosts);
      setError(handleApiError(error, 'Error al dar dislike al post.'));
    }
  };

  // Navigation handlers
  const handleCommunityClick = (community: Community) => {
    setSelectedCommunity(community);
    setCurrentView('community-posts');
    setSearchTerm('');
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
    setCurrentView('communities');
    setPosts([]);
    setSearchTerm('');
  };

  // Modal handlers
  const openCommunityModal = (community?: Community) => {
    setEditingCommunity(community || null);
    setShowCommunityModal(true);
  };

  const openPostModal = (post?: Post, parent?: Post) => {
    setEditingPost(post || null);
    setParentPost(parent || null);
    setShowPostModal(true);
  };

  const openMembersModal = (community: Community) => {
    setSelectedCommunity(community);
    setShowMembersModal(true);
  };

  const showConfirmation = (title: string, message: string, onConfirm: () => void, isDestructive = false) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      isDestructive
    });
  };

  // Filtering and sorting logic
  const getFilteredAndSortedCommunities = () => {
    let filtered = communities.filter(community =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply membership filter
    if (user) {
      if (filterBy === 'member') {
        filtered = filtered.filter(community => 
          community.users.some(u => u.id === user.id)
        );
      } else if (filterBy === 'non-member') {
        filtered = filtered.filter(community => 
          !community.users.some(u => u.id === user.id)
        );
      }
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'created-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'created-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'members-asc':
          return a.users.length - b.users.length;
        case 'members-desc':
          return b.users.length - a.users.length;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  };

  const filteredCommunities = getFilteredAndSortedCommunities();

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user is member/owner
  const isCommunityMember = (community: Community) => {
    return user && community.users.some(u => u.id === user.id);
  };

  const isPostOwner = (post: Post) => {
    return user && post.author.id === user.id;
  };

  const isCommunityOwner = (community: Community) => {
    return user && community.owner && community.owner.id === user.id;
  };

  if (isInitialLoading) {
    return <UniversalLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple relative overflow-hidden">
      
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Partículas flotantes mejoradas */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-dream-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 6 + 8}s`,
            }}
          />
        ))}
        
        {/* Estrellas estáticas y en movimiento */}
        {Array.from({ length: 15 }, (_, i) => (
          <Star
            key={`star-static-${i}`}
            className="absolute text-oniria_lightpink/15 animate-pulse"
            style={{
              width: `${Math.random() * 16 + 12}px`,
              height: `${Math.random() * 16 + 12}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
        
        {Array.from({ length: 10 }, (_, i) => (
          <Star
            key={`star-moving-${i}`}
            className="absolute text-oniria_pink/10 animate-star-twinkle"
            style={{
              width: `${Math.random() * 12 + 8}px`,
              height: `${Math.random() * 12 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
        
        {/* Orbes de gradiente mejorados */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-oniria_purple/8 to-oniria_pink/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-oniria_pink/8 to-oniria_lightpink/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-oniria_lightpink/5 to-oniria_purple/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }} />
      </div>

      {/* Action Loaders - USANDO UNIVERSAL LOADER */}
      {isActionLoading && <UniversalLoader message={loadingMessage} />}
      
      {/* Error Alert */}
      {error && (
        <ErrorAlert
          message={error}
          onRetry={!isActionLoading ? loadInitialData : undefined}
          onClose={() => setError(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
      />

      {/* Enhanced Header con logo y efectos del Dashboard - CORREGIDO */}
      <header className="relative bg-oniria_darkblue/90 backdrop-blur-xl border-b border-oniria_purple/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple/5 via-oniria_pink/5 to-oniria_lightpink/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {/* SOLO mostrar botón de regreso al dashboard si NO estamos en community-posts */}
              {currentView === 'communities' && (
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="group p-3 text-oniria_lightpink/70 hover:text-oniria_lightpink hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                  title="Regresar al Dashboard"
                >
                  <ArrowLeft className="w-6 h-6 group-hover:animate-pulse" />
                </button>
              )}

              {currentView === 'community-posts' && (
                <button
                  onClick={handleBackToCommunities}
                  className="group p-3 text-oniria_lightpink/70 hover:text-oniria_lightpink hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
                </button>
              )}
              
              <div className="flex items-center space-x-3">
                {/* Logo del Dashboard - MÁS GRANDE */}
                <div className="relative flex-shrink-0">
                  <div className="flex gap-2 sm:gap-3 items-center">
                    <div className="relative">
                      <div className="flex items-center">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 p-1 sm:p-2 transition-transform duration-300 hover:scale-105">
                          <img 
                            src="/img/Oniria.svg" 
                            alt="NOCTIRIA Logo" 
                            className="w-full h-full object-contain filter drop-shadow-sm relative z-10" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>     
                </div>
                
                <div className="group relative">
                  <h1 className="text-3xl font-bold font-inter bg-gradient-to-r from-oniria_lightpink via-oniria_pink to-oniria_purple bg-clip-text text-transparent hover:bg-gradient-to-l transition-all duration-700 hover:tracking-wider group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.6)] animate-text-shimmer">
                    {currentView === 'communities' ? 'CENTRO DE COMUNIDADES' : selectedCommunity?.name?.toUpperCase()}
                  </h1>
                  
                  {/* Efectos decorativos del texto */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute -top-1 left-2 w-0.5 h-0.5 bg-oniria_purple/40 rounded-full animate-pulse"></div>
                    <div className="absolute top-1 -right-1 w-0.5 h-0.5 bg-oniria_pink/30 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute -bottom-1 left-8 w-0.5 h-0.5 bg-oniria_lightpink/40 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                  </div>
                  
                  {/* Línea elegante */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-oniria_purple/30 to-transparent opacity-60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple/40 to-oniria_pink/40"></div>
                  </div>
                  
                  {/* Resplandor de fondo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple/3 via-oniria_pink/3 to-oniria_lightpink/3 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              </div>
              
              {/* QUITAR la descripción del header cuando estamos en community-posts */}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Botón de refresh */}
              <button
                onClick={loadInitialData}
                className="group p-3 text-oniria_lightpink/70 hover:text-oniria_lightpink hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                title="Actualizar"
              >
                <svg className="w-5 h-5 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {selectedCommunity && currentView === 'community-posts' && (
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <User className="w-4 h-4 text-oniria_pink" />
                  <span className="text-sm text-oniria_lightpink font-medium">{selectedCommunity.users.length} miembros</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Enhanced Search and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 animate-fade-in-up">
          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple/20 via-oniria_pink/20 to-oniria_lightpink/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1">
                <div className="flex items-center space-x-3 px-4 py-3">
                  <Search className="w-5 h-5 text-oniria_pink group-hover:text-oniria_lightpink transition-colors duration-300" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={currentView === 'communities' ? 'Buscar comunidades...' : 'Buscar posts...'}
                    className="flex-1 bg-transparent text-oniria_lightpink placeholder-oniria_lightpink/50 focus:outline-none text-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="p-1 rounded-full hover:bg-white/10 text-oniria_lightpink/60 hover:text-oniria_lightpink transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filter dropdown para communities */}
            {currentView === 'communities' && (
              <FilterDropdown
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                currentUser={user}
              />
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-3">
              {currentView === 'communities' && (
                <button
                  onClick={() => openCommunityModal()}
                  className="group relative flex items-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Plus className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Crear Comunidad</span>
                </button>
              )}
              
              {currentView === 'community-posts' && isCommunityMember(selectedCommunity!) && (
                <button
                  onClick={() => openPostModal()}
                  className="group relative flex items-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <MessageSquare className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Nuevo Post</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {currentView === 'communities' ? (
          <div className="space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-oniria_lightpink">{communities.length}</p>
                    <p className="text-sm text-oniria_lightpink/70">Comunidades Totales</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-oniria_pink to-oniria_lightpink rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-oniria_lightpink">
                      {user ? communities.filter(c => c.users.some(u => u.id === user.id)).length : 0}
                    </p>
                    <p className="text-sm text-oniria_lightpink/70">Mis Comunidades</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-oniria_lightpink to-oniria_purple rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-oniria_lightpink">
                      {user ? communities.filter(c => c.owner?.id === user.id).length : 0}
                    </p>
                    <p className="text-sm text-oniria_lightpink/70">Soy Propietario</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Communities Grid - MÁS ANCHO: CAMBIADO A 2 COLUMNAS MÁXIMO */}
            {filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCommunities.map((community, index) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    index={index}
                    onClick={() => handleCommunityClick(community)}
                    onEdit={() => openCommunityModal(community)}
                    onDelete={() => showConfirmation(
                      'Eliminar Comunidad',
                      `¿Estás seguro de que deseas eliminar "${community.name}"? Esta acción no se puede deshacer.`,
                      () => handleDeleteCommunity(community.id),
                      true
                    )}
                    onJoin={() => showConfirmation(
                      isCommunityMember(community) ? 'Abandonar Comunidad' : 'Unirse a Comunidad',
                      isCommunityMember(community) 
                        ? `¿Estás seguro de que deseas abandonar "${community.name}"?`
                        : `¿Estás seguro de que deseas unirte a "${community.name}"?`,
                      () => handleJoinCommunity(community.id)
                    )}
                    onShowMembers={() => openMembersModal(community)}
                    currentUser={user}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 animate-fade-in-up">
                <div className="w-24 h-24 bg-gradient-to-br from-oniria_purple/20 to-oniria_pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-oniria_lightpink/60" />
                </div>
                <h3 className="text-xl font-semibold text-oniria_lightpink mb-2">
                  {searchTerm ? 'No se encontraron comunidades' : 'No hay comunidades disponibles'}
                </h3>
                <p className="text-oniria_lightpink/70 mb-6">
                  {searchTerm 
                    ? 'Intenta con términos de búsqueda diferentes'
                    : 'Sé el primero en crear una comunidad onírica'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => openCommunityModal()}
                    className="bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Crear Primera Comunidad
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Community Posts View */
          <div className="space-y-6">
            {/* Community Info Bar */}
            {selectedCommunity && (
              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {selectedCommunity.profile_image ? (
                      <img src={selectedCommunity.profile_image} alt={selectedCommunity.name} className="w-16 h-16 rounded-xl border-2 border-oniria_pink/50 object-cover shadow-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">{selectedCommunity.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-oniria_lightpink">{selectedCommunity.name}</h2>
                      <p className="text-oniria_lightpink/70">{selectedCommunity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-oniria_lightpink/60">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{selectedCommunity.users.length} miembros</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Creada {new Date(selectedCommunity.created_at).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openMembersModal(selectedCommunity)}
                      className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-oniria_lightpink px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    >
                      <Users className="w-4 h-4" />
                      <span>Ver Miembros</span>
                    </button>
                    
                    {user && (
                      <button
                        onClick={() => showConfirmation(
                          isCommunityMember(selectedCommunity) ? 'Abandonar Comunidad' : 'Unirse a Comunidad',
                          isCommunityMember(selectedCommunity) 
                            ? `¿Estás seguro de que deseas abandonar "${selectedCommunity.name}"?`
                            : `¿Estás seguro de que deseas unirte a "${selectedCommunity.name}"?`,
                          () => handleJoinCommunity(selectedCommunity.id)
                        )}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                          isCommunityMember(selectedCommunity)
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-100'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-100'
                        }`}
                      >
                        {isCommunityMember(selectedCommunity) ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        <span>{isCommunityMember(selectedCommunity) ? 'Salir' : 'Unirse'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Post Creator - Solo para miembros */}
            {selectedCommunity && isCommunityMember(selectedCommunity) && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <ChatPostCreator
                  onSubmit={(data) => handleCreatePost({
                    ...data,
                    community: selectedCommunity.id
                  })}
                  placeholder="Comparte tus pensamientos, sueños y experiencias con la comunidad..."
                />
              </div>  
            )}

            {/* Posts List */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLikePost}
                    onDislike={handleDislikePost}
                    onReply={(post) => openPostModal(undefined, post)}
                    onEdit={(post) => openPostModal(post)}
                    onDelete={(postId) => showConfirmation(
                      'Eliminar Post',
                      '¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer.',
                      () => handleDeletePost(postId),
                      true
                    )}
                    currentUser={user}
                    isOwner={isPostOwner(post)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 animate-fade-in-up">
                <div className="w-24 h-24 bg-gradient-to-br from-oniria_purple/20 to-oniria_pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-12 h-12 text-oniria_lightpink/60" />
                </div>
                <h3 className="text-xl font-semibold text-oniria_lightpink mb-2">
                  {searchTerm ? 'No se encontraron posts' : 'No hay posts en esta comunidad'}
                </h3>
                <p className="text-oniria_lightpink/70 mb-6">
                  {searchTerm 
                    ? 'Intenta con términos de búsqueda diferentes'
                    : 'Sé el primero en compartir algo interesante'
                  }
                </p>
                {!searchTerm && selectedCommunity && isCommunityMember(selectedCommunity) && (
                  <button
                    onClick={() => openPostModal()}
                    className="bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Crear Primer Post
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <CommunityModal
        isOpen={showCommunityModal}
        onClose={() => {
          setShowCommunityModal(false);
          setEditingCommunity(null);
        }}
        onSubmit={editingCommunity ? handleUpdateCommunity : handleCreateCommunity}
        community={editingCommunity || undefined}
        isEditing={!!editingCommunity}
      />

      <PostModal
        isOpen={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setEditingPost(null);
          setParentPost(null);
        }}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        community={selectedCommunity!}
        parentPost={parentPost || undefined}
        post={editingPost || undefined}
        isEditing={!!editingPost}
      />

      <MembersModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        community={selectedCommunity!}
      />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modal-entrance {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes message-entrance {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes dream-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) translateX(-10px) rotate(240deg);
          }
        }

        @keyframes star-twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-modal-entrance {
          animation: modal-entrance 0.4s ease-out forwards;
        }

        .animate-message-entrance {
          animation: message-entrance 0.5s ease-out forwards;
        }

        .animate-dream-float {
          animation: dream-float 8s ease-in-out infinite;
        }

        .animate-star-twinkle {
          animation: star-twinkle 3s ease-in-out infinite;
        }

        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-track-oniria_darkblue\/50 {
          scrollbar-color: rgba(45, 55, 120, 0.5) transparent;
        }

        .scrollbar-thumb-oniria_purple\/30 {
          scrollbar-color: rgba(147, 51, 234, 0.3) transparent;
        }
      `}</style>
      <DashboardFooter/>
    </div>
  );
};

export default CommunityApp;