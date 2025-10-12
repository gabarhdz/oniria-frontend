import React, { useState } from 'react';
import { LogOut, RefreshCw, User, Settings, Shield, Bell, Moon, Sun, HelpCircle, AlertTriangle, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationCenter } from '../../../components/NotificationCenter';

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
    { icon: User, label: 'Mi Perfil', action: () => navigate('/dashboard/profile/profile') },
    { icon: Settings, label: 'Configuración', action: () => console.log('Configuración') },
    { icon: Shield, label: 'Privacidad', action: () => console.log('Privacidad') },
    { icon: Bell, label: 'Notificaciones', action: () => console.log('Notificaciones') },
    { icon: darkMode ? Sun : Moon, label: darkMode ? 'Modo Claro' : 'Modo Oscuro', action: () => setDarkMode(!darkMode) },
    { icon: HelpCircle, label: 'Ayuda', action: () => console.log('Ayuda') },
  ];

  const navigationItems = [
    { label: 'Chatbot', path: '/chatbot' },
    { label: 'Análisis', path: '/analysis' },
    { label: 'Psicólogos', path: '/psychologists' },
    { label: 'Comunidad', path: '/communities' },
  ];

  const getUserInitials = (username: string): string =>
    username.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);

  const getProfileImageUrl = (profilePic?: string): string | null => {
    if (!profilePic) return null;
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
      return profilePic;
    }
    const cleanPath = profilePic.startsWith('/') ? profilePic : `/${profilePic}`;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutConfirm(true);
    setShowMobileMenu(false);
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

  const handleOutsideClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative') || !target.closest('button')) {
      setShowProfileMenu(false);
    }
  };

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

  const NavigationLink: React.FC<{ item: string; onClick?: () => void; isMobile?: boolean }> = ({
    item,
    onClick,
    isMobile = false
  }) => (
    <button
      onClick={onClick}
      className={`group relative text-oniria_lightpink hover:text-white transition-all duration-500 ${
        isMobile ? 'w-full text-left py-4 px-6 rounded-2xl' : 'py-3 px-6 rounded-2xl'
      } block overflow-hidden cursor-pointer hover:bg-gradient-to-r hover:from-oniria_purple/10 hover:to-oniria_pink/10`}
    >
      <span className={`relative z-10 font-medium ${isMobile ? 'text-lg' : 'text-base'}`}>
        {item}
      </span>
    </button>
  );

  const LogoutConfirmModal = () => (
    <div className={`fixed inset-0 z-[9999] transition-all duration-300 ${showLogoutConfirm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancelLogout}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`relative bg-oniria_darkblue/95 backdrop-blur-2xl border border-oniria_purple/30 rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${showLogoutConfirm ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="relative z-10 text-center space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-oniria_lightpink">¿Cerrar Sesión?</h3>
            <p className="text-sm sm:text-base text-oniria_lightpink/80">
              ¿Estás seguro de que deseas cerrar tu sesión en NOCTIRIA?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-6 py-3 rounded-xl bg-oniria_blue/20 text-oniria_lightpink hover:text-white transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-6 py-3 rounded-xl bg-oniria_pink/30 text-white transition-all duration-300"
              >
                <LogOut className="w-4 h-4 inline-block mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileMenu = () => (
    <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${
      showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          showMobileMenu ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setShowMobileMenu(false)}
      />
      <div className={`absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-oniria_darkblue/95 backdrop-blur-2xl border-l border-oniria_purple/30 transform transition-transform duration-500 ${
        showMobileMenu ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}>
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
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 rounded-full bg-oniria_purple/15 text-oniria_lightpink hover:text-white transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavigationLink
                key={item.label}
                item={item.label}
                onClick={() => {
                  navigate(item.path);
                  setShowMobileMenu(false);
                }}
                isMobile={true}
              />
            ))}
          </div>

          <div className="p-4 border-t border-oniria_purple/20">
            {profileMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 text-oniria_lightpink hover:text-white transition-all duration-300 py-3 px-4 rounded-xl hover:bg-oniria_purple/10"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-oniria_purple/20 space-y-3 flex-shrink-0">
          <button
            onClick={() => {
              onRefresh();
              setShowMobileMenu(false);
            }}
            disabled={isRefreshing}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-oniria_purple/15 text-oniria_lightpink hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-oniria_pink/20 text-oniria_lightpink hover:text-white transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-oniria_darkblue/90 backdrop-blur-xl text-oniria_lightpink h-[70px] sm:h-[90px] border-b border-oniria_purple/20">
        <div
          className="flex justify-between items-center p-3 sm:p-4 h-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8"
          onClick={handleOutsideClick}
        >
          {/* Logo y título */}
          <div className="relative flex-shrink-0 flex items-center ml-4 sm:ml-6 md:ml-8">
            <div className="relative w-14 h-14 p-1 transition-transform duration-300 hover:scale-105">
              <img src="/img/Oniria.svg" alt="ONIRIA Logo" className="w-full h-full object-contain" />
            </div>
            <span className="ml-2 font-bold text-lg sm:text-2xl lg:text-3xl text-oniria_lightpink">NOCTIRIA</span>
          </div>

          {/* Navegación desktop */}
          <div className="hidden lg:flex items-center">
            <ul className="flex gap-6 xl:gap-8 text-sm xl:text-base">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <NavigationLink item={item.label} onClick={() => navigate(item.path)} />
                </li>
              ))}
            </ul>
          </div>

          {/* Botones acción desktop - CON NOTIFICACIONES */}
          <div className="hidden lg:flex items-center gap-3 lg:gap-4">
            {/* Botón de actualizar */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 lg:p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 lg:w-5 lg:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* 🔔 NOTIFICATION CENTER - NUEVO */}
            <NotificationCenter />

            {/* Menú de perfil */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 lg:p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105"
                title={`Perfil de ${user.username}`}
              >
                <ProfileAvatar size="small" />
              </button>
              
              {/* Dropdown de perfil */}
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-oniria_darkblue/95 backdrop-blur-2xl border border-oniria_purple/30 rounded-2xl shadow-2xl overflow-hidden animate-dropdown-enter">
                  <div className="p-6 border-b border-oniria_purple/20">
                    <div className="flex items-center space-x-4">
                      <ProfileAvatar size="large" showRing={true} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg truncate">{user.username}</h3>
                        <p className="text-sm text-oniria_pink/80 truncate">{user.email || 'Sin email'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    {profileMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            item.action();
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 text-oniria_lightpink hover:text-white transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/10"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Botón de cerrar sesión */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center space-x-2 px-4 py-2 lg:py-2.5 rounded-xl bg-oniria_pink/20 hover:bg-oniria_pink/30 text-oniria_lightpink hover:text-white transition-all duration-300 transform hover:scale-105 backdrop-blur-xl border border-oniria_pink/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xl:inline">Salir</span>
            </button>
          </div>

          {/* Botones móviles y tablets (todo <lg) - CON NOTIFICACIONES */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Botón de actualizar móvil */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* 🔔 NOTIFICATION CENTER MÓVIL - NUEVO */}
            <NotificationCenter />

            {/* Botón de menú móvil */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300"
              title="Menú"
            >
              <div className="flex items-center space-x-2">
                <Menu className={`w-5 h-5 transition-transform duration-300 ${showMobileMenu ? 'rotate-90' : ''}`} />
                <ProfileAvatar size="small" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Espaciador para el header fixed */}
      <div className="h-[70px] sm:h-[90px]" />

      {/* Menú móvil */}
      <MobileMenu />
      
      {/* Modal de confirmación de logout */}
      <LogoutConfirmModal />
    </>
  );
};

export default DashboardHeader;