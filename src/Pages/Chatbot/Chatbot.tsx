import React, { useState, useRef, useEffect } from 'react';

// Importar componentes y tipos desde componentsChatbot
import {
  Orb,
  IntroAnimation,
  BackgroundDecorations,
  Sidebar,
  Header,
  MessageBubble,
  LoadingIndicator,
  ChatInput,
} from './componentsChatbot/index';

import type {
  Message,
  Conversation,
  UserData
} from './componentsChatbot/index';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const OniriaChatbot: React.FC = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showIntro, setShowIntro] = React.useState(true);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
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
        
        if (conversationsWithDates.length > 0) {
          setCurrentConversationId(conversationsWithDates[0].id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }, []);

  const saveConversations = (convs: Conversation[]) => {
    localStorage.setItem('noctiria_conversations', JSON.stringify(convs));
    setConversations(convs);
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const generateTitle = (firstUserMessage: string, conversationNumber: number) => {
    const preview = firstUserMessage.length > 30 
      ? firstUserMessage.substring(0, 30) + '...'
      : firstUserMessage;
    return `#${conversationNumber}: ${preview}`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !currentConversationId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const updatedConversations = conversations.map((conv, index) => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        
        const conversationNumber = conversations.length - index;
        const title = conv.title.startsWith('Conversación #') 
          ? generateTitle(input, conversationNumber)
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
    const userInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userInput })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else if (response.status === 500) {
          const errorMsg = errorData.error || 'Error en el servidor';
          throw new Error(`Error del servidor: ${errorMsg}`);
        } else if (response.status === 404) {
          throw new Error('Endpoint no encontrado. Verifica que el backend esté corriendo.');
        }
        
        const errorMsg = errorData.error || errorData.detail || 'Error desconocido';
        throw new Error(`Error ${response.status}: ${errorMsg}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      
      const finalConversations = conversations.map((conv) => {
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
    } catch (error: any) {
      console.error('Error calling AI:', error);
      
      const errorMessage = error.message || 'Lo siento, ocurrió un error al procesar tu mensaje.';
      setError(errorMessage);
      
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      };
      
      const finalConversations = conversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage, errorMsg],
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

  const handleRefresh = () => {
    setShowIntro(true);
    setInput('');
    setIsLoading(false);
    setCopiedId(null);
    setError(null);
    setTimeout(() => {
      setShowIntro(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (conversations.length === 0 && !showIntro) {
      createNewConversation();
    }
  }, [showIntro]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple relative overflow-hidden">
      
      <BackgroundDecorations />

      {showIntro && <IntroAnimation />}

      <Sidebar
        showSidebar={showSidebar}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onToggleSidebar={() => setShowSidebar(false)}
        onCreateNew={createNewConversation}
        onSelectConversation={(id) => {
          setCurrentConversationId(id);
          setShowSidebar(false);
        }}
        onDeleteConversation={deleteConversation}
      />

      <div className={`relative z-10 h-screen flex flex-col transition-all duration-300 ${showSidebar ? 'ml-0 sm:ml-72' : 'ml-0'}`}>
        
        <Header
          showSidebar={showSidebar}
          currentConversation={currentConversation}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onRefresh={handleRefresh}
          onExport={exportChat}
        />

        {error && (
          <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <p className="text-sm text-red-200">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-200 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                index={index}
                isLoading={isLoading}
                messagesLength={messages.length}
                user={user}
                copiedId={copiedId}
                onCopy={copyMessage}
              />
            ))}

            {isLoading && <LoadingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput
          input={input}
          isLoading={isLoading}
          currentConversationId={currentConversationId}
          onInputChange={setInput}
          onSend={handleSend}
        />
      </div>

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
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
      `}</style>
    </div>
  );
};

export default OniriaChatbot;