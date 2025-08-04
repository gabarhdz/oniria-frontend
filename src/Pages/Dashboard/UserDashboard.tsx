// Pages/Dashboard/UserDashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Components
import {
  TwinklingStars,
  DashboardHeader,
  WelcomeSection,
  UserInfoCards,
  StatisticsSection,
  ActionsSection,
  DashboardFooter
} from './components';  

interface UserStats {
  dreamsLogged: number;
  daysSinceJoined: number;
  favoriteTime: string;
  dreamCategories: number;
}

export const UserDashboard: React.FC = () => {
  const { user, logout, refreshUserData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userStats] = useState<UserStats>({
    dreamsLogged: 0,
    daysSinceJoined: 0,
    favoriteTime: "00:00",
    dreamCategories: 0
  });


  // Función para refrescar datos del usuario
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await refreshUserData();
      console.log('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Función para manejar logout
  const handleLogout = () => {
    logout();
  };

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
          user={user}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <WelcomeSection user={user} />
          <UserInfoCards user={user} />
          <StatisticsSection
            userStats={userStats}
            isLoadingStats={false}
            statsError={null}
            onRetryStats={() => {}}
          />
          <ActionsSection />
        </main>
         <DashboardFooter />
      </div>
    </div>
  );
};

export default UserDashboard;