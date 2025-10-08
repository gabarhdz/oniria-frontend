import { Send, Loader } from 'lucide-react';
import React from 'react';
import type { ChatInputProps } from './types';

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  currentConversationId,
  onInputChange,
  onSend
}) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 px-4 py-4 sm:px-6 sm:py-5">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end space-x-3 sm:space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje onírico..."
              className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-oniria_pink text-oniria_lightpink placeholder-oniria_lightpink/50 resize-none text-sm sm:text-base transition-all backdrop-blur-sm"
              rows={1}
              style={{ minHeight: '52px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={onSend}
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
  );
};
 export default ChatInput;