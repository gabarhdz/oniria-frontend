import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  FileText, 
  Calendar, 
  Award, 
  TrendingUp, 
  Brain,
  Heart,
  Bell,
  Settings,
  LogOut,
  RefreshCw,
  PlusCircle,
  Eye,
  MessageSquare,
  Activity,
  Moon,
  Star,
  Crown
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Componente de estrellas
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

// Tipos para props
type StatCardProps = {
  icon: React.ComponentType<React.ComponentProps<'svg'>> | any;
  title: string;
  value: number | string;
  subtitle?: string;
  gradient?: string;
  change?: { value: number; isPositive: boolean };
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, gradient = 'from-indigo-500 to-indigo-600', change }) => {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-[#252c3e]/60 uppercase tracking-wider">{title}</p>
          {change && (
            <div className="flex items-center space-x-1 mt-1">
              <TrendingUp className={`w-3 h-3 ${change.isPositive ? 'text-emerald-500' : 'text-red-500 rotate-180'}`} />
              <span className={`text-xs font-medium ${change.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-[#252c3e]">{value}</div>
        {subtitle && <p className="text-xs text-[#252c3e]/60">{subtitle}</p>}
      </div>
    </div>
  );
};

type QuickActionCardProps = {
  icon: React.ComponentType<React.ComponentProps<'svg'>> | any;
  title: string;
  description?: string;
  onClick?: () => void;
  gradient?: string;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon: Icon, title, description, onClick, gradient = 'from-indigo-500 to-indigo-600' }) => {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 p-6 text-left"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[#252c3e] mb-1">{title}</h3>
          <p className="text-sm text-[#252c3e]/70">{description}</p>
        </div>
      </div>
    </button>
  );
};

const PsychologistDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeConsultations: 0,
    completedForms: 0,
    averageRating: 0
  });

  useEffect(() => {
    // Aquí cargarías las estadísticas reales desde tu API
    setStats({
      totalPatients: 24,
      activeConsultations: 8,
      completedForms: 156,
      averageRating: 4.8
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Aquí refrescarías los datos
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const recentActivities = [
    { icon: FileText, text: 'Formulario completado por paciente #1234', time: 'Hace 2 horas', color: 'text-blue-500' },
    { icon: MessageSquare, text: 'Nueva consulta programada', time: 'Hace 4 horas', color: 'text-green-500' },
    { icon: Brain, text: 'Análisis de sueño enviado', time: 'Ayer', color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      <TwinklingStars count={40} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]"></div>

      {/* Header */}
      <header className="relative z-10 bg-[#252c3e]/30 backdrop-blur-xl border-b border-[#f1b3be]/20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-2xl p-1 shadow-2xl">
              <img src="/img/Oniria.svg" alt="Oniria" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#ffe0db]">Panel Profesional</h1>
              <p className="text-[#f1b3be]">Bienvenido, Dr(a). {user?.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 text-[#ffe0db] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 relative">
              <Bell className="w-5 h-5 text-[#ffe0db]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <Link
              to="/dashboard/profile/profile"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Settings className="w-5 h-5 text-[#ffe0db]" />
            </Link>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-[#ffe0db] transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Badge Profesional */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#ffe0db]">Cuenta Profesional Verificada</h2>
                <p className="text-[#ffe0db]/80">Psicólogo certificado en Noctiria</p>
              </div>
            </div>
            <Award className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Estadísticas */}
        <div>
          <h2 className="text-2xl font-bold text-[#ffe0db] mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[#f1b3be]" />
            Resumen de Actividad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              title="Pacientes Activos"
              value={stats.totalPatients}
              subtitle="pacientes en tratamiento"
              gradient="from-blue-500 to-blue-600"
              change={{ value: 12, isPositive: true }}
            />
            <StatCard
              icon={MessageSquare}
              title="Consultas Activas"
              value={stats.activeConsultations}
              subtitle="sesiones programadas"
              gradient="from-green-500 to-green-600"
              change={{ value: 8, isPositive: true }}
            />
            <StatCard
              icon={FileText}
              title="Formularios"
              value={stats.completedForms}
              subtitle="evaluaciones completadas"
              gradient="from-purple-500 to-purple-600"
              change={{ value: 15, isPositive: true }}
            />
            <StatCard
              icon={Star}
              title="Calificación"
              value={stats.averageRating}
              subtitle="promedio de satisfacción"
              gradient="from-yellow-500 to-yellow-600"
            />
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div>
          <h2 className="text-2xl font-bold text-[#ffe0db] mb-6 flex items-center">
            <PlusCircle className="w-6 h-6 mr-2 text-[#f1b3be]" />
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              icon={Users}
              title="Gestionar Pacientes"
              description="Ver lista completa de pacientes y expedientes"
              gradient="from-[#9675bc] to-[#7c3aed]"
              onClick={() => console.log('Gestionar pacientes')}
            />
            <QuickActionCard
              icon={Calendar}
              title="Agenda"
              description="Ver y programar consultas"
              gradient="from-[#f1b3be] to-[#ec4899]"
              onClick={() => console.log('Agenda')}
            />
            <QuickActionCard
              icon={FileText}
              title="Crear Formulario"
              description="Diseñar nuevos cuestionarios de evaluación"
              gradient="from-[#ffe0db] to-[#f97316]"
              onClick={() => console.log('Crear formulario')}
            />
            <QuickActionCard
              icon={Brain}
              title="Análisis de Sueños"
              description="Revisar análisis pendientes de pacientes"
              gradient="from-purple-500 to-purple-600"
              onClick={() => console.log('Análisis')}
            />
            <QuickActionCard
              icon={Heart}
              title="Recursos Terapéuticos"
              description="Acceder a ejercicios y técnicas"
              gradient="from-pink-500 to-pink-600"
              onClick={() => console.log('Recursos')}
            />
            <QuickActionCard
              icon={Eye}
              title="Reportes"
              description="Ver estadísticas y progreso general"
              gradient="from-indigo-500 to-indigo-600"
              onClick={() => console.log('Reportes')}
            />
          </div>
        </div>

        {/* Actividad Reciente */}
        <div>
          <h2 className="text-2xl font-bold text-[#ffe0db] mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[#f1b3be]" />
            Actividad Reciente
          </h2>
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                      <span className="text-[#252c3e]">{activity.text}</span>
                    </div>
                    <span className="text-xs text-[#252c3e]/60">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PsychologistDashboard;