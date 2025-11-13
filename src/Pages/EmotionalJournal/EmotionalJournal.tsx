// src/Pages/EmotionalJournal/EmotionalJournal.tsx
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Star,
  TrendingUp,
  Heart,
  Brain,
  Moon,
  Sun,
  Cloud,
  Sparkles,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  BarChart3,
  Award,
  Zap,
  Eye,
  Lock,
  ClipboardCheck, // 👈 NUEVO ICONO
  FileText // 👈 NUEVO ICONO
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 👈 IMPORTAR
import { useAuth } from '../../contexts/AuthContext'; // 👈 IMPORTAR
import { DashboardFooter } from '../Dashboard/components';

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
  ai_analysis?: string;
  categories?: Array<{ id: string; name: string; color: string }>;
}

interface EmotionalStats {
  total_entries: number;
  entries_this_month: number;
  entries_this_week: number;
  mood_distribution: Record<string, number>;
  average_intensity: number;
  most_common_emotions: Array<{ name: string; count: number }>;
  streak_days: number;
  favorite_entries: number;
}

// ==================== COMPONENTES AUXILIARES ====================

// Estrellas parpadeantes
const TwinklingStars: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-gradient-to-r from-[#f1b3be] to-[#ffe0db] animate-twinkle opacity-60"
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

// Componente de estado de ánimo
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
      <Icon className={`w-${size/4} h-${size/4} ${config.color}`} />
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
const EmotionalDiaryPage: React.FC = () => {
  // 👇 HOOKS NUEVOS
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados principales
  const [entries, setEntries] = useState<EmotionalEntry[]>([]);
  const [stats, setStats] = useState<EmotionalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<EmotionalEntry | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'stats'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Formulario de nueva entrada
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    entry_date: new Date().toISOString().split('T')[0],
    mood: 'neutral' as const,
    intensity: 5,
    tags: '',
    is_private: false
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadEntries();
    loadStats();
  }, []);

  const loadEntries = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No hay token de autenticación');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/dreams/emotional-entries/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar entradas');
      }

      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error cargando entradas:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8000/api/dreams/emotional-entries/statistics/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleCreateEntry = async () => {
    try {
      const newEntryData: EmotionalEntry = {
        id: Date.now().toString(),
        ...newEntry,
        created_at: new Date().toISOString(),
        is_favorite: false,
        tags_list: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
        categories: []
      };

      setEntries([newEntryData, ...entries]);
      setShowNewEntryModal(false);
      resetForm();
      
      await loadStats();
    } catch (error) {
      console.error('Error creando entrada:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta entrada?')) return;
    
    try {
      setEntries(entries.filter(e => e.id !== id));
      await loadStats();
    } catch (error) {
      console.error('Error eliminando entrada:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      setEntries(entries.map(e => 
        e.id === id ? { ...e, is_favorite: !e.is_favorite } : e
      ));
    } catch (error) {
      console.error('Error actualizando favorito:', error);
    }
  };

  const resetForm = () => {
    setNewEntry({
      title: '',
      content: '',
      entry_date: new Date().toISOString().split('T')[0],
      mood: 'neutral',
      intensity: 5,
      tags: '',
      is_private: false
    });
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

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  // 👇 FUNCIÓN PARA MANEJAR NAVEGACIÓN A FORMULARIOS
  const handleFormsNavigation = () => {
    if (user?.is_psychologist) {
      navigate('/forms/manage');
    } else {
      navigate('/forms/take');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <TwinklingStars />
        <div className="text-center z-10">
          <Brain className="w-16 h-16 text-[#f1b3be] animate-spin mx-auto mb-4" />
          <p className="text-[#ffe0db] text-xl">Cargando tu diario emocional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      <TwinklingStars count={40} />
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]" />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-[#f1b3be]/20 backdrop-blur-xl bg-[#252c3e]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#ffe0db]">Diario Emocional</h1>
              <p className="text-[#f1b3be]">Registra y analiza tus emociones</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 👇 BOTÓN CONDICIONAL DE FORMULARIOS */}
            <button
              onClick={handleFormsNavigation}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#ffe0db] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#ffe0db] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              title={user?.is_psychologist ? 'Gestionar Formularios' : 'Mis Evaluaciones'}
            >
              {user?.is_psychologist ? (
                <>
                  <ClipboardCheck className="w-5 h-5" />
                  <span className="hidden sm:inline">Gestionar Formularios</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span className="hidden sm:inline">Mis Evaluaciones</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowNewEntryModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Entrada</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      {stats && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="w-10 h-10 text-[#9675bc]" />
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-[#252c3e]">{stats.total_entries}</div>
              <div className="text-sm text-[#252c3e]/60">Entradas totales</div>
            </div>

            <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-10 h-10 text-[#f1b3be]" />
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-[#252c3e]">{stats.streak_days}</div>
              <div className="text-sm text-[#252c3e]/60">Días consecutivos</div>
            </div>

            <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-10 h-10 text-amber-400" />
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <div className="text-3xl font-bold text-[#252c3e]">{stats.favorite_entries}</div>
              <div className="text-sm text-[#252c3e]/60">Favoritos</div>
            </div>

            <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-10 h-10 text-[#ffe0db]" />
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-[#252c3e]">{stats.average_intensity.toFixed(1)}</div>
              <div className="text-sm text-[#252c3e]/60">Intensidad promedio</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60" />
              <input
                type="text"
                placeholder="Buscar entradas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/70 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all"
              />
            </div>

            {/* Filter & View Mode */}
            <div className="flex items-center space-x-3">
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="px-4 py-3 bg-white/70 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
              >
                <option value="all">Todos los estados</option>
                <option value="very_good">Muy Bien</option>
                <option value="good">Bien</option>
                <option value="neutral">Neutral</option>
                <option value="bad">Mal</option>
                <option value="very_bad">Muy Mal</option>
              </select>

              <div className="flex bg-white/70 rounded-xl p-1 border border-[#9675bc]/20">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#9675bc] text-white' : 'text-[#252c3e]/60'}`}
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-[#9675bc] text-white' : 'text-[#252c3e]/60'}`}
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 pb-32">
        {filteredEntries.length === 0 ? (
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-lg p-12 text-center">
            <Brain className="w-20 h-20 text-[#f1b3be]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#252c3e] mb-2">
              {searchTerm ? 'No se encontraron entradas' : 'Aún no tienes entradas'}
            </h3>
            <p className="text-[#252c3e]/70 mb-6">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza registrando tus emociones hoy'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowNewEntryModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Crear Primera Entrada</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <MoodIcon mood={entry.mood} size={48} />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-[#252c3e]">{entry.title}</h3>
                        {entry.is_favorite && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
                        {entry.is_private && <Lock className="w-4 h-4 text-[#9675bc]" />}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-[#252c3e]/60 mb-3">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(entry.entry_date).toLocaleDateString('es-ES')}</span>
                        </span>
                        <span>•</span>
                        <span>{getMoodLabel(entry.mood)}</span>
                        <span>•</span>
                        <span>Intensidad: {entry.intensity}/10</span>
                      </div>

                      <p className="text-[#252c3e]/80 leading-relaxed mb-4">
                        {entry.content.substring(0, 200)}
                        {entry.content.length > 200 && '...'}
                      </p>

                      {entry.tags_list && entry.tags_list.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {entry.tags_list.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-[#9675bc]/10 text-[#9675bc] text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFavorite(entry.id)}
                      className={`p-2 rounded-lg transition-all ${
                        entry.is_favorite 
                          ? 'bg-amber-400/20 text-amber-400' 
                          : 'bg-white/50 text-[#252c3e]/60 hover:bg-amber-400/20 hover:text-amber-400'
                      }`}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="p-2 rounded-lg bg-white/50 text-[#252c3e]/60 hover:bg-[#9675bc]/20 hover:text-[#9675bc] transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 rounded-lg bg-white/50 text-[#252c3e]/60 hover:bg-red-500/20 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Intensity Bar */}
                <div className="w-full bg-[#252c3e]/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] transition-all duration-500"
                    style={{ width: `${entry.intensity * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nueva Entrada */}
      {showNewEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[#252c3e]">Nueva Entrada</h2>
              <button
                onClick={() => {
                  setShowNewEntryModal(false);
                  resetForm();
                }}
                className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="¿Cómo te sientes hoy?"
                  className="w-full px-4 py-3 bg-white/70 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all"
                />
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                  Contenido
                </label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Escribe sobre tus emociones, pensamientos, lo que pasó hoy..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white/70 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all resize-none"
                />
              </div>

              {/* Fecha y Estado de ánimo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newEntry.entry_date}
                    onChange={(e) => setNewEntry({ ...newEntry, entry_date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/70 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                    Estado de ánimo
                  </label>
                  <select
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/70 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
                  >
                    <option value="very_good">Muy Bien</option>
                    <option value="good">Bien</option>
                    <option value="neutral">Neutral</option>
                    <option value="bad">Mal</option>
                    <option value="very_bad">Muy Mal</option>
                  </select>
                </div>
              </div>

              {/* Intensidad */}
              <div>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                  Intensidad: {newEntry.intensity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEntry.intensity}
                  onChange={(e) => setNewEntry({ ...newEntry, intensity: parseInt(e.target.value) })}
                  className="w-full h-2 bg-[#9675bc]/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-[#252c3e]/60 mt-1">
                  <span>Mínima</span>
                  <span>Máxima</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                  placeholder="trabajo, familia, salud..."
                  className="w-full px-4 py-3 bg-white/70 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all"
                />
              </div>

              {/* Privacidad */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_private"
                  checked={newEntry.is_private}
                  onChange={(e) => setNewEntry({ ...newEntry, is_private: e.target.checked })}
                  className="w-5 h-5 text-[#9675bc] bg-white/70 border-[#9675bc]/20 rounded focus:ring-[#9675bc]"
                />
                <label htmlFor="is_private" className="text-sm font-medium text-[#252c3e] flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Entrada privada</span>
                </label>
              </div>

              {/* Botones */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowNewEntryModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-[#252c3e]/10 hover:bg-[#252c3e]/20 text-[#252c3e] rounded-xl font-medium transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateEntry}
                  disabled={!newEntry.title || !newEntry.content}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>Guardar Entrada</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Entrada */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 animate-scale-in">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4 flex-1">
                <MoodIcon mood={selectedEntry.mood} size={64} />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold text-[#252c3e]">{selectedEntry.title}</h2>
                    {selectedEntry.is_favorite && <Star className="w-6 h-6 text-amber-400 fill-amber-400" />}
                    {selectedEntry.is_private && <Lock className="w-5 h-5 text-[#9675bc]" />}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-[#252c3e]/60">
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
                className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Detalles */}
            <div className="space-y-6">
              {/* Estado e intensidad */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-xl p-4 border border-[#9675bc]/10">
                  <div className="text-sm font-semibold text-[#252c3e]/60 mb-2">Estado de ánimo</div>
                  <div className="text-2xl font-bold text-[#252c3e]">{getMoodLabel(selectedEntry.mood)}</div>
                </div>
                <div className="bg-white/50 rounded-xl p-4 border border-[#9675bc]/10">
                  <div className="text-sm font-semibold text-[#252c3e]/60 mb-2">Intensidad emocional</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-[#252c3e]">{selectedEntry.intensity}/10</div>
                    <div className="flex-1 bg-[#252c3e]/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db]"
                        style={{ width: `${selectedEntry.intensity * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="bg-white/50 rounded-xl p-6 border border-[#9675bc]/10">
                <div className="text-sm font-semibold text-[#252c3e]/60 mb-3">Contenido</div>
                <p className="text-[#252c3e] leading-relaxed whitespace-pre-wrap">{selectedEntry.content}</p>
              </div>

              {/* Tags */}
              {selectedEntry.tags_list && selectedEntry.tags_list.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-[#252c3e]/60 mb-3">Etiquetas</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags_list.map((tag, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-[#9675bc]/10 text-[#9675bc] text-sm font-medium rounded-full border border-[#9675bc]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Análisis AI (si existe) */}
              {selectedEntry.ai_analysis && (
                <div className="bg-gradient-to-br from-[#9675bc]/10 to-[#f1b3be]/10 rounded-xl p-6 border border-[#9675bc]/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="w-5 h-5 text-[#9675bc]" />
                    <div className="text-sm font-semibold text-[#252c3e]">Análisis con IA</div>
                  </div>
                  <p className="text-[#252c3e]/80 leading-relaxed">{selectedEntry.ai_analysis}</p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => toggleFavorite(selectedEntry.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedEntry.is_favorite
                      ? 'bg-amber-400/20 text-amber-600 hover:bg-amber-400/30'
                      : 'bg-white/70 text-[#252c3e] hover:bg-amber-400/20 hover:text-amber-600'
                  }`}
                >
                  <Star className="w-5 h-5" />
                  <span>{selectedEntry.is_favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</span>
                </button>
                
                <button
                  onClick={() => {
                    handleDeleteEntry(selectedEntry.id);
                    setSelectedEntry(null);
                  }}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-600 rounded-xl font-medium transition-all duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DashboardFooter />

      {/* Estilos personalizados */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        /* Slider personalizado */
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9675bc, #f1b3be);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(150, 117, 188, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9675bc, #f1b3be);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(150, 117, 188, 0.5);
        }
        
        .slider::-webkit-slider-runnable-track {
          background: linear-gradient(90deg, #9675bc 0%, #f1b3be 50%, #ffe0db 100%);
          height: 8px;
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          background: linear-gradient(90deg, #9675bc 0%, #f1b3be 50%, #ffe0db 100%);
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default EmotionalDiaryPage;