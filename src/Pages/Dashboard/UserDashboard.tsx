// Pages/Dashboard/UserDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth, authApiClient } from '../../contexts/AuthContext';
import axios from 'axios';

// Components
import {
  TwinklingStars,
  DashboardHeader,
  WelcomeSection,
  UserInfoCards,
  StatisticsSection,
  ActionsSection,
  DashboardFooter
} from './components';  // ← Cambiado aquí

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
      await refreshUserData();
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

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

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
        <DashboardHeader
          onRefresh={handleRefreshData}
          onLogout={handleLogout}
          isRefreshing={isRefreshing}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <WelcomeSection user={user} />
          <UserInfoCards user={user} />
          <StatisticsSection
            userStats={userStats}
            isLoadingStats={isLoadingStats}
            statsError={statsError}
            onRetryStats={fetchUserStats}
          />
          <ActionsSection />
          <DashboardFooter />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;