import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProfileHeaderProps } from './types';

// Profile Header Component
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  activeTab, 
  viewOnly = false, 
  username 
}) => {
  const getTabTitle = () => {
    if (viewOnly) return `Perfil de ${username || 'Usuario'}`;
    
    switch (activeTab) {
      case 'profile': return 'Mi Perfil';
      case 'privacy': return 'Configuración de Privacidad';
      case 'security': return 'Seguridad de la Cuenta';
      default: return 'Mi Perfil';
    }
  };
  
  const getTabDescription = () => {
    if (viewOnly) return 'Explora el perfil público de este usuario';
    
    switch (activeTab) {
      case 'profile': return 'Gestiona tu identidad en Noctiria';
      case 'privacy': return 'Controla quién puede ver tu información';
      case 'security': return 'Protege tu cuenta y datos personales';
      default: return 'Gestiona tu identidad en Noctiria';
    }
  };
  
  const backPath = viewOnly ? '/communities' : '/dashboard';
  const backText = viewOnly ? 'Volver a Comunidades' : 'Volver al Dashboard';
  
  return (
    <header className="relative z-10 p-6 border-b border-[#f1b3be]/20 backdrop-blur-xl bg-[#252c3e]/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link 
          to={backPath}
          className="flex items-center space-x-3 text-[#ffe0db]/80 hover:text-[#ffe0db] transition-colors group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{backText}</span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h1 className="text-2xl font-bold text-[#ffe0db]">{getTabTitle()}</h1>
            <p className="text-[#f1b3be]">{getTabDescription()}</p>
          </div>
          <Sparkles className="w-8 h-8 text-[#f1b3be] animate-pulse" />
        </div>
      </div>
    </header>
  );
};