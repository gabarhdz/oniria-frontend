import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, Plus, MessageSquare, X } from 'lucide-react';
import type { Community, Post } from './types';
import { ChatPostCreator } from './PostComponents';

// Enhanced Community Modal - Responsivo
export const CommunityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; profile_image?: File }) => void;
  community?: Community;
  isEditing?: boolean;
}> = ({ isOpen, onClose, onSubmit, community, isEditing = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(community?.name || '');
      setDescription(community?.description || '');
      setImagePreview(community?.profile_image || null);
      setProfileImage(null);
    }
  }, [isOpen, community]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, profile_image: profileImage || undefined });
    setName('');
    setDescription('');
    setProfileImage(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-2 sm:px-4">
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-modal-entrance">
        
        {/* Header - Responsivo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-oniria_darkblue mb-2 sm:mb-3">
            {isEditing ? 'Editar Comunidad' : 'Crear Nueva Comunidad'}
          </h2>
          <p className="text-sm sm:text-base text-oniria_darkblue/70 px-2">
            {isEditing ? 'Actualiza la información de tu comunidad' : 'Dale vida a una nueva comunidad onírica'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Profile Image Upload - Centrado y responsivo */}
          <div className="text-center">
            <label className="block text-sm sm:text-base font-semibold text-oniria_darkblue mb-4 sm:mb-6">Imagen de Perfil</label>
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-oniria_purple/20 to-oniria_pink/20 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mx-auto">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-oniria_purple" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-oniria_pink to-oniria_purple rounded-full flex items-center justify-center shadow-xl cursor-pointer">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Form fields - Stack en móvil, grid en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Name Field */}
            <div className="lg:col-span-1">
              <label className="block text-sm sm:text-base font-semibold text-oniria_darkblue mb-2 sm:mb-3">
                Nombre de la Comunidad
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={30}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/50 border border-oniria_purple/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-oniria_pink focus:border-transparent text-oniria_darkblue placeholder-oniria_darkblue/50 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
                placeholder="Ej: Exploradores de Sueños"
              />
              <div className="text-xs sm:text-sm text-oniria_darkblue/60 mt-2">{name.length}/30 caracteres</div>
            </div>
            
            {/* Description Field */}
            <div className="lg:col-span-1">
              <label className="block text-sm sm:text-base font-semibold text-oniria_darkblue mb-2 sm:mb-3">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={450}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/50 border border-oniria_purple/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-oniria_pink focus:border-transparent text-oniria_darkblue placeholder-oniria_darkblue/50 backdrop-blur-sm transition-all duration-300 resize-none text-sm sm:text-base"
                placeholder="Describe el propósito de tu comunidad onírica..."
                rows={4}
              />
              <div className="text-xs sm:text-sm text-oniria_darkblue/60 mt-2">{description.length}/450 caracteres</div>
            </div>
          </div>
          
          {/* Action Buttons - Stack en móvil, horizontal en desktop */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              {isEditing ? 'Actualizar Comunidad' : 'Crear Comunidad'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/50 hover:bg-white/70 text-oniria_darkblue py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PostModal - Responsivo
export const PostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; text: string; community: string; parent_post?: string }) => void;
  community: Community;
  parentPost?: Post;
  post?: Post;
  isEditing?: boolean;
}> = ({ isOpen, onClose, onSubmit, community, parentPost, post, isEditing = false }) => {
  const handleChatSubmit = (data: { title: string; text: string }) => {
    onSubmit({
      title: data.title,
      text: data.text,
      community: community.id,
      parent_post: parentPost?.id
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-2 sm:px-4">
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-modal-entrance">
        
        {/* Header - Responsivo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-oniria_darkblue mb-2">
            {isEditing ? 'Editar Mensaje' : parentPost ? 'Responder Mensaje' : 'Nuevo Mensaje'}
          </h2>
          <p className="text-xs sm:text-sm text-oniria_darkblue/70">
            Compartiendo en: <span className="font-semibold text-oniria_purple">{community.name}</span>
          </p>
        </div>

        {/* Chat creator con fondo */}
        <div className="bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <ChatPostCreator
            onSubmit={handleChatSubmit}
            parentPost={parentPost}
            post={post}
            isEditing={isEditing}
            placeholder="Comparte tus pensamientos, sueños y experiencias..."
          />
        </div>

        {/* Footer con botón cerrar */}
        <div className="flex justify-end pt-3 sm:pt-4">
          <button
            onClick={onClose}
            className="bg-white/50 hover:bg-white/70 text-oniria_darkblue py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};