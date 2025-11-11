// src/components/Chat/ChatButton.tsx
import React, { useState } from 'react';
import { MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { useChatWithPsychologist } from './useChatWithPsychologist';

interface ChatButtonProps {
  psychologistId: string;
  psychologistName: string;
  psychologistPic?: string;
  variant?: 'primary' | 'secondary' | 'icon';
  initialMessage?: string;
  buttonText?: string;
  className?: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  psychologistId,
  psychologistName,
  psychologistPic,
  variant = 'primary',
  initialMessage = '¡Hola! Me gustaría consultar contigo.',
  buttonText = 'Iniciar Chat',
  className = ''
}) => {
  const [showChat, setShowChat] = useState(false);
  const [currentUserId] = useState(
    () => JSON.parse(localStorage.getItem('user_data') || '{}').id
  );
  
  const { conversationId, isLoading, error, startChat } = useChatWithPsychologist(
    psychologistId
  );

  const handleStartChat = async () => {
    try {
      if (!conversationId) {
        await startChat(initialMessage);
      }
      setShowChat(true);
    } catch (error) {
      console.error('Error al iniciar chat:', error);
      alert('No se pudo iniciar el chat. Por favor intenta de nuevo.');
    }
  };

  // Variantes de estilo del botón
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return `flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`;
      
      case 'secondary':
        return `flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-white hover:bg-[#ffe0db]/50 rounded-xl text-[#9675bc] font-medium transition-all duration-300 hover:scale-105 border border-[#9675bc]/20 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`;
      
      case 'icon':
        return `flex items-center justify-center p-3 sm:p-4 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`;
      
      default:
        return className;
    }
  };

  return (
    <>
      <button
        onClick={handleStartChat}
        disabled={isLoading}
        className={getButtonStyles()}
        title={`Chatear con ${psychologistName}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            {variant !== 'icon' && <span className="hidden sm:inline">Conectando...</span>}
          </>
        ) : conversationId && !showChat ? (
          <>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            {variant !== 'icon' && <span className="hidden sm:inline">Continuar Chat</span>}
          </>
        ) : (
          <>
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            {variant !== 'icon' && <span className="hidden sm:inline">{buttonText}</span>}
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-500 animate-fade-in">
          {error}
        </div>
      )}

      {/* Chat Window */}
      {showChat && conversationId && (
        <ChatWindow
          conversationId={conversationId}
          psychologistName={psychologistName}
          psychologistPic={psychologistPic}
          onClose={() => setShowChat(false)}
          currentUserId={currentUserId}
        />
      )}

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatButton;