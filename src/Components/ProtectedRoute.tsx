// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Lock, Shield, Moon, Star } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'psychologist';
}

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <img 
              src="/img/Oniria.svg" 
              alt="Oniria" 
              className="w-24 h-24 object-contain drop-shadow-lg" 
            />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ffe0db] rounded-full flex items-center justify-center animate-bounce">
            <Moon className="w-4 h-4 text-[#252c3e]" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-8 h-8 text-[#f1b3be] animate-spin" />
            <h2 className="text-2xl font-bold text-[#ffe0db]">
              Conectando con tus sueños...
            </h2>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-[#f1b3be]/80">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Verificando tu acceso a Noctiria</span>
            <Star className="w-4 h-4 animate-pulse" />
          </div>

          <div className="flex justify-center space-x-1 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#9675bc] rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const UnauthorizedScreen: React.FC<{ requiredRole?: string }> = ({ requiredRole }) => {
  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-red-500/10 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-md mx-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center shadow-xl border-2 border-red-400/30">
            <Lock className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#ffe0db] mb-4">
          Acceso Denegado
        </h1>
        
        <div className="bg-red-950/30 backdrop-blur-sm border border-red-400/20 rounded-2xl p-6 mb-6">
          <p className="text-[#ffe0db]/90 mb-4">
            {requiredRole 
              ? `Necesitas permisos de ${requiredRole === 'psychologist' ? 'psicólogo' : 'usuario'} para acceder a esta sección de Noctiria.`
              : 'Debes iniciar sesión para acceder a tu mundo de sueños.'
            }
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-red-300/80 text-sm">
            <Shield className="w-4 h-4" />
            <span>Tu seguridad onírica es nuestra prioridad</span>
          </div>
        </div>

        <button
          onClick={handleGoToLogin}
          className="group relative w-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] hover:from-[#ffe0db] hover:via-[#f1b3be] hover:to-[#9675bc] text-white font-bold py-4 px-8 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-xl"
        >
          <div className="flex items-center justify-center space-x-3">
            <Lock className="w-5 h-5" />
            <span>Iniciar Sesión en Noctiria</span>
            <Moon className="w-5 h-5 group-hover:animate-bounce" />
          </div>
        </button>

        <div className="mt-6 text-sm text-[#ffe0db]/70">
          <p>¿No tienes cuenta? 
            <button
              onClick={() => window.location.href = '/signup'}
              className="ml-2 text-[#f1b3be] hover:text-[#ffe0db] underline transition-colors duration-200"
            >
              Crea tu mundo de sueños
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, mostrar pantalla de acceso denegado
  if (!isAuthenticated) {
    return <UnauthorizedScreen />;
  }

  // Verificar rol específico si es requerido
  if (requiredRole) {
    const hasRequiredRole = requiredRole === 'psychologist' 
      ? user?.is_psychologist 
      : !user?.is_psychologist;

    if (!hasRequiredRole) {
      return <UnauthorizedScreen requiredRole={requiredRole} />;
    }
  }

  // Si todo está bien, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;