import React, { useState, useEffect } from 'react';
import { Plus, Search, MessageSquare, User, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useForm } from 'react-hook-form';

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
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://127.0.0.1:8000/api',
      headers: { 'Content-Type': 'application/json' },
    });
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
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
  getCommunities = async (): Promise<Community[]> => (await this.axiosInstance.get('/communities/')).data;
  createCommunity = async (data: { name: string; description?: string }): Promise<Community> =>
    (await this.axiosInstance.post('/communities/', data)).data;
  getPosts = async (): Promise<Post[]> => (await this.axiosInstance.get('/communities/post/')).data;
  createPost = async (data: { title: string; text: string; community: string; parent_post?: string }): Promise<void> =>
    await this.axiosInstance.post('/communities/post/', data);
  likePost = async (postId: string): Promise<void> => await this.axiosInstance.patch(`/communities/post/like/${postId}/`);
  dislikePost = async (postId: string): Promise<void> => await this.axiosInstance.patch(`/communities/post/dislike/${postId}/`);
}
const api = new ApiService();

// Dummy Auth Context
const useAuth = () => {
  const userData = localStorage.getItem('user_data');
  let user: User | undefined = undefined;
  try { user = userData ? JSON.parse(userData) : undefined; } catch { user = undefined; }
  return { user };
};

// Components
const CommunityCard: React.FC<{ community: Community; onClick: () => void }> = ({ community, onClick }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 cursor-pointer hover:bg-white/20 transition-all duration-200 transform hover:scale-[1.02] border border-white/20" onClick={onClick}>
    <div className="flex items-center space-x-4">
      {community.profile_image ? (
        <img src={community.profile_image} alt={community.name} className="w-12 h-12 rounded-full border-2 border-[#f1b3be]" />
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
  </div>
);

const PostCard: React.FC<{
  post: Post;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onReply: (post: Post) => void;
  currentUser?: User;
}> = React.memo(({ post, onLike, onDislike, onReply, currentUser }) => {
  const isLiked = currentUser && post.likes.some(user => user.id === currentUser.id);
  const isDisliked = currentUser && post.dislikes.some(user => user.id === currentUser.id);
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-4 border border-white/20">
      {post.parent_post && (
        <div className="bg-[#9675bc]/20 rounded-lg p-3 mb-4 border-l-4 border-[#f1b3be]">
          <p className="text-sm text-[#ffe0db]/70">Respondiendo a:</p>
          <p className="text-sm font-medium text-[#ffe0db]">{post.parent_post.title}</p>
        </div>
      )}
      <div className="flex items-start space-x-3">
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
          <div className="flex items-center space-x-6">
            <button onClick={() => onLike(post.id)} className={`flex items-center space-x-1 text-sm transition-colors ${isLiked ? 'text-[#f1b3be]' : 'text-[#ffe0db]/60 hover:text-[#f1b3be]'}`}>
              <ThumbsUp className="w-4 h-4" /><span>{post.likes.length}</span>
            </button>
            <button onClick={() => onDislike(post.id)} className={`flex items-center space-x-1 text-sm transition-colors ${isDisliked ? 'text-red-400' : 'text-[#ffe0db]/60 hover:text-red-400'}`}>
              <ThumbsDown className="w-4 h-4" /><span>{post.dislikes.length}</span>
            </button>
            <button onClick={() => onReply(post)} className="flex items-center space-x-1 text-sm text-[#ffe0db]/60 hover:text-[#ffe0db] transition-colors">
              <MessageSquare className="w-4 h-4" /><span>Responder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Create Community Modal (react-hook-form)
const CreateCommunityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm<{ name: string; description: string }>();
  const submit = (data: { name: string; description: string }) => {
    onSubmit(data);
    reset();
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Community</h2>
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input {...register('name', { required: true, maxLength: 30 })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Community name" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea {...register('description', { maxLength: 450 })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Community description" rows={3} />
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Create</button>
            <button type="button" onClick={() => { reset(); onClose(); }} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Post Modal (react-hook-form)
const CreatePostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; text: string; community: string; parent_post?: string }) => void;
  communities: Community[];
  parentPost?: Post;
}> = ({ isOpen, onClose, onSubmit, communities, parentPost }) => {
  const { register, handleSubmit, reset } = useForm<{ title: string; text: string; community: string }>();
  const submit = (data: { title: string; text: string; community: string }) => {
    onSubmit({ ...data, parent_post: parentPost?.id });
    reset();
    onClose();
  };
  useEffect(() => { reset(); }, [isOpen, parentPost, reset]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{parentPost ? `Reply to "${parentPost.title}"` : 'Create New Post'}</h2>
        {parentPost && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Original post:</p>
            <p className="text-sm font-medium">{parentPost.title}</p>
            <p className="text-xs text-gray-500">{parentPost.text.substring(0, 100)}...</p>
          </div>
        )}
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input {...register('title', { required: true, maxLength: 50 })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Post title" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Community</label>
            <select {...register('community', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={!!parentPost}>
              <option value="">Select a community</option>
              {communities.map(community => (
                <option key={community.id} value={community.id}>{community.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea {...register('text', { required: true, maxLength: 2500 })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What's on your mind?" rows={4} />
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">{parentPost ? 'Reply' : 'Create Post'}</button>
            <button type="button" onClick={() => { reset(); onClose(); }} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
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
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [parentPost, setParentPost] = useState<Post | null>(null);

  // Cargar comunidades y posts solo una vez al inicio
  useEffect(() => {
    api.getCommunities().then(setCommunities);
    api.getPosts().then(setPosts);
  }, []);

  // Crear comunidad y recargar solo comunidades
  const handleCreateCommunity = async (data: { name: string; description: string }) => {
    await api.createCommunity(data);
    api.getCommunities().then(setCommunities);
  };

  // Crear post y recargar solo posts
  const handleCreatePost = async (data: { title: string; text: string; community: string; parent_post?: string }) => {
    await api.createPost(data);
    api.getPosts().then(setPosts);
  };

  // Likes y dislikes optimistas
  const handleLikePost = async (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: user ? [...post.likes, user] : post.likes,
              dislikes: post.dislikes.filter(u => u.id !== user?.id),
            }
          : post
      )
    );
    await api.likePost(postId);
  };

  const handleDislikePost = async (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              dislikes: user ? [...post.dislikes, user] : post.dislikes,
              likes: post.likes.filter(u => u.id !== user?.id),
            }
          : post
      )
    );
    await api.dislikePost(postId);
  };

  const handleReply = (post: Post) => {
    setParentPost(post);
    setShowCreatePost(true);
  };

  // Filtrado local, instantáneo
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts
    .filter(post =>
      (!selectedCommunity || post.community.id === selectedCommunity.id) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.text.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a]">
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
                onClick={() => setShowCreateCommunity(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Comunidad</span>
              </button>
            )}
            {activeTab === 'posts' && (
              <button
                onClick={() => { setParentPost(null); setShowCreatePost(true); }}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#f1b3be] to-[#ffe0db] hover:from-[#ffe0db] hover:to-[#f1b3be] text-[#1a1f35] px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
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
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLikePost}
                  onDislike={handleDislikePost}
                  onReply={handleReply}
                  currentUser={user}
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
      <CreateCommunityModal
        isOpen={showCreateCommunity}
        onClose={() => setShowCreateCommunity(false)}
        onSubmit={handleCreateCommunity}
      />
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => {
          setShowCreatePost(false);
          setParentPost(null);
        }}
        onSubmit={handleCreatePost}
        communities={communities}
        parentPost={parentPost || undefined}
      />
    </div>
  );
};

export default CommunityApp;