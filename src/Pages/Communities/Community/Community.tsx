import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { DashboardFooter } from '../../Dashboard/components/DashboardFooter';

// Importar todos los componentes modulares
import type { User, Community, Post, FilterType, SortType } from './CommunityComponents/types';
import { api } from './CommunityComponents/ApiService';
import { UniversalLoader, ActionLoadingModal } from './CommunityComponents/LoadingComponents';
import { ErrorAlert, ConfirmationModal } from './CommunityComponents/ModalComponents';
import { FilterDropdown } from './CommunityComponents/FilterAndAvatarComponents';
import { MembersModal } from './CommunityComponents/MembersModal';
import { CommunityCard } from './CommunityComponents/CommunityCard';
import { PostCard } from './CommunityComponents/PostComponents';
import { CommunityModal, PostModal } from './CommunityComponents/CommunityPostModals';

// Hook de autenticación
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

// Función de manejo de errores
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

// Main Community Component
const CommunityApp: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'communities' | 'community-posts'>('communities');
  
  // Filter states
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortType>('created-desc');
  
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
  const loadCommunityPosts = useCallback(
    async (communityId: string, showLoader: boolean = true) => {
      try {
        if (showLoader) setIsActionLoading(true);
        setLoadingMessage('Cargando posts...');
        setError(null);
        const postsData = await api.getPostsByCommunity(communityId);
        setPosts(postsData);
      } catch (error: any) {
        setError(handleApiError(error, 'Error al cargar los posts de la comunidad.'));
      } finally {
        if (showLoader) setIsActionLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Community handlers
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
      await api.createCommunity(formData);
      await loadInitialData();
      setShowCommunityModal(false);
    } catch (error: any) {
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
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }
      await api.updateCommunity(editingCommunity.id, formData);
      await loadInitialData();
      setEditingCommunity(null);
      setShowCommunityModal(false);
      if (selectedCommunity?.id === editingCommunity.id) {
        const updated = communities.find(c => c.id === editingCommunity.id);
        if (updated) setSelectedCommunity(updated);
      }
    } catch (error: any) {
      setError(handleApiError(error, 'Error al actualizar la comunidad.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCommunity = async (id: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Eliminando comunidad...');
      await api.deleteCommunity(id);
      await loadInitialData();
      if (selectedCommunity?.id === id) {
        setSelectedCommunity(null);
        setCurrentView('communities');
      }
    } catch (error: any) {
      setError(handleApiError(error, 'Error al eliminar la comunidad.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleJoinCommunity = async (id: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Procesando...');
      await api.joinCommunity(id);
      await loadInitialData();
      if (selectedCommunity?.id === id) {
        const updated = communities.find(c => c.id === id);
        if (updated) setSelectedCommunity(updated);
      }
    } catch (error: any) {
      setError(handleApiError(error, 'Error al unirse/salir de la comunidad.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  // Post handlers
  const handleCreatePost = async (data: { title: string; text: string; community: string; parent_post?: string }) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Creando post...');
      await api.createPost(data);
      if (selectedCommunity) {
        await loadCommunityPosts(selectedCommunity.id, false);
      }
      setShowPostModal(false);
      setParentPost(null);
    } catch (error: any) {
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
      await api.updatePost(editingPost.id, { title: data.title, text: data.text });
      if (selectedCommunity) {
        await loadCommunityPosts(selectedCommunity.id, false);
      }
      setEditingPost(null);
      setShowPostModal(false);
    } catch (error: any) {
      setError(handleApiError(error, 'Error al actualizar el post.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setIsActionLoading(true);
      setLoadingMessage('Eliminando post...');
      await api.deletePost(postId);
      if (selectedCommunity) {
        await loadCommunityPosts(selectedCommunity.id, false);
      }
    } catch (error: any) {
      setError(handleApiError(error, 'Error al eliminar el post.'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await api.likePost(postId);
      if (selectedCommunity) {
        await loadCommunityPosts(selectedCommunity.id, false);
      }
    } catch (error: any) {
      setError(handleApiError(error, 'Error al dar like.'));
    }
  };

  const handleDislikePost = async (postId: string) => {
    try {
      await api.dislikePost(postId);
      if (selectedCommunity) {
        await loadCommunityPosts(selectedCommunity.id, false);
      }
    } catch (error: any) {
      setError(handleApiError(error, 'Error al dar dislike.'));
    }
  };

  // Filter and sort communities
  const getFilteredAndSortedCommunities = () => {
    let filtered = communities;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply membership filter
    if (user && filterBy === 'member') {
      filtered = filtered.filter(c => c.users.some(u => u.id === user.id));
    } else if (user && filterBy === 'non-member') {
      filtered = filtered.filter(c => !c.users.some(u => u.id === user.id));
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
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
          return 0;
      }
    });

    return sorted;
  };

  const filteredCommunities = getFilteredAndSortedCommunities();

  // Loading screen
  if (isInitialLoading) {
    return <UniversalLoader message="Cargando Centro de Comunidades..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple relative overflow-hidden overscroll-none">
      
      {/* Background decorations - Más dinámicos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-float blur-sm"
            style={{
              width: `${Math.random() * 250 + 100}px`,
              height: `${Math.random() * 250 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 25 + 15}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 px-3 sm:px-6 py-4 sm:py-8">
        
        {/* Header - Completamente responsivo */}
        <div className="max-w-7xl mx-auto">
          {currentView === 'communities' ? (
            // Communities view header
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col space-y-4 sm:space-y-6">
                {/* Botón de regreso y título */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  {/* Botón regresar a Dashboard */}
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="p-2 sm:p-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-oniria_lightpink hover:bg-white/20 hover:scale-105 transition-all duration-300 flex-shrink-0 group"
                    title="Regresar al Dashboard"
                  >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-oniria_lightpink mb-2 animate-fade-in-up">
                      Centro de Comunidades
                    </h1>
                    <p className="text-oniria_lightpink/70 text-sm sm:text-base animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      Explora y únete a comunidades oníricas
                    </p>
                  </div>
                  
                  {/* Botón crear en desktop junto al título */}
                  {user && (
                    <button
                      onClick={() => {
                        setEditingCommunity(null);
                        setShowCommunityModal(true);
                      }}
                      className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl font-semibold text-sm sm:text-base animate-fade-in-up"
                      style={{ animationDelay: '0.2s' }}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Crear Comunidad</span>
                    </button>
                  )}
                </div>

                {/* Botón crear en móvil - full width */}
                {user && (
                  <button
                    onClick={() => {
                      setEditingCommunity(null);
                      setShowCommunityModal(true);
                    }}
                    className="sm:hidden flex items-center justify-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm w-full"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Comunidad</span>
                  </button>
                )}

                {/* Search and Filter - Stack en móvil */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  {/* Search bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-oniria_lightpink/60 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Buscar comunidades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-oniria_lightpink placeholder-oniria_lightpink/50 focus:outline-none focus:ring-2 focus:ring-oniria_pink focus:bg-white/15 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                  
                  {/* Filter dropdown */}
                  <FilterDropdown
                    filterBy={filterBy}
                    setFilterBy={setFilterBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    currentUser={user}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Community posts view header - Responsivo
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col space-y-4">
                {/* Back button y título */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <button
                    onClick={() => {
                      setSelectedCommunity(null);
                      setCurrentView('communities');
                    }}
                    className="p-2 sm:p-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-oniria_lightpink hover:bg-white/20 transition-all duration-300 flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-oniria_lightpink mb-1 sm:mb-2 truncate">
                      {selectedCommunity?.name}
                    </h1>
                    <p className="text-oniria_lightpink/70 text-xs sm:text-sm line-clamp-2">
                      {selectedCommunity?.description}
                    </p>
                  </div>
                </div>

                {/* Actions - Stack en móvil */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Members button - Más prominente */}
                  {selectedCommunity && (
                    <button
                      onClick={() => setShowMembersModal(true)}
                      className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2.5 text-oniria_lightpink transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <span className="font-medium">
                        Ver {selectedCommunity.users.length} {selectedCommunity.users.length === 1 ? 'miembro' : 'miembros'}
                      </span>
                    </button>
                  )}

                  {/* Create post button */}
                  {user && selectedCommunity && (
                    <button
                      onClick={() => {
                        setEditingPost(null);
                        setParentPost(null);
                        setShowPostModal(true);
                      }}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Nuevo Post</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto">
          {currentView === 'communities' ? (
            // Communities Grid - Responsivo
            filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCommunities.map((community, index) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    onClick={() => {
                      setSelectedCommunity(community);
                      setCurrentView('community-posts');
                      loadCommunityPosts(community.id);
                    }}
                    onEdit={() => {
                      setEditingCommunity(community);
                      setShowCommunityModal(true);
                    }}
                    onDelete={() => {
                      setConfirmModal({
                        isOpen: true,
                        title: 'Eliminar Comunidad',
                        message: `¿Estás seguro de que quieres eliminar "${community.name}"? Esta acción no se puede deshacer.`,
                        onConfirm: () => {
                          handleDeleteCommunity(community.id);
                          setConfirmModal({ ...confirmModal, isOpen: false });
                        },
                        isDestructive: true
                      });
                    }}
                    onJoin={() => handleJoinCommunity(community.id)}
                    onShowMembers={() => {
                      setSelectedCommunity(community);
                      setShowMembersModal(true);
                    }}
                    currentUser={user}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              // Empty state
              <div className="text-center py-12 sm:py-20">
                <div className="max-w-md mx-auto px-4">
                  <div className="text-6xl sm:text-7xl mb-4 sm:mb-6">🔍</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-oniria_lightpink mb-2 sm:mb-3">
                    No se encontraron comunidades
                  </h3>
                  <p className="text-oniria_lightpink/70 mb-4 sm:mb-6 text-sm sm:text-base">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : '¡Sé el primero en crear una comunidad!'}
                  </p>
                  {user && !searchTerm && (
                    <button
                      onClick={() => setShowCommunityModal(true)}
                      className="bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base"
                    >
                      Crear Primera Comunidad
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            // Posts List
            <div className="max-w-4xl mx-auto">
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLikePost}
                    onDislike={handleDislikePost}
                    onReply={(post) => {
                      setParentPost(post);
                      setShowPostModal(true);
                    }}
                    onEdit={(post) => {
                      setEditingPost(post);
                      setShowPostModal(true);
                    }}
                    onDelete={(postId) => {
                      setConfirmModal({
                        isOpen: true,
                        title: 'Eliminar Post',
                        message: '¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.',
                        onConfirm: () => {
                          handleDeletePost(postId);
                          setConfirmModal({ ...confirmModal, isOpen: false });
                        },
                        isDestructive: true
                      });
                    }}
                    currentUser={user}
                    isOwner={user?.id === post.author.id}
                  />
                ))
              ) : (
                // Empty posts state
                <div className="text-center py-12 sm:py-20">
                  <div className="max-w-md mx-auto px-4">
                    <div className="text-6xl sm:text-7xl mb-4 sm:mb-6">💭</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-oniria_lightpink mb-2 sm:mb-3">
                      No hay posts aún
                    </h3>
                    <p className="text-oniria_lightpink/70 mb-4 sm:mb-6 text-sm sm:text-base">
                      ¡Sé el primero en compartir algo!
                    </p>
                    {user && (
                      <button
                        onClick={() => setShowPostModal(true)}
                        className="bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base"
                      >
                        Crear Primer Post
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-12 sm:mt-20">
        <DashboardFooter />
      </div>

      {/* Modals */}
      <ActionLoadingModal isOpen={isActionLoading} message={loadingMessage} />
      
      {error && (
        <ErrorAlert
          message={error}
          onClose={() => setError(null)}
          onRetry={() => {
            setError(null);
            loadInitialData();
          }}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
      />

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
        <>
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

          <MembersModal
            isOpen={showMembersModal}
            onClose={() => setShowMembersModal(false)}
            community={selectedCommunity}
          />
        </>
      )}
    </div>
  );
};

export default CommunityApp;