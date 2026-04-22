import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshCw,
  LogOut,
  UserCircle2,
  Mail,
  Clock3,
  NotebookPen,
  Layers,
  Activity,
  BookOpen,
  BarChart3,
  Sparkles,
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  is_psychologist: boolean;
  description?: string;
  profile_pic?: string;
  profile_pic_url?: string;
}

interface UserStats {
  dreamsLogged: number;
  daysSinceJoined: number;
  favoriteTime: string;
  dreamCategories: number;
}

const shellClass =
  'rounded-2xl border border-zinc-700/60 bg-zinc-900/65 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)]';

const StatTile: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({
  icon,
  label,
  value,
}) => (
  <div className={`${shellClass} p-5`}>
    <div className="mb-4 inline-flex rounded-xl border border-zinc-600 bg-zinc-800 p-3 text-zinc-100">{icon}</div>
    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-zinc-100">{value}</p>
  </div>
);

const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className={`${shellClass} w-full p-5 text-left transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-800/90`}
  >
    <div className="mb-3 inline-flex rounded-lg border border-zinc-600 bg-zinc-800 p-2.5 text-zinc-100">{icon}</div>
    <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
    <p className="mt-1 text-sm text-zinc-400">{description}</p>
  </button>
);

export const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userStats] = useState<UserStats>({
    dreamsLogged: 0,
    daysSinceJoined: 0,
    favoriteTime: '00:00',
    dreamCategories: 0,
  });

  const fetchUserData = async () => {
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
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Error desconocido');
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchUserData();
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await fetchUserData();
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  const displayDescription = useMemo(
    () => user?.description?.trim() || 'Aquí aparecerá una breve descripción de tu perfil.',
    [user],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-500 border-t-transparent" />
          <p className="text-zinc-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p>{error ? `Error: ${error}` : 'No se pudieron cargar los datos del usuario.'}</p>
        <button
          onClick={handleRefreshData}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className={`${shellClass} mb-8 p-5 sm:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Oniria Dashboard</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Hola, {user.username}</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">{displayDescription}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile icon={<NotebookPen className="h-5 w-5" />} label="Sueños registrados" value={userStats.dreamsLogged} />
          <StatTile icon={<Clock3 className="h-5 w-5" />} label="Días desde registro" value={userStats.daysSinceJoined} />
          <StatTile icon={<Activity className="h-5 w-5" />} label="Hora frecuente" value={userStats.favoriteTime} />
          <StatTile icon={<Layers className="h-5 w-5" />} label="Categorías" value={userStats.dreamCategories} />
        </section>

        <section className="mb-8 grid gap-4 lg:grid-cols-3">
          <div className={`${shellClass} p-5 lg:col-span-2`}>
            <h2 className="text-lg font-semibold">Perfil</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-zinc-500">Usuario</p>
                <p className="flex items-center gap-2 text-zinc-200"><UserCircle2 className="h-4 w-4" />{user.username}</p>
              </div>
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-zinc-500">Correo</p>
                <p className="flex items-center gap-2 text-zinc-200"><Mail className="h-4 w-4" />{user.email}</p>
              </div>
            </div>
          </div>

          <div className={`${shellClass} p-5`}>
            <h2 className="text-lg font-semibold">Estado</h2>
            <p className="mt-3 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
              Cuenta {user.is_psychologist ? 'profesional' : 'estándar'} activa.
            </p>
            <p className="mt-3 text-sm text-zinc-500">Tema visual aplicado: Monocromático (escala de grises).</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Accesos rápidos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Diario de sueños"
              description="Registra una nueva entrada y revisa tu historial reciente."
              onClick={() => (window.location.href = '/emotional-journal')}
            />
            <ActionCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Analítica"
              description="Explora tendencias y patrones de tus registros."
              onClick={() => console.log('Abrir analítica')}
            />
            <ActionCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Sugerencias IA"
              description="Recibe recomendaciones basadas en actividad reciente."
              onClick={() => console.log('Abrir sugerencias')}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
