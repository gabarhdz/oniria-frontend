// Pages/Dashboard/UserDashboard.tsx
import React, { useEffect, useState } from 'react';
import { NotificationCenter } from '../../components/NotificationCenter';
import {
  TwinklingStars,
  DashboardHeader,
  WelcomeSection,
  UserInfoCards,
  StatisticsSection,
  ActionsSection,
  DashboardFooter
} from './components';

interface User {
  username: string;
  email?: string;
  is_psychologist: boolean;
  description?: string;
  profile_pic?: string;
}

interface UserStats {
  dreamsLogged: number;
  daysSinceJoined: number;
  favoriteTime: string;
  dreamCategories: number;
}

export const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userStats] = useState<UserStats>({
    dreamsLogged: 0,
    daysSinceJoined: 0,
    favoriteTime: "00:00",
    dreamCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch user info
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');

        const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 🔹 Refresh handler
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to refresh user data');
      const data = await response.json();
      setUser(data);
      console.log('✅ Datos actualizados correctamente');
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  // 🔹 Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f1b3be] border-t-transparent mx-auto"></div>
          <p className="text-[#ffe0db]">Cargando tu perfil onírico...</p>
        </div>
      </div>
    );
  }

  // 🔹 Error screen
  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#1a1f35] flex flex-col items-center justify-center text-center space-y-4 text-[#ffe0db]">
        <p>{error ? `Error: ${error}` : 'No se pudieron cargar los datos del usuario 😕'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#9675bc]/40 hover:bg-[#9675bc]/60 rounded-lg transition-all"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // 🔹 Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      <TwinklingStars count={30} />

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9675bc]/3 to-transparent" />

      <div className="relative z-10 min-h-screen">
        <DashboardHeader
          onRefresh={handleRefreshData}
          onLogout={handleLogout}
          isRefreshing={isRefreshing}
          
        />

        <WelcomeSection user={user} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
