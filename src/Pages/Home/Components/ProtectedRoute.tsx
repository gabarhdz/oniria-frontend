// src/Pages/Home/Components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'psychologist' | 'user';
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <img 
                src="/img/Oniria.svg" 
                alt="Oniria" 
                className="w-24 h-24 object-contain drop-shadow-lg" 
              />
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-8 h-8 text-[#f1b3be] animate-spin" />
            <h2 className="text-2xl font-bold text-[#ffe0db]">
              Verificando acceso...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Verificar autenticación
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol específico si es requerido
  if (requiredRole && user) {
    if (requiredRole === 'psychologist' && !user.is_psychologist) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-red-500/10 via-white/5 to-red-500/10 backdrop-blur-xl rounded-3xl border border-red-500/30 shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-[#ffe0db] mb-2">
                Acceso Restringido
              </h2>
              <p className="text-[#ffe0db]/80">
                Esta sección está disponible únicamente para psicólogos certificados.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      );
    }

    if (requiredRole === 'user' && user.is_psychologist) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-blue-500/10 via-white/5 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-blue-500/30 shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-[#ffe0db] mb-2">
                Acceso Profesional
              </h2>
              <p className="text-[#ffe0db]/80">
                Esta sección está disponible únicamente para usuarios regulares.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/psychologist'}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Ir al Panel Profesional
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;