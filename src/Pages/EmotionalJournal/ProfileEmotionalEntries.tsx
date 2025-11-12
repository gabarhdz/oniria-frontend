import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  Lock,
  Eye,
  Star,
  TrendingUp,
  Brain,
  Sparkles,
  Sun,
  Cloud,
  Moon,
  ChevronRight
} from 'lucide-react';

// ==================== TIPOS ====================
interface EmotionalEntry {
  id: string;
  title: string;
  content: string;
  entry_date: string;
  created_at: string;
  mood: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good';
  intensity: number;
  is_favorite: boolean;
  is_private: boolean;
  tags_list: string[];
  categories?: Array<{ id: string; name: string; color: string }>;
}

interface UserEmotionalData {
  total_entries: number;
  public_entries: number;
  favorite_entries: number;
  average_intensity: number;
  streak_days: number;
  entries: EmotionalEntry[];
}

// ==================== COMPONENTE MOOD ICON ====================
const MoodIcon: React.FC<{ mood: string; size?: number }> = ({ mood, size = 24 }) => {
  const moodConfig = {
    very_bad: { icon: Cloud, color: 'text-gray-500', bg: 'bg-gray-500/20' },
    bad: { icon: Cloud, color: 'text-blue-400', bg: 'bg-blue-400/20' },
    neutral: { icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
    good: { icon: Sun, color: 'text-orange-400', bg: 'bg-orange-400/20' },
    very_good: { icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-400/20' }
  };

  const config = moodConfig[mood as keyof typeof moodConfig] || moodConfig.neutral;
  const Icon = config.icon;

  return (
    <div className={`p-2 rounded-lg ${config.bg}`}>
      <Icon className={`${config.color}`} style={{ width: size, height: size }} />
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
const ProfileEmotionalEntries: React.FC<{ userId: string; isOwnProfile: boolean }> = ({ 
  userId, 
  isOwnProfile 
}) => {
  const [emotionalData, setEmotionalData] = useState<UserEmotionalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<EmotionalEntry | null>(null);

  useEffect(() => {
    loadEmotionalData();
  }, [userId]);

  const loadEmotionalData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Cargar entradas del usuario
      const entriesResponse = await fetch(
        `http://127.0.0.1:8000/api/dreams/emotional-entries/${isOwnProfile ? '' : `?user=${userId}`}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!entriesResponse.ok) {
        throw new Error('Error al cargar entradas');
      }

      let entries: EmotionalEntry[] = await entriesResponse.json();

      // Si no es perfil propio, filtrar solo públicas
      if (!isOwnProfile) {
        entries = entries.filter(e => !e.is_private);
      }

      // Calcular estadísticas
      const totalEntries = entries.length;
      const publicEntries = entries.filter(e => !e.is_private).length;
      const favoriteEntries = entries.filter(e => e.is_favorite).length;
      const avgIntensity = entries.length > 0
        ? entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length
        : 0;

      // Calcular racha (simplificado)
      const streakDays = calculateStreak(entries);

      setEmotionalData({
        total_entries: totalEntries,
        public_entries: publicEntries,
        favorite_entries: favoriteEntries,
        average_intensity: avgIntensity,
        streak_days: streakDays,
        entries: entries.slice(0, 6) // Solo mostrar las últimas 6
      });
    } catch (error) {
      console.error('Error cargando datos emocionales:', error);
      setEmotionalData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (entries: EmotionalEntry[]): number => {
    if (entries.length === 0) return 0;

    const sortedDates = entries
      .map(e => new Date(e.entry_date).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const uniqueDates = [...new Set(sortedDates)];
    let streak = 1;
    const today = new Date();

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getMoodLabel = (mood: string) => {
    const labels = {
      very_bad: 'Muy Mal',
      bad: 'Mal',
      neutral: 'Neutral',
      good: 'Bien',
      very_good: 'Muy Bien'
    };
    return labels[mood as keyof typeof labels] || mood;
  };

  if (isLoading) {
    return (
      <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-8">
        <div className="flex items-center justify-center py-12">
          <Brain className="w-12 h-12 text-[#f1b3be] animate-spin" />
        </div>
      </div>
    );
  }

  if (!emotionalData || emotionalData.total_entries === 0) {
    return (
      <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="w-6 h-6 text-[#f1b3be]" />
          <h3 className="text-xl font-bold text-[#ffe0db]">Diario Emocional</h3>
        </div>
        <div className="text-center py-8">
          <Brain className="w-16 h-16 text-[#f1b3be]/30 mx-auto mb-4" />
          <p className="text-[#ffe0db]/70">
            {isOwnProfile 
              ? 'Aún no has registrado entradas emocionales' 
              : 'Este usuario no ha compartido entradas públicas'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Emocionales */}
      <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="w-6 h-6 text-[#f1b3be]" />
          <h3 className="text-xl font-bold text-[#ffe0db]">Diario Emocional</h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Total Entradas */}
          <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-[#9675bc]" />
              <span className="text-xs font-semibold text-[#ffe0db]/60">
                {isOwnProfile ? 'Total' : 'Públicas'}
              </span>
            </div>
            <div className="text-2xl font-bold text-[#ffe0db]">
              {isOwnProfile ? emotionalData.total_entries : emotionalData.public_entries}
            </div>
          </div>

          {/* Favoritos */}
          {isOwnProfile && (
            <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-[#ffe0db]/60">Favoritos</span>
              </div>
              <div className="text-2xl font-bold text-[#ffe0db]">
                {emotionalData.favorite_entries}
              </div>
            </div>
          )}

          {/* Intensidad Promedio */}
          <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#f1b3be]" />
              <span className="text-xs font-semibold text-[#ffe0db]/60">Intensidad</span>
            </div>
            <div className="text-2xl font-bold text-[#ffe0db]">
              {emotionalData.average_intensity.toFixed(1)}/10
            </div>
          </div>

          {/* Racha */}
          <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#ffe0db]" />
              <span className="text-xs font-semibold text-[#ffe0db]/60">Racha</span>
            </div>
            <div className="text-2xl font-bold text-[#ffe0db]">
              {emotionalData.streak_days}d
            </div>
          </div>

          {/* Públicas (solo si es perfil propio) */}
          {isOwnProfile && (
            <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-[#ffe0db]/60">Públicas</span>
              </div>
              <div className="text-2xl font-bold text-[#ffe0db]">
                {emotionalData.public_entries}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Entradas */}
      <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-[#ffe0db]">
            {isOwnProfile ? 'Entradas Recientes' : 'Entradas Públicas'}
          </h4>
          {isOwnProfile && (
            <a
              href="/emotional-diary"
              className="text-sm text-[#f1b3be] hover:text-[#ffe0db] transition-colors flex items-center space-x-1"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="space-y-4">
          {emotionalData.entries.map((entry, index) => (
            <div
              key={entry.id}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#ffe0db]/20 hover:bg-white/60 transition-all cursor-pointer group"
              onClick={() => setSelectedEntry(entry)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4">
                <MoodIcon mood={entry.mood} size={32} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-bold text-[#252c3e] truncate">{entry.title}</h5>
                    {entry.is_favorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />}
                    {entry.is_private && <Lock className="w-3 h-3 text-[#9675bc] flex-shrink-0" />}
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-[#252c3e]/60 mb-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(entry.entry_date).toLocaleDateString('es-ES')}</span>
                    </span>
                    <span>•</span>
                    <span>{getMoodLabel(entry.mood)}</span>
                  </div>

                  <p className="text-sm text-[#252c3e]/70 line-clamp-2">
                    {entry.content}
                  </p>

                  {entry.tags_list && entry.tags_list.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags_list.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#9675bc]/10 text-[#9675bc] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {entry.tags_list.length > 3 && (
                        <span className="px-2 py-0.5 bg-[#9675bc]/10 text-[#9675bc] text-xs rounded-full">
                          +{entry.tags_list.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Barra de intensidad */}
                  <div className="mt-2 w-full bg-[#252c3e]/10 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db]"
                      style={{ width: `${entry.intensity * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Ver Entrada Detallada */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 animate-scale-in">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4 flex-1">
                <MoodIcon mood={selectedEntry.mood} size={48} />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#252c3e]">{selectedEntry.title}</h2>
                    {selectedEntry.is_favorite && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
                    {selectedEntry.is_private && <Lock className="w-4 h-4 text-[#9675bc]" />}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-[#252c3e]/60">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedEntry.entry_date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
              >
                ×
              </button>
            </div>

            {/* Detalles */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-xl p-4 border border-[#9675bc]/10">
                  <div className="text-xs font-semibold text-[#252c3e]/60 mb-1">Estado</div>
                  <div className="text-lg font-bold text-[#252c3e]">{getMoodLabel(selectedEntry.mood)}</div>
                </div>
                <div className="bg-white/50 rounded-xl p-4 border border-[#9675bc]/10">
                  <div className="text-xs font-semibold text-[#252c3e]/60 mb-1">Intensidad</div>
                  <div className="text-lg font-bold text-[#252c3e]">{selectedEntry.intensity}/10</div>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-[#9675bc]/10">
                <div className="text-xs font-semibold text-[#252c3e]/60 mb-2">Contenido</div>
                <p className="text-[#252c3e] leading-relaxed whitespace-pre-wrap">{selectedEntry.content}</p>
              </div>

              {selectedEntry.tags_list && selectedEntry.tags_list.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-[#252c3e]/60 mb-2">Etiquetas</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags_list.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#9675bc]/10 text-[#9675bc] text-sm rounded-full border border-[#9675bc]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProfileEmotionalEntries;