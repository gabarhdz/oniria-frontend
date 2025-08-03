// components/dashboard/DashboardHeader.tsx
import React, { useState } from 'react';
import { LogOut, RefreshCw, User, Settings, Shield, Bell, Moon, Sun, HelpCircle } from 'lucide-react';

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
  user: User; // Required, same as WelcomeSection
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  onLogout,
  isRefreshing,
  user
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const profileMenuItems = [
    { icon: User, label: 'Mi Perfil', action: () => console.log('Ver perfil') },
    { icon: Settings, label: 'Configuración', action: () => console.log('Configuración') },
    { icon: Shield, label: 'Privacidad', action: () => console.log('Privacidad') },
    { icon: Bell, label: 'Notificaciones', action: () => console.log('Notificaciones') },
    { icon: darkMode ? Sun : Moon, label: darkMode ? 'Modo Claro' : 'Modo Oscuro', action: () => setDarkMode(!darkMode) },
    { icon: HelpCircle, label: 'Ayuda', action: () => console.log('Ayuda') },
  ];

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
    return `http://127.0.0.1:8000${profilePic}`;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-oniria_darkblue/90 backdrop-blur-xl text-oniria_lightpink h-[90px] font-playfair border-b border-oniria_purple/20 shadow-2xl shadow-oniria_purple/10">
        <div className="flex justify-between items-center p-4 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
             onClick={(e) => {
               // Cerrar dropdown si se hace click fuera
               const target = e.target as HTMLElement;
               if (!target.closest('.relative') || !target.closest('button')) {
                 setShowProfileMenu(false);
               }
             }}>
          {/* Logo con estilo adaptado - Más grande */}
          <div className="relative ml-6">
            <div className="flex gap-4 items-center">
              <div className="relative group">
                <div className="flex items-center group">
                  <div className="relative w-24 h-24 p-2">
                    <img 
                      src="/img/Oniria.svg" 
                      alt="ONIRIA Logo" 
                      className="w-full h-full object-contain filter drop-shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" 
                    />
                  </div>
                  <span className="font-playfair font-black italic text-3xl ml-4 bg-gradient-to-r from-oniria_pink via-oniria_lightpink to-oniria_purple bg-clip-text text-transparent hover:bg-gradient-to-l transition-all duration-700 hover:tracking-wider">
                    NOCTIRIA
                  </span>
                </div>
              </div>
            </div>     
          </div>

          {/* Navegación con opciones de la landing */}
          <div className="flex items-center">
            <ul className="flex gap-8 text-[16px] font-inter">
              {['Chatbot', 'Análisis', 'Psicólogos', 'Comunidad'].map((item, index) => (
                <li key={item} className="group relative">
                  <button 
                    className="relative text-oniria_lightpink hover:text-white transition-all duration-500 py-3 px-6 rounded-2xl block overflow-hidden cursor-pointer hover:bg-gradient-to-r hover:from-oniria_purple/10 hover:to-oniria_pink/10"
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
                    <span className="relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.8)] transition-all duration-300">
                      {item}
                    </span>
                    
                    {/* Línea animada ondulada */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple to-oniria_pink animate-pulse"></div>
                    </div>
                    
                    {/* Efecto de destello lateral */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_lightpink/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Botones de acción con estilos mejorados */}
          <div className="flex items-center gap-4 mr-12">
            {/* Botón Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="group relative p-3 rounded-full bg-oniria_purple/15 backdrop-blur-sm border border-oniria_purple/40 hover:border-oniria_pink/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_purple/40 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Actualizar datos"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_purple/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <RefreshCw className={`w-5 h-5 relative z-10 transition-all duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
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
                <div className="relative z-10 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-oniria_purple/40 via-oniria_pink/30 to-oniria_lightpink/20 flex items-center justify-center">
                  {getProfileImageUrl(user.profile_pic) ? (
                    <img 
                      src={getProfileImageUrl(user.profile_pic)!} 
                      alt={`Avatar de ${user.username}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Si la imagen falla al cargar, mostrar las iniciales
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-white font-medium text-sm">${getUserInitials(user.username)}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {getUserInitials(user.username)}
                    </span>
                  )}
                </div>
              </button>

              {/* Dropdown del perfil */}
              <div className={`absolute top-full right-0 mt-2 w-80 transition-all duration-500 ease-out transform ${showProfileMenu ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
                <div className="bg-oniria_darkblue/95 backdrop-blur-2xl border border-oniria_purple/30 rounded-2xl shadow-2xl shadow-oniria_purple/20 overflow-hidden">
                  {/* Header del perfil */}
                  <div className="p-6 bg-gradient-to-r from-oniria_purple/10 via-oniria_pink/10 to-oniria_lightpink/10 border-b border-oniria_purple/20">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-oniria_purple/40 via-oniria_pink/30 to-oniria_lightpink/20 ring-2 ring-oniria_purple/30 flex items-center justify-center">
                        {getProfileImageUrl(user.profile_pic) ? (
                          <img 
                            src={getProfileImageUrl(user.profile_pic)!} 
                            alt={`Avatar de ${user.username}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Si la imagen falla al cargar, mostrar las iniciales
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-white font-semibold text-lg">${getUserInitials(user.username)}</span>`;
                              }
                            }}
                          />
                        ) : (
                          <span className="text-white font-semibold text-lg">
                            {getUserInitials(user.username)}
                          </span>
                        )}
                      </div>
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

            {/* Botón Logout con animaciones - color cambiado */}
            <button
              onClick={onLogout}
              className="group relative flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-oniria_pink/20 to-oniria_purple/15 backdrop-blur-sm border border-oniria_pink/40 hover:border-oniria_purple/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_pink/40 overflow-hidden cursor-pointer"
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
              <span className="hidden sm:inline relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(241,179,190,0.8)] transition-all duration-300">
                Salir
              </span>

              {/* Línea animada en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                <div className="absolute inset-0 bg-gradient-to-r from-oniria_purple to-oniria_pink animate-pulse"></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Espaciador para el header fijo */}
      <div className="h-[90px]"></div>
    </>
  );
};

export default DashboardHeader;