// src/components/Chat/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, X, Minimize2, Maximize2, Loader2, User as UserIcon,
  CheckCheck, Check, Clock
} from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    profile_pic?: string;
  };
  created_at: string;
  is_read: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  psychologistName: string;
  psychologistPic?: string;
  onClose: () => void;
  currentUserId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  psychologistName,
  psychologistPic,
  onClose,
  currentUserId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Conectar WebSocket
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${conversationId}/?token=${token}`
    );

    ws.onopen = () => {
      console.log('✅ Chat WebSocket conectado');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'chat_history':
          setMessages(data.messages);
          break;
        
        case 'new_message':
          setMessages(prev => [...prev, data.message]);
          break;
        
        case 'typing':
          if (data.user_id !== currentUserId) {
            setIsTyping(data.is_typing);
          }
          break;
        
        case 'error':
          console.error('Error en chat:', data.message);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('❌ Error en WebSocket:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('🔌 Chat WebSocket desconectado');
      setIsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [conversationId, currentUserId]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || !isConnected || isSending) return;

    setIsSending(true);

    wsRef.current.send(JSON.stringify({
      action: 'send_message',
      content: newMessage.trim()
    }));

    setNewMessage('');
    setIsSending(false);
    
    // Detener indicador de escritura
    sendTypingStatus(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendTypingStatus = (isTyping: boolean) => {
    if (!wsRef.current || !isConnected) return;

    wsRef.current.send(JSON.stringify({
      action: 'typing',
      is_typing: isTyping
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);

    // Enviar indicador de escritura
    if (!isTyping && e.target.value.trim()) {
      sendTypingStatus(true);
    }

    // Detener indicador después de 2 segundos sin escribir
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserInitials = (username: string) => {
    return username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
        >
          {psychologistPic ? (
            <img
              src={psychologistPic}
              alt={psychologistName}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
          )}
          <span className="font-semibold">Chat con {psychologistName}</span>
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[400px] h-[600px] bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/30 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#9675bc] to-[#f1b3be] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {psychologistPic ? (
            <img
              src={psychologistPic}
              alt={psychologistName}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {getUserInitials(psychologistName)}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-white font-bold">{psychologistName}</h3>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-white/80 text-xs">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender.id === currentUserId;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-2xl p-3 ${
                    isOwn
                      ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white'
                      : 'bg-white/50 text-[#252c3e]'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">
                    {message.content}
                  </p>
                </div>
                <div className={`flex items-center space-x-1 mt-1 text-xs text-[#252c3e]/60 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <span>{formatTime(message.created_at)}</span>
                  {isOwn && (
                    message.is_read ? (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/50 rounded-2xl p-3 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#9675bc] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#f1b3be] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-[#ffe0db] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-xs text-[#252c3e]/60">
                {psychologistName} está escribiendo...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#ffe0db]/30 bg-white/50">
        <div className="flex items-end space-x-2">
          <textarea
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 resize-none bg-white/70 border border-[#ffe0db]/30 rounded-xl px-4 py-3 text-[#252c3e] placeholder-[#252c3e]/50 focus:outline-none focus:ring-2 focus:ring-[#9675bc]/50 max-h-24"
            rows={1}
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected || isSending}
            className="p-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;