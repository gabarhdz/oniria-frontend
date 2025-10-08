import { Copy, Check } from 'lucide-react';
import React from 'react';
import type { MessageBubbleProps } from './types';
import Orb from './Orb';

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  index,
  isLoading,
  messagesLength,
  user,
  copiedId,
  onCopy
}) => {
  return (
    <div
      className={`flex items-start space-x-3 sm:space-x-4 animate-fade-in-up ${
        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex-shrink-0">
        {message.role === 'assistant' ? (
          <div className="relative w-12 h-12 sm:w-14 sm:h-14">
            <Orb isActive={isLoading && index === messagesLength - 1} size="small" />
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
              onClick={() => onCopy(message.id, message.content)}
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
  );
};
 export default MessageBubble;