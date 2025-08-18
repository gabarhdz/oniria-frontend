// App.tsx - Updated with Profile Routes
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Home1 from './Pages/Home/Home';
import LogIn from './Pages/LogIn/LogIn';
import SignUp from './Pages/SignUp/SignUp';
import Profile from './Pages/Profile/Profile';
import CommunityApp from './Pages/Community/components/Community';
import UserDashboard from './Pages/Dashboard/UserDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import { Loader2, Crown, Home, Moon } from 'lucide-react';

// Componente para rutas públicas que redirige si ya está autenticado
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Componente temporal para psicólogos
const PsychologistDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
      <div className="text-center text-[#ffe0db] space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center shadow-2xl">
          <img src="/img/Oniria.svg" alt="Oniria" className="w-16 h-16 object-contain" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
          Panel de Psicólogo
        </h1>
        <p className="text-xl">Contenido exclusivo para psicólogos en desarrollo...</p>
        <div className="flex items-center justify-center space-x-2 text-yellow-400">
          <Crown className="w-6 h-6" />
          <span>Acceso Profesional Verificado</span>
          <Crown className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Pantalla de carga
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-8 h-8 text-[#f1b3be] animate-spin" />
            <h2 className="text-2xl font-bold text-[#ffe0db]">
              Cargando Noctiria...
            </h2>
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

// Página 404
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
      <div className="text-center text-[#ffe0db] space-y-8">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold">Página no encontrada en Noctiria</h2>
          <p className="text-xl text-[#ffe0db]/70 max-w-md mx-auto">
            Esta página no existe en el mundo de los sueños. ¿Te has perdido en un laberinto onírico?
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] hover:from-[#ffe0db] hover:via-[#f1b3be] hover:to-[#9675bc] text-white font-bold py-4 px-8 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Volver al mundo real</span>
            <Moon className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-[#ffe0db]/60">
            <Link to="/login" className="hover:text-[#f1b3be] transition-colors duration-200">
              Iniciar Sesión
            </Link>
            <span>•</span>
            <Link to="/signup" className="hover:text-[#f1b3be] transition-colors duration-200">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home1 />} />
          <Route path="/login" element={<PublicRoute><LogIn /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          
          {/* Rutas protegidas para usuarios autenticados */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          
          
          {/* Rutas del perfil con subrutas */}
          <Route 
            path="/dashboard/profile" 
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard/profile/profile" replace />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/profile/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/profile/privacy" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/profile/security" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta protegida solo para psicólogos */}
          <Route 
            path="/psychologist" 
            element={
              <ProtectedRoute requiredRole="psychologist">
                <PsychologistDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Ruta de la comunidad */}
          <Route 
            path="/communities" 
            element={
              <ProtectedRoute>
                <CommunityApp />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;