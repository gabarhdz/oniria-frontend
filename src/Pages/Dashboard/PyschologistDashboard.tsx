import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  MessageSquare,
  FileText,
  Star,
  RefreshCw,
  Settings,
  LogOut,
  Calendar,
  Activity,
  ClipboardList,
  Brain,
} from 'lucide-react';

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle: string;
};

const panelClass =
  'rounded-2xl border border-zinc-700/60 bg-zinc-900/70 p-5 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)]';

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle }) => (
  <div className={panelClass}>
    <div className="mb-3 inline-flex rounded-lg border border-zinc-600 bg-zinc-800 p-3 text-zinc-100">{icon}</div>
    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{title}</p>
    <p className="mt-1 text-2xl font-semibold text-zinc-100">{value}</p>
    <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
  </div>
);

const PyschologistDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeConsultations: 0,
    completedForms: 0,
    averageRating: 0,
  });

  useEffect(() => {
    setStats({
      totalPatients: 24,
      activeConsultations: 8,
      completedForms: 156,
      averageRating: 4.8,
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 900);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className={`${panelClass} mb-8`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Panel profesional</p>
              <h1 className="mt-2 text-2xl font-semibold">Dr(a). {user?.username}</h1>
              <p className="mt-2 text-sm text-zinc-400">Dashboard monocromático enfocado en datos clínicos y flujo diario.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <Link
                to="/dashboard/profile/profile"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
              >
                <Settings className="h-4 w-4" />
                Ajustes
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Users className="h-5 w-5" />} title="Pacientes" value={stats.totalPatients} subtitle="en seguimiento" />
          <StatCard icon={<MessageSquare className="h-5 w-5" />} title="Consultas" value={stats.activeConsultations} subtitle="activas hoy" />
          <StatCard icon={<FileText className="h-5 w-5" />} title="Formularios" value={stats.completedForms} subtitle="completados" />
          <StatCard icon={<Star className="h-5 w-5" />} title="Valoración" value={stats.averageRating} subtitle="promedio" />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className={`${panelClass} lg:col-span-2`}>
            <h2 className="text-lg font-semibold">Tareas de hoy</h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-3"><Calendar className="mt-0.5 h-4 w-4 text-zinc-400" />3 consultas programadas en la tarde.</li>
              <li className="flex items-start gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-3"><ClipboardList className="mt-0.5 h-4 w-4 text-zinc-400" />7 formularios pendientes de revisión.</li>
              <li className="flex items-start gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-3"><Brain className="mt-0.5 h-4 w-4 text-zinc-400" />2 análisis de sueños requieren feedback clínico.</li>
            </ul>
          </article>

          <aside className={panelClass}>
            <h2 className="text-lg font-semibold">Actividad reciente</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-400">
              <p className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">Paciente #1234 completó su formulario.</p>
              <p className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">Nueva cita agendada para mañana.</p>
              <p className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">Actualización de métricas disponible.</p>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs uppercase tracking-[0.14em] text-zinc-500">
              <Activity className="h-3.5 w-3.5" />
              Tema monocromático aplicado
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default PyschologistDashboard;
