// src/Pages/ForgotPassword/ForgotPassword.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Moon, 
  Shield, 
  Clock,
  Star,
  Heart,
  Sparkles
} from 'lucide-react';
import axios from 'axios';

interface ForgotPasswordData {
  email: string;
}

interface ApiResponse {
  message: string;
  detail?: string;
  success: boolean;
  errors?: any;
}

// Efectos visuales reutilizables
const TwinklingStars: React.FC<{ count?: number; className?: string }> = ({ count = 25, className = '' }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.5 + 0.3,
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const DreamAlert: React.FC<{ 
  type: 'success' | 'error'; 
  message: string; 
  title: string; 
  detail?: string;
  onClose: () => void 
}> = ({ type, message, title, detail, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="relative max-w-lg w-full mx-4">
        <TwinklingStars count={15} className="rounded-2xl" />
        <div className={`relative bg-gradient-to-br backdrop-blur-xl rounded-2xl shadow-2xl border p-8 animate-scale-in ${
          type === 'success' 
            ? 'from-green-50/95 via-white/90 to-[#ffe0db]/95 border-green-200/50' 
            : 'from-red-50/95 via-white/90 to-[#ffe0db]/95 border-red-200/50'
        }`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${type === 'success' ? 'animate-check-in' : 'animate-shake-x'}`}>
              {type === 'success' ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className={`font-bold text-xl mb-3 ${
                type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {title}
              </h3>
              <p className={`text-base whitespace-pre-line mb-2 ${
                type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message}
              </p>
              {detail && (
                <p className={`text-sm whitespace-pre-line opacity-80 ${
                  type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {detail}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                type === 'success'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              } hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
            >
              {type === 'success' ? 'Entendido' : 'Cerrar'}
            </button>
          </div>
          
          {type === 'success' && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    type: 'success' | 'error';
    message: string;
    title: string;
    detail?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordData>();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>(
        'http://127.0.0.1:8000/api/users/password-reset/request/',
        data,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setShowAlert({
        type: 'success',
        title: '✉️ Solicitud enviada',
        message: response.data.message,
        detail: response.data.detail
      });

      reset();

    } catch (error) {
      console.error('Error en forgot password:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        setShowAlert({
          type: 'error',
          title: 'Error en la solicitud',
          message: errorData.message || 'Hubo un error al procesar tu solicitud.',
          detail: errorData.detail || 'Por favor intenta nuevamente.'
        });
      } else {
        setShowAlert({
          type: 'error',
          title: 'Error de conexión',
          message: 'No se pudo conectar con el servidor.',
          detail: 'Verifica tu conexión a internet e intenta nuevamente.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <TwinklingStars count={35} />
      
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]"></div>
      
      {/* Orbes flotantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => ({
          id: i,
          size: Math.random() * 60 + 20,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: Math.random() * 4 + 3,
        })).map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full opacity-20 animate-float-dream"
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              background: `radial-gradient(circle, rgba(255, 224, 219, 0.8) 0%, rgba(241, 179, 190, 0.4) 50%, rgba(150, 117, 188, 0.2) 100%)`,
              filter: 'blur(1px)',
              animationDelay: `${orb.delay}s`,
              animationDuration: `${orb.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Alert Modal */}
      {showAlert && (
        <DreamAlert
          type={showAlert.type}
          title={showAlert.title}
          message={showAlert.message}
          detail={showAlert.detail}
          onClose={() => {
            setShowAlert(null);
            if (showAlert.type === 'success') {
              // Opcional: redirigir al login después de mostrar el success
              setTimeout(() => navigate('/login'), 1000);
            }
          }}
        />
      )}

      <div className={`max-w-md w-full transition-all duration-1000 ease-out relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full blur-2xl opacity-20 animate-breath-slow group-hover:opacity-40 transition-opacity duration-1000"></div>
            
            <Link to="/" className="relative">
              <div className="relative bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-3xl p-2 shadow-2xl group-hover:scale-105 transition-transform duration-500 w-32 h-32 flex items-center justify-center">
                <img 
                  src="/img/Oniria.svg" 
                  alt="Oniria Logo" 
                  className="w-28 h-28 object-contain drop-shadow-2xl filter" 
                  style={{ filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3)) drop-shadow(0 4px 8px rgba(150, 117, 188, 0.4))' }} 
                />
              </div>
            </Link>

            {/* Elementos decorativos */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffe0db] rounded-full animate-float-gentle opacity-80"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-[#f1b3be] rounded-full animate-float-gentle opacity-70" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent animate-dream-shimmer-slow">
            ¿Olvidaste tu llave secreta?
          </h1>
          <p className="text-lg text-[#ffe0db]/90 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            No te preocupes, te ayudamos a recuperar el acceso a tu mundo de sueños
          </p>
          <div className="flex items-center justify-center space-x-2 text-[#f1b3be]/80 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Shield className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Proceso seguro y privado</span>
            <Clock className="w-4 h-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Form Container */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 via-[#f1b3be]/10 to-[#ffe0db]/10 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-[#ffe0db]/90 via-white/85 to-[#f1b3be]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#f1b3be]/20 p-8">
            
            {/* Back Button */}
            <div className="mb-6 animate-slide-in-left">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-[#214d72] hover:text-[#9675bc] transition-colors duration-300 group/back"
              >
                <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Volver al login</span>
              </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Email Field */}
              <div className="group/field animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-3 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-[#9675bc]" />
                  Tu email de contacto *
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-xl blur-sm opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60 group-hover/field:text-[#9675bc] transition-colors duration-200 z-10" />
                  <input
                    {...register('email', { 
                      required: 'Tu email es requerido para recuperar la contraseña',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Por favor ingresa un email válido'
                      }
                    })}
                    type="email"
                    className="relative w-full pl-12 pr-4 py-4 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#9675bc]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                    placeholder="tu-email@ejemplo.com"
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-4 h-4 text-[#f1b3be]/60 animate-pulse" />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-in-down">
                    <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-xl p-4 border border-[#9675bc]/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-[#9675bc] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-[#252c3e]/80">
                    <p className="font-medium mb-1">¿Cómo funciona?</p>
                    <ul className="space-y-1 text-xs opacity-90">
                      <li>• Te enviaremos un enlace seguro a tu email</li>
                      <li>• El enlace es válido por solo 1 hora</li>
                      <li>• Solo funcionará una vez por seguridad</li>
                      <li>• Si no recibes el email, revisa spam</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-[#214d72] via-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:via-[#9675bc] hover:to-[#214d72] text-white font-bold py-5 px-8 rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-3xl text-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Enviando enlace mágico...</span>
                        <Moon className="w-5 h-5 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        <span>Enviar enlace de recuperación</span>
                        <Star className="w-5 h-5 animate-pulse" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-[#f1b3be]/20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center text-sm text-[#252c3e]/70">
                <p className="mb-3">¿Problemas para recuperar tu cuenta?</p>
                <div className="space-y-2">
                  <p className="text-xs">
                    Asegúrate de que el email sea el mismo con el que te registraste
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>Proceso Seguro</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#f1b3be]" />
                      <span>Válido 1 hora</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-[#9675bc]" />
                      <span>Soporte 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg border border-[#f1b3be]/20 p-4">
            <p className="text-xs text-[#252c3e]/70 mb-2">
              ¿Recordaste tu contraseña?{' '}
              <Link 
                to="/login" 
                className="text-[#9675bc] hover:text-[#214d72] transition-colors duration-200 font-medium underline underline-offset-2"
              >
                Iniciar sesión
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4 text-[#252c3e]/60">
              <div className="flex items-center space-x-1">
                <Moon className="w-3 h-3 animate-pulse" />
                <span className="text-xs">Noctiria 2025</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-[#f1b3be] animate-pulse" />
                <span className="text-xs">Hecho con magia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes float-dream {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-15px) translateX(10px) rotate(120deg); }
          66% { transform: translateY(10px) translateX(-10px) rotate(240deg); }
        }
        
        @keyframes breath-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        
        @keyframes dream-shimmer-slow {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }
        
        @keyframes shake-x {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes check-in {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-in-left {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          0% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-down {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-in-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-float-dream { animation: float-dream 6s ease-in-out infinite; }
        .animate-breath-slow { animation: breath-slow 6s ease-in-out infinite; }
        .animate-dream-shimmer-slow { 
          background-size: 200% auto;
          animation: dream-shimmer-slow 12s linear infinite; 
        }
        .animate-float-gentle { animation: float-gentle 4s ease-in-out infinite; }
        .animate-shake-x { animation: shake-x 0.5s ease-in-out; }
        .animate-check-in { animation: check-in 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-slide-in-left { 
          animation: slide-in-left 0.6s ease-out forwards; 
          opacity: 0; 
        }
        .animate-slide-in-right { 
          animation: slide-in-right 0.6s ease-out forwards; 
          opacity: 0; 
        }
        .animate-slide-in-down { animation: slide-in-down 0.3s ease-out; }
        .animate-slide-in-up { 
          animation: slide-in-up 0.6s ease-out forwards; 
          opacity: 0; 
        }
        .animate-fade-in-up { 
          animation: fade-in-up 0.6s ease-out forwards; 
          opacity: 0; 
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;