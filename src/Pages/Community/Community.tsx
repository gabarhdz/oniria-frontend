import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, MessageSquare, User, Calendar, ThumbsUp, ThumbsDown, Loader2, Edit2, Trash2, Camera, UserPlus, UserMinus, Reply, X, ArrowLeft, Send, Sparkles, Star, Heart, Eye, Zap, Crown } from 'lucide-react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  profile_image?: string;
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

// Enhanced Loading Screen
const PageLoader: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Iniciando Noctiria...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const texts = [
      'Iniciando Noctiria...',
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

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          />
        ))}
      </div>

      {/* Floating dream bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-dream-bubble opacity-20"
            style={{
              width: `${Math.random() * 60 + 40}px`,
              height: `${Math.random() * 60 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, #9675bc, #f1b3be)`,
              borderRadius: `${Math.random() * 50 + 25}% ${Math.random() * 50 + 25}%`,
              filter: 'blur(2px)',
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 4 + 6}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 space-y-8">
        {/* Logo container with glow */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
            <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full flex items-center justify-center backdrop-blur-sm">
              <MessageSquare className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          </div>
          
          {/* Orbital rings */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="w-full h-full rounded-full border-2 border-[#f1b3be]/30 border-dashed" />
          </div>
          <div className="absolute inset-2 animate-spin-reverse">
            <div className="w-full h-full rounded-full border border-[#ffe0db]/40" />
          </div>
        </div>

        {/* Enhanced text section */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent animate-text-glow">
            Centro de Comunidades
          </h2>
          
          <div className="space-y-3">
            <p className="text-xl text-[#ffe0db] animate-fade-in-up">{loadingText}</p>
            
            {/* Progress bar */}
            <div className="w-80 mx-auto">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full transition-all duration-300 ease-out shadow-lg animate-progress-glow"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-[#ffe0db]/70 mt-2">{Math.round(progress)}% completado</p>
            </div>
          </div>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-[#f1b3be] rounded-full animate-bounce shadow-lg"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 0 20px rgba(241, 179, 190, 0.6)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Action Loader
const ActionLoader: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl text-center max-w-sm mx-4 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9675bc]/20 via-[#f1b3be]/20 to-[#ffe0db]/20 animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#f1b3be] rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-6">
        {/* Enhanced spinner */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-[#9675bc]/30 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-[#f1b3be] border-r-[#f1b3be] rounded-full animate-spin" />
          </div>
          <div className="absolute inset-0 w-20 h-20 border-2 border-[#ffe0db]/40 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#ffe0db] animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-[#ffe0db] drop-shadow-lg">{message}</h3>
          <p className="text-sm text-[#ffe0db]/70">Procesando en el reino onírico...</p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 pt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#f1b3be] rounded-full animate-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Error Alert
const ErrorAlert: React.FC<{ 
  message: string; 
  onRetry?: () => void; 
  onClose: () => void 
}> = ({ message, onRetry, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-red-500/20 via-red-400/10 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30 shadow-2xl text-center max-w-md mx-4 relative overflow-hidden">
      
      {/* Error glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 animate-pulse" />
      
      <div className="relative z-10 space-y-6">
        {/* Error icon with animation */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-error-pulse">
            <span className="text-white text-3xl animate-bounce">⚠</span>
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-red-500/30 rounded-full animate-ping mx-auto" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-[#ffe0db]">Error en Noctiria</h3>
          <p className="text-sm text-[#ffe0db]/80 leading-relaxed">{message}</p>
        </div>
        
        <div className="flex space-x-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              Reintentar
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-white/20 hover:bg-white/30 text-[#ffe0db] px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium"
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
        
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#f1b3be] rounded-full animate-float opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-[#ffe0db]">{title}</h3>
            <p className="text-sm text-[#ffe0db]/80 leading-relaxed">{message}</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium ${
                isDestructive 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                  : 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white'
              }`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white/20 hover:bg-white/30 text-[#ffe0db] px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Community Card
const CommunityCard: React.FC<{ 
  community: Community; 
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onJoin?: () => void;
  currentUser?: User;
}> = ({ community, onClick, onEdit, onDelete, onJoin, currentUser }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isMember = currentUser && community.users.some(user => user.id === currentUser.id);
  const isOwner = currentUser && community.owner && community.owner.id === currentUser.id;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <div 
      ref={cardRef}
      className="group relative overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Dynamic mouse glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(150, 117, 188, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Enhanced glass border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[#9675bc]/30 via-[#f1b3be]/20 to-[#ffe0db]/30 group-hover:from-[#9675bc]/50 group-hover:via-[#f1b3be]/40 group-hover:to-[#ffe0db]/50 transition-all duration-500">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/15 via-white/10 to-[#ffe0db]/20 backdrop-blur-xl shadow-inner" />
      </div>
      
      {/* Floating particles on hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {isHovered && (
          <>
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#f1b3be] rounded-full animate-float opacity-70"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random()}s`,
                }}
              />
            ))}
          </>
        )}
      </div>
      
      <div className="relative z-10 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          {community.profile_image ? (
            <div className="relative">
              <img src={community.profile_image} alt={community.name} className="w-12 h-12 rounded-full border-2 border-[#f1b3be] object-cover shadow-lg" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#9675bc]/20 to-[#f1b3be]/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-bold">{community.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-[#ffe0db] group-hover:text-white transition-colors duration-300">{community.name}</h3>
              {isOwner && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white text-xs px-2 py-1 rounded-full shadow-lg">
                  <Crown className="w-3 h-3" />
                  <span>Propietario</span>
                </div>
              )}
            </div>
            <p className="text-[#ffe0db]/70 text-sm group-hover:text-[#ffe0db]/90 transition-colors duration-300 mt-1">
              {community.description || 'Sin descripción'}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center space-x-4 text-xs text-[#ffe0db]/60 group-hover:text-[#ffe0db]/80 transition-colors duration-300">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{community.users.length} miembros</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(community.created_at).toLocaleDateString()}</span>
          </div>
          {community.owner && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Por: {community.owner.username}</span>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex space-x-2">
            {isOwner && onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-blue-100 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                title="Editar comunidad"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {isOwner && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-100 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                title="Eliminar comunidad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {currentUser && onJoin && (
            <button
              onClick={(e) => { e.stopPropagation(); onJoin(); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium ${
                isMember 
                  ? 'bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-100'
                  : 'bg-green-500/20 hover:bg-green-500/40 text-green-300 hover:text-green-100'
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

// Enhanced Post Card (Chat-like interface)
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
      {/* Chat bubble background */}
      <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-300 hover:shadow-xl hover:bg-white/20">
        
        {/* Floating particles on hover */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {isHovered && (
            <>
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-[#f1b3be] rounded-full animate-float opacity-60"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Reply indicator */}
        {post.parent_post && (
          <div className="bg-gradient-to-r from-[#9675bc]/20 to-[#f1b3be]/20 rounded-xl p-4 mb-4 border-l-4 border-[#f1b3be] backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <Reply className="w-4 h-4 text-[#f1b3be]" />
                <p className="text-sm text-[#ffe0db]/70 font-medium">Respondiendo a:</p>
              </div>
              <p className="text-sm font-semibold text-[#ffe0db] mb-1">{post.parent_post.title}</p>
              <p className="text-xs text-[#ffe0db]/60">{post.parent_post.text.substring(0, 100)}...</p>
            </div>
          </div>
        )}
        
        {/* Post header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-sm font-medium text-white">{post.author.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white/20 animate-pulse" />
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-[#ffe0db] group-hover:text-white transition-colors duration-300">
                  {post.author.username}
                </span>
                <span className="text-[#ffe0db]/50 text-sm">•</span>
                <span className="text-[#ffe0db]/50 text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                {/* Verificacion badge si es necesario */}
                <div className="flex items-center space-x-1 bg-[#9675bc]/20 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-[#f1b3be]" />
                  <span className="text-xs text-[#ffe0db]/80">Soñador</span>
                </div>
              </div>
              
              {/* Post title */}
              <h3 className="text-lg font-semibold text-[#ffe0db] group-hover:text-white transition-colors duration-300 leading-tight">
                {post.title}
              </h3>
              
              {/* Post content */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                <p className="text-[#ffe0db]/90 leading-relaxed">{post.text}</p>
              </div>
            </div>
          </div>
          
          {/* Action menu for owner */}
          {isOwner && (
            <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                  ? 'text-[#f1b3be] bg-[#f1b3be]/20 shadow-lg' 
                  : 'text-[#ffe0db]/60 hover:text-[#f1b3be] hover:bg-[#f1b3be]/10'
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
                  : 'text-[#ffe0db]/60 hover:text-red-400 hover:bg-red-400/10'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="font-medium">{post.dislikes.length}</span>
            </button>
            
            {/* Reply button */}
            <button 
              onClick={() => onReply(post)} 
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-[#ffe0db]/60 hover:text-[#ffe0db] hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <Reply className="w-4 h-4" />
              <span className="font-medium">Responder</span>
            </button>
          </div>
          
          {/* Timestamp */}
          <div className="text-xs text-[#ffe0db]/40">
            {new Date(post.created_at).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced Community Modal
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
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-modal-entrance">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#252c3e] mb-2">
            {isEditing ? 'Editar Comunidad' : 'Crear Nueva Comunidad'}
          </h2>
          <p className="text-sm text-[#252c3e]/70">
            {isEditing ? 'Actualiza la información de tu comunidad' : 'Dale vida a una nueva comunidad onírica'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="text-center">
            <label className="block text-sm font-semibold text-[#252c3e] mb-4">Imagen de Perfil</label>
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-[#9675bc]/20 to-[#f1b3be]/20 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg mx-auto">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-[#9675bc]" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#f1b3be] to-[#9675bc] rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Nombre de la Comunidad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={30}
              className="w-full px-4 py-3 bg-white/50 border border-[#9675bc]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f1b3be] focus:border-transparent text-[#252c3e] placeholder-[#252c3e]/50 backdrop-blur-sm transition-all duration-300"
              placeholder="Ej: Exploradores de Sueños"
            />
            <div className="text-xs text-[#252c3e]/60 mt-1">{name.length}/30 caracteres</div>
          </div>
          
          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={450}
              className="w-full px-4 py-3 bg-white/50 border border-[#9675bc]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f1b3be] focus:border-transparent text-[#252c3e] placeholder-[#252c3e]/50 backdrop-blur-sm transition-all duration-300 resize-none"
              placeholder="Describe el propósito de tu comunidad onírica..."
              rows={4}
            />
            <div className="text-xs text-[#252c3e]/60 mt-1">{description.length}/450 caracteres</div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {isEditing ? 'Actualizar' : 'Crear Comunidad'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/50 hover:bg-white/70 text-[#252c3e] py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
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
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(post?.title || '');
      setText(post?.text || '');
    }
  }, [isOpen, post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      title, 
      text, 
      community: community.id, 
      parent_post: parentPost?.id 
    });
    setTitle('');
    setText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-modal-entrance">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#252c3e] mb-2">
            {isEditing ? 'Editar Mensaje' : parentPost ? 'Responder Mensaje' : 'Nuevo Mensaje'}
          </h2>
          <p className="text-sm text-[#252c3e]/70">
            Compartiendo en: <span className="font-semibold text-[#9675bc]">{community.name}</span>
          </p>
        </div>
        
        {/* Parent post preview */}
        {parentPost && (
          <div className="bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-xl p-4 mb-6 border-l-4 border-[#f1b3be]">
            <div className="flex items-center space-x-2 mb-2">
              <Reply className="w-4 h-4 text-[#f1b3be]" />
              <p className="text-sm text-[#252c3e]/70 font-medium">Respondiendo a:</p>
            </div>
            <p className="text-sm font-semibold text-[#252c3e]">{parentPost.title}</p>
            <p className="text-xs text-[#252c3e]/60 mt-1">{parentPost.text.substring(0, 100)}...</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Título del Mensaje</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={50}
              className="w-full px-4 py-3 bg-white/50 border border-[#9675bc]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f1b3be] focus:border-transparent text-[#252c3e] placeholder-[#252c3e]/50 backdrop-blur-sm transition-all duration-300"
              placeholder="¿De qué quieres hablar?"
            />
            <div className="text-xs text-[#252c3e]/60 mt-1">{title.length}/50 caracteres</div>
          </div>
          
          {/* Content Field - Chat-like */}
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Tu Mensaje</label>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                maxLength={2500}
                className="w-full px-4 py-4 pb-12 bg-white/50 border border-[#9675bc]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f1b3be] focus:border-transparent text-[#252c3e] placeholder-[#252c3e]/50 backdrop-blur-sm transition-all duration-300 resize-none"
                placeholder="Comparte tus pensamientos, sueños y experiencias..."
                rows={6}
              />
              
              {/* Character count and send button */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div className="text-xs text-[#252c3e]/60">{text.length}/2500</div>
                <button
                  type="submit"
                  disabled={!title.trim() || !text.trim()}
                  className="bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] disabled:from-gray-300 disabled:to-gray-400 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/50 hover:bg-white/70 text-[#252c3e] py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Community Component (keeping all original functionality)
const CommunityApp: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'communities' | 'community-posts'>('communities');
  
  // Modal states
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
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

  // Error handling (MANTENIDO IGUAL)
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

  // Load initial data (MANTENIDO IGUAL)
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

  // Load posts for selected community (MANTENIDO IGUAL)
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

  // Load posts when community is selected (MANTENIDO IGUAL)
  useEffect(() => {
    if (selectedCommunity && currentView === 'community-posts') {
      loadCommunityPosts(selectedCommunity.id);
    }
  }, [selectedCommunity, currentView, loadCommunityPosts]);

  // TODAS LAS FUNCIONES CRUD MANTENIDAS EXACTAMENTE IGUAL
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
    try {
      setIsActionLoading(true);
      setLoadingMessage('Actualizando membresía...');
      setError(null);
      
      await api.joinCommunity(communityId);
      const updatedCommunities = await api.getCommunities();
      setCommunities(updatedCommunities);
      
      if (selectedCommunity?.id === communityId) {
        const updatedCommunity = updatedCommunities.find(c => c.id === communityId);
        if (updatedCommunity) {
          setSelectedCommunity(updatedCommunity);
        }
      }
    } catch (error: any) {
      console.error('Error joining community:', error);
      setError(handleApiError(error, 'Error al actualizar la membresía.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  // Post CRUD operations (MANTENIDAS IGUALES)
  const handleCreatePost = async (data: { title: string; text: string; community: string; parent_post?: string }) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Creando post...');
      setError(null);
      
      await api.createPost(data);
      
      if (selectedCommunity) {
        await loadCommunityPosts(selectedCommunity.id);
      }
      
      setParentPost(null);
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(handleApiError(error, 'Error al crear el post.'));
    } finally {
      setIsActionLoading(false);
    }
  };

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

  const handleDeletePost = async (postId: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Eliminando post...');
      setError(null);
      
      await api.deletePost(postId);
      
      if (selectedCommunity) {
        await loadCommunityPosts(selectedCommunity.id);
      }
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setError(handleApiError(error, 'Error al eliminar el post.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  // Like/Dislike with optimistic updates (MANTENIDAS IGUALES)
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

  // Navigation handlers (MANTENIDOS IGUALES)
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

  // Modal handlers (MANTENIDOS IGUALES)
  const openCommunityModal = (community?: Community) => {
    setEditingCommunity(community || null);
    setShowCommunityModal(true);
  };

  const openPostModal = (post?: Post, parent?: Post) => {
    setEditingPost(post || null);
    setParentPost(parent || null);
    setShowPostModal(true);
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

  // Filtering (MANTENIDO IGUAL)
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user is member/owner (MANTENIDAS IGUALES)
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
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating dream elements */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-dream-float"
            style={{
              width: `${Math.random() * 12 + 8}px`,
              height: `${Math.random() * 12 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 6}s`,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#9675bc]/10 to-[#f1b3be]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-[#f1b3be]/10 to-[#ffe0db]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Action Loaders */}
      {isActionLoading && <ActionLoader message={loadingMessage} />}
      
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

      {/* Enhanced Header */}
      <header className="relative bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/5 via-[#f1b3be]/5 to-[#ffe0db]/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {currentView === 'community-posts' && (
                <button
                  onClick={handleBackToCommunities}
                  className="group p-3 text-[#ffe0db]/70 hover:text-[#ffe0db] hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
                </button>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#9675bc] to-[#f1b3be] rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
                    {currentView === 'communities' ? 'Centro de Comunidades' : selectedCommunity?.name}
                  </h1>
                  {currentView === 'community-posts' && selectedCommunity && (
                    <p className="text-sm text-[#ffe0db]/70">{selectedCommunity.description}</p>
                  )}
                </div>
              </div>
            </div>
            
            {selectedCommunity && currentView === 'community-posts' && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <User className="w-4 h-4 text-[#f1b3be]" />
                  <span className="text-sm text-[#ffe0db] font-medium">{selectedCommunity.users.length} miembros</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Eye className="w-4 h-4 text-[#9675bc]" />
                  <span className="text-sm text-[#ffe0db] font-medium">En línea</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Enhanced Search and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0">
          
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/20 to-[#f1b3be]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ffe0db]/50 w-5 h-5" />
              <input
                type="text"
                placeholder={`Buscar ${currentView === 'communities' ? 'comunidades' : 'mensajes'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f1b3be] focus:border-transparent text-[#ffe0db] placeholder-[#ffe0db]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            {currentView === 'communities' && (
              <button
                onClick={() => openCommunityModal()}
                disabled={isActionLoading}
                className="group relative flex items-center space-x-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="font-semibold relative z-10">Nueva Comunidad</span>
                <Sparkles className="w-4 h-4 relative z-10 group-hover:animate-pulse" />
              </button>
            )}
            
            {currentView === 'community-posts' && selectedCommunity && user && isCommunityMember(selectedCommunity) && (
              <button
                onClick={() => openPostModal()}
                disabled={isActionLoading}
                className="group relative flex items-center space-x-3 bg-gradient-to-r from-[#f1b3be] to-[#ffe0db] hover:from-[#ffe0db] hover:to-[#f1b3be] text-[#1a1f35] px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <MessageSquare className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Nuevo Mensaje</span>
                <Send className="w-4 h-4 relative z-10 group-hover:animate-pulse" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentView === 'communities' ? (
            
            /* Communities Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCommunities.map((community, index) => (
                <div
                  key={community.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CommunityCard
                    community={community}
                    onClick={() => handleCommunityClick(community)}
                    onEdit={isCommunityOwner(community) ? () => openCommunityModal(community) : undefined}
                    onDelete={isCommunityOwner(community) ? () => showConfirmation(
                      'Eliminar Comunidad',
                      `¿Estás seguro de que deseas eliminar la comunidad "${community.name}"? Esta acción no se puede deshacer.`,
                      () => handleDeleteCommunity(community.id),
                      true
                    ) : undefined}
                    onJoin={() => handleJoinCommunity(community.id)}
                    currentUser={user}
                  />
                </div>
              ))}
              
              {filteredCommunities.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#9675bc]/20 to-[#f1b3be]/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Search className="w-12 h-12 text-[#ffe0db]/40" />
                    </div>
                    <div className="absolute inset-0 bg-[#f1b3be]/20 rounded-full animate-ping" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#ffe0db] mb-2">No se encontraron comunidades</h3>
                  <p className="text-[#ffe0db]/70">Intenta con diferentes términos de búsqueda</p>
                </div>
              )}
            </div>
            
          ) : (
            
            /* Posts Chat Interface */
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-message-entrance"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <PostCard
                      post={post}
                      onLike={handleLikePost}
                      onDislike={handleDislikePost}
                      onReply={(post) => openPostModal(undefined, post)}
                      onEdit={(post) => openPostModal(post)}
                      onDelete={(postId) => showConfirmation(
                        'Eliminar Mensaje',
                        '¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer.',
                        () => handleDeletePost(postId),
                        true
                      )}
                      currentUser={user}
                      isOwner={isPostOwner(post)}
                    />
                  </div>
                ))}
                
                {filteredPosts.length === 0 && !isActionLoading && (
                  <div className="text-center py-20">
                    <div className="relative inline-block mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-[#9675bc]/20 to-[#f1b3be]/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <MessageSquare className="w-16 h-16 text-[#ffe0db]/40" />
                      </div>
                      <div className="absolute inset-0 bg-[#f1b3be]/10 rounded-full animate-ping" />
                      <div className="absolute top-4 right-4 w-4 h-4 bg-[#ffe0db] rounded-full animate-bounce" />
                      <div className="absolute bottom-8 left-8 w-3 h-3 bg-[#9675bc] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#ffe0db] mb-4">No hay mensajes aún</h3>
                    <p className="text-[#ffe0db]/70 text-lg mb-8">¡Sé el primero en compartir algo increíble!</p>
                    
                    {user && isCommunityMember(selectedCommunity!) && (
                      <button
                        onClick={() => openPostModal()}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Crear primer mensaje</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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

      {selectedCommunity && (
        <PostModal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setEditingPost(null);
            setParentPost(null);
          }}
          onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
          community={selectedCommunity}
          parentPost={parentPost || undefined}
          post={editingPost || undefined}
          isEditing={!!editingPost}
        />
      )}

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.4;
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(120deg);
            opacity: 0.8;
          }
          66% {
            transform: translateY(-10px) translateX(-10px) rotate(240deg);
            opacity: 0.6;
          }
        }
        
        @keyframes dream-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-15px) translateX(8px) scale(1.1) rotate(90deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-8px) translateX(-8px) scale(0.9) rotate(180deg);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-20px) translateX(5px) scale(1.05) rotate(270deg);
            opacity: 0.8;
          }
        }
        
        @keyframes dream-bubble {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
            opacity: 0.15;
          }
          33% {
            transform: translateY(-25px) translateX(15px) scale(1.2) rotate(120deg);
            opacity: 0.25;
          }
          66% {
            transform: translateY(-12px) translateX(-12px) scale(0.8) rotate(240deg);
            opacity: 0.10;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(150, 117, 188, 0.3), 0 0 40px rgba(241, 179, 190, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(150, 117, 188, 0.5), 0 0 60px rgba(241, 179, 190, 0.4);
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 224, 219, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 224, 219, 0.6), 0 0 30px rgba(241, 179, 190, 0.4);
          }
        }
        
        @keyframes progress-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(241, 179, 190, 0.4);
          }
          50% {
            box-shadow: 0 0 20px rgba(241, 179, 190, 0.8);
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes message-entrance {
          from {
            opacity: 0;
            transform: translateX(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes modal-entrance {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes error-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes wave {
          0%, 60%, 100% {
            transform: initial;
          }
          30% {
            transform: translateY(-15px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-dream-float {
          animation: dream-float 8s ease-in-out infinite;
        }
        
        .animate-dream-bubble {
          animation: dream-bubble 10s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .animate-progress-glow {
          animation: progress-glow 1.5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-message-entrance {
          animation: message-entrance 0.4s ease-out;
        }
        
        .animate-modal-entrance {
          animation: modal-entrance 0.3s ease-out;
        }
        
        .animate-error-pulse {
          animation: error-pulse 2s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CommunityApp;