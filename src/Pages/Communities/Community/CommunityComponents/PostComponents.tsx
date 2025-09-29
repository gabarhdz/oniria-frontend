import React, { useState, useRef, useEffect } from 'react';
import { 
  Reply, 
  ThumbsUp, 
  ThumbsDown, 
  Edit2, 
  Trash2, 
  Star, 
  Plus, 
  Send, 
  X, 
  Sparkles 
} from 'lucide-react';
import type{ Post, User } from './types';
import { ProfileAvatar } from './FilterAndAvatarComponents';

// PostCard Component - Completamente responsivo
export const PostCard: React.FC<{
  post: Post;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onReply: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  currentUser?: User;
  isOwner?: boolean;
}> = React.memo(({ post, onLike, onDislike, onReply, onEdit, onDelete, currentUser, isOwner }) => {
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
        
        {/* Reply indicator - Responsivo */}
        {post.parent_post && (
          <div className="bg-gradient-to-r from-oniria_purple/20 to-oniria_pink/20 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border-l-4 border-oniria_pink backdrop-blur-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <Reply className="w-3 h-3 sm:w-4 sm:h-4 text-oniria_pink" />
                <p className="text-xs sm:text-sm text-oniria_lightpink/70 font-medium">Respondiendo a:</p>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-oniria_lightpink mb-1">{post.parent_post.title}</p>
              <p className="text-xs text-oniria_lightpink/60 line-clamp-2">
                {post.parent_post.text.substring(0, 100)}...
              </p>
            </div>
          </div>
        )}
        
        {/* Post header - Layout responsivo */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            {/* Avatar con indicador online */}
            <div className="relative flex-shrink-0">
              <ProfileAvatar 
                user={post.author} 
                size="medium" 
                onClick={() => {
                  window.location.href = `/dashboard/profile/view/${post.author.id}`;
                }}
                className="hover:ring-2 hover:ring-oniria_purple/50"
              />
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white/20 animate-pulse" />
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
          
          {/* Action menu for owner - Solo visible en hover en desktop */}
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
        
        {/* Interaction bar - Layout responsivo */}
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
            <button 
              onClick={() => onReply(post)} 
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-oniria_lightpink/60 hover:text-oniria_lightpink hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <Reply className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium hidden sm:inline">Responder</span>
            </button>
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

// Chat-style Post Creator - Responsivo
export const ChatPostCreator: React.FC<{
  onSubmit: (data: { title: string; text: string }) => void;
  placeholder?: string;
  parentPost?: Post;
  post?: Post;
  isEditing?: boolean;
}> = ({ onSubmit, placeholder = "Comparte tus pensamientos...", parentPost, post, isEditing = false }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [text, setText] = useState(post?.text || '');
  const [isExpanded, setIsExpanded] = useState(isEditing);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if (title.trim() && text.trim()) {
      onSubmit({ title, text });
      if (!isEditing) {
        setTitle('');
        setText('');
        setIsExpanded(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const handleCancel = () => {
    if (!isEditing) {
      setTitle('');
      setText('');
    }
    setIsExpanded(false);
  };

  return (
    <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
      
      {/* Parent post preview - Responsivo */}
      {parentPost && isExpanded && (
        <div className="bg-gradient-to-r from-oniria_purple/10 to-oniria_pink/10 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border-l-4 border-oniria_pink">
          <div className="flex items-center space-x-2 mb-2">
            <Reply className="w-3 h-3 sm:w-4 sm:h-4 text-oniria_pink" />
            <p className="text-xs sm:text-sm text-oniria_lightpink/70 font-medium">Respondiendo a:</p>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-oniria_lightpink">{parentPost.title}</p>
          <p className="text-xs text-oniria_lightpink/60 mt-1 line-clamp-2">
            {parentPost.text.substring(0, 100)}...
          </p>
        </div>
      )}
      
      {!isExpanded ? (
        // Botón para expandir - Responsivo
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-4 text-left bg-gradient-to-r from-oniria_purple/10 via-oniria_pink/10 to-oniria_lightpink/10 hover:from-oniria_purple/20 hover:via-oniria_pink/20 hover:to-oniria_lightpink/20 rounded-lg sm:rounded-xl border border-oniria_pink/20 hover:border-oniria_pink/40 transition-all duration-300 transform hover:scale-[1.01] group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-oniria_lightpink/90 group-hover:text-oniria_lightpink font-medium text-sm sm:text-base truncate">
              {parentPost ? 'Responder a este mensaje...' : 'Crear nuevo mensaje...'}
            </p>
            <p className="text-xs sm:text-sm text-oniria_lightpink/60 group-hover:text-oniria_lightpink/80 hidden sm:block">
              Comparte tus pensamientos con la comunidad
            </p>
          </div>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-oniria_pink/60 group-hover:text-oniria_pink group-hover:animate-pulse" />
        </button>
      ) : (
        // Formulario expandido - Responsivo
        <div className="space-y-3 sm:space-y-4">
          {/* Title input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={50}
              className="w-full px-0 py-2 bg-transparent border-none focus:outline-none text-oniria_lightpink placeholder-oniria_lightpink/50 text-base sm:text-lg font-semibold"
              placeholder="Título de tu mensaje..."
            />
            <div className="h-px bg-gradient-to-r from-oniria_purple/30 to-oniria_pink/30"></div>
          </div>
          
          {/* Text input */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={2500}
              className="w-full px-0 py-2 bg-transparent border-none focus:outline-none text-oniria_lightpink placeholder-oniria_lightpink/50 resize-none min-h-[60px] max-h-[200px] overflow-y-auto text-sm sm:text-base"
              placeholder={placeholder}
              rows={2}
            />
            
            {/* Bottom bar - Layout responsivo */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 pt-3 border-t border-white/10 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-oniria_lightpink/60 flex-wrap">
                <span>{title.length}/50</span>
                <span>•</span>
                <span>{text.length}/2500</span>
                <span className="hidden lg:flex items-center space-x-1">
                  <span>•</span>
                  <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">⌘</kbd>
                  <span>+</span>
                  <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">Enter</kbd>
                  <span>para enviar</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 sm:space-x-2 bg-white/20 hover:bg-white/30 text-oniria_lightpink px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-xs sm:text-sm"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Cancelar</span>
                  </button>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !text.trim()}
                  className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink disabled:from-gray-400 disabled:to-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg disabled:opacity-50 text-xs sm:text-sm"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{isEditing ? 'Actualizar' : 'Enviar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};