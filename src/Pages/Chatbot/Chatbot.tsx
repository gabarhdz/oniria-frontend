import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Download, Copy, Check, MessageSquare, User, Loader, Star, Plus, Menu } from 'lucide-react';

// Enhanced Orb Component
const Orb = ({ isActive, size = 'medium' }: { isActive: boolean; size?: 'small' | 'medium' | 'large' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.35;

      // Create gradient with more vibrant colors
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 1.2);
      
      if (isActive) {
        gradient.addColorStop(0, 'rgba(155, 66, 254, 1)');
        gradient.addColorStop(0.3, 'rgba(234, 88, 164, 0.9)');
        gradient.addColorStop(0.6, 'rgba(254, 163, 204, 0.7)');
        gradient.addColorStop(1, 'rgba(155, 66, 254, 0.2)');
      } else {
        gradient.addColorStop(0, 'rgba(155, 66, 254, 0.6)');
        gradient.addColorStop(0.4, 'rgba(234, 88, 164, 0.5)');
        gradient.addColorStop(0.7, 'rgba(254, 163, 204, 0.4)');
        gradient.addColorStop(1, 'rgba(155, 66, 254, 0.1)');
      }

      // Draw main circle with pulse effect
      const pulse = isActive ? Math.sin(time * 3) * 0.15 + 1 : Math.sin(time) * 0.05 + 1;
      const radius = baseRadius * pulse;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw outer glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.5);
      glowGradient.addColorStop(0, 'rgba(254, 163, 204, 0)');
      glowGradient.addColorStop(0.5, 'rgba(234, 88, 164, 0.3)');
      glowGradient.addColorStop(1, 'rgba(155, 66, 254, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw rotating particles
      const particleCount = isActive ? 12 : 8;
      for (let i = 0; i < particleCount; i++) {
        const angle = (time * (isActive ? 2 : 0.5) + i * (Math.PI * 2) / particleCount) % (Math.PI * 2);
        const distance = radius * (isActive ? 0.9 : 0.7);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const particleRadius = isActive ? 4 + Math.sin(time * 3 + i) * 2 : 2 + Math.sin(time + i) * 1;

        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, particleRadius * 2);
        particleGradient.addColorStop(0, 'rgba(254, 163, 204, 1)');
        particleGradient.addColorStop(0.5, 'rgba(234, 88, 164, 0.8)');
        particleGradient.addColorStop(1, 'rgba(155, 66, 254, 0)');

        ctx.beginPath();
        ctx.arc(x, y, particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = particleGradient;
        ctx.fill();
      }

      // Draw energy waves when active
      if (isActive) {
        for (let i = 0; i < 3; i++) {
          const waveRadius = (radius * 0.5) + (time * 50 + i * 50) % (radius * 0.8);
          const waveAlpha = 1 - ((time * 50 + i * 50) % (radius * 0.8)) / (radius * 0.8);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(254, 163, 204, ${waveAlpha * 0.5})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  profile_pic?: string;
}

// Main Chatbot Component
const OniriaChatbot = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get user data from localStorage
  const getUserData = (): UserData | null => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  };

  const user = getUserData();

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('noctiria_conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
        
        // Set the most recent conversation as current
        if (conversationsWithDates.length > 0) {
          setCurrentConversationId(conversationsWithDates[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage
  const saveConversations = (convs: Conversation[]) => {
    localStorage.setItem('noctiria_conversations', JSON.stringify(convs));
    setConversations(convs);
  };

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  // Create new conversation
  const createNewConversation = () => {
    const conversationNumber = conversations.length + 1;
    const newConversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `Conversación #${conversationNumber}`,
      messages: [{
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '¡Hola! Soy Noctiria AI, tu asistente onírico. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
    setCurrentConversationId(newConversation.id);
    setShowSidebar(false);
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide intro animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Generate conversation title from first message
  const generateTitle = (firstUserMessage: string) => {
    return firstUserMessage.length > 40 
      ? firstUserMessage.substring(0, 40) + '...'
      : firstUserMessage;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !currentConversationId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Update conversation with user message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        
        // Update title if it's the first user message
        const title = conv.title === 'Nueva Conversación' 
          ? generateTitle(input)
          : conv.title;

        return {
          ...conv,
          title,
          messages: updatedMessages,
          updatedAt: new Date()
        };
      }
      return conv;
    });

    saveConversations(updatedConversations);
    setInput('');
    setIsLoading(true);

    // Simulate API call - Replace with actual DeepSeek API integration
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Esta es una respuesta simulada de Noctiria AI.\n\nTu mensaje fue: "${input}"\n\nEn una implementación real, aquí se integraría la API de DeepSeek para obtener respuestas inteligentes.`,
        timestamp: new Date()
      };
      
      const finalConversations = conversations.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage, aiMessage],
            updatedAt: new Date()
          };
        }
        return conv;
      });

      saveConversations(finalConversations);
    } catch (error) {
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        timestamp: new Date()
      };
      
      const finalConversations = conversations.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage, errorMessage],
            updatedAt: new Date()
          };
        }
        return conv;
      });

      saveConversations(finalConversations);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(c => c.id !== id);
    saveConversations(updatedConversations);
    
    if (currentConversationId === id) {
      if (updatedConversations.length > 0) {
        setCurrentConversationId(updatedConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  const exportChat = () => {
    if (!currentConversation) return;
    
    const chatText = currentConversation.messages.map(m => 
      `[${m.timestamp.toLocaleTimeString()}] ${m.role === 'user' ? user?.username || 'Usuario' : 'Noctiria'}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConversation.title}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Create initial conversation if none exists
  useEffect(() => {
    if (conversations.length === 0 && !showIntro) {
      createNewConversation();
    }
  }, [showIntro]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple relative overflow-hidden">
      
      {/* Background decorations */}
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
        {Array.from({ length: 15 }, (_, i) => (
          <Star
            key={`star-${i}`}
            className="absolute text-oniria_lightpink/20 animate-pulse"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Intro Animation */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple animate-fade-out" style={{ animationDelay: '2.5s' }}>
          <div className="text-center space-y-8 animate-scale-in">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
              <Orb isActive={true} size="large" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-oniria_lightpink via-oniria_pink to-oniria_purple bg-clip-text text-transparent">
                Noctiria AI
              </h1>
              <p className="text-lg sm:text-xl text-oniria_lightpink/90">
                Tu asistente onírico inteligente
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-oniria_lightpink">Conversaciones</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <MessageSquare className="w-5 h-5 text-oniria_lightpink" />
            </button>
          </div>

          <button
            onClick={createNewConversation}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Conversación</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  currentConversationId === conv.id
                    ? 'bg-white/20 border border-white/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
                onClick={() => {
                  setCurrentConversationId(conv.id);
                  setShowSidebar(false);
                }}
              >
                <p className="text-sm font-medium text-oniria_lightpink truncate mb-1">
                  {conv.title}
                </p>
                <p className="text-xs text-oniria_lightpink/60">
                  {conv.updatedAt.toLocaleDateString()}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3 h-3 text-red-300" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 h-screen flex flex-col transition-all duration-300 ${showSidebar ? 'lg:ml-72' : 'lg:ml-72'}`}>
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 py-4 sm:px-6 sm:py-5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
              >
                <Menu className="w-5 h-5 text-oniria_lightpink" />
              </button>
              
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Orb isActive={false} size="small" />
              </div>
              
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-oniria_lightpink">Noctiria AI</h1>
                <p className="text-xs sm:text-sm text-oniria_lightpink/70">
                  {currentConversation?.title || 'Asistente Inteligente'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={exportChat}
                className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-oniria_lightpink transition-all duration-300 hover:scale-105"
                title="Exportar chat"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 sm:space-x-4 animate-fade-in-up ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.role === 'assistant' ? (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                      <Orb isActive={isLoading && index === messages.length - 1} size="small" />
                    </div>
                  ) : user?.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={user.username}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-oniria_pink/50 shadow-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-oniria_pink to-oniria_lightpink rounded-full flex items-center justify-center shadow-lg border-2 border-oniria_pink/50">
                      <span className="text-white font-bold text-lg">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div
                    className={`relative group max-w-[85%] sm:max-w-[75%] ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-oniria_purple to-oniria_pink text-white'
                        : 'bg-white/15 backdrop-blur-xl border border-white/20 text-oniria_lightpink'
                    } rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg`}
                  >
                    {message.role === 'user' && user && (
                      <p className="text-xs font-semibold mb-1 opacity-80">{user.username}</p>
                    )}
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => copyMessage(message.id, message.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                        title="Copiar mensaje"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start space-x-3 sm:space-x-4 animate-fade-in-up">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                  <Orb isActive={true} size="small" />
                </div>
                <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-oniria_pink rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 bg-oniria_pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-oniria_pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 px-4 py-4 sm:px-6 sm:py-5">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end space-x-3 sm:space-x-4">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje onírico..."
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-oniria_pink text-oniria_lightpink placeholder-oniria_lightpink/50 resize-none text-sm sm:text-base transition-all backdrop-blur-sm"
                  rows={1}
                  style={{ minHeight: '52px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !currentConversationId}
                className="flex-shrink-0 p-3 sm:p-4 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink disabled:from-gray-400/50 disabled:to-gray-500/50 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
            <p className="text-xs text-oniria_lightpink/50 mt-2 text-center">
              Presiona Enter para enviar • Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes modal-entrance {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-out {
          animation: fade-out 0.5s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
        .animate-modal-entrance {
          animation: modal-entrance 0.3s ease-out;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OniriaChatbot;