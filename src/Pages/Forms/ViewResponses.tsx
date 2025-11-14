// src/Pages/Forms/ViewResponses.tsx
import React, { useState, useEffect } from 'react';
import {
  Brain,
  User,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardFooter } from '../Dashboard/components';

interface Answer {
  id: string;
  question: {
    id: string;
    question_text: string;
    min_value: number;
    max_value: number;
  };
  value: number;
}

interface FormResponse {
  id: string;
  form: {
    id: string;
    title: string;
    description?: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
    profile_pic?: string;
  };
  created_at: string;
  total_score: number;
  answers: Answer[];
  due_test?: {
    id: string;
    description?: string;
    date: string;
    is_completed: boolean;
    access_code: number;
  };
}

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

const ViewResponses: React.FC = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://127.0.0.1:8000/api/psychologists/my-form-responses/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar respuestas');
      }

      const data = await response.json();
      console.log('📋 Respuestas cargadas:', data);
      setResponses(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar las respuestas de formularios');
    } finally {
      setLoading(false);
    }
  };

  const filteredResponses = responses.filter(response => 
    response.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    response.form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateMaxScore = (answers: Answer[]) => {
    return answers.reduce((sum, answer) => sum + answer.question.max_value, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <TwinklingStars />
        <div className="text-center z-10">
          <Brain className="w-16 h-16 text-[#f1b3be] animate-spin mx-auto mb-4" />
          <p className="text-[#ffe0db] text-xl">Cargando respuestas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      <TwinklingStars count={40} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]" />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-[#f1b3be]/20 backdrop-blur-xl bg-[#252c3e]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/psychologist')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-[#ffe0db]" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#ffe0db]">Respuestas de Formularios</h1>
              <p className="text-[#f1b3be]">Revisa las evaluaciones completadas por tus pacientes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-[#9675bc]" />
            </div>
            <div className="text-3xl font-bold text-[#252c3e]">{responses.length}</div>
            <div className="text-sm text-[#252c3e]/60">Respuestas Totales</div>
          </div>

          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-[#252c3e]">
              {responses.filter(r => r.due_test?.is_completed).length}
            </div>
            <div className="text-sm text-[#252c3e]/60">Completados</div>
          </div>

          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <User className="w-8 h-8 text-[#f1b3be]" />
            </div>
            <div className="text-3xl font-bold text-[#252c3e]">
              {new Set(responses.map(r => r.user.id)).size}
            </div>
            <div className="text-sm text-[#252c3e]/60">Pacientes Únicos</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60" />
            <input
              type="text"
              placeholder="Buscar por paciente o formulario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 transition-all"
            />
          </div>
        </div>

        {/* Responses List */}
        {filteredResponses.length === 0 ? (
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-[#f1b3be]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#252c3e] mb-2">
              {searchTerm ? 'No se encontraron resultados' : 'No hay respuestas aún'}
            </h3>
            <p className="text-[#252c3e]/70">
              {searchTerm ? 'Intenta con otros términos' : 'Los pacientes aún no han completado formularios'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-32">
            {filteredResponses.map((response, index) => (
              <div
                key={response.id}
                className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6 hover:shadow-2xl transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#252c3e] mb-2">
                      {response.form.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#252c3e]/60">
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{response.user.username}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(response.created_at).toLocaleDateString('es-ES')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(response.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                      {response.due_test && (
                        <span className="flex items-center space-x-1">
                          <span className="font-mono text-xs bg-[#9675bc]/20 px-2 py-1 rounded">
                            Código: {response.due_test.access_code}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`text-3xl font-bold ${getScoreColor(response.total_score, calculateMaxScore(response.answers))}`}>
                      {response.total_score}
                    </div>
                    <div className="text-sm text-[#252c3e]/60">
                      de {calculateMaxScore(response.answers)}
                    </div>
                    {response.due_test?.is_completed && (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
                    )}
                  </div>
                </div>

                {response.form.description && (
                  <p className="text-sm text-[#252c3e]/70 mb-4 italic">
                    {response.form.description}
                  </p>
                )}

                <button
                  onClick={() => setSelectedResponse(response)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] rounded-xl text-white font-medium transition-all hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalles</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#252c3e] mb-2">{selectedResponse.form.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-[#252c3e]/60">
                  <span className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{selectedResponse.user.username}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedResponse.created_at).toLocaleDateString('es-ES')}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#9675bc] mb-2">
                  {selectedResponse.total_score}
                </div>
                <div className="text-sm text-[#252c3e]/60">
                  Puntaje Total (de {calculateMaxScore(selectedResponse.answers)})
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#252c3e] mb-4">Respuestas Detalladas</h3>
              {selectedResponse.answers.map((answer, index) => (
                <div key={answer.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-[#252c3e] flex-1 font-medium">
                      {index + 1}. {answer.question.question_text}
                    </p>
                    <span className="ml-4 px-3 py-1 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white rounded-full text-sm font-bold">
                      {answer.value}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-[#252c3e]/60">
                    <span>Rango: {answer.question.min_value} - {answer.question.max_value}</span>
                    <span>•</span>
                    <span>
                      {Math.round((answer.value / answer.question.max_value) * 100)}% del máximo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <DashboardFooter />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ViewResponses;