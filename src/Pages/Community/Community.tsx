import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, MessageSquare, User, Calendar, ThumbsUp, ThumbsDown, Loader2, Edit2, Trash2, Camera, UserPlus, UserMinus, Reply, X } from 'lucide-react';

// Types
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

// API Service
class ApiService {
  private baseURL = 'http://127.0.0.1:8000/api';

  private getHeaders(includeAuth = true) {
    const headers: Record<string, string> = {};
    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }
    
    return response.json();
  }

  // Communities API
  getCommunities = async (): Promise<Community[]> => {
    const response = await fetch(`${this.baseURL}/communities/`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  };

  createCommunity = async (data: FormData): Promise<Community> => {
    const response = await fetch(`${this.baseURL}/communities/`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: data
    });
    return this.handleResponse(response);
  };

  updateCommunity = async (id: string, data: FormData): Promise<Community> => {
    const response = await fetch(`${this.baseURL}/communities/specific/${id}/`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: data
    });
    return this.handleResponse(response);
  };

  deleteCommunity = async (id: string): Promise<void> => {
    const response = await fetch(`${this.baseURL}/communities/specific/${id}/`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }
  };

  joinCommunity = async (id: string): Promise<void> => {
    const response = await fetch(`${this.baseURL}/communities/join/${id}/`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  };

  getSimilarCommunities = async (name: string): Promise<Community[]> => {
    const response = await fetch(`${this.baseURL}/communities/${name}/`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  };

  // Posts API
  getPosts = async (): Promise<Post[]> => {
    const response = await fetch(`${this.baseURL}/communities/post/`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  };

  createPost = async (data: { title: string; text: string; community: string; parent_post?: string }): Promise<void> => {
    const response = await fetch(`${this.baseURL}/communities/post/`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  };

  updatePost = async (id: string, data: { title: string; text: string }): Promise<Post> => {
    const response = await fetch(`${this.baseURL}/communities/post/${id}/`, {
      method: 'PUT',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  };

  deletePost = async (id: string): Promise<void> => {
    const response = await fetch(`${this.baseURL}/communities/post/${id}/`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }
  };

  likePost = async (postId: string): Promise<void> => {
    const response = await fetch(`${this.baseURL}/communities/post/like/${postId}/`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  };

  dislikePost = async (postId: string): Promise<void> => {
    const response = await fetch(`${this.baseURL}/communities/post/dislike/${postId}/`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  };

  getPostsByCommunity = async (communityId: string): Promise<Post[]> => {
    const response = await fetch(`${this.baseURL}/communities/post/community/${communityId}/`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  };
}

const api = new ApiService();

// Dummy Auth Context
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

// Loading Components
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
    <div className="text-center">
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

// Error Components
const ErrorAlert: React.FC<{ 
  message: string; 
  onRetry?: () => void; 
  onClose: () => void 
}> = ({ message, onRetry, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
    <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-red-400/30 shadow-2xl text-center max-w-md mx-4">
      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white text-2xl">⚠</span>
      </div>
      <h3 className="text-lg font-semibold text-[#ffe0db] mb-2">Error</h3>
      <p className="text-sm text-[#ffe0db]/80 mb-6">{message}</p>
      <div className="flex space-x-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            Reintentar
          </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 bg-white/20 hover:bg-white/30 text-[#ffe0db] px-4 py-2 rounded-lg transition-all duration-200"
        >
          Cerrar
        </button>
      </div>
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
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl text-center max-w-md mx-4">
        <h3 className="text-lg font-semibold text-[#ffe0db] mb-2">{title}</h3>
        <p className="text-sm text-[#ffe0db]/80 mb-6">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              isDestructive 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                : 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/20 hover:bg-white/30 text-[#ffe0db] px-4 py-2 rounded-lg transition-all duration-200"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Community Card Component
const CommunityCard: React.FC<{ 
  community: Community; 
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onJoin?: () => void;
  currentUser?: User;
  isOwner?: boolean;
}> = ({ community, onClick, onEdit, onDelete, onJoin, currentUser, isOwner }) => {
  const isMember = currentUser && community.users.some(user => user.id === currentUser.id);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 cursor-pointer hover:bg-white/20 transition-all duration-200 transform hover:scale-[1.02] border border-white/20">
      <div className="flex items-center space-x-4" onClick={onClick}>
        {community.profile_image ? (
          <img src={community.profile_image} alt={community.name} className="w-12 h-12 rounded-full border-2 border-[#f1b3be] object-cover" />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">{community.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#ffe0db]">{community.name}</h3>
          <p className="text-[#ffe0db]/70 text-sm">{community.description || 'Sin descripción'}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-[#ffe0db]/60">
            <span className="flex items-center"><User className="w-3 h-3 mr-1" />{community.users.length} miembros</span>
            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{new Date(community.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
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
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
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
    </div>
  );
};

// Post Card Component
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
    <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-4 border border-white/20">
      {post.parent_post && (
        <div className="bg-[#9675bc]/20 rounded-lg p-3 mb-4 border-l-4 border-[#f1b3be]">
          <p className="text-sm text-[#ffe0db]/70">Respondiendo a:</p>
          <p className="text-sm font-medium text-[#ffe0db]">{post.parent_post.title}</p>
          <p className="text-xs text-[#ffe0db]/60 mt-1">{post.parent_post.text.substring(0, 100)}...</p>
        </div>
      )}
      
      {/* Post header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm font-medium text-white">{post.author.username.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-[#ffe0db]">{post.author.username}</span>
              <span className="text-[#ffe0db]/50 text-sm">•</span>
              <span className="text-[#ffe0db]/50 text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
              <span className="bg-gradient-to-r from-[#9675bc]/30 to-[#f1b3be]/30 text-[#ffe0db] text-xs px-2 py-1 rounded-full border border-[#f1b3be]/30">
                {post.community.name}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#ffe0db] mb-2">{post.title}</h3>
            <p className="text-[#ffe0db]/80 mb-4">{post.text}</p>
          </div>
        </div>
        
        {/* Action buttons for owner */}
        {isOwner && (
          <div className="flex space-x-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(post)}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                title="Editar post"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(post.id)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
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
        <button onClick={() => onLike(post.id)} className={`flex items-center space-x-1 text-sm transition-colors ${isLiked ? 'text-[#f1b3be]' : 'text-[#ffe0db]/60 hover:text-[#f1b3be]'}`}>
          <ThumbsUp className="w-4 h-4" /><span>{post.likes.length}</span>
        </button>
        <button onClick={() => onDislike(post.id)} className={`flex items-center space-x-1 text-sm transition-colors ${isDisliked ? 'text-red-400' : 'text-[#ffe0db]/60 hover:text-red-400'}`}>
          <ThumbsDown className="w-4 h-4" /><span>{post.dislikes.length}</span>
        </button>
        <button onClick={() => onReply(post)} className="flex items-center space-x-1 text-sm text-[#ffe0db]/60 hover:text-[#ffe0db] transition-colors">
          <Reply className="w-4 h-4" /><span>Responder</span>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Editar Comunidad' : 'Crear Nueva Comunidad'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de Perfil</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={30}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la comunidad"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={450}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la comunidad"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Editar Post' : parentPost ? `Responder a "${parentPost.title}"` : 'Crear Nuevo Post'}
        </h2>
        
        {parentPost && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Post original:</p>
            <p className="text-sm font-medium">{parentPost.title}</p>
            <p className="text-xs text-gray-500">{parentPost.text.substring(0, 100)}...</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título del post"
            />
          </div>
          
          {!isEditing && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comunidad</label>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                required
                disabled={!!parentPost}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una comunidad</option>
                {communities.map(community => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              maxLength={2500}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="¿Qué tienes en mente?"
              rows={4}
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditing ? 'Actualizar' : parentPost ? 'Responder' : 'Crear Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
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

  // Error handling
  const handleApiError = (error: any, defaultMessage: string): string => {
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
      const [communitiesData, postsData] = await Promise.all([
        api.getCommunities(),
        api.getPosts()
      ]);
      setCommunities(communitiesData);
      setPosts(postsData);
    } catch (error: any) {
      console.error('Error loading initial data:', error);
      setError(handleApiError(error, 'Error al cargar los datos iniciales.'));
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
      
      // Clear selected community if it was deleted
      if (selectedCommunity?.id === communityId) {
        setSelectedCommunity(null);
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
    } catch (error: any) {
      console.error('Error joining community:', error);
      setError(handleApiError(error, 'Error al actualizar la membresía.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  // Post CRUD operations
  const handleCreatePost = async (data: { title: string; text: string; community: string; parent_post?: string }) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Creando post...');
      setError(null);
      
      await api.createPost(data);
      const updatedPosts = await api.getPosts();
      setPosts(updatedPosts);
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
      const updatedPosts = await api.getPosts();
      setPosts(updatedPosts);
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
      const updatedPosts = await api.getPosts();
      setPosts(updatedPosts);
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setError(handleApiError(error, 'Error al eliminar el post.'));
    } finally {
      setIsActionLoading(false);
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

  // Filtering
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post =>
    (!selectedCommunity || post.community.id === selectedCommunity.id) &&
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Check if user is owner
  const isCommunityOwner = (community: Community) => {
    // Since we don't have owner info in the model, we can assume first member or check another way
    // For now, let's assume all users can edit their communities
    return user && community.users.some(u => u.id === user.id);
  };

  const isPostOwner = (post: Post) => {
    return user && post.author.id === user.id;
  };

  if (isInitialLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a]">
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

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
              Centro de Comunidades
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('communities')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'communities'
                    ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white shadow-lg'
                    : 'text-[#ffe0db]/70 hover:text-[#ffe0db] hover:bg-white/10'
                }`}
              >
                Comunidades
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ffe0db]/50 w-5 h-5" />
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'communities' ? 'comunidades' : 'posts'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b3be] text-[#ffe0db] placeholder-[#ffe0db]/50"
            />
          </div>
          
          <div className="flex space-x-3">
            {activeTab === 'communities' && (
              <button
                onClick={() => openCommunityModal()}
                disabled={isActionLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Comunidad</span>
              </button>
            )}
            
            {activeTab === 'posts' && (
              <button
                onClick={() => openPostModal()}
                disabled={isActionLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#f1b3be] to-[#ffe0db] hover:from-[#ffe0db] hover:to-[#f1b3be] text-[#1a1f35] px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Post</span>
              </button>
            )}
          </div>
        </div>

        {/* Community Filter for Posts */}
        {activeTab === 'posts' && (
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-[#ffe0db]">Filtrar por comunidad:</span>
              <select
                value={selectedCommunity?.id || ''}
                onChange={(e) => {
                  const community = communities.find(c => c.id === e.target.value);
                  setSelectedCommunity(community || null);
                }}
                className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b3be] text-[#ffe0db]"
              >
                <option value="">Todas las Comunidades</option>
                {communities.map(community => (
                  <option key={community.id} value={community.id} className="bg-[#2a3f5f] text-[#ffe0db]">
                    {community.name}
                  </option>
                ))}
              </select>
              {selectedCommunity && (
                <button
                  onClick={() => setSelectedCommunity(null)}
                  className="text-sm text-[#f1b3be] hover:text-[#ffe0db] transition-colors"
                >
                  Limpiar filtro
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'communities' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map(community => (
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
                />
              ))}
              {filteredCommunities.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#ffe0db]/70">No se encontraron comunidades</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => (
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
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#ffe0db]/70">No se encontraron posts</p>
                </div>
              )}
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
    </div>
  );
};

export default CommunityApp;