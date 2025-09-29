import React, { useState, useRef, useEffect, memo } from 'react';
import { 
  Reply, 
  ThumbsUp, 
  ThumbsDown, 
  Edit2, 
  Trash2, 
  Star, 
  Send,
  Lock
} from 'lucide-react';
import type{ Post, User } from './types';
import { ProfileAvatar } from './FilterAndAvatarComponents';

// PostCard Component - Diseño tarjeta mejorado
export const PostCard: React.FC<{
  post: Post;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onReply: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  currentUser?: User;
  isOwner?: boolean;
  isMember?: boolean;
}> = React.memo(({ post, onLike, onDislike, onReply, onEdit, onDelete, currentUser, isOwner, isMember = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLiked = currentUser && post.likes.some(user => user.id === currentUser.id);
  const isDisliked = currentUser && post.dislikes.some(user => user.id === currentUser.id);

  return (
    <div 
      className="group relative mb-3 sm:mb-4 animate-message-entrance"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:bg-white/20">
        
        {/* Reply indicator */}
        {post.parent_post && (
          <div className="bg-gradient-to-r from-oniria_purple/20 to-oniria_pink/20 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border-l-4 border-oniria_pink backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Reply className="w-3 h-3 sm:w-4 sm:h-4 text-oniria_pink" />
              <p className="text-xs sm:text-sm text-oniria_lightpink/70 font-medium">Respondiendo a {post.parent_post.author.username}:</p>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-oniria_lightpink mb-1">{post.parent_post.title}</p>
            <p className="text-xs text-oniria_lightpink/60 line-clamp-2">
              {post.parent_post.text.substring(0, 100)}...
            </p>
          </div>
        )}
        
        {/* Post header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <ProfileAvatar 
                user={post.author} 
                size="medium" 
                onClick={() => {
                  window.location.href = `/dashboard/profile/view/${post.author.id}`;
                }}
                className="hover:ring-2 hover:ring-oniria_purple/50"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="font-semibold text-oniria_lightpink group-hover:text-white transition-colors duration-300 text-sm sm:text-base truncate">
                  {post.author.username}
                </span>
                <span className="text-oniria_lightpink/50 text-xs sm:text-sm">•</span>
                <span className="text-oniria_lightpink/50 text-xs sm:text-sm">
                  {new Date(post.created_at).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                {/* Badge de psicólogo */}
                {post.author.is_psychologist && (
                  <div className="flex items-center space-x-1 bg-oniria_purple/20 px-2 py-0.5 sm:py-1 rounded-full">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-oniria_pink" />
                    <span className="text-xs text-oniria_lightpink/80 hidden sm:inline">Psicólogo</span>
                    <span className="text-xs text-oniria_lightpink/80 sm:hidden">Psi</span>
                  </div>
                )}
              </div>
              
              {/* Post title */}
              <h3 className="text-base sm:text-lg font-semibold text-oniria_lightpink group-hover:text-white transition-colors duration-300 leading-tight">
                {post.title}
              </h3>
              
              {/* Post content */}
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 backdrop-blur-sm">
                <p className="text-oniria_lightpink/90 leading-relaxed break-words text-xs sm:text-sm">
                  {post.text}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action menu for owner */}
          {isOwner && (
            <div className="flex space-x-1 sm:space-x-2 ml-2 sm:ml-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(post)}
                  className="p-1.5 sm:p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-blue-100 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                  title="Editar post"
                >
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-1.5 sm:p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-100 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                  title="Eliminar post"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Interaction bar */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 flex-wrap gap-2">
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Like button */}
            <button 
              onClick={() => onLike(post.id)} 
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                isLiked 
                  ? 'text-oniria_pink bg-oniria_pink/20 shadow-lg' 
                  : 'text-oniria_lightpink/60 hover:text-oniria_pink hover:bg-oniria_pink/10'
              }`}
            >
              <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{post.likes.length}</span>
            </button>
            
            {/* Dislike button */}
            <button 
              onClick={() => onDislike(post.id)} 
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                isDisliked 
                  ? 'text-red-400 bg-red-400/20 shadow-lg' 
                  : 'text-oniria_lightpink/60 hover:text-red-400 hover:bg-red-400/10'
              }`}
            >
              <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{post.dislikes.length}</span>
            </button>
            
            {/* Reply button */}
            {isMember ? (
              <button 
                onClick={() => onReply(post)} 
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-oniria_lightpink/60 hover:text-oniria_lightpink hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <Reply className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium hidden sm:inline">Responder</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-oniria_lightpink/40 cursor-not-allowed">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium hidden sm:inline">Únete para responder</span>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <div className="text-xs text-oniria_lightpink/40">
            {new Date(post.created_at).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

// Chat-style Post Creator - Input directo simple
export const ChatPostCreator: React.FC<{
  onSubmit: (data: { title: string; text: string }) => void;
  placeholder?: string;
  parentPost?: Post;
  post?: Post;
  isEditing?: boolean;
}> = ({ onSubmit, placeholder = "Escribe tu mensaje...", parentPost, post, isEditing = false }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [text, setText] = useState(post?.text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if (title.trim() && text.trim()) {
      onSubmit({ title, text });
      if (!isEditing) {
        setTitle('');
        setText('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-3 sm:p-4 shadow-xl mb-4 sm:mb-6">
      
      {/* Parent post preview */}
      {parentPost && (
        <div className="bg-gradient-to-r from-oniria_purple/10 to-oniria_pink/10 rounded-xl p-3 mb-3 border-l-4 border-oniria_pink">
          <div className="flex items-center space-x-2 mb-1">
            <Reply className="w-3 h-3 sm:w-4 sm:h-4 text-oniria_pink" />
            <p className="text-xs sm:text-sm text-oniria_lightpink/70 font-medium">
              Respondiendo a {parentPost.author.username}
            </p>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-oniria_lightpink">{parentPost.title}</p>
          <p className="text-xs text-oniria_lightpink/60 line-clamp-2">{parentPost.text}</p>
        </div>
      )}
      
      <div className="space-y-2 sm:space-y-3">
        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={50}
          className="w-full px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-oniria_pink text-oniria_lightpink placeholder-oniria_lightpink/50 text-sm sm:text-base font-semibold transition-all"
          placeholder="Título..."
        />
        
        {/* Text input con contador y botón */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={2500}
            className="w-full px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-oniria_pink text-oniria_lightpink placeholder-oniria_lightpink/50 resize-none text-sm sm:text-base transition-all"
            placeholder={placeholder}
            rows={2}
            style={{ minHeight: '60px', maxHeight: '150px' }}
          />
          
          {/* Bottom bar con contador y botón */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-xs text-oniria_lightpink/50">
              <span>{title.length}/50</span>
              <span>•</span>
              <span>{text.length}/2500</span>
              <span className="hidden sm:inline text-oniria_lightpink/40">• Enter para enviar</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !text.trim()}
              className="flex items-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink disabled:from-gray-400/50 disabled:to-gray-500/50 text-white px-4 sm:px-5 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg disabled:opacity-50 text-xs sm:text-sm"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isEditing ? 'Actualizar' : 'Enviar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};