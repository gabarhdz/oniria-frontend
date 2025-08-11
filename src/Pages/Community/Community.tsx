import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  User, 
  Calendar, 
  ThumbsUp, 
  ThumbsDown, 
  Loader2, 
  Edit2, 
  Trash2, 
  Camera, 
  UserPlus, 
  UserMinus, 
  Reply, 
  X,
  Filter,
  Users,
  Star,
  Heart,
  MessageCircle,
  TrendingUp,
  Globe,
  Lock,
  Settings,
  ArrowLeft,
  Eye,
  Sparkles,
  Waves,
  Crown,
  Shield,
  Compass,
  BookOpen,
  Coffee,
  TreePine,
  Palette,
  Music,
  Brain,
  Lightbulb,
  MapPin,
  Share2,
  MoreHorizontal,
  Send,
  Image,
  Smile,
  Check,
  AlertTriangle,
  RefreshCw,
  Moon
} from 'lucide-react';

// Axios setup
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000
});

// Enhanced particle effects
const DreamParticles: React.FC = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-dream-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: 'radial-gradient(circle, rgba(150, 117, 188, 0.8) 0%, rgba(241, 179, 190, 0.6) 50%, rgba(255, 224, 219, 0.3) 100%)',
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Floating orbs background
const FloatingOrbs: React.FC = () => {
  const orbs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 6,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full animate-float-gentle opacity-5"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, rgba(150, 117, 188, 0.4) 0%, rgba(241, 179, 190, 0.3) 50%, rgba(255, 224, 219, 0.1) 100%)`,
            filter: 'blur(2px)',
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced shimmer effect
const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
  </div>
);

// Enhanced notification system
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

const NotificationToast: React.FC<{ notification: Notification; onClose: (id: string) => void }> = ({ 
  notification, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => onClose(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <Check className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgGradient = () => {
    switch (notification.type) {
      case 'success': return 'from-green-500/20 via-emerald-400/10 to-green-500/20';
      case 'error': return 'from-red-500/20 via-red-400/10 to-red-500/20';
      case 'warning': return 'from-yellow-500/20 via-yellow-400/10 to-yellow-500/20';
      default: return 'from-blue-500/20 via-blue-400/10 to-blue-500/20';
    }
  };

  return (
    <div className={`transform transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`relative bg-gradient-to-r ${getBgGradient()} backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl max-w-sm overflow-hidden`}>
        <Shimmer />
        <div className="relative z-10 flex items-start space-x-3">
          <div className="mt-1">{getIcon()}</div>
          <div className="flex-1">
            <h4 className="text-white font-semibold text-sm">{notification.title}</h4>
            <p className="text-white/80 text-sm mt-1">{notification.message}</p>
          </div>
          <button
            onClick={() => onClose(notification.id)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Interfaces
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
  // Frontend-only properties for filtering
  category?: 'Lucidez' | 'Sanación' | 'Interpretación' | 'Arte' | 'Meditación' | 'Psicología';
  trending?: boolean;
  featured?: boolean;
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

// API Service with Axios
class ApiService {
  constructor() {
    // Add request interceptor for auth token
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any): string {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     error.message;
      return message || `HTTP ${error.response?.status}`;
    }
    return error.message || 'Error desconocido';
  }

  // Communities API
  getCommunities = async (): Promise<Community[]> => {
    try {
      const response = await api.get('/communities/');
      // Add frontend categories randomly for demo
      const categories: Community['category'][] = ['Lucidez', 'Sanación', 'Interpretación', 'Arte', 'Meditación', 'Psicología'];
      return response.data.map((community: Community, index: number) => ({
        ...community,
        category: categories[index % categories.length],
        trending: Math.random() > 0.7,
        featured: Math.random() > 0.8
      }));
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  createCommunity = async (data: FormData): Promise<Community> => {
    try {
      const response = await api.post('/communities/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  updateCommunity = async (id: string, data: FormData): Promise<Community> => {
    try {
      const response = await api.put(`/communities/specific/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  deleteCommunity = async (id: string): Promise<void> => {
    try {
      await api.delete(`/communities/specific/${id}/`);
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  joinCommunity = async (id: string): Promise<void> => {
    try {
      await api.patch(`/communities/join/${id}/`);
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  // Posts API
  getPosts = async (): Promise<Post[]> => {
    try {
      const response = await api.get('/communities/post/');
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  createPost = async (data: { title: string; text: string; community: string; parent_post?: string }): Promise<void> => {
    try {
      await api.post('/communities/post/', data);
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  updatePost = async (id: string, data: { title: string; text: string }): Promise<Post> => {
    try {
      const response = await api.put(`/communities/post/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  deletePost = async (id: string): Promise<void> => {
    try {
      await api.delete(`/communities/post/${id}/`);
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  likePost = async (postId: string): Promise<void> => {
    try {
      await api.patch(`/communities/post/like/${postId}/`);
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  dislikePost = async (postId: string): Promise<void> => {
    try {
      await api.patch(`/communities/post/dislike/${postId}/`);
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };

  getPostsByCommunity = async (communityId: string): Promise<Post[]> => {
    try {
      const response = await api.get(`/communities/post/community/${communityId}/`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  };
}

const apiService = new ApiService();

// Auth hook
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

// Enhanced search component
const SearchBar: React.FC<{ 
  onSearch: (query: string) => void; 
  placeholder?: string;
}> = ({ onSearch, placeholder = "Buscar comunidades..." }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-500 ${
        isFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
      }`} />
      
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
        <div className="flex items-center px-6 py-4">
          <Search className={`w-5 h-5 mr-3 transition-colors duration-300 ${
            isFocused ? 'text-purple-300' : 'text-white/60'
          }`} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                onSearch('');
              }}
              className="ml-3 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Shimmer className="rounded-2xl" />
      </div>
    </div>
  );
};

// Enhanced filter component
const FilterPanel: React.FC<{ 
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}> = ({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/15 transition-all duration-300 hover:scale-105"
      >
        <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>Filtros</span>
        <div className={`w-2 h-2 bg-purple-400 rounded-full ${selectedCategory !== 'all' || sortBy !== 'members' ? 'block' : 'hidden'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl z-50 animate-slide-in-down">
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Compass className="w-4 h-4 mr-2 text-purple-400" />
                Categorías
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['all', ...categories].map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {category === 'all' ? 'Todas' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort options */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-pink-400" />
                Ordenar por
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'members', label: 'Más miembros' },
                  { value: 'posts', label: 'Más recientes' },
                  { value: 'trending', label: 'Tendencia' },
                  { value: 'name', label: 'Nombre' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading Components
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#252c3e] via-[#214d72] to-[#4a5d7a] flex items-center justify-center relative overflow-hidden">
    <DreamParticles />
    <FloatingOrbs />
    
    <div className="text-center relative z-10">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-[#9675bc]/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-[#f1b3be] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-[#ffe0db] mb-3">Cargando Centro de Comunidades</h2>
      <p className="text-[#ffe0db]/70 mb-6">Obteniendo comunidades y posts...</p>
      <div className="flex justify-center space-x-2">
        <div className="w-3 h-3 bg-[#f1b3be] rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-[#9675bc] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-[#ffe0db] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

const ActionLoader: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
    <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center max-w-sm mx-4">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-3 border-[#9675bc]/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-3 border-transparent border-t-[#f1b3be] border-r-[#f1b3be] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Plus className="w-6 h-6 text-[#ffe0db]" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-[#ffe0db] mb-2">{message}</h3>
      <p className="text-sm text-[#ffe0db]/70">Por favor espera un momento...</p>
    </div>
  </div>
);

// Confirmation Modal
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
      <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center max-w-md mx-4 relative overflow-hidden">
        <Shimmer className="rounded-3xl" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-[#ffe0db] mb-4">{title}</h3>
          <p className="text-sm text-[#ffe0db]/80 mb-8">{message}</p>
          <div className="flex space-x-4">
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 font-medium ${
                isDestructive 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg'
                  : 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white shadow-lg'
              }`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white/20 hover:bg-white/30 text-[#ffe0db] px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 font-medium"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced community card
const CommunityCard: React.FC<{ 
  community: Community; 
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onJoin?: () => void;
  currentUser?: User;
  isOwner?: boolean;
  delay?: number;
}> = ({ community, onClick, onEdit, onDelete, onJoin, currentUser, isOwner, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isMember = currentUser && community.users.some(user => user.id === currentUser.id);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Lucidez': return <Moon className="w-6 h-6 text-white" />;
      case 'Sanación': return <Shield className="w-6 h-6 text-white" />;
      case 'Interpretación': return <Brain className="w-6 h-6 text-white" />;
      case 'Arte': return <Palette className="w-6 h-6 text-white" />;
      case 'Meditación': return <TreePine className="w-6 h-6 text-white" />;
      case 'Psicología': return <Lightbulb className="w-6 h-6 text-white" />;
      default: return <MessageSquare className="w-6 h-6 text-white" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Lucidez': return 'from-purple-500 to-indigo-600';
      case 'Sanación': return 'from-rose-500 to-pink-600';
      case 'Interpretación': return 'from-amber-500 to-orange-600';
      case 'Arte': return 'from-teal-500 to-cyan-600';
      case 'Meditación': return 'from-green-500 to-emerald-600';
      case 'Psicología': return 'from-slate-500 to-gray-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative cursor-pointer transform transition-all duration-700 hover:scale-[1.02] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Dynamic mouse glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(150, 117, 188, 0.4), transparent 70%)`,
        }}
      />

      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(community.category)} rounded-3xl blur-2xl opacity-10 group-hover:opacity-25 transition-all duration-700 scale-110`} />
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 overflow-hidden">
        
        {/* Trending badge */}
        {community.trending && (
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-3 py-1 text-xs font-bold text-white animate-pulse shadow-lg">
              🔥 Trending
            </div>
          </div>
        )}

        {/* Featured badge */}
        {community.featured && (
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg flex items-center space-x-1">
              <Crown className="w-3 h-3" />
              <span>Destacada</span>
            </div>
          </div>
        )}

        <Shimmer className="rounded-3xl" />

        {/* Header */}
        <div className="flex items-start space-x-4 mb-6" onClick={onClick}>
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${getCategoryColor(community.category)} shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0`}>
            {community.profile_image ? (
              <img src={community.profile_image} alt={community.name} className="w-6 h-6 rounded object-cover" />
            ) : (
              getCategoryIcon(community.category)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-[#ffe0db] mb-2 group-hover:text-purple-200 transition-colors">
              {community.name}
            </h3>
            <p className="text-[#ffe0db]/70 text-sm leading-relaxed line-clamp-2">
              {community.description || 'Sin descripción'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-xl font-bold text-[#ffe0db]">
                  {community.users.length}
                </span>
              </div>
              <p className="text-[#ffe0db]/50 text-xs">miembros</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-pink-400" />
                <span className="text-xl font-bold text-[#ffe0db]">
                  {new Date(community.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[#ffe0db]/50 text-xs">creada</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-[#ffe0db]/80 font-medium">
              {community.category || 'General'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {isOwner && onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                title="Editar comunidad"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {isOwner && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                title="Eliminar comunidad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {currentUser && onJoin && (
            <button
              onClick={(e) => { e.stopPropagation(); onJoin(); }}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-all duration-300 hover:scale-105 ${
                isMember 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
              }`}
            >
              {isMember ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isMember ? 'Salir' : 'Unirse'}</span>
            </button>
          )}
        </div>

        {/* Join button */}
        <button 
          onClick={onClick}
          className="w-full py-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-white font-semibold transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center space-x-2 relative overflow-hidden"
        >
          <Shimmer />
          <div className="relative z-10 flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Explorar Comunidad</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </button>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-float-gentle opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                top: `${20 + i * 25}%`,
                right: `${10 + i * 15}%`,
                width: `${2 + i}px`,
                height: `${2 + i}px`,
                background: ['#ffe0db', '#f1b3be', '#9675bc'][i],
                borderRadius: '50%',
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced post card
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
  const isLiked = currentUser && post.likes.some(user => user.id === currentUser.id);
  const isDisliked = currentUser && post.dislikes.some(user => user.id === currentUser.id);

  return (
    <div className="group relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 overflow-hidden">
      <Shimmer className="rounded-3xl" />
      
      {post.parent_post && (
        <div className="bg-[#9675bc]/20 rounded-2xl p-4 mb-4 border-l-4 border-[#f1b3be] relative overflow-hidden">
          <Shimmer className="rounded-2xl" />
          <div className="relative z-10">
            <p className="text-sm text-[#ffe0db]/70 mb-1">Respondiendo a:</p>
            <p className="text-sm font-medium text-[#ffe0db]">{post.parent_post.title}</p>
            <p className="text-xs text-[#ffe0db]/60 mt-1">{post.parent_post.text.substring(0, 100)}...</p>
          </div>
        </div>
      )}
      
      {/* Post header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            {post.author.profile_image ? (
              <img src={post.author.profile_image} alt={post.author.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-white">{post.author.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-[#ffe0db]">{post.author.username}</span>
              <span className="text-[#ffe0db]/50 text-sm">•</span>
              <span className="text-[#ffe0db]/50 text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
              <span className="bg-gradient-to-r from-[#9675bc]/30 to-[#f1b3be]/30 text-[#ffe0db] text-xs px-3 py-1 rounded-full border border-[#f1b3be]/30">
                {post.community.name}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#ffe0db] mb-2 group-hover:text-purple-200 transition-colors">{post.title}</h3>
            <p className="text-[#ffe0db]/80 mb-4 leading-relaxed">{post.text}</p>
          </div>
        </div>
        
        {/* Action buttons for owner */}
        {isOwner && (
          <div className="flex space-x-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(post)}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-300 hover:scale-110"
                title="Editar post"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(post.id)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300 hover:scale-110"
                title="Eliminar post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Post actions */}
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => onLike(post.id)} 
          className={`flex items-center space-x-2 text-sm transition-all duration-300 hover:scale-110 group/like ${
            isLiked ? 'text-[#f1b3be]' : 'text-[#ffe0db]/60 hover:text-[#f1b3be]'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 group-hover/like:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">{post.likes.length}</span>
        </button>
        
        <button 
          onClick={() => onDislike(post.id)} 
          className={`flex items-center space-x-2 text-sm transition-all duration-300 hover:scale-110 group/dislike ${
            isDisliked ? 'text-red-400' : 'text-[#ffe0db]/60 hover:text-red-400'
          }`}
        >
          <ThumbsDown className={`w-4 h-4 group-hover/dislike:scale-110 transition-transform ${isDisliked ? 'fill-current' : ''}`} />
          <span className="font-medium">{post.dislikes.length}</span>
        </button>
        
        <button 
          onClick={() => onReply(post)} 
          className="flex items-center space-x-2 text-sm text-[#ffe0db]/60 hover:text-[#ffe0db] transition-all duration-300 hover:scale-110 group/reply"
        >
          <Reply className="w-4 h-4 group-hover/reply:scale-110 transition-transform" />
          <span>Responder</span>
        </button>

        <button className="flex items-center space-x-2 text-sm text-[#ffe0db]/60 hover:text-green-400 transition-all duration-300 hover:scale-110 group/share">
          <Share2 className="w-4 h-4 group-hover/share:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
});

// Create/Edit Community Modal
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full mx-4 border border-white/20 shadow-2xl overflow-hidden">
        <DreamParticles />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#ffe0db]">
                  {isEditing ? 'Editar Comunidad' : 'Crear Nueva Comunidad'}
                </h2>
                <p className="text-[#ffe0db]/70">Construye tu espacio onírico único</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#ffe0db]/60 hover:text-[#ffe0db] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-[#ffe0db] font-medium mb-2">Imagen de Perfil</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 text-sm text-[#ffe0db]/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#ffe0db] font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={30}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-[#ffe0db] placeholder-[#ffe0db]/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                placeholder="Nombre de la comunidad"
              />
            </div>
            
            <div>
              <label className="block text-[#ffe0db] font-medium mb-2">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={450}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-[#ffe0db] placeholder-[#ffe0db]/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none"
                placeholder="Descripción de la comunidad"
                rows={4}
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-600/50 hover:bg-slate-600/70 text-[#ffe0db] py-4 px-6 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Create/Edit Post Modal
const PostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; text: string; community: string; parent_post?: string }) => void;
  communities: Community[];
  parentPost?: Post;
  post?: Post;
  isEditing?: boolean;
}> = ({ isOpen, onClose, onSubmit, communities, parentPost, post, isEditing = false }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(post?.title || '');
      setText(post?.text || '');
      setSelectedCommunity(post?.community.id || parentPost?.community.id || '');
    }
  }, [isOpen, post, parentPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      title, 
      text, 
      community: selectedCommunity, 
      parent_post: parentPost?.id 
    });
    setTitle('');
    setText('');
    setSelectedCommunity('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full mx-4 border border-white/20 shadow-2xl overflow-hidden">
        <DreamParticles />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#ffe0db]">
                  {isEditing ? 'Editar Post' : parentPost ? `Responder a "${parentPost.title}"` : 'Crear Nuevo Post'}
                </h2>
                <p className="text-[#ffe0db]/70">Comparte tu experiencia onírica</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#ffe0db]/60 hover:text-[#ffe0db] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {parentPost && (
            <div className="bg-[#9675bc]/20 rounded-2xl p-4 mb-6 border-l-4 border-[#f1b3be] relative overflow-hidden">
              <Shimmer className="rounded-2xl" />
              <div className="relative z-10">
                <p className="text-sm text-[#ffe0db]/70 mb-1">Post original:</p>
                <p className="text-sm font-medium text-[#ffe0db]">{parentPost.title}</p>
                <p className="text-xs text-[#ffe0db]/60 mt-1">{parentPost.text.substring(0, 100)}...</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#ffe0db] font-medium mb-2">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={50}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-[#ffe0db] placeholder-[#ffe0db]/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                placeholder="Título del post"
              />
            </div>
            
            {!isEditing && (
              <div>
                <label className="block text-[#ffe0db] font-medium mb-2">Comunidad</label>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  required
                  disabled={!!parentPost}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-[#ffe0db] focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                >
                  <option value="" className="bg-slate-800">Selecciona una comunidad</option>
                  {communities.map(community => (
                    <option key={community.id} value={community.id} className="bg-slate-800">
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-[#ffe0db] font-medium mb-2">Contenido</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                maxLength={2500}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-[#ffe0db] placeholder-[#ffe0db]/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none"
                placeholder="¿Qué tienes en mente?"
                rows={6}
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
              >
                {isEditing ? 'Actualizar' : parentPost ? 'Responder' : 'Crear Post'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-600/50 hover:bg-slate-600/70 text-[#ffe0db] py-4 px-6 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
              >
                Cancelar
              </button>
            </div>
          </form>
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
  const [activeTab, setActiveTab] = useState<'communities' | 'posts'>('communities');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('members');
  
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
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
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

  // Notification management
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const [communitiesData, postsData] = await Promise.all([
        apiService.getCommunities(),
        apiService.getPosts()
      ]);
      setCommunities(communitiesData);
      setPosts(postsData);
    } catch (error: any) {
      console.error('Error loading initial data:', error);
      addNotification({
        type: 'error',
        title: 'Error de Carga',
        message: error.message || 'Error al cargar los datos iniciales.'
      });
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Community CRUD operations
  const handleCreateCommunity = async (data: { name: string; description: string; profile_image?: File }) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Creando comunidad...');
      
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }
      
      await apiService.createCommunity(formData);
      const updatedCommunities = await apiService.getCommunities();
      setCommunities(updatedCommunities);
      
      addNotification({
        type: 'success',
        title: 'Comunidad Creada',
        message: `${data.name} se ha creado exitosamente`
      });
    } catch (error: any) {
      console.error('Error creating community:', error);
      addNotification({
        type: 'error',
        title: 'Error al Crear',
        message: error.message || 'Error al crear la comunidad.'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateCommunity = async (data: { name: string; description: string; profile_image?: File }) => {
    if (!editingCommunity) return;
    
    try {
      setIsActionLoading(true);
      setLoadingMessage('Actualizando comunidad...');
      
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }
      
      await apiService.updateCommunity(editingCommunity.id, formData);
      const updatedCommunities = await apiService.getCommunities();
      setCommunities(updatedCommunities);
      setEditingCommunity(null);
      
      addNotification({
        type: 'success',
        title: 'Comunidad Actualizada',
        message: `${data.name} se ha actualizado exitosamente`
      });
    } catch (error: any) {
      console.error('Error updating community:', error);
      addNotification({
        type: 'error',
        title: 'Error al Actualizar',
        message: error.message || 'Error al actualizar la comunidad.'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCommunity = async (communityId: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Eliminando comunidad...');
      
      await apiService.deleteCommunity(communityId);
      const updatedCommunities = await apiService.getCommunities();
      setCommunities(updatedCommunities);
      
      // Clear selected community if it was deleted
      if (selectedCommunity?.id === communityId) {
        setSelectedCommunity(null);
      }
      
      addNotification({
        type: 'success',
        title: 'Comunidad Eliminada',
        message: 'La comunidad ha sido eliminada exitosamente'
      });
    } catch (error: any) {
      console.error('Error deleting community:', error);
      addNotification({
        type: 'error',
        title: 'Error al Eliminar',
        message: error.message || 'Error al eliminar la comunidad.'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Actualizando membresía...');
      
      await apiService.joinCommunity(communityId);
      const updatedCommunities = await apiService.getCommunities();
      setCommunities(updatedCommunities);
      
      const community = updatedCommunities.find(c => c.id === communityId);
      const isMember = user && community?.users.some(u => u.id === user.id);
      
      addNotification({
        type: 'success',
        title: isMember ? 'Te has unido' : 'Has salido',
        message: isMember ? `Te has unido a ${community?.name}` : `Has salido de ${community?.name}`
      });
    } catch (error: any) {
      console.error('Error joining community:', error);
      addNotification({
        type: 'error',
        title: 'Error de Membresía',
        message: error.message || 'Error al actualizar la membresía.'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Post CRUD operations
  const handleCreatePost = async (data: { title: string; text: string; community: string; parent_post?: string }) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Creando post...');
      
      await apiService.createPost(data);
      const updatedPosts = await apiService.getPosts();
      setPosts(updatedPosts);
      setParentPost(null);
      
      addNotification({
        type: 'success',
        title: 'Post Creado',
        message: `${data.title} se ha creado exitosamente`
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      addNotification({
        type: 'error',
        title: 'Error al Crear',
        message: error.message || 'Error al crear el post.'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdatePost = async (data: { title: string; text: string; community: string; parent_post?: string }) => {
    if (!editingPost) return;
    
    try {
      setIsActionLoading(true);
      setLoadingMessage('Actualizando post...');
      
      await apiService.updatePost(editingPost.id, { title: data.title, text: data.text });
      const updatedPosts = await apiService.getPosts();
      setPosts(updatedPosts);
      setEditingPost(null);
      
      addNotification({
        type: 'success',
        title: 'Post Actualizado',
        message: `${data.title} se ha actualizado exitosamente`
      });
    } catch (error: any) {
      console.error('Error updating post:', error);
      addNotification({
        type: 'error',
        title: 'Error al Actualizar',
        message: error.message || 'Error al actualizar el post.'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Eliminando post...');
      
      await apiService.deletePost(postId);
      const updatedPosts = await apiService.getPosts();
      setPosts(updatedPosts);
      
      addNotification({
        type: 'success',
        title: 'Post Eliminado',
        message: 'El post ha sido eliminado exitosamente'
      });
    } catch (error: any) {
      console.error('Error deleting post:', error);
      addNotification({
        type: 'error',
        title: 'Error al Eliminar',
        message: error.message || 'Error al eliminar el post.'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Like/Dislike with optimistic updates
  const handleLikePost = async (postId: string) => {
    if (!user) {
      addNotification({
        type: 'warning',
        title: 'Inicia Sesión',
        message: 'Debes iniciar sesión para dar like a un post.'
      });
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
      await apiService.likePost(postId);
    } catch (error: any) {
      console.error('Error liking post:', error);
      setPosts(originalPosts);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al dar like al post.'
      });
    }
  };

  const handleDislikePost = async (postId: string) => {
    if (!user) {
      addNotification({
        type: 'warning',
        title: 'Inicia Sesión',
        message: 'Debes iniciar sesión para dar dislike a un post.'
      });
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
      await apiService.dislikePost(postId);
    } catch (error: any) {
      console.error('Error disliking post:', error);
      setPosts(originalPosts);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Error al dar dislike al post.'
      });
    }
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

  // Filtering and sorting
  const categories = [...new Set(communities.map(c => c.category).filter(Boolean))] as string[];
  
  const filteredCommunities = communities
    .filter(community => {
      const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (community.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'members': return b.users.length - a.users.length;
        case 'posts': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'trending': return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case 'name': return a.name.localeCompare(b.name);
        default: return a.name.localeCompare(b.name);
      }
    });

  const filteredPosts = posts.filter(post =>
    (!selectedCommunity || post.community.id === selectedCommunity.id) &&
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Check if user is owner
  const isCommunityOwner = (community: Community) => {
    return user && community.users.some(u => u.id === user.id);
  };

  const isPostOwner = (post: Post) => {
    return user && post.author.id === user.id;
  };

  if (isInitialLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#252c3e] via-[#214d72] to-[#4a5d7a] relative overflow-hidden">
      <DreamParticles />
      <FloatingOrbs />
      
      {/* Action Loaders */}
      {isActionLoading && <ActionLoader message={loadingMessage} />}

      {/* Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-4">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
      />

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
                  Centro de Comunidades Noctiria
                </h1>
                <p className="text-[#ffe0db]/70">Conecta con soñadores de todo el mundo</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('communities')}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  activeTab === 'communities'
                    ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white shadow-lg'
                    : 'text-[#ffe0db]/70 hover:text-[#ffe0db] hover:bg-white/10'
                }`}
              >
                Comunidades
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                  activeTab === 'posts'
                    ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white shadow-lg'
                    : 'text-[#ffe0db]/70 hover:text-[#ffe0db] hover:bg-white/10'
                }`}
              >
                Posts
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="flex-1 max-w-2xl">
            <SearchBar 
              onSearch={setSearchTerm}
              placeholder={`Buscar ${activeTab === 'communities' ? 'comunidades, temas, intereses' : 'posts, contenido'}...`}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {activeTab === 'communities' && (
              <FilterPanel
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            )}
            
            {activeTab === 'communities' && (
              <button
                onClick={() => openCommunityModal()}
                disabled={isActionLoading}
                className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>Crear Comunidad</span>
              </button>
            )}
            
            {activeTab === 'posts' && (
              <button
                onClick={() => openPostModal()}
                disabled={isActionLoading}
                className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#f1b3be] to-[#ffe0db] hover:from-[#ffe0db] hover:to-[#f1b3be] text-[#252c3e] rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>Nuevo Post</span>
              </button>
            )}
          </div>
        </div>

        {/* Community Filter for Posts */}
        {activeTab === 'posts' && (
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-[#ffe0db] flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filtrar por comunidad:</span>
              </span>
              <select
                value={selectedCommunity?.id || ''}
                onChange={(e) => {
                  const community = communities.find(c => c.id === e.target.value);
                  setSelectedCommunity(community || null);
                }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f1b3be] text-[#ffe0db] transition-all"
              >
                <option value="" className="bg-[#2a3f5f] text-[#ffe0db]">Todas las Comunidades</option>
                {communities.map(community => (
                  <option key={community.id} value={community.id} className="bg-[#2a3f5f] text-[#ffe0db]">
                    {community.name}
                  </option>
                ))}
              </select>
              {selectedCommunity && (
                <button
                  onClick={() => setSelectedCommunity(null)}
                  className="text-sm text-[#f1b3be] hover:text-[#ffe0db] transition-colors flex items-center space-x-1"
                >
                  <X className="w-3 h-3" />
                  <span>Limpiar filtro</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'communities' ? (
            <>
              {/* Featured Communities */}
              {filteredCommunities.some(c => c.featured) && (
                <div className="mb-16">
                  <div className="flex items-center space-x-3 mb-8">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-[#ffe0db]">Comunidades Destacadas</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCommunities
                      .filter(c => c.featured)
                      .map((community, index) => (
                        <CommunityCard
                          key={community.id}
                          community={community}
                          onClick={() => { setSelectedCommunity(community); setActiveTab('posts'); }}
                          onEdit={() => openCommunityModal(community)}
                          onDelete={() => showConfirmation(
                            'Eliminar Comunidad',
                            `¿Estás seguro de que deseas eliminar la comunidad "${community.name}"? Esta acción no se puede deshacer.`,
                            () => handleDeleteCommunity(community.id),
                            true
                          )}
                          onJoin={() => handleJoinCommunity(community.id)}
                          currentUser={user}
                          isOwner={isCommunityOwner(community)}
                          delay={index}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* All Communities */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-blue-400" />
                    <h2 className="text-3xl font-bold text-[#ffe0db]">
                      {selectedCategory === 'all' ? 'Todas las Comunidades' : `Comunidades de ${selectedCategory}`}
                    </h2>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-[#ffe0db]/80">
                      {filteredCommunities.length} comunidades
                    </span>
                  </div>
                </div>

                {filteredCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCommunities.map((community, index) => (
                      <CommunityCard
                        key={community.id}
                        community={community}
                        onClick={() => { setSelectedCommunity(community); setActiveTab('posts'); }}
                        onEdit={() => openCommunityModal(community)}
                        onDelete={() => showConfirmation(
                          'Eliminar Comunidad',
                          `¿Estás seguro de que deseas eliminar la comunidad "${community.name}"? Esta acción no se puede deshacer.`,
                          () => handleDeleteCommunity(community.id),
                          true
                        )}
                        onJoin={() => handleJoinCommunity(community.id)}
                        currentUser={user}
                        isOwner={isCommunityOwner(community)}
                        delay={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                      <Search className="w-16 h-16 text-white/40" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#ffe0db] mb-4">No se encontraron comunidades</h3>
                    <p className="text-[#ffe0db]/60 mb-8 max-w-md mx-auto">
                      No encontramos comunidades que coincidan con tu búsqueda. 
                      Intenta con otros términos o crea una nueva comunidad.
                    </p>
                    <div className="space-x-4">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[#ffe0db] transition-all duration-300"
                      >
                        <RefreshCw className="w-4 h-4 inline mr-2" />
                        Limpiar Filtros
                      </button>
                      <button
                        onClick={() => openCommunityModal()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-white transition-all duration-300 hover:scale-105"
                      >
                        Crear Nueva Comunidad
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className={`transform transition-all duration-700 ${
                      index === 0 ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <PostCard
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
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <MessageCircle className="w-16 h-16 text-white/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#ffe0db] mb-4">No se encontraron posts</h3>
                  <p className="text-[#ffe0db]/60 mb-8 max-w-md mx-auto">
                    {selectedCommunity 
                      ? `No hay posts en ${selectedCommunity.name} aún. Sé el primero en compartir algo.`
                      : 'No hay posts disponibles. Crea el primer post y comparte tu experiencia.'
                    }
                  </p>
                  <button
                    onClick={() => openPostModal()}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Crear Primer Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {activeTab === 'communities' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            {[
              { icon: Users, label: 'Soñadores Conectados', value: communities.reduce((acc, c) => acc + c.users.length, 0).toString(), color: 'from-purple-500 to-indigo-500' },
              { icon: MessageCircle, label: 'Experiencias Compartidas', value: posts.length.toString(), color: 'from-pink-500 to-rose-500' },
              { icon: Heart, label: 'Conexiones Creadas', value: posts.reduce((acc, p) => acc + p.likes.length, 0).toString(), color: 'from-red-500 to-pink-500' },
              { icon: Star, label: 'Comunidades Activas', value: communities.length.toString(), color: 'from-yellow-500 to-orange-500' }
            ].map((stat, index) => (
              <div key={stat.label} className="group relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-[#ffe0db] mb-2">{stat.value}</div>
                  <div className="text-[#ffe0db]/60 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
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
        communities={communities}
        parentPost={parentPost || undefined}
        post={editingPost || undefined}
        isEditing={!!editingPost}
      />

      <style>{`
        @keyframes dream-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.6;
          }
          33% { 
            transform: translateY(-20px) translateX(15px) rotate(120deg); 
            opacity: 1;
          }
          66% { 
            transform: translateY(10px) translateX(-10px) rotate(240deg); 
            opacity: 0.8;
          }
        }
        
        @keyframes float-gentle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
          }
          50% { 
            transform: translateY(-15px) translateX(8px) scale(1.1); 
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slide-in-down {
          0% { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-dream-float {
          animation: dream-float 6s ease-in-out infinite;
        }
        
        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-slide-in-down {
          animation: slide-in-down 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CommunityApp;