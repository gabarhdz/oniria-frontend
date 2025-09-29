import React, { useState } from 'react';
import { 
  Crown, 
  CheckCircle, 
  Users, 
  Clock, 
  Edit2, 
  Trash2, 
  UserPlus, 
  UserMinus,
  Star,
  Eye
} from 'lucide-react';
import type { Community, User } from './types';

// COMMUNITY CARD RESPONSIVA Y OPTIMIZADA
export const CommunityCard: React.FC<{ 
  community: Community; 
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onJoin?: () => void;
  onShowMembers?: () => void;
  currentUser?: User;
  index: number;
}> = ({ 
  community, 
  onClick, 
  onEdit, 
  onDelete, 
  onJoin, 
  onShowMembers, 
  currentUser, 
  index 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isMember = currentUser && community.users.some(user => user.id === currentUser.id);
  const isOwner = currentUser && community.owner && community.owner.id === currentUser.id;

  return (
    <div 
      className="group relative overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 w-full animate-fade-in-up
                 h-[350px] sm:h-[380px] lg:h-[400px]"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Enhanced glass border with particles */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl p-[1px] bg-gradient-to-br from-oniria_purple/60 via-oniria_pink/50 to-oniria_lightpink/60 group-hover:from-oniria_purple/80 group-hover:via-oniria_pink/70 group-hover:to-oniria_lightpink/80 transition-all duration-500">
        <div className="h-full w-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/40 via-white/35 to-white/30 backdrop-blur-xl shadow-inner flex flex-col relative overflow-hidden">
          
          {/* Floating particles inside card */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 3}s`,
                }}
              />
            ))}
            
            {/* Static stars - Menos en móvil */}
            {Array.from({ length: window.innerWidth < 640 ? 2 : 4 }, (_, i) => (
              <Star
                key={`star-${i}`}
                className="absolute text-oniria_lightpink/30 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                  width: `${Math.random() * 6 + 4}px`,
                  height: `${Math.random() * 6 + 4}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Content responsivo */}
      <div className="relative z-10 p-4 sm:p-5 lg:p-6 h-full flex flex-col">
        
        {/* Header - Layout responsivo */}
        <div className="flex items-start space-x-3 sm:space-x-4 flex-shrink-0 mb-3 sm:mb-4">
          {/* Community Image/Avatar - MÁS GRANDE */}
          {community.profile_image ? (
            <div className="relative flex-shrink-0">
              <img 
                src={community.profile_image} 
                alt={community.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-oniria_pink/50 object-cover shadow-lg" 
              />
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-oniria_purple/10 to-oniria_pink/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
                  {community.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
          
          {/* Title and badges - Stack en móvil */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-oniria_darkblue group-hover:text-oniria_purple transition-colors duration-300 truncate">
                {community.name}
              </h3>
              
              {/* Badges - Stack en móvil, inline en desktop */}
              <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                {isOwner && (
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-oniria_purple to-oniria_pink text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-md">
                    <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Propietario</span>
                    <span className="sm:hidden">Owner</span>
                  </div>
                )}
                {isMember && !isOwner && (
                  <div className="flex items-center space-x-1 bg-emerald-500/30 text-emerald-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Miembro</span>
                    <span className="sm:hidden">Member</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Description - Altura adaptativa */}
        <div className="flex-1 py-2 overflow-hidden">
          <p className="text-oniria_darkblue/90 group-hover:text-oniria_darkblue transition-colors duration-300 leading-relaxed text-xs sm:text-sm line-clamp-3 sm:line-clamp-4 lg:line-clamp-5">
            {community.description || 'Una comunidad esperando ser explorada...'}
          </p>
        </div>
        
        {/* Stats - Layout responsivo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-oniria_darkblue/70 group-hover:text-oniria_darkblue/80 transition-colors duration-300 flex-shrink-0 mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Botón de miembros - Más prominente en móvil */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onShowMembers && onShowMembers(); 
              }}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition-all duration-300 hover:scale-105"
            >
              <Users className="w-3 h-3" />
              <span className="font-medium text-xs">
                {community.users.length}
                <span className="hidden sm:inline ml-1">
                  {community.users.length === 1 ? 'miembro' : 'miembros'}
                </span>
              </span>
            </button>
            
            {/* Fecha - Compacta en móvil */}
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                {new Date(community.created_at).toLocaleDateString('es-ES', { 
                  month: 'short', 
                  day: 'numeric',
                  year: window.innerWidth < 640 ? '2-digit' : 'numeric'
                })}
              </span>
            </div>
          </div>
          
          {/* Owner info - Solo en desktop o cuando hay espacio */}
          {community.owner && (
            <div className="text-xs text-oniria_darkblue/60 truncate max-w-[120px] sm:max-w-[140px] hidden sm:block">
              Por: {community.owner.username}
            </div>
          )}
        </div>
        
        {/* Action buttons - Layout responsivo */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-oniria_darkblue/20 flex-shrink-0">
          {/* Admin actions */}
          <div className="flex space-x-1 sm:space-x-2">
            {isOwner && onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-1.5 sm:p-2 bg-blue-500/30 hover:bg-blue-500/40 text-blue-700 hover:text-blue-800 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                title="Editar comunidad"
              >
                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
            {isOwner && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-1.5 sm:p-2 bg-red-500/30 hover:bg-red-500/40 text-red-700 hover:text-red-800 rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                title="Eliminar comunidad"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
            
            {/* View button para usuarios no miembros */}
            {!isMember && (
              <button
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="p-1.5 sm:p-2 bg-oniria_purple/20 hover:bg-oniria_purple/30 text-oniria_purple hover:text-oniria_darkblue rounded-lg transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                title="Ver comunidad"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
          
          {/* Join/Leave button */}
          {currentUser && onJoin && (
            <button
              onClick={(e) => { e.stopPropagation(); onJoin(); }}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium ${
                isMember 
                  ? 'bg-red-500/30 hover:bg-red-500/40 text-red-700 hover:text-red-800'
                  : 'bg-green-500/30 hover:bg-green-500/40 text-green-700 hover:text-green-800'
              }`}
            >
              {isMember ? <UserMinus className="w-3 h-3 sm:w-4 sm:h-4" /> : <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="hidden sm:inline">{isMember ? 'Salir' : 'Unirse'}</span>
              <span className="sm:hidden">{isMember ? '−' : '+'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};