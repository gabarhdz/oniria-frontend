// components/UserDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth, authApiClient } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Crown, 
  Edit, 
  LogOut, 
  Settings, 
  Moon, 
  Star, 
  Heart, 
  Shield, 
  Camera,
  Sparkles,
  BookOpen,
  Clock,
  Award,
  Palette,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

interface UserStats {
  dreamsLogged: number;
  daysSinceJoined: number;
  favoriteTime: string;
  dreamCategories: number;
}

interface DreamData {
  total_dreams: number;
  dream_categories: number;
  favorite_time: string;
  recent_dreams: any[];
}

const TwinklingStars: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  gradient: string;
}> = ({ icon, title, value, subtitle, gradient }) => {
  return (
    <div className="group relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
      <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-[#ffe0db]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#f1b3be]/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#252c3e]/70">{title}</p>
            <p className="text-3xl font-bold text-[#252c3e]">{value}</p>
            {subtitle && (
              <p className="text-xs text-[#252c3e]/60">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
  disabled?: boolean;
}> = ({ icon, title, description, onClick, gradient, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full overflow-hidden transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
      <div className="relative bg-gradient-to-br from-white/70 via-white/60 to-[#ffe0db]/70 backdrop-blur-sm rounded-xl p-4 border border-[#f1b3be]/20 shadow-lg group-hover:shadow-xl">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-[#252c3e] group-hover:text-[#214d72] transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-[#252c3e]/70">{description}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 bg-[#f1b3be] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </button>
  );
};

export const UserDashboard: React.FC = () => {
  const { user, logout, refreshUserData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    dreamsLogged: 0,
    daysSinceJoined: 0,
    favoriteTime: "00:00",
    dreamCategories: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Función para obtener estadísticas del usuario usando axios
  const fetchUserStats = async () => {
    try {
      setIsLoadingStats(true);
      setStatsError(null);

      const response = await authApiClient.get('/user/stats/');
      
      if (response.status === 200 && response.data) {
        const data: DreamData = response.data;
        setUserStats({
          dreamsLogged: data.total_dreams || 0,
          daysSinceJoined: calculateDaysSinceJoined(),
          favoriteTime: data.favorite_time || "00:00",
          dreamCategories: data.dream_categories || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          // Si no hay estadísticas disponibles, usar valores por defecto
          setUserStats({
            dreamsLogged: 0,
            daysSinceJoined: calculateDaysSinceJoined(),
            favoriteTime: "00:00",
            dreamCategories: 0
          });
        } else if (error.response?.status === 401) {
          setStatsError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          logout();
        } else {
          setStatsError('Error al cargar las estadísticas. Intenta de nuevo más tarde.');
        }
      } else {
        setStatsError('Error de conexión. Verifica tu conexión a internet.');
      }
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Calcular días desde que se unió
  const calculateDaysSinceJoined = (): number => {
    if (user) {
      // Si el backend proporciona fecha de registro, usarla
      // Por ahora, usamos un cálculo simulado
      const joinDate = new Date();
      joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 100 + 1));
      return Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  // Función para refrescar datos del usuario y estadísticas
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      // Refrescar datos del usuario del contexto
      await refreshUserData();
      
      // Refrescar estadísticas
      await fetchUserStats();
      
      console.log('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error refreshing data:', error);
      setStatsError('Error al actualizar los datos. Intenta de nuevo.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Función para manejar logout con confirmación
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar tu sesión onírica?')) {
      logout();
    }
  };

  // Función para actualizar perfil
  const handleUpdateProfile = async () => {
    try {
      // Implementar lógica para actualizar perfil
      const response = await authApiClient.patch('/user/profile/', {
        // datos del perfil a actualizar
      });
      
      if (response.status === 200) {
        await refreshUserData();
        console.log('Perfil actualizado correctamente');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  // Acciones disponibles para el usuario
  const mockActions = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Diario de Sueños",
      description: "Registra y explora tus experiencias oníricas",
      gradient: "from-[#9675bc] to-[#7c3aed]",
      onClick: () => {
        // Navegar al diario de sueños
        window.location.href = '/dreams';
      }
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Análisis de Patrones",
      description: "Descubre los patrones ocultos en tus sueños",
      gradient: "from-[#f1b3be] to-[#ec4899]",
      onClick: () => {
        // Navegar al análisis de patrones
        window.location.href = '/analysis';
      }
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Logros Oníricos",
      description: "Ve tus logros como explorador de sueños",
      gradient: "from-[#ffe0db] to-[#f97316]",
      onClick: () => {
        // Navegar a logros
        window.location.href = '/achievements';
      }
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Configuración",
      description: "Personaliza tu experiencia en Noctiria",
      gradient: "from-[#214d72] to-[#0f172a]",
      onClick: () => {
        // Navegar a configuración
        window.location.href = '/settings';
      }
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f1b3be] border-t-transparent mx-auto"></div>
          <p className="text-[#ffe0db]">Cargando tu perfil onírico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      <TwinklingStars count={30} />
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9675bc]/3 to-transparent"></div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-xl border-b border-[#f1b3be]/20 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-xl p-1 shadow-lg">
                  <img src="/img/Oniria.svg" alt="Oniria" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
                  Noctiria
                </h1>
              </div>

              {/* User actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-[#f1b3be]/20 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
                  title="Actualizar datos"
                >
                  <RefreshCw className={`w-5 h-5 text-[#ffe0db] ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/20 hover:from-red-500/30 hover:to-red-600/30 text-red-200 hover:text-white transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome section */}
          <div className="text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full blur-2xl opacity-20 animate-pulse w-32 h-32"></div>
              <div className="relative">
                {user.profile_pic ? (
                  <img
                    src={user.profile_pic}
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9675bc] via-[#f1b3be] to-[#ffe0db] flex items-center justify-center shadow-2xl">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
                ¡Bienvenido, {user.username}!
              </h1>
              <div className="flex items-center justify-center space-x-2 text-[#ffe0db]/80">
                {user.is_psychologist ? (
                  <>
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">Psicólogo Certificado</span>
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-[#f1b3be]" />
                    <span className="text-sm">Explorador de Sueños</span>
                    <Star className="w-5 h-5 text-[#ffe0db]" />
                  </>
                )}
              </div>
              {user.description && (
                <p className="text-[#ffe0db]/70 max-w-2xl mx-auto">
                  {user.description}
                </p>
              )}
            </div>
          </div>

          {/* User info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9675bc]/20 via-[#f1b3be]/20 to-[#ffe0db]/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-[#ffe0db]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#f1b3be]/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#9675bc] to-[#7c3aed] shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#252c3e]">Nombre de Soñador</h3>
                    <p className="text-[#252c3e]/70">{user.username}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f1b3be]/20 via-[#ec4899]/20 to-[#9675bc]/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-[#ffe0db]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#f1b3be]/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#f1b3be] to-[#ec4899] shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#252c3e]">Correo Onírico</h3>
                    <p className="text-[#252c3e]/70 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffe0db]/20 via-[#f97316]/20 to-[#f1b3be]/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-[#ffe0db]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#f1b3be]/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#ffe0db] to-[#f97316] shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#252c3e]">ID de Usuario</h3>
                    <p className="text-[#252c3e]/70 font-mono text-sm">#{user.id.slice(0, 8)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent mb-2">
                Tu Viaje Onírico
              </h2>
              <p className="text-[#ffe0db]/70">Estadísticas de tu exploración en Noctiria</p>
            </div>

            {/* Error message */}
            {statsError && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/20 rounded-lg p-4 text-center">
                <p className="text-red-200">{statsError}</p>
                <button
                  onClick={fetchUserStats}
                  className="mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg text-red-100 transition-colors duration-200"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Loading state */}
            {isLoadingStats && !statsError && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#f1b3be] border-t-transparent mx-auto mb-4"></div>
                <p className="text-[#ffe0db]/70">Cargando estadísticas...</p>
              </div>
            )}

            {/* Statistics cards */}
            {!isLoadingStats && !statsError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<BookOpen className="w-6 h-6" />}
                  title="Sueños Registrados"
                  value={userStats.dreamsLogged}
                  subtitle="experiencias oníricas"
                  gradient="from-[#9675bc] to-[#7c3aed]"
                />
                
                <StatCard
                  icon={<Clock className="w-6 h-6" />}
                  title="Días en Noctiria"
                  value={userStats.daysSinceJoined}
                  subtitle="días explorando"
                  gradient="from-[#f1b3be] to-[#ec4899]"
                />
                
                <StatCard
                  icon={<Moon className="w-6 h-6" />}
                  title="Hora Favorita"
                  value={userStats.favoriteTime}
                  subtitle="momento onírico"
                  gradient="from-[#ffe0db] to-[#f97316]"
                />
                
                <StatCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="Categorías"
                  value={userStats.dreamCategories}
                  subtitle="tipos de sueños"
                  gradient="from-[#214d72] to-[#0f172a]"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent mb-2">
                Explorar Noctiria
              </h2>
              <p className="text-[#ffe0db]/70">Descubre todas las herramientas disponibles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockActions.map((action, index) => (
                <ActionButton
                  key={index}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  onClick={action.onClick}
                  gradient={action.gradient}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-[#f1b3be]/20">
            <div className="space-y-2">
              <p className="text-[#ffe0db]/60 text-sm">
                © 2024 Noctiria - Tu compañero en la exploración onírica
              </p>
              <div className="flex items-center justify-center space-x-4 text-[#ffe0db]/50">
                <button className="hover:text-[#f1b3be] transition-colors duration-200">
                  Privacidad
                </button>
                <span>•</span>
                <button className="hover:text-[#f1b3be] transition-colors duration-200">
                  Términos
                </button>
                <span>•</span>
                <button className="hover:text-[#f1b3be] transition-colors duration-200">
                  Soporte
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;