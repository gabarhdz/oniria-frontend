import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MessageCircle, Search, Clock, CheckCheck, Loader2, User, ArrowLeft, 
  Filter, Sparkles, Star, MoreVertical, Archive, Pin, Volume2, VolumeX, 
  RefreshCw, Bell, BellOff, Trash2, Check
} from 'lucide-react';

// ==================== TYPES ====================
interface UserType {
  id: string;
  username: string;
  profile_pic?: string;
  is_psychologist?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  user: UserType;
  psychologist: UserType;
  last_message?: Message;
  unread_count: number;
  updated_at: string;
  is_pinned?: boolean;
  is_muted?: boolean;
  is_archived?: boolean;
}

interface ChatNotification {
  id: string;
  type: 'new_message' | 'message_read';
  conversation_id: string;
  message: Message;
  sender: UserType;
  created_at: string;
}

// ==================== CUSTOM HOOKS ====================

// Hook para manejar WebSocket de notificaciones de chat
const useChatNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar audio
  useEffect(() => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audioRef.current = audio;
  }, []);

  const playNotificationSound = useCallback(() => {
    const soundEnabled = localStorage.getItem('chat_notification_sound') !== 'false';
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (!userId || wsRef.current?.readyState === WebSocket.OPEN) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      wsRef.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/notifications/?token=${token}`
      );

      wsRef.current.onopen = () => {
        console.log('✅ Chat notifications WebSocket connected');
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'new_message') {
            setNotifications(prev => [data, ...prev]);
            playNotificationSound();
            
            // Mostrar notificación del navegador
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Nuevo mensaje de ${data.sender.username}`, {
                body: data.message.content.substring(0, 100),
                icon: data.sender.profile_pic || '/img/Oniria.svg',
                badge: '/img/Oniria.svg',
              });
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ Chat notifications WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('🔌 Chat notifications WebSocket closed');
        setIsConnected(false);
        
        // Reconectar después de 5 segundos
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('🔄 Reconnecting chat notifications...');
          connectWebSocket();
        }, 5000);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [userId, playNotificationSound]);

  useEffect(() => {
    if (userId) {
      connectWebSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [userId, connectWebSocket]);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  return {
    notifications,
    isConnected,
    clearNotification,
    playNotificationSound
  };
};

// ==================== COMPONENTS ====================

// Componente de estrellas parpadeantes
const TwinklingStars: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-gradient-to-r from-[#f1b3be] to-[#ffe0db] animate-twinkle opacity-60"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Componente de notificaciones de chat
const ChatNotificationBell: React.FC<{
  notifications: ChatNotification[];
  onClear: (id: string) => void;
}> = ({ notifications, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('chat_notification_sound') !== 'false';
  });

  const unreadCount = notifications.length;

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('chat_notification_sound', newValue.toString());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105"
        title="Notificaciones de chat"
      >
        {unreadCount > 0 ? (
          <MessageCircle className="w-6 h-6 text-[#f1b3be] animate-bounce" />
        ) : (
          <MessageCircle className="w-6 h-6 text-[#f1b3be]" />
        )}
        
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#f1b3be] to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 bg-[#252c3e]/95 backdrop-blur-xl border border-[#ffe0db]/20 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-[#ffe0db]/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[#ffe0db]">
                Mensajes
              </h3>
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-lg transition-all ${
                  soundEnabled 
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#ffe0db]/50" />
                )}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-80 p-2">
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className="p-3 mb-2 bg-[#ffe0db]/10 hover:bg-[#ffe0db]/20 rounded-lg transition-all cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    window.location.href = `/chat/${notif.conversation_id}`;
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notif.sender.profile_pic ? (
                        <img
                          src={notif.sender.profile_pic}
                          alt={notif.sender.username}
                          className="w-10 h-10 rounded-full border-2 border-[#f1b3be]/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9675bc] to-[#f1b3be] flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {notif.sender.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#ffe0db] truncate">
                        {notif.sender.username}
                      </h4>
                      <p className="text-xs text-[#ffe0db]/70 line-clamp-2">
                        {notif.message.content}
                      </p>
                      <p className="text-xs text-[#ffe0db]/50 mt-1">
                        {new Date(notif.created_at).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClear(notif.id);
                      }}
                      className="flex-shrink-0 p-1 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-[#f1b3be]/30 mx-auto mb-3" />
                <p className="text-[#ffe0db]/70 text-sm">
                  No hay mensajes nuevos
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal mejorado
const EnhancedConversationsList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'pinned' | 'archived' | 'muted'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentUserId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user_data') || '{}').id;
    } catch {
      return null;
    }
  });

  // Hook de notificaciones de chat
  const { 
    notifications: chatNotifications, 
    isConnected: isChatConnected,
    clearNotification,
    playNotificationSound 
  } = useChatNotifications(currentUserId);

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Cargar conversaciones
  useEffect(() => {
    loadConversations();
  }, []);

  // Actualizar conversaciones cuando llegan notificaciones nuevas
  useEffect(() => {
    if (chatNotifications.length > 0) {
      loadConversations();
    }
  }, [chatNotifications.length]);

  // Filtrar conversaciones
  useEffect(() => {
    let filtered = conversations.filter(conv => {
      const otherUser = conv.user.id === currentUserId ? conv.psychologist : conv.user;
      const matchesSearch = otherUser.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      switch (filterType) {
        case 'unread':
          return conv.unread_count > 0;
        case 'pinned':
          return conv.is_pinned;
        case 'archived':
          return conv.is_archived;
        case 'muted':
          return conv.is_muted;
        default:
          return !conv.is_archived;
      }
    });

    // Ordenar: pinned primero, luego por fecha
    filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    setFilteredConversations(filtered);
  }, [conversations, searchTerm, filterType, currentUserId]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        'http://127.0.0.1:8000/api/chat/conversations/',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      // Recuperar estados de localStorage
      const savedStates = JSON.parse(localStorage.getItem('conversation_states') || '{}');

      setConversations(data.map((conv: Conversation) => ({
        ...conv,
        is_pinned: savedStates[conv.id]?.is_pinned || false,
        is_muted: savedStates[conv.id]?.is_muted || false,
        is_archived: savedStates[conv.id]?.is_archived || false
      })));
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConversationStates = (updatedConversations: Conversation[]) => {
    const states = updatedConversations.reduce((acc, conv) => {
      acc[conv.id] = {
        is_pinned: conv.is_pinned,
        is_muted: conv.is_muted,
        is_archived: conv.is_archived
      };
      return acc;
    }, {} as Record<string, any>);
    
    localStorage.setItem('conversation_states', JSON.stringify(states));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const getUserInitials = (username: string) => {
    return username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getOtherUser = (conversation: Conversation) => {
    return conversation.user.id === currentUserId 
      ? conversation.psychologist 
      : conversation.user;
  };

  const togglePin = (convId: string) => {
    const updated = conversations.map(conv => 
      conv.id === convId ? { ...conv, is_pinned: !conv.is_pinned } : conv
    );
    setConversations(updated);
    saveConversationStates(updated);
  };

  const toggleMute = (convId: string) => {
    const updated = conversations.map(conv => 
      conv.id === convId ? { ...conv, is_muted: !conv.is_muted } : conv
    );
    setConversations(updated);
    saveConversationStates(updated);
  };

  const archiveConversation = (convId: string) => {
    const updated = conversations.map(conv => 
      conv.id === convId ? { ...conv, is_archived: !conv.is_archived } : conv
    );
    setConversations(updated);
    saveConversationStates(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <TwinklingStars count={40} />
        <div className="text-center z-10">
          <Loader2 className="w-16 h-16 text-[#f1b3be] animate-spin mx-auto mb-4" />
          <p className="text-[#ffe0db] text-xl">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      {/* Efectos de fondo */}
      <TwinklingStars count={40} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]"></div>

      {/* Header */}
      <header className={`relative z-10 p-6 border-b border-[#f1b3be]/20 backdrop-blur-xl bg-[#252c3e]/30 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center space-x-3 text-[#ffe0db]/80 hover:text-[#ffe0db] transition-colors group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <h1 className="text-2xl font-bold text-[#ffe0db]">Mis Conversaciones</h1>
              <p className="text-[#f1b3be]">
                Chat con psicólogos {isChatConnected && <span className="text-emerald-400">● En línea</span>}
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-[#f1b3be] animate-pulse" />
          </div>

          {/* Chat Notifications Bell */}
          <ChatNotificationBell
            notifications={chatNotifications}
            onClear={clearNotification}
          />
        </div>
      </header>

      {/* Contenido principal */}
      <main className={`relative z-10 p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Stats card */}
          <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-6 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] to-indigo-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-[#ffe0db]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffe0db]">{conversations.length}</div>
                    <div className="text-[#ffe0db]/60 text-sm">Total</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f1b3be] to-rose-500 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#ffe0db]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffe0db]">
                      {conversations.filter(c => c.unread_count > 0).length}
                    </div>
                    <div className="text-[#ffe0db]/60 text-sm">No leídos</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-[#ffe0db] rounded-xl flex items-center justify-center">
                    <Pin className="w-6 h-6 text-[#252c3e]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffe0db]">
                      {conversations.filter(c => c.is_pinned).length}
                    </div>
                    <div className="text-[#ffe0db]/60 text-sm">Fijados</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <VolumeX className="w-6 h-6 text-[#ffe0db]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffe0db]">
                      {conversations.filter(c => c.is_muted).length}
                    </div>
                    <div className="text-[#ffe0db]/60 text-sm">Silenciados</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Archive className="w-6 h-6 text-[#ffe0db]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffe0db]">
                      {conversations.filter(c => c.is_archived).length}
                    </div>
                    <div className="text-[#ffe0db]/60 text-sm">Archivados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ffe0db]/60" />
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#ffe0db]/10 backdrop-blur-sm border border-[#ffe0db]/20 rounded-xl text-[#ffe0db] placeholder-[#ffe0db]/50 focus:outline-none focus:ring-2 focus:ring-[#f1b3be] transition-all"
                />
              </div>

              <div className="flex space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center space-x-2 px-4 py-3 bg-[#ffe0db]/10 hover:bg-[#ffe0db]/20 backdrop-blur-sm border border-[#ffe0db]/20 rounded-xl text-[#ffe0db] transition-all"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="capitalize">
                      {filterType === 'all' ? 'Todos' : 
                       filterType === 'unread' ? 'No leídos' :
                       filterType === 'pinned' ? 'Fijados' :
                       filterType === 'muted' ? 'Silenciados' :
                       'Archivados'}
                    </span>
                  </button>

                  {showFilterMenu && (
                    <div className="absolute bottom-full mb-2 right-0 bg-[#252c3e]/95 backdrop-blur-xl border border-[#ffe0db]/20 rounded-xl shadow-2xl overflow-hidden z-[9999] min-w-[200px]">
                      {[
                        { value: 'all', label: 'Todos', icon: MessageCircle },
                        { value: 'unread', label: 'No leídos', icon: Star },
                        { value: 'pinned', label: 'Fijados', icon: Pin },
                        { value: 'muted', label: 'Silenciados', icon: VolumeX },
                        { value: 'archived', label: 'Archivados', icon: Archive }
                      ].map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => {
                            setFilterType(filter.value as any);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all ${
                            filterType === filter.value
                              ? 'bg-gradient-to-r from-[#9675bc]/20 to-[#f1b3be]/20 text-[#ffe0db]'
                              : 'text-[#ffe0db]/70 hover:bg-[#ffe0db]/10 hover:text-[#ffe0db]'
                          }`}
                        >
                          <filter.icon className="w-4 h-4" />
                          <span>{filter.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={loadConversations}
                  className="p-3 bg-[#ffe0db]/10 hover:bg-[#ffe0db]/20 backdrop-blur-sm border border-[#ffe0db]/20 rounded-xl text-[#ffe0db] transition-all hover:rotate-180"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Conversations list */}
          <div className="space-y-4">
            {filteredConversations.length === 0 ? (
              <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-12 text-center animate-fade-in">
                <MessageCircle className="w-20 h-20 text-[#f1b3be]/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#ffe0db] mb-2">
                  {searchTerm ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
                </h3>
                <p className="text-[#ffe0db]/70">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda' 
                    : 'Inicia una conversación con un psicólogo'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation, index) => {
                const otherUser = getOtherUser(conversation);
                const lastMessage = conversation.last_message;
                const isUnread = conversation.unread_count > 0;

                return (
                  <div
                    key={conversation.id}
                    className="group bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-6 hover:bg-[#ffe0db]/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-[#f1b3be]/20 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => window.location.href = `/chat/${conversation.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {otherUser.profile_pic ? (
                          <img
                            src={otherUser.profile_pic}
                            alt={otherUser.username}
                            className="w-16 h-16 rounded-full border-4 border-[#f1b3be]/30 object-cover shadow-lg group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9675bc] to-[#f1b3be] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">
                              {getUserInitials(otherUser.username)}
                            </span>
                          </div>
                        )}
                        
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#252c3e] flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>

                        {/* Unread badge */}
                        {isUnread && !conversation.is_muted && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#252c3e] shadow-lg">
                            <span className="text-white text-xs font-bold">
                              {conversation.unread_count}
                            </span>
                          </div>
                        )}

                        {/* Muted indicator */}
                        {conversation.is_muted && isUnread && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-500/80 rounded-full flex items-center justify-center border-2 border-[#252c3e] shadow-lg">
                            <BellOff className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-bold text-[#ffe0db] truncate ${
                              isUnread && !conversation.is_muted ? 'text-[#f1b3be]' : ''
                            }`}>
                              {otherUser.username}
                            </h3>
                            
                            {otherUser.is_psychologist && (
                              <div className="bg-gradient-to-r from-blue-500 to-[#9675bc] rounded-full p-1">
                                <User className="w-3 h-3 text-[#ffe0db]" />
                              </div>
                            )}
                            {conversation.is_pinned && (
                              <Pin className="w-4 h-4 text-amber-500" />
                            )}
                            {conversation.is_muted && (
                              <VolumeX className="w-4 h-4 text-[#ffe0db]/50" />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {lastMessage && (
                              <div className="flex items-center space-x-1 text-xs text-[#ffe0db]/60">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(lastMessage.created_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {lastMessage && (
                          <div className="flex items-center space-x-2">
                            {lastMessage.sender_id === currentUserId && (
                              <CheckCheck className={`w-4 h-4 flex-shrink-0 ${
                                lastMessage.is_read ? 'text-blue-400' : 'text-[#ffe0db]/40'
                              }`} />
                            )}
                            <p className={`text-sm truncate ${
                              isUnread && !conversation.is_muted ? 'font-semibold text-[#ffe0db]' : 'text-[#ffe0db]/70'
                            }`}>
                              {lastMessage.content}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Quick actions */}
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(conversation.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            conversation.is_pinned 
                              ? 'bg-amber-500/20 text-amber-400' 
                              : 'bg-[#ffe0db]/10 text-[#ffe0db]/60 hover:bg-[#ffe0db]/20'
                          }`}
                          title="Fijar"
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute(conversation.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            conversation.is_muted 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-[#ffe0db]/10 text-[#ffe0db]/60 hover:bg-[#ffe0db]/20'
                          }`}
                          title={conversation.is_muted ? 'Activar notificaciones' : 'Silenciar notificaciones'}
                        >
                          {conversation.is_muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveConversation(conversation.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            conversation.is_archived 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-[#ffe0db]/10 text-[#ffe0db]/60 hover:bg-[#ffe0db]/20'
                          }`}
                          title="Archivar"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Estilos personalizados */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EnhancedConversationsList;