// src/Pages/Forms/FormsManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  ClipboardList,
  Users,
  Edit3,
  Trash2,
  Eye,
  Send,
  AlertCircle,
  CheckCircle,
  Brain,
  Sparkles,
  Search,
  Filter,
  X,
  Calendar,
  User,
  BarChart3
} from 'lucide-react';
import { useForms } from '../../hooks/useForms';
import type { Form, Question, DueTest,CreateFormData , AssignTestData} from '../../types/forms';
import { DashboardFooter } from '../Dashboard/components';

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

const FormsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'forms' | 'assigned'>('forms');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [assignedTests, setAssignedTests] = useState<DueTest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [selectedTest, setSelectedTest] = useState<DueTest | null>(null);

  const {
    isLoading,
    error,
    clearError,
    getQuestions,
    getForms,
    getAssignedTests,
    createQuestion,
    createForm,
    deleteQuestion,
    deleteForm,
    assignTest
  } = useForms();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'questions') {
        const data = await getQuestions();
        setQuestions(data);
      } else if (activeTab === 'forms') {
        const data = await getForms();
        setForms(data);
      } else {
        const data = await getAssignedTests();
        setAssignedTests(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createQuestion({
        question_text: formData.get('question_text') as string,
        min_value: parseInt(formData.get('min_value') as string),
        max_value: parseInt(formData.get('max_value') as string)
      });
      setShowCreateQuestionModal(false);
      loadData();
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;
    
    try {
      await deleteQuestion(id);
      loadData();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleDeleteForm = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este formulario?')) return;
    
    try {
      await deleteForm(id);
      loadData();
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    
    if (activeTab === 'questions') {
      return questions.filter(q => 
        q.question_text.toLowerCase().includes(term)
      );
    } else if (activeTab === 'forms') {
      return forms.filter(f => 
        f.title.toLowerCase().includes(term) ||
        f.description?.toLowerCase().includes(term)
      );
    } else {
      return assignedTests.filter(t => 
        t.patient.username.toLowerCase().includes(term) ||
        t.form.title.toLowerCase().includes(term)
      );
    }
  };

  const stats = {
    questions: questions.length,
    forms: forms.length,
    assigned: assignedTests.length,
    completed: assignedTests.filter(t => t.is_completed).length
  };

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
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#ffe0db]">Gestión de Formularios</h1>
              <p className="text-[#f1b3be]">Crea y administra evaluaciones</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateQuestionModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nueva Pregunta</span>
            </button>
            
            <button
              onClick={() => setShowCreateFormModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#f1b3be] to-[#ffe0db] hover:from-[#ffe0db] hover:to-[#f1b3be] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              <span className="hidden sm:inline">Nuevo Formulario</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 text-[#9675bc]" />
            </div>
            <div className="text-3xl font-bold text-[#252c3e]">{stats.questions}</div>
            <div className="text-sm text-[#252c3e]/60">Preguntas</div>
          </div>

          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-[#f1b3be]" />
            </div>
            <div className="text-3xl font-bold text-[#252c3e]">{stats.forms}</div>
            <div className="text-sm text-[#252c3e]/60">Formularios</div>
          </div>

          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Send className="w-8 h-8 text-[#ffe0db]" />
            </div>
            <div className="text-3xl font-bold text-[#252c3e]">{stats.assigned}</div>
            <div className="text-sm text-[#252c3e]/60">Asignados</div>
          </div>

          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-[#252c3e]">{stats.completed}</div>
            <div className="text-sm text-[#252c3e]/60">Completados</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-2">
          <div className="flex space-x-2">
            {[
              { id: 'questions', label: 'Preguntas', icon: Brain },
              { id: 'forms', label: 'Formularios', icon: FileText },
              { id: 'assigned', label: 'Asignados', icon: Send }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white shadow-lg'
                    : 'text-[#252c3e] hover:bg-[#ffe0db]/30'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'questions' ? 'preguntas' : activeTab === 'forms' ? 'formularios' : 'asignaciones'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 transition-all"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 pb-32">
        {isLoading ? (
          <div className="text-center py-20">
            <Brain className="w-16 h-16 text-[#f1b3be] animate-spin mx-auto mb-4" />
            <p className="text-[#ffe0db]">Cargando...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData().length === 0 ? (
              <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-lg p-12 text-center">
                <AlertCircle className="w-16 h-16 text-[#f1b3be]/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#252c3e] mb-2">
                  {searchTerm ? 'No se encontraron resultados' : `No hay ${activeTab === 'questions' ? 'preguntas' : activeTab === 'forms' ? 'formularios' : 'tests asignados'}`}
                </h3>
                <p className="text-[#252c3e]/70">
                  {searchTerm ? 'Intenta con otros términos' : 'Comienza creando uno nuevo'}
                </p>
              </div>
            ) : activeTab === 'questions' ? (
              filteredData().map((question: any, index: number) => (
                <div
                  key={question.id}
                  className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6 hover:shadow-2xl transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#252c3e] mb-2">{question.question_text}</h3>
                      <div className="flex items-center space-x-4 text-sm text-[#252c3e]/60">
                        <span>Rango: {question.min_value} - {question.max_value}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : activeTab === 'forms' ? (
              filteredData().map((form: any, index: number) => (
                <div
                  key={form.id}
                  className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6 hover:shadow-2xl transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#252c3e] mb-2">{form.title}</h3>
                      {form.description && (
                        <p className="text-sm text-[#252c3e]/70 mb-3">{form.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-[#252c3e]/60">
                        <span>{form.questions.length} preguntas</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedForm(form);
                          setShowAssignModal(true);
                        }}
                        className="p-2 rounded-lg bg-[#9675bc]/20 text-[#9675bc] hover:bg-[#9675bc]/30 transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteForm(form.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredData().map((test: any, index: number) => (
                <div
                  key={test.id}
                  className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6 hover:shadow-2xl transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-[#252c3e]">{test.form.title}</h3>
                        {test.is_completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-[#252c3e]/60 mb-2">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{test.patient.username}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(test.date).toLocaleDateString('es-ES')}</span>
                        </span>
                      </div>
                      {test.description && (
                        <p className="text-sm text-[#252c3e]/70">{test.description}</p>
                      )}
                      <div className="mt-2">
                        <span className="text-xs font-medium text-[#9675bc]">
                          Código: {test.access_code}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTest(test)}


                      className="p-2 rounded-lg bg-[#9675bc]/20 text-[#9675bc] hover:bg-[#9675bc]/30 transition-all"
                    >
                    
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal crear pregunta */}
      {showCreateQuestionModal && (
        <QuestionModal
          onClose={() => setShowCreateQuestionModal(false)}
          onSubmit={handleCreateQuestion}
        />
      )}

      {/* Modal crear formulario */}
      {showCreateFormModal && (
      <FormModal
       questions={questions}
       onClose={() => setShowCreateFormModal(false)}
       onSubmit={async (data: CreateFormData) => {
       try {
       await createForm(data);
       setShowCreateFormModal(false);
       loadData();
       } catch (error) {
       console.error('Error:', error);
      }
    }}
   />
      )}

      {/* Modal asignar test */}
      {/* Modal asignar test */}
      {showAssignModal && selectedForm && (
  <AssignTestModal
    form={selectedForm}
    onClose={() => {
      setShowAssignModal(false);
      setSelectedForm(null);
    }}
    onSubmit={async (data: { patient: string; date: string; description?: string }) => {
      try {
        const assignData: AssignTestData = {
          form: selectedForm.id,
          patient: data.patient,
          date: data.date,
          description: data.description || ''
        };

        await assignTest(assignData);

        setShowAssignModal(false);
        setSelectedForm(null);
        loadData();
      } catch (error) {
        console.error('Error:', error);
      }
    }}
  />
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

// Modal componentes se crearán por separado
const QuestionModal: React.FC<any> = ({ onClose, onSubmit }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
      <h2 className="text-2xl font-bold text-[#252c3e] mb-6">Nueva Pregunta</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#252c3e] mb-2">Pregunta</label>
          <textarea
            name="question_text"
            required
            rows={3}
            className="w-full px-4 py-3 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
            placeholder="Escribe tu pregunta aquí..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Valor Mínimo</label>
            <input
              type="number"
              name="min_value"
              defaultValue={0}
              required
              className="w-full px-4 py-3 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Valor Máximo</label>
            <input
              type="number"
              name="max_value"
              defaultValue={10}
              required
              className="w-full px-4 py-3 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
            />
          </div>
        </div>
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  </div>
);

const FormModal: React.FC<any> = ({ questions, onClose, onSubmit }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full my-8">
        <h2 className="text-2xl font-bold text-[#252c3e] mb-6">Nuevo Formulario</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              questions_ids: selectedQuestions
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Título</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-3 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
              placeholder="Nombre del formulario"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Descripción</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-3 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
              placeholder="Descripción opcional"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">
              Seleccionar Preguntas ({selectedQuestions.length})
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2 border border-[#9675bc]/20 rounded-xl p-4">
              {questions.map((q: Question) => (
                <label key={q.id} className="flex items-start space-x-3 p-3 hover:bg-[#ffe0db]/20 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(q.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuestions([...selectedQuestions, q.id]);
                      } else {
                        setSelectedQuestions(selectedQuestions.filter(id => id !== q.id));
                      }
                    }}
                    className="mt-1"
                  />
                  <span className="text-sm text-[#252c3e]">{q.question_text}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={selectedQuestions.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              Crear Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssignTestModal: React.FC<any> = ({ form, onClose, onSubmit }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  
  useEffect(() => {
    // Cargar lista de pacientes (usuarios no psicólogos)
    const loadPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        setPatients(data.filter((u: any) => !u.is_psychologist));
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    };
    loadPatients();
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-[#252c3e] mb-6">Asignar Test</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({
              patient: selectedPatient,
              form: form.id,
              date: formData.get('date') as string,
              description: formData.get('description') as string
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Formulario</label>
            <input
              type="text"
              value={form.title}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-[#9675bc]/20 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Paciente</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
            >
              <option value="">Seleccionar paciente...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.username} ({p.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Fecha límite</label>
            <input
              type="datetime-local"
              name="date"
              required
              className="w-full px-4 py-3 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#252c3e] mb-2">Descripción</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-3 border border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40"
              placeholder="Instrucciones para el paciente..."
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedPatient}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              Asignar Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormsManagement;