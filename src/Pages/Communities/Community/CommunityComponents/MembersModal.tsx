import React from 'react';
import { Users, Crown, Star, X } from 'lucide-react';
import type{ Community } from './types';
import { ProfileAvatar, getUserInitials } from './FilterAndAvatarComponents';

// MembersModal completamente responsive
export const MembersModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  community: Community;
}> = ({ isOpen, onClose, community }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-2 sm:px-4">
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl w-full max-w-xs sm:max-w-lg lg:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden shadow-2xl border border-white/20 animate-modal-entrance">
        
        {/* Header - Responsivo */}
        <div className="p-4 sm:p-6 border-b border-oniria_purple/20 bg-gradient-to-r from-oniria_purple/10 to-oniria_pink/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-oniria_purple flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-oniria_darkblue truncate">
                  Miembros de {community.name}
                </h3>
                <p className="text-xs sm:text-sm text-oniria_darkblue/70">
                  {community.users.length} {community.users.length === 1 ? 'miembro' : 'miembros'} en total
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/50 hover:bg-white/70 text-oniria_darkblue transition-all duration-300 hover:scale-110 flex-shrink-0 ml-2"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Members List - Scroll responsivo */}
        <div className="p-3 sm:p-6 overflow-y-auto max-h-[60vh] sm:max-h-[50vh]">
          <div className="space-y-2 sm:space-y-4">
            {community.users.map((member, index) => (
              <div
                key={member.id}
                className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/60 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Avatar responsivo usando ProfileAvatar */}
                <div className="flex-shrink-0">
                  <ProfileAvatar
                    user={member}
                    size="medium"
                    onClick={() => window.location.href = `/dashboard/profile/view/${member.id}`}
                    className="hover:ring-2 hover:ring-oniria_purple/50 cursor-pointer"
                  />
                </div>

                {/* Info del usuario - Layout responsivo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
                    <h4 className="font-semibold text-oniria_darkblue truncate text-sm sm:text-base">
                      {member.username}
                    </h4>
                    
                    {/* Badges - Stack en móvil, inline en desktop */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {member.id === community.owner?.id && (
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-oniria_purple to-oniria_pink text-white text-xs px-2 py-0.5 sm:py-1 rounded-lg">
                          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Propietario</span>
                          <span className="sm:hidden">Owner</span>
                        </div>
                      )}
                      {member.is_psychologist && (
                        <div className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-600 text-xs px-2 py-0.5 sm:py-1 rounded-lg">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Psicólogo</span>
                          <span className="sm:hidden">Psi</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Email - Oculto en móvil pequeño */}
                  <p className="text-xs sm:text-sm text-oniria_darkblue/70 truncate hidden sm:block">
                    {member.email}
                  </p>
                  
                  {/* Description - Solo en desktop */}
                  {member.description && (
                    <p className="text-xs text-oniria_darkblue/60 mt-1 truncate hidden lg:block">
                      {member.description}
                    </p>
                  )}
                </div>

                {/* Indicador de conectado (opcional) */}
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Responsivo */}
        <div className="p-3 sm:p-4 border-t border-oniria_purple/20 bg-gradient-to-r from-oniria_purple/5 to-oniria_pink/5">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};