import React, { useState } from 'react';
import { LogOut, RefreshCw, User, Settings, Shield, Bell, Moon, Sun, HelpCircle, AlertTriangle, Menu, X, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  email?: string;
  is_psychologist: boolean;
  description?: string;
  profile_pic?: string;
}

interface DashboardHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
  user: User;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  onLogout,
  isRefreshing,
  user
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const navigate = useNavigate();

  const profileMenuItems = [
    { icon: User, label: 'Mi Perfil', action: () => navigate('/profile') },
    { icon: Settings, label: 'Configuración', action: () => console.log('Configuración') },
    { icon: Shield, label: 'Privacidad', action: () => console.log('Privacidad') },
    { icon: Bell, label: 'Notificaciones', action: () => console.log('Notificaciones') },
    { icon: darkMode ? Sun : Moon, label: darkMode ? 'Modo Claro' : 'Modo Oscuro', action: () => setDarkMode(!darkMode) },
    { icon: HelpCircle, label: 'Ayuda', action: () => console.log('Ayuda') },
  ];

  const navigationItems = ['Chatbot', 'Análisis', 'Psicólogos', 'Comunidad'];

  // Función para obtener las iniciales del usuario
  const getUserInitials = (username: string): string => {
    return username.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  // Función para generar URL completa de la imagen de perfil
  const getProfileImageUrl = (profilePic?: string): string | null => {
    if (!profilePic) return null;
    
    // Si ya es una URL completa, la devolvemos tal como está
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
      return profilePic;
    }
    
    // Si es una ruta relativa, la construimos con el dominio del API
    const cleanPath = profilePic.startsWith('/') ? profilePic : `/${profilePic}`;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutConfirm(true);
    setShowMobileMenu(false); // Cerrar menú móvil si está abierto
  };

  const handleConfirmLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutConfirm(false);
    onLogout();
  };

  const handleCancelLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutConfirm(false);
  };

  // Cerrar menús cuando se hace clic fuera
  const handleOutsideClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative') || !target.closest('button')) {
      setShowProfileMenu(false);
    }
  };

  // Componente para mostrar avatar simplificado
  const ProfileAvatar: React.FC<{ size: 'small' | 'medium' | 'large'; showRing?: boolean }> = ({ 
    size, 
    showRing = false 
  }) => {
    const [imageError, setImageError] = useState(false);
    
    const sizeClasses = {
      small: 'w-8 h-8',
      medium: 'w-10 h-10',
      large: 'w-16 h-16'
    }[size];
    
    const textSize = {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-lg'
    }[size];
    
    const ringClasses = showRing ? 'ring-2 ring-oniria_purple/30' : '';
    
    const profileImageUrl = getProfileImageUrl(user.profile_pic);

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div className={`${sizeClasses} ${ringClasses} rounded-full overflow-hidden bg-gradient-to-br from-oniria_purple/40 via-oniria_pink/30 to-oniria_lightpink/20 flex items-center justify-center relative`}>
        {profileImageUrl && !imageError ? (
          <img 
            src={profileImageUrl}
            alt={`Avatar de ${user.username}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span className={`text-white font-semibold ${textSize} select-none`}>
            {getUserInitials(user.username)}
          </span>
        )}
      </div>
    );
  };

  // Componente de navegación reutilizable
  const NavigationLink: React.FC<{ item: string; onClick?: () => void; isMobile?: boolean }> = ({ 
    item, 
    onClick,
    isMobile = false 
  }) => (
    <button 
      onClick={onClick}
      className={`group relative text-oniria_lightpink hover:text-white transition-all duration-500 ${
        isMobile 
          ? 'w-full text-left py-4 px-6 rounded-2xl' 
          : 'py-3 px-6 rounded-2xl'
      } block overflow-hidden cursor-pointer hover:bg-gradient-to-r hover:from-oniria_purple/10 hover:to-oniria_pink/10`}
    >
      {/* Efecto de burbuja expansiva */}
      <div className="absolute inset-0 bg-gradient-to-br from-oniria_purple/20 via-oniria_pink/15 to-oniria_lightpink/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
      
      {/* Partículas flotantes */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-2 left-3 w-1 h-1 bg-oniria_purple rounded-full animate-pulse"></div>
        <div className="absolute bottom-3 right-4 w-1.5 h-1.5 bg-oniria_pink/80 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-oniria_lightpink rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
      </div>
      
      {/* Texto con efecto de brillo */}
      <span className={`relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.8)] transition-all duration-300 ${
        isMobile ? 'text-lg' : 'text-base'
      }`}>
        {item}
      </span>
      
      {/* Línea animada ondulada */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
        <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple to-oniria_pink animate-pulse"></div>
      </div>
      
      {/* Efecto de destello lateral */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_lightpink/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
    </button>
  );

  // Modal de confirmación de logout
  const LogoutConfirmModal = () => (
    <div className={`fixed inset-0 z-[9999] transition-all duration-300 ${showLogoutConfirm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCancelLogout(e);
        }}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`relative bg-gradient-to-br from-oniria_darkblue/95 via-oniria_darkblue/90 to-oniria_blue/95 backdrop-blur-2xl border border-oniria_purple/30 rounded-2xl shadow-2xl shadow-oniria_purple/20 p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${showLogoutConfirm ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          
          {/* Efectos de fondo decorativos */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute top-4 left-4 w-2 h-2 bg-oniria_purple/30 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-oniria_pink/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-oniria_lightpink/30 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-oniria_purple/20 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>

          {/* Contenido del modal */}
          <div className="relative z-10 text-center space-y-6">
            {/* Icono de advertencia animado */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-oniria_pink/20 via-oniria_purple/20 to-oniria_lightpink/20 rounded-full blur-xl animate-pulse w-20 h-20"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-oniria_pink/30 to-oniria_purple/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-oniria_lightpink animate-pulse" />
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-oniria_lightpink via-oniria_pink to-oniria_purple bg-clip-text text-transparent">
                ¿Cerrar Sesión?
              </h3>
              <p className="text-sm sm:text-base text-oniria_lightpink/80">
                ¿Estás seguro de que deseas cerrar tu sesión en NOCTIRIA?
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              {/* Botón Cancelar */}
              <button
                onClick={handleCancelLogout}
                className="group relative flex-1 px-6 py-3 rounded-xl bg-oniria_blue/20 backdrop-blur-sm border border-oniria_blue/50 hover:border-oniria_purple/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_blue/40 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_blue/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10 font-medium">Cancelar</span>
              </button>

              {/* Botón Confirmar */}
              <button
                onClick={handleConfirmLogout}
                className="group relative flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-oniria_pink/30 to-oniria_purple/25 backdrop-blur-sm border border-oniria_pink/50 hover:border-oniria_purple/70 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_pink/50 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_pink/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {/* Partículas de fondo */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-2 left-3 w-1 h-1 bg-white/50 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-3 right-4 w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white/40 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                </div>

                <span className="relative z-10 font-medium flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Menú móvil con scroll
  const MobileMenu = () => (
    <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${
      showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          showMobileMenu ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setShowMobileMenu(false)}
      />
      
      {/* Panel deslizante con scroll */}
      <div className={`absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-gradient-to-br from-oniria_darkblue/95 via-oniria_darkblue/90 to-oniria_blue/95 backdrop-blur-2xl border-l border-oniria_purple/30 shadow-2xl shadow-oniria_purple/20 transform transition-transform duration-500 ${
        showMobileMenu ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}>
        
        {/* Header del menú móvil - Fijo */}
        <div className="flex items-center justify-between p-6 border-b border-oniria_purple/20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <ProfileAvatar size="medium" />
            <div>
              <h3 className="font-semibold text-white text-lg">{user.username}</h3>
              <p className="text-sm text-oniria_pink/80">
                {user.is_psychologist ? 'Psicólogo' : 'Usuario'}
              </p>
            </div>
          </div>
          
          {/* Botón cerrar */}
          <button
            onClick={() => setShowMobileMenu(false)}
            className="group relative p-2 rounded-full bg-oniria_purple/15 backdrop-blur-sm border border-oniria_purple/40 hover:border-oniria_pink/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_purple/40 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_purple/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <X className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:rotate-180" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-oniria_darkblue/50 scrollbar-thumb-oniria_purple/30 hover:scrollbar-thumb-oniria_purple/50">
          {/* Navegación móvil */}
          <div className="p-4 space-y-2">
            <h4 className="text-sm font-semibold text-oniria_purple/80 uppercase tracking-wider mb-4">
              Navegación
            </h4>
            {navigationItems.map((item, index) => (
              <div
                key={item}
                className={`transform transition-all duration-500 ${
                  showMobileMenu ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{transitionDelay: `${index * 100}ms`}}
              >
                <NavigationLink 
                  item={item} 
                  onClick={() => setShowMobileMenu(false)}
                  isMobile={true}
                />
              </div>
            ))}
          </div>

          {/* Opciones de perfil */}
          <div className="p-4 border-t border-oniria_purple/20">
            <h4 className="text-sm font-semibold text-oniria_purple/80 uppercase tracking-wider mb-4">
              Perfil
            </h4>
            {profileMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setShowMobileMenu(false);
                  }}
                  className={`group relative w-full flex items-center space-x-3 text-oniria_lightpink hover:text-white transition-all duration-500 py-3 px-4 rounded-xl overflow-hidden transform ${
                    showMobileMenu ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  } cursor-pointer hover:bg-gradient-to-r hover:from-oniria_purple/10 hover:to-oniria_pink/5`}
                  style={{transitionDelay: `${(navigationItems.length + index) * 100}ms`}}
                >
                  {/* Efecto de burbuja expansiva */}
                  <div className="absolute inset-0 bg-gradient-to-br from-oniria_purple/20 via-oniria_pink/10 to-oniria_lightpink/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                  
                  {/* Partículas flotantes */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-2 left-6 w-0.5 h-0.5 bg-oniria_purple rounded-full animate-pulse"></div>
                    <div className="absolute bottom-3 right-6 w-1 h-1 bg-oniria_pink/80 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute top-1/2 right-8 w-0.5 h-0.5 bg-oniria_lightpink rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                  </div>

                  <Icon className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110 text-oniria_pink group-hover:text-white" />
                  <span className="relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.8)] transition-all duration-300">
                    {item.label}
                  </span>

                  {/* Línea animada */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple to-oniria_pink animate-pulse"></div>
                  </div>

                  {/* Efecto de destello lateral */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_lightpink/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botones de acción en móvil - Fijos en la parte inferior */}
        <div className="p-4 border-t border-oniria_purple/20 space-y-3 flex-shrink-0">
          {/* Botón Refresh */}
          <button
            onClick={() => {
              onRefresh();
              setShowMobileMenu(false);
            }}
            disabled={isRefreshing}
            className="group relative w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-oniria_purple/15 backdrop-blur-sm border border-oniria_purple/40 hover:border-oniria_pink/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_purple/40 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_purple/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <RefreshCw className={`w-5 h-5 relative z-10 transition-all duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span className="relative z-10 font-medium">Actualizar</span>
          </button>

          {/* Botón Logout */}
          <button
            onClick={handleLogoutClick}
            className="group relative w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-oniria_pink/20 to-oniria_purple/15 backdrop-blur-sm border border-oniria_pink/40 hover:border-oniria_purple/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_pink/40 overflow-hidden cursor-pointer"
          >
            {/* Efecto de destello */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_pink/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            {/* Partículas de fondo */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-2 left-3 w-1 h-1 bg-oniria_purple rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 right-4 w-1.5 h-1.5 bg-oniria_pink/80 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-oniria_lightpink rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
            </div>

            <LogOut className="w-4 h-4 relative z-10 transition-all duration-300" />
            <span className="relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.8)] transition-all duration-300">
              Cerrar Sesión
            </span>

            {/* Línea animada en la parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
              <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple to-oniria_pink animate-pulse"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-oniria_darkblue/90 backdrop-blur-xl text-oniria_lightpink h-[70px] sm:h-[90px] font-playfair border-b border-oniria_purple/20 shadow-2xl shadow-oniria_purple/10">
        <div className="flex justify-between items-center p-3 sm:p-4 h-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8"
             onClick={handleOutsideClick}>
          
          {/* Logo con texto NOCTIRIA - Más pegado a la izquierda */}
          <div className="relative flex-shrink-0 -ml-6 sm:-ml-8">
            <div className="flex gap-2 sm:gap-3 items-center">
              <div className="relative">
                <div className="flex items-center">
                  {/* Container del logo solo con scale */}
                  <div className="relative w-14 h-14 sm:w-18 sm:h-18 lg:w-28 lg:h-28 p-1 sm:p-2 transition-transform duration-300 hover:scale-105">
                    <img 
                      src="/img/Oniria.svg" 
                      alt="ONIRIA Logo" 
                      className="w-full h-full object-contain filter drop-shadow-sm relative z-10" 
                    />
                  </div>
                  
                  {/* Texto NOCTIRIA con efectos reducidos */}
                  <div className="relative ml-2 sm:ml-3 group">
                    <span className="font-inter font-bold text-lg sm:text-2xl lg:text-3xl bg-gradient-to-r from-oniria_pink via-oniria_lightpink to-oniria_purple bg-clip-text text-transparent hover:bg-gradient-to-l transition-all duration-700 hover:tracking-wider block relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.6)]">
                      NOCTIRIA
                    </span>
                    
                    {/* Efectos decorativos reducidos alrededor del texto */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {/* Partículas flotantes reducidas */}
                      <div className="absolute -top-1 left-2 w-0.5 h-0.5 bg-oniria_purple/40 rounded-full animate-pulse"></div>
                      <div className="absolute top-1 -right-1 w-0.5 h-0.5 bg-oniria_pink/30 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                      <div className="absolute -bottom-1 left-8 w-0.5 h-0.5 bg-oniria_lightpink/40 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                    </div>
                    
                    {/* Línea elegante que se expande desde el centro */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-oniria_purple/30 to-transparent opacity-60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple/40 to-oniria_pink/40"></div>
                    </div>
                    
                    {/* Resplandor de fondo reducido */}
                    <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple/3 via-oniria_pink/3 to-oniria_lightpink/3 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  </div>
                </div>
              </div>
            </div>     
          </div>

          {/* Navegación desktop - Solo visible en pantallas grandes */}
          <div className="hidden lg:flex items-center">
            <ul className="flex gap-6 xl:gap-8 text-sm xl:text-base font-inter">
              {navigationItems.map((item) => (
                <li key={item} className="group relative">
                  <NavigationLink item={item} />
                </li>
              ))}
            </ul>
          </div>

          {/* Botones de acción desktop - Solo visible en pantallas medianas y grandes */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Botón Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="group relative p-2 lg:p-3 rounded-full bg-oniria_purple/15 backdrop-blur-sm border border-oniria_purple/40 hover:border-oniria_pink/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_purple/40 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Actualizar datos"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_purple/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <RefreshCw className={`w-4 h-4 lg:w-5 lg:h-5 relative z-10 transition-all duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            </button>

            {/* Botón Perfil con dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="group relative p-2 rounded-full bg-oniria_blue/20 backdrop-blur-sm border border-oniria_blue/50 hover:border-oniria_purple/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_blue/40 overflow-hidden cursor-pointer"
                title={`Perfil de ${user.username}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_blue/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Avatar del usuario */}
                <div className="relative z-10">
                  <ProfileAvatar size="small" />
                </div>
              </button>

              {/* Dropdown del perfil - Solo desktop */}
              <div className={`absolute top-full right-0 mt-2 w-80 transition-all duration-500 ease-out transform ${showProfileMenu ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
                <div className="bg-oniria_darkblue/95 backdrop-blur-2xl border border-oniria_purple/30 rounded-2xl shadow-2xl shadow-oniria_purple/20 overflow-hidden">
                  {/* Header del perfil */}
                  <div className="p-6 bg-gradient-to-r from-oniria_purple/10 via-oniria_pink/10 to-oniria_lightpink/10 border-b border-oniria_purple/20">
                    <div className="flex items-center space-x-4">
                      <ProfileAvatar size="large" showRing={true} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg truncate">{user.username}</h3>
                        <p className="text-sm text-oniria_pink/80 truncate">{user.email || 'Sin email'}</p>
                        {user.is_psychologist && (
                          <div className="mt-1 flex items-center">
                            <Shield className="w-3 h-3 text-oniria_purple mr-1" />
                            <span className="text-xs text-oniria_purple font-medium">Psicólogo Verificado</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Descripción del usuario si existe */}
                    {user.description && (
                      <div className="mt-4 p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-oniria_lightpink/90 line-clamp-3">
                          {user.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Opciones del menú */}
                  <div className="p-2">
                    {profileMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className={`group relative w-full flex items-center space-x-3 text-oniria_lightpink hover:text-white transition-all duration-500 py-3 px-4 rounded-xl overflow-hidden transform ${showProfileMenu ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'} cursor-pointer hover:bg-gradient-to-r hover:from-oniria_purple/10 hover:to-oniria_pink/5`}
                          style={{transitionDelay: `${index * 50}ms`}}
                        >
                          {/* Efecto de burbuja expansiva */}
                          <div className="absolute inset-0 bg-gradient-to-br from-oniria_purple/20 via-oniria_pink/10 to-oniria_lightpink/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                          
                          {/* Partículas flotantes */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute top-2 left-6 w-0.5 h-0.5 bg-oniria_purple rounded-full animate-pulse"></div>
                            <div className="absolute bottom-3 right-6 w-1 h-1 bg-oniria_pink/80 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="absolute top-1/2 right-8 w-0.5 h-0.5 bg-oniria_lightpink rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                          </div>

                          <Icon className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110 text-oniria_pink group-hover:text-white" />
                          <span className="relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.8)] transition-all duration-300">
                            {item.label}
                          </span>

                          {/* Línea animada */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple to-oniria_pink animate-pulse"></div>
                          </div>

                          {/* Efecto de destello lateral */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_lightpink/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Logout desktop */}
            <button
              onClick={handleLogoutClick}
              className="group relative flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 rounded-full bg-gradient-to-r from-oniria_pink/20 to-oniria_purple/15 backdrop-blur-sm border border-oniria_pink/40 hover:border-oniria_purple/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_pink/40 overflow-hidden cursor-pointer"
            >
              {/* Efecto de destello */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_pink/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Partículas de fondo */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-2 left-3 w-1 h-1 bg-oniria_purple rounded-full animate-pulse"></div>
                <div className="absolute bottom-3 right-4 w-1.5 h-1.5 bg-oniria_pink/80 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-oniria_lightpink rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
              </div>

              <LogOut className="w-4 h-4 relative z-10 transition-all duration-300" />
              <span className="hidden lg:inline relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.8)] transition-all duration-300">
                Salir
              </span>

              {/* Línea animada en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple to-oniria_pink animate-pulse"></div>
              </div>
            </button>
          </div>

          {/* Botones móviles - Visible en pantallas pequeñas y medianas */}
          <div className="flex md:hidden items-center gap-2">
            {/* Botón Refresh móvil */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="group relative p-2 rounded-full bg-oniria_purple/15 backdrop-blur-sm border border-oniria_purple/40 hover:border-oniria_pink/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_purple/40 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Actualizar datos"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_purple/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <RefreshCw className={`w-4 h-4 relative z-10 transition-all duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            </button>

            {/* Botón hamburguesa */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="group relative p-2 rounded-full bg-oniria_blue/20 backdrop-blur-sm border border-oniria_blue/50 hover:border-oniria_purple/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_blue/40 overflow-hidden cursor-pointer"
              title="Menú"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_blue/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10 flex items-center space-x-2">
                <Menu className={`w-5 h-5 transition-all duration-300 ${showMobileMenu ? 'rotate-180' : 'group-hover:rotate-90'}`} />
                <div className="flex items-center">
                  <ProfileAvatar size="small" />
                </div>
              </div>
            </button>
          </div>

          {/* Avatar y menú solo en tablet (md) */}
          <div className="hidden md:flex lg:hidden items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="group relative p-2 rounded-full bg-oniria_blue/20 backdrop-blur-sm border border-oniria_blue/50 hover:border-oniria_purple/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_blue/40 overflow-hidden cursor-pointer"
              title="Menú"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_blue/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10 flex items-center space-x-2">
                <Menu className={`w-5 h-5 transition-all duration-300 ${showMobileMenu ? 'rotate-180' : 'group-hover:rotate-90'}`} />
                <ProfileAvatar size="small" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Espaciador para el header fijo - Responsive */}
      <div className="h-[70px] sm:h-[90px]"></div>

      {/* Menú móvil */}
      <MobileMenu />

      {/* Modal de confirmación de logout */}
      <LogoutConfirmModal />
    </>
  );
};

export default DashboardHeader;