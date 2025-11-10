import React, { useState } from 'react';
import {
  LogOut,
  RefreshCw,
  User,
  Settings,
  Shield,
  Moon,
  Sun,
  HelpCircle,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
    { icon: darkMode ? Sun : Moon, label: darkMode ? 'Modo Claro' : 'Modo Oscuro', action: () => setDarkMode(!darkMode) },
    { icon: HelpCircle, label: 'Ayuda', action: () => console.log('Ayuda') },
  ];

  const navigationItems = [
    { label: 'Chatbot', path: '/chatbot' },
    { label: 'Análisis', path: '/analysis' },
    { label: 'Psicólogos', path: '/psychologists' },
    { label: 'Comunidad', path: '/communities' },
    { label: 'Conversaciones', path: '/conversaciones' } // <-- agregado
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
    setShowProfileMenu(false);
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
        isMobile ? 'w-full text-left py-4 px-6 rounded-2xl' : 'py-3 px-4 lg:px-5 xl:px-6 rounded-2xl'
      } block overflow-hidden cursor-pointer`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/20 to-oniria_lightpink/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-2 left-3 w-1 h-1 bg-oniria_lightpink rounded-full animate-pulse"></div>
        <div className="absolute bottom-3 right-4 w-1.5 h-1.5 bg-oniria_lightpink/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
      </div>

      <span className={`relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300 ${isMobile ? 'text-lg' : 'text-sm lg:text-base'}`}>
        {item}
      </span>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_lightpink to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
        <div className="absolute inset-0 bg-gradient-to-r from-oniria_lightpink to-white animate-pulse"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
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
    <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${showMobileMenu ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setShowMobileMenu(false)}
      />
      <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] sm:max-w-[80vw] bg-oniria_darkblue/95 backdrop-blur-2xl border-l border-oniria_purple/30 transform transition-transform duration-500 ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-oniria_purple/20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <ProfileAvatar size="medium" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-base sm:text-lg truncate">{user.username}</h3>
              <p className="text-xs sm:text-sm text-oniria_pink/80 truncate">
                {user.is_psychologist ? 'Psicólogo' : 'Usuario'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 rounded-full bg-oniria_purple/15 text-oniria_lightpink hover:text-white transition-all duration-300 flex-shrink-0"
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
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-oniria_purple/20 space-y-3 flex-shrink-0">
          <button
            onClick={() => { onRefresh(); setShowMobileMenu(false); }}
            disabled={isRefreshing}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-oniria_purple/15 text-oniria_lightpink hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm sm:text-base">Actualizar</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-oniria_pink/20 text-oniria_lightpink hover:text-white transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm sm:text-base">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-oniria_darkblue/90 backdrop-blur-xl text-oniria_lightpink h-[60px] sm:h-[70px] md:h-[80px] lg:h-[90px] border-b border-oniria_purple/20">
        <div
          className="flex justify-between items-center p-2 sm:p-3 lg:p-4 h-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8"
        >
          {/* Logo y título */}
          <div className="relative flex-shrink-0 flex items-center ml-2 sm:ml-4 md:ml-6 lg:ml-8">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-1 transition-transform duration-300 hover:scale-105">
              <img src="/img/Oniria.svg" alt="ONIRIA Logo" className="w-full h-full object-contain" />
            </div>
            <span className="ml-1.5 sm:ml-2 font-bold text-base sm:text-xl md:text-2xl lg:text-3xl text-oniria_lightpink whitespace-nowrap">NOCTIRIA</span>
          </div>

          {/* Navegación desktop */}
          <div className="hidden lg:flex items-center">
            <ul className="flex gap-2 xl:gap-4 2xl:gap-6 text-sm xl:text-base">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <NavigationLink item={item.label} onClick={() => navigate(item.path)} />
                </li>
              ))}
            </ul>
          </div>

          {/* Botones acción desktop */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-4 mr-4 xl:mr-6 2xl:mr-8">
            {/* Botón de conversciones */}
            <Link
              to="/conversaciones"
              className="w-10 h-10 xl:w-11 xl:h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105"
              title="Mis conversaciones"
            >
              <MessageCircle className="w-5 h-5 xl:w-6 xl:h-6" />
            </Link>

            {/* Botón de actualizar */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-10 h-10 xl:w-11 xl:h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-5 h-5 xl:w-6 xl:h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Notification Center - Desktop */}
            <NotificationCenter />

            {/* Menú de perfil */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 xl:w-11 xl:h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105"
                title={`Perfil de ${user.username}`}
              >
                <ProfileAvatar size="small" />
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 xl:w-80 bg-oniria_darkblue/95 backdrop-blur-2xl border border-oniria_purple/30 rounded-2xl shadow-2xl overflow-hidden animate-dropdown-enter">
                  <div className="p-4 xl:p-6 border-b border-oniria_purple/20">
                    <div className="flex items-center space-x-3 xl:space-x-4">
                      <ProfileAvatar size="large" showRing={true} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-base xl:text-lg truncate">{user.username}</h3>
                        <p className="text-xs xl:text-sm text-oniria_pink/80 truncate">{user.email || 'Sin email'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            item.action();
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 text-oniria_lightpink hover:text-white transition-all duration-300 py-2.5 xl:py-3 px-3 xl:px-4 rounded-xl hover:bg-white/10"
                        >
                          <Icon className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0" />
                          <span className="text-sm xl:text-base">{item.label}</span>
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
              className="flex items-center space-x-1.5 xl:space-x-2 px-3 xl:px-4 py-2 xl:py-2.5 rounded-xl bg-oniria_pink/20 hover:bg-oniria_pink/30 text-oniria_lightpink hover:text-white transition-all duration-300 transform hover:scale-105 backdrop-blur-xl border border-oniria_pink/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xl:inline text-sm xl:text-base">Salir</span>
            </button>
          </div>

          {/* Botones móviles */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 mr-2 sm:mr-4">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-5 h-5 sm:w-6 sm:h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <NotificationCenter />

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300"
              title="Menú"
            >
              <Menu className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${showMobileMenu ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Espaciador para el header fixed */}
      <div className="h-[60px] sm:h-[70px] md:h-[80px] lg:h-[90px]" />

      {/* Menú móvil */}
      <MobileMenu />

      {/* Modal de confirmación de logout */}
      <LogoutConfirmModal />
    </>

  );
}

export default DashboardHeader;