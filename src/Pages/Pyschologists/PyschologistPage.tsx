import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  Star,
  MessageCircle,
  Search,
  GraduationCap,
  Heart,
  CheckCircle,
  ArrowRight,
  Brain,
  Shield,
  TrendingUp
} from 'lucide-react';

type University = { id?: number; name?: string };
type UserObj = { id?: string | number; username?: string };
type PsychologistType = {
  id: string | number;
  user?: UserObj;
  username?: string;
  profile_pic?: string | null;
  university?: University | null;
  description?: string | null;
  [key: string]: any;
};

// Twinkling stars component
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

const PsychologistCard: React.FC<{
  psychologist: PsychologistType;
  onViewProfile: (p: PsychologistType) => void;
  onContact: (p: PsychologistType) => void;
}> = ({ psychologist, onViewProfile, onContact }) => {
  const [isHovered, setIsHovered] = useState(false);
  const displayName = psychologist.user?.username || psychologist.username || 'Psicólogo';

  return (
    <div
      className="group relative bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 via-[#f1b3be]/10 to-[#ffe0db]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center space-x-1 bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/30">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium text-green-700">Verificado</span>
        </div>
      </div>

      <div className="relative p-6 space-y-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#9675bc] to-[#f1b3be] p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                {psychologist.profile_pic ? (
                  <img
                    src={psychologist.profile_pic}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#9675bc]">
                    {String(displayName).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white">
              <div className="w-full h-full rounded-full bg-green-400 animate-ping opacity-75" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-[#252c3e] truncate group-hover:text-[#214d72] transition-colors">
              {displayName}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <GraduationCap className="w-4 h-4 text-[#9675bc]" />
              <span className="text-sm text-[#252c3e]/70">
                {psychologist.university?.name || 'Universidad'}
              </span>
            </div>

            <div className="flex items-center space-x-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-sm text-[#252c3e]/70 ml-1">(4.8)</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#252c3e]/80 line-clamp-3 leading-relaxed">
          {psychologist.description || 'Psicólogo profesional especializado en análisis de sueños y terapia emocional.'}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-[#9675bc]/10 text-[#9675bc] text-xs font-medium rounded-full">
            Análisis de Sueños
          </span>
          <span className="px-3 py-1 bg-[#f1b3be]/10 text-[#f1b3be] text-xs font-medium rounded-full">
            Terapia Cognitiva
          </span>
          <span className="px-3 py-1 bg-[#ffe0db]/30 text-[#252c3e] text-xs font-medium rounded-full">
            +3 más
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#ffe0db]/30">
          <div className="text-center">
            <div className="text-lg font-bold text-[#252c3e]">150+</div>
            <div className="text-xs text-[#252c3e]/60">Pacientes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#252c3e]">5 años</div>
            <div className="text-xs text-[#252c3e]/60">Experiencia</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#252c3e]">98%</div>
            <div className="text-xs text-[#252c3e]/60">Satisfacción</div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => onViewProfile(psychologist)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Users className="w-4 h-4" />
            <span>Ver Perfil</span>
          </button>
          <button
            onClick={() => onContact(psychologist)}
            className="flex items-center justify-center px-4 py-3 bg-white hover:bg-[#ffe0db]/50 rounded-xl text-[#9675bc] font-medium transition-all duration-300 hover:scale-105 border border-[#9675bc]/20 shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PsychologistsPage: React.FC = () => {
  const [psychologists, setPsychologists] = useState<PsychologistType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'disponibles' | 'mejor_valorados'>('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://127.0.0.1:8000/api/psychologists/psychologists/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('Error fetching psychologists:', res.status, await res.text());
          setPsychologists([]);
          return;
        }

        const data = await res.json();
        // soportar paginación (results) o lista directa
        const items = Array.isArray(data) ? data : data.results ?? [];
        setPsychologists(items);
      } catch (error) {
        console.error('Error:', error);
        setPsychologists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  const handleViewProfile = (psychologist: PsychologistType) => {
    // navegar o abrir modal
    console.log('Ver perfil:', psychologist);
    // ejemplo: window.location.href = `/psychologists/${psychologist.id}`;
  };

  const handleContact = (psychologist: PsychologistType) => {
    console.log('Contactar:', psychologist);
    // abrir modal / iniciar chat
  };

  const handleRegisterAsPsychologist = () => {
    window.location.href = '/psychologist-signup';
  };

  const filteredPsychologists = psychologists.filter((psy) => {
    const name = (psy.user?.username || psy.username || '').toString().toLowerCase();
    const desc = (psy.description || '').toString().toLowerCase();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return name.includes(term) || desc.includes(term);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      <TwinklingStars count={40} />

      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9675bc]/3 to-transparent" />

      <div className={`relative z-10 min-h-screen transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <header className="border-b border-[#f1b3be]/20 backdrop-blur-xl bg-[#252c3e]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#ffe0db]">Psicólogos Certificados</h1>
                  <p className="text-[#f1b3be]">Encuentra tu guía en el mundo onírico</p>
                </div>
              </div>

              <button
                onClick={handleRegisterAsPsychologist}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] hover:from-[#9675bc] hover:to-[#f1b3be] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Award className="w-5 h-5" />
                <span>Convertirme en Psicólogo</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Psicólogos', value: String(psychologists.length || '0'), color: 'from-[#9675bc] to-indigo-500' },
              { icon: Heart, label: 'Consultas', value: '2,500+', color: 'from-[#f1b3be] to-rose-500' },
              { icon: Star, label: 'Satisfacción', value: '98%', color: 'from-amber-500 to-[#ffe0db]' },
              { icon: TrendingUp, label: 'Éxito', value: '95%', color: 'from-green-500 to-emerald-500' }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#252c3e] mb-1">{stat.value}</div>
                <div className="text-sm text-[#252c3e]/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o especialidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70"
                />
              </div>

              <div className="flex gap-2">
                {['Todos', 'Disponibles', 'Mejor Valorados'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(
                      filter === 'Todos' ? 'all' : filter === 'Disponibles' ? 'disponibles' : 'mejor_valorados'
                    )}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      (selectedFilter === 'all' && filter === 'Todos') ||
                      (selectedFilter === 'disponibles' && filter === 'Disponibles') ||
                      (selectedFilter === 'mejor_valorados' && filter === 'Mejor Valorados')
                        ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white shadow-lg'
                        : 'bg-white/70 text-[#252c3e] hover:bg-[#ffe0db]/50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#ffe0db] text-lg">Cargando psicólogos...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPsychologists.map((psychologist, index) => (
                <div
                  key={psychologist.id ?? index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PsychologistCard
                    psychologist={psychologist}
                    onViewProfile={handleViewProfile}
                    onContact={handleContact}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredPsychologists.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#ffe0db] mb-2">No se encontraron psicólogos</h3>
              <p className="text-[#ffe0db]/70">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-[#9675bc]/20 via-[#f1b3be]/20 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#9675bc]/30 p-8 md:p-12 text-center">
            <Shield className="w-16 h-16 text-[#f1b3be] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#ffe0db] mb-4">
              ¿Eres psicólogo certificado?
            </h2>
            <p className="text-[#ffe0db]/80 text-lg mb-8 max-w-2xl mx-auto">
              Únete a nuestra comunidad de profesionales y ayuda a otros a explorar su mundo onírico
            </p>
            <button
              onClick={handleRegisterAsPsychologist}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] hover:from-[#9675bc] hover:to-[#f1b3be] rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <Award className="w-6 h-6" />
              <span>Registrarme como Psicólogo</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PsychologistsPage;