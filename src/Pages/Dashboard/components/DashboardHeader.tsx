import React, { useEffect, useState } from 'react';
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
  profile_pic_url?: string;
}

interface DashboardHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  onLogout,
  isRefreshing
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found in localStorage');

        const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
  ];

  const getUserInitials = (username: string): string =>
    username.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);

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

    const handleImageError = () => setImageError(true);

    return (
      <div className={`${sizeClasses} ${ringClasses} rounded-full overflow-hidden bg-gradient-to-br from-oniria_purple/40 via-oniria_pink/30 to-oniria_lightpink/20 flex items-center justify-center relative`}>
        {user?.profile_pic_url && !imageError ? (
          <img
            src={user.profile_pic_url}
            alt={`Avatar de ${user.username}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <span className={`text-white font-semibold ${textSize} select-none`}>
            {user ? getUserInitials(user.username) : '??'}
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
      className={`group relative text-oniria_lightpink hover:text-white transition-all duration-500 ${isMobile ? 'w-full text-left py-4 px-6 rounded-2xl' : 'py-3 px-4 lg:px-5 xl:px-6 rounded-2xl'}`}
    >
      <span className={`relative z-10 font-medium transition-all duration-300 ${isMobile ? 'text-lg' : 'text-sm lg:text-base'}`}>
        {item}
      </span>
    </button>
  );

  const LogoutConfirmModal = () => (
    <div className={`fixed inset-0 z-[9999] transition-all duration-300 ${showLogoutConfirm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancelLogout} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`relative bg-oniria_darkblue/95 backdrop-blur-2xl border border-oniria_purple/30 rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${showLogoutConfirm ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="text-center space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-oniria_lightpink">¿Cerrar Sesión?</h3>
            <p className="text-sm sm:text-base text-oniria_lightpink/80">
              ¿Estás seguro de que deseas cerrar tu sesión en NOCTIRIA?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button onClick={handleCancelLogout} className="flex-1 px-6 py-3 rounded-xl bg-oniria_blue/20 text-oniria_lightpink hover:text-white transition-all duration-300">
                Cancelar
              </button>
              <button onClick={handleConfirmLogout} className="flex-1 px-6 py-3 rounded-xl bg-oniria_pink/30 text-white transition-all duration-300">
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
      <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-oniria_darkblue/95 border-l border-oniria_purple/30 transform transition-transform duration-500 ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-oniria_purple/20">
          <div className="flex items-center space-x-3">
            <ProfileAvatar size="medium" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-base sm:text-lg truncate">
                {user?.username || 'Usuario'}
              </h3>
              <p className="text-xs sm:text-sm text-oniria_pink/80 truncate">
                {user?.is_psychologist ? 'Psicólogo' : 'Usuario'}
              </p>
            </div>
          </div>
          <button onClick={() => setShowMobileMenu(false)} className="p-2 rounded-full bg-oniria_purple/15 text-oniria_lightpink hover:text-white transition-all duration-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavigationLink key={item.label} item={item.label} onClick={() => { navigate(item.path); setShowMobileMenu(false); }} isMobile />
            ))}
          </div>

          <div className="p-4 border-t border-oniria_purple/20">
            {profileMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} onClick={() => { item.action(); setShowMobileMenu(false); }}
                  className="w-full flex items-center space-x-3 text-oniria_lightpink hover:text-white transition-all duration-300 py-3 px-4 rounded-xl hover:bg-oniria_purple/10">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-oniria_darkblue/90 text-oniria_lightpink h-[70px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-oniria_purple"></div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-oniria_darkblue/90 text-oniria_lightpink h-[70px] flex items-center justify-center">
        <span className="text-red-500">Error al cargar los datos del usuario</span>
      </header>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-oniria_darkblue/90 text-oniria_lightpink h-[70px] border-b border-oniria_purple/20">
        <div className="flex justify-between items-center p-3 max-w-7xl mx-auto">
          <div className="flex items-center">
            <img src="/img/Oniria.svg" alt="NOCTIRIA" className="w-10 h-10 mr-2" />
            <span className="font-bold text-xl text-oniria_lightpink">NOCTIRIA</span>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <ul className="flex gap-4">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <NavigationLink item={item.label} onClick={() => navigate(item.path)} />
                </li>
              ))}
            </ul>

            <Link
              to="/conversaciones"
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl border border-white/20"
              title="Mis conversaciones"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl border border-white/20 disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <NotificationCenter />

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl border border-white/20"
                title={user ? `Perfil de ${user.username}` : 'Perfil'}
              >
                <ProfileAvatar size="small" />
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-oniria_darkblue/95 border border-oniria_purple/30 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-oniria_purple/20 flex items-center space-x-4">
                    <ProfileAvatar size="large" showRing />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-base truncate">
                        {user?.username || 'Usuario'}
                      </h3>
                      <p className="text-xs text-oniria_pink/80 truncate">
                        {user?.email || 'Sin email'}
                      </p>
                    </div>
                  </div>
                  <div className="p-2">
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => { item.action(); setShowProfileMenu(false); }}
                          className="w-full flex items-center space-x-3 text-oniria_lightpink hover:text-white transition-all duration-300 py-2.5 px-3 rounded-xl hover:bg-white/10"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogoutClick}
              className="px-3 py-2 rounded-xl bg-oniria_pink/20 text-oniria_lightpink hover:text-white transition-all duration-300"
            >
              <LogOut className="w-4 h-4 inline-block mr-1" />
              Salir
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white/10 rounded-xl border border-white/20 disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <NotificationCenter />

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 bg-white/10 rounded-xl border border-white/20"
              title="Menú"
            >
              <Menu className={`w-5 h-5 ${showMobileMenu ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="h-[70px]" />
      <MobileMenu />
      <LogoutConfirmModal />
    </>
  );
};

export default DashboardHeader;
