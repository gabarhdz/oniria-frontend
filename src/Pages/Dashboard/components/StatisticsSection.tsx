import React from 'react';
import { BookOpen, Clock, Moon, Sparkles } from 'lucide-react';
import { StatCard } from './StatCard';

interface UserStats {
  dreamsLogged: number;
  daysSinceJoined: number;
  favoriteTime: string;
  dreamCategories: number;
}

interface StatisticsSectionProps {
  userStats: UserStats;
  isLoadingStats: boolean;
  statsError: string | null;
  onRetryStats: () => void;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  userStats,
  isLoadingStats,
  statsError,
  onRetryStats
}) => {
  return (
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
            onClick={onRetryStats}
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
  );
};

export default StatisticsSection;