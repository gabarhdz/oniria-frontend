// src/Pages/Forms/TakeFormPage.tsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Brain,
  Clock,
  User,
  FileText,
  Send,
  ArrowLeft,
  Star,
  TrendingUp
} from 'lucide-react';
import { useForms } from '../../hooks/useForms';
import type { Form, DueTest,SubmitFormData } from '../../types/forms';
import { DashboardFooter } from '../Dashboard/components';
import { useAuth } from '../../contexts/AuthContext';





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

const TakeFormPage: React.FC = () => {
  const { user } = useAuth(); // 👈 Obtener usuario actual
  const [assignedTests, setAssignedTests] = useState<DueTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<DueTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoading, getMyDueTests, submitFormResponse } = useForms();

  useEffect(() => {
    loadAssignedTests();
  }, []);

  const loadAssignedTests = async () => {
    try {
      console.log('🔍 Cargando tests asignados...');
      console.log('👤 Usuario actual:', user?.id, user?.username);
      
      const tests = await getMyDueTests();
      console.log('📋 Tests recibidos del servidor:', tests);
      
      // 🔹 CORRECCIÓN: Filtrar tests donde el usuario actual es el paciente
     const myTests = tests.filter(t => {
  const patientId = typeof t.patient === 'object' ? t.patient.id : t.patient;
  const userId = user?.id;

  const isMyTest = patientId === userId;
  const isPending = !t.is_completed; // asegúrate de que sea booleano

  return isMyTest && isPending;
});

      
      console.log('✅ Tests filtrados para mostrar:', myTests);
      setAssignedTests(myTests);
      
      if (myTests.length === 0) {
        console.log('⚠️ No hay tests pendientes para mostrar');
      }
    } catch (error) {
      console.error('❌ Error loading tests:', error);
      setError('Error al cargar evaluaciones. Por favor, intenta nuevamente.');
    }
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleNextQuestion = () => {
    if (selectedTest && currentQuestionIndex < selectedTest.form.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  
const handleSubmit = async () => {
  if (!selectedTest) return;

  const allQuestionsAnswered = selectedTest.form.questions.every(
    q => answers[q.id] !== undefined
  );

  if (!allQuestionsAnswered) {
    alert('Por favor responde todas las preguntas antes de enviar.');
    return;
  }

  setIsSubmitting(true);

  try {
    const payload: SubmitFormData = {
      form: selectedTest.form.id,
      due_test: selectedTest.id,
      answers: selectedTest.form.questions.map(q => ({
        question: q.id,  // 👈 ID exacto que Django espera
        value: answers[q.id]
      }))
    };

    console.log('📤 Payload a enviar:', payload);

    const response = await submitFormResponse(payload);

    console.log('✅ Respuesta enviada exitosamente:', response);
    setSubmitted(true);

    setTimeout(() => {
      setSelectedTest(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setSubmitted(false);
      loadAssignedTests();
    }, 3000);
  } catch (error) {
    console.error('❌ Error al enviar formulario:', error);
    alert('Error al enviar el formulario. Intenta nuevamente.');
  } finally {
    setIsSubmitting(false);
  }
};


  const getProgress = () => {
    if (!selectedTest) return 0;
    const total = selectedTest.form.questions.length;
    const answered = Object.keys(answers).length;
    return Math.round((answered / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <TwinklingStars />
        <div className="text-center z-10">
          <Brain className="w-16 h-16 text-[#f1b3be] animate-spin mx-auto mb-4" />
          <p className="text-[#ffe0db] text-xl">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <TwinklingStars />
        <div className="text-center z-10 p-8">
          <AlertCircle className="w-24 h-24 text-red-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-[#ffe0db] mb-4">Error</h2>
          <p className="text-[#ffe0db]/80 text-xl mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadAssignedTests();
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] rounded-xl text-white font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <TwinklingStars />
        <div className="text-center z-10 p-8">
          <CheckCircle className="w-24 h-24 text-emerald-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold text-[#ffe0db] mb-4">¡Formulario Enviado!</h2>
          <p className="text-[#ffe0db]/80 text-xl mb-6">
            Tu psicólogo revisará tus respuestas pronto.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] mx-auto rounded-full" />
        </div>
      </div>
    );
  }

  if (selectedTest) {
    const currentQuestion = selectedTest.form.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === selectedTest.form.questions.length - 1;
    const progress = getProgress();

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
        <TwinklingStars count={40} />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]" />
        
        {/* Header */}
        <header className="relative z-10 p-6 border-b border-[#f1b3be]/20 backdrop-blur-xl bg-[#252c3e]/30">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm('¿Estás seguro? Perderás tu progreso actual.')) {
                  setSelectedTest(null);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                }
              }}
              className="flex items-center space-x-2 text-[#ffe0db] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-[#ffe0db]">{selectedTest.form.title}</h1>
              <p className="text-[#f1b3be] text-sm">
                Pregunta {currentQuestionIndex + 1} de {selectedTest.form.questions.length}
              </p>
            </div>

            <div className="w-20" />
          </div>
        </header>

        {/* Progress bar */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-4">
          <div className="bg-[#252c3e]/30 backdrop-blur-xl rounded-full h-3 overflow-hidden border border-[#ffe0db]/20">
            <div
              className="h-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-[#ffe0db] text-sm mt-2">
            {progress}% completado
          </p>
        </div>

        {/* Question */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-8 md:p-12">
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#252c3e] mb-4 leading-relaxed">
                {currentQuestion.question_text}
              </h2>
              <div className="flex items-center space-x-4 text-[#252c3e]/60">
                <span className="text-sm">
                  Escala: {currentQuestion.min_value} - {currentQuestion.max_value}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-[#252c3e]/60">
                  {currentQuestion.min_value} (Mínimo)
                </span>
                <span className="text-4xl font-bold text-[#9675bc]">
                  {answers[currentQuestion.id] ?? Math.floor((currentQuestion.min_value + currentQuestion.max_value) / 2)}
                </span>
                <span className="text-sm font-medium text-[#252c3e]/60">
                  {currentQuestion.max_value} (Máximo)
                </span>
              </div>

              <input
                type="range"
                min={currentQuestion.min_value}
                max={currentQuestion.max_value}
                value={answers[currentQuestion.id] ?? Math.floor((currentQuestion.min_value + currentQuestion.max_value) / 2)}
                onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-lg appearance-none cursor-pointer slider"
              />

              {/* Visual feedback */}
              <div className="flex justify-between mt-4">
                {Array.from({ length: currentQuestion.max_value - currentQuestion.min_value + 1 }, (_, i) => {
                  const value = currentQuestion.min_value + i;
                  const isSelected = (answers[currentQuestion.id] ?? Math.floor((currentQuestion.min_value + currentQuestion.max_value) / 2)) === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleAnswerChange(currentQuestion.id, value)}
                      className={`w-8 h-8 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white scale-125 shadow-lg'
                          : 'bg-white/50 text-[#252c3e]/60 hover:bg-white/70'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between space-x-4">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-white/70 hover:bg-white/90 text-[#252c3e] rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(answers).length < selectedTest.form.questions.length}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Brain className="w-5 h-5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Formulario</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all"
                >
                  <span>Siguiente</span>
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <style>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #9675bc, #f1b3be);
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(150, 117, 188, 0.6);
            transition: transform 0.2s;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          
          .slider::-moz-range-thumb {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #9675bc, #f1b3be);
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 12px rgba(150, 117, 188, 0.6);
          }
        `}</style>
      </div>
    );
  }

  // Lista de tests asignados
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      <TwinklingStars count={40} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]" />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-[#f1b3be]/20 backdrop-blur-xl bg-[#252c3e]/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#ffe0db]">Evaluaciones Pendientes</h1>
              <p className="text-[#f1b3be]">Completa los formularios asignados por tu psicólogo</p>
            </div>
          </div>
          
          {/* Debug info (remover en producción) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-[#ffe0db]/60 bg-black/20 px-3 py-2 rounded-lg">
              <p>Usuario: {user?.username}</p>
              <p>ID: {user?.id}</p>
              <p>Tests: {assignedTests.length}</p>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 pb-32">
        {assignedTests.length === 0 ? (
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-lg p-12 text-center">
            <CheckCircle className="w-20 h-20 text-[#f1b3be]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#252c3e] mb-2">
              No tienes evaluaciones pendientes
            </h3>
            <p className="text-[#252c3e]/70">
              Tu psicólogo te asignará formularios cuando sea necesario
            </p>
            
            {/* Debug button (remover en producción) */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={loadAssignedTests}
                className="mt-6 px-4 py-2 bg-[#9675bc] text-white rounded-lg text-sm"
              >
                🔄 Recargar (Debug)
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedTests.map((test, index) => (
              <div
                key={test.id}
                className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#252c3e]">{test.form.title}</h3>
                  <AlertCircle className="w-6 h-6 text-amber-500 animate-pulse" />
                </div>

                {test.form.description && (
                  <p className="text-[#252c3e]/70 mb-4">{test.form.description}</p>
                )}

                {test.description && (
                  <div className="bg-[#9675bc]/10 rounded-xl p-4 mb-4">
                    <p className="text-sm text-[#252c3e]/80">
                      <strong>Nota del psicólogo:</strong> {test.description}
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-[#252c3e]/60">
                    <User className="w-4 h-4" />
                    <span>Asignado por: {test.psychologist.username}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-[#252c3e]/60">
                    <Clock className="w-4 h-4" />
                    <span>Fecha límite: {new Date(test.date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-[#252c3e]/60">
                    <FileText className="w-4 h-4" />
                    <span>{test.form.questions.length} preguntas</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-[#9675bc]">
                    <span className="font-mono font-bold">Código: {test.access_code}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTest(test)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <span>Comenzar Evaluación</span>
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default TakeFormPage;