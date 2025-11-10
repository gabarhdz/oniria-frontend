

import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Search, 
  Clock, 
  CheckCheck,
  Loader2,
  User as UserIcon
} from 'lucide-react';
import axios from 'axios';
import { ChatWindow } from './ChatWindow';

interface Conversation {
  id: string;
  user: {
    id: string;
    username: string;
    profile_pic?: string;
  };
  psychologist: {
    id: string;
    username: string;
    profile_pic?: string;
  };
  last_message?: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    is_read: boolean;
  };
  unread_count: number;
  updated_at: string;
}

export const ConversationsList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [currentUserId] = useState(
    () => JSON.parse(localStorage.getItem('user_data') || '{}').id
  );

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      
      const response = await axios.get(
        'http://127.0.0.1:8000/api/chat/conversations/',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.user.id === currentUserId ? conv.psychologist : conv.user;
    return otherUser.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-[#9675bc] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#9675bc] to-[#f1b3be] rounded-2xl p-6 mb-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Mis Conversaciones</h1>
        <p className="text-white/80">
          {conversations.length} {conversations.length === 1 ? 'conversación' : 'conversaciones'}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-[#ffe0db]/30 rounded-xl text-[#252c3e] placeholder-[#252c3e]/50 focus:outline-none focus:ring-2 focus:ring-[#9675bc]/50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#ffe0db]/30">
            <MessageCircle className="w-16 h-16 text-[#9675bc]/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#252c3e] mb-2">
              {searchTerm ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
            </h3>
            <p className="text-[#252c3e]/70">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Inicia una conversación con un psicólogo'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const otherUser = getOtherUser(conversation);
            const lastMessage = conversation.last_message;
            const isUnread = conversation.unread_count > 0;

            return (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full bg-white/70 hover:bg-white/90 backdrop-blur-sm border ${
                  isUnread ? 'border-[#9675bc]/50' : 'border-[#ffe0db]/30'
                } rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg text-left`}
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {otherUser.profile_pic ? (
                      <img
                        src={otherUser.profile_pic}
                        alt={otherUser.username}
                        className="w-14 h-14 rounded-full border-2 border-[#9675bc]/30"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#9675bc] to-[#f1b3be] flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {getUserInitials(otherUser.username)}
                        </span>
                      </div>
                    )}
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-xs font-bold">
                          {conversation.unread_count}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold text-[#252c3e] truncate ${
                        isUnread ? 'text-[#9675bc]' : ''
                      }`}>
                        {otherUser.username}
                      </h3>
                      {lastMessage && (
                        <div className="flex items-center space-x-1 text-xs text-[#252c3e]/60">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(lastMessage.created_at)}</span>
                        </div>
                      )}
                    </div>

                    {lastMessage && (
                      <div className="flex items-center space-x-2">
                        {lastMessage.sender_id === currentUserId && (
                          <CheckCheck className={`w-4 h-4 flex-shrink-0 ${
                            lastMessage.is_read ? 'text-blue-500' : 'text-[#252c3e]/40'
                          }`} />
                        )}
                        <p className={`text-sm truncate ${
                          isUnread ? 'font-semibold text-[#252c3e]' : 'text-[#252c3e]/70'
                        }`}>
                          {lastMessage.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Chat Window */}
      {selectedConversation && (
        <ChatWindow
          conversationId={selectedConversation}
          psychologistName={
            getOtherUser(
              conversations.find(c => c.id === selectedConversation)!
            ).username
          }
          psychologistPic={
            getOtherUser(
              conversations.find(c => c.id === selectedConversation)!
            ).profile_pic
          }
          onClose={() => {
            setSelectedConversation(null);
            loadConversations(); // Recargar para actualizar contadores
          }}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default ConversationsList;