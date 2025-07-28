import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Moon, Shield, LogIn as LoginIcon, Sparkles, Star, Heart } from 'lucide-react';

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  access?: string;
  refresh?: string;
  token?: string;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    is_psychologist: boolean;
    description?: string;
    profile_pic?: string;
  };
}

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

const DreamOrbs: React.FC = () => {
  const orbs = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
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
  );
};

const MorphingClouds: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div 
        className="absolute w-80 h-80 opacity-10 animate-morph-slow"
        style={{
          top: '5%',
          left: '10%',
          background: 'radial-gradient(ellipse, rgba(150, 117, 188, 0.6) 0%, rgba(241, 179, 190, 0.3) 50%, transparent 100%)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(2px)',
        }}
      />
      <div 
        className="absolute w-96 h-96 opacity-12 animate-morph-slow"
        style={{
          top: '50%',
          right: '5%',
          background: 'radial-gradient(ellipse, rgba(255, 224, 219, 0.5) 0%, rgba(241, 179, 190, 0.4) 50%, transparent 100%)',
          borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
          filter: 'blur(2px)',
          animationDelay: '2s',
        }}
      />
    </div>
  );
};

const EnhancedBackgroundEffects: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div 
        className="absolute w-32 h-32 opacity-5 animate-float-hexagon"
        style={{
          top: '20%',
          left: '85%',
          background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.3) 0%, rgba(67, 56, 202, 0.2) 50%, rgba(147, 51, 234, 0.1) 100%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          filter: 'blur(1px)',
        }}
      />
      
      <div 
        className="absolute w-24 h-24 opacity-6 animate-spin-slow"
        style={{
          top: '70%',
          left: '10%',
          background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.1) 100%)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          filter: 'blur(2px)',
          animationDelay: '3s',
        }}
      />
      
      <div 
        className="absolute w-40 h-40 opacity-3 animate-pulse-ring"
        style={{
          bottom: '15%',
          right: '30%',
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 30%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
};

const DreamAlert: React.FC<{ type: 'success' | 'error'; message: string; title: string; onClose: () => void }> = ({ 
  type, message, title, onClose 
}) => {
  const handleClose = () => {
    onClose();
    if (type === 'success') {
      window.location.href = '/';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="relative max-w-md w-full mx-4">
        <TwinklingStars count={15} className="rounded-2xl" />
        <div className={`relative bg-gradient-to-br backdrop-blur-xl rounded-2xl shadow-2xl border p-6 animate-scale-in ${
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
              <h3 className={`font-bold text-lg mb-2 ${
                type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {title}
              </h3>
              <p className={`text-sm whitespace-pre-line ${
                type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={handleClose}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                type === 'success'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              } hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
            >
              {type === 'success' ? 'Continuar' : 'Entendido'}
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

const LogIn: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const [showAlert, setShowAlert] = useState<{ 
    type: 'success' | 'error'; 
    message: string; 
    title: string; 
    userData?: { username: string; profile_pic?: string; }; 
  } | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const API_LOGIN_URL = 'http://127.0.0.1:8000/auth/jwt/create';
  const API_USER_URL = 'http://127.0.0.1:8000/api/users/me'; // Endpoint para obtener datos del usuario

  const {
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const loginUser = async (loginData: LoginData) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.access) {
          localStorage.setItem('authToken', data.access);
          localStorage.setItem('accessToken', data.access);
        }
        
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
        
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        return data;
      } else {
        const errorMessage = data.non_field_errors?.[0] || 
                           data.detail || 
                           data.message ||
                           Object.values(data).flat().join(', ') ||
                           'Credenciales incorrectas';
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginData) => {
    setError('');
    setSuccess('');
    
    try {
      const result = await loginUser(data);
      setShowAlert({
        type: 'success',
        title: '¡Bienvenido de vuelta!',
        message: `Hola de nuevo, soñador. Tu sesión ha sido iniciada exitosamente.\n\nTus sueños te esperan en Noctiria...`
      });
      reset();
      
    } catch (err) {
      console.error('Error de login:', err);
      setShowAlert({
        type: 'error',
        title: 'Error de acceso',
        message: err instanceof Error ? err.message : 'Ha ocurrido un error inesperado durante el login. Por favor intenta nuevamente.'
      });
    }
  };

  const handleForgotPassword = () => {
    setShowAlert({
      type: 'error',
      title: 'Recuperación de contraseña',
      message: 'La funcionalidad de recuperación de contraseña estará disponible próximamente.\n\n¿Necesitas ayuda? Contacta con nuestro equipo de soporte.'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <TwinklingStars count={35} />
      <DreamOrbs />
      <MorphingClouds />
      <EnhancedBackgroundEffects />
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9675bc]/3 to-transparent animate-dream-veil"></div>

      {/* Alert Modal */}
      {showAlert && (
        <DreamAlert
          type={showAlert.type}
          title={showAlert.title}
          message={showAlert.message}
          onClose={() => setShowAlert(null)}
        />
      )}

      <div className={`max-w-xl w-full transition-all duration-1000 ease-out relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full blur-2xl opacity-15 animate-breath-slow group-hover:opacity-30 transition-opacity duration-1000"></div>
            <div className="absolute inset-3 bg-gradient-to-r from-[#f1b3be] via-[#ffe0db] to-[#9675bc] rounded-full blur-xl opacity-25 animate-breath-slow group-hover:opacity-40 transition-opacity duration-1000" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-3xl p-2 shadow-2xl group-hover:scale-105 transition-transform duration-500 w-32 h-32 flex items-center justify-center">
              <img src='/img/Oniria.svg' alt="Oniria Logo" className="w-28 h-28 object-contain drop-shadow-2xl filter" style={{ filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3)) drop-shadow(0 4px 8px rgba(150, 117, 188, 0.4))' }} />
            </div>
            
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#ffe0db] rounded-full animate-float-gentle opacity-80"></div>
            <div className="absolute -bottom-3 -left-3 w-2 h-2 bg-[#f1b3be] rounded-full animate-float-gentle opacity-70" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-[#9675bc] rounded-full animate-float-gentle opacity-60" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent animate-dream-shimmer-slow">
            Bienvenido de vuelta
          </h1>
          <p className="text-xl text-[#ffe0db]/90 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Regresa a tu mundo de sueños en Noctiria
          </p>
          <div className="flex items-center justify-center space-x-2 text-[#f1b3be]/80 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Moon className="w-5 h-5 animate-pulse" />
            <span className="text-sm">Tus sueños te esperan</span>
            <Star className="w-4 h-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        <div className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 via-[#f1b3be]/10 to-[#ffe0db]/10 rounded-3xl blur-xl transition-all duration-500 ${
            focusedField ? 'opacity-80 scale-105' : 'opacity-40'
          }`}></div>
          
          <div className="relative bg-gradient-to-br from-[#ffe0db]/85 via-white/80 to-[#f1b3be]/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#f1b3be]/20 p-8 group-hover:shadow-3xl transition-shadow duration-500">
            
            <div className="space-y-6">
              
              <div className="group/field animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center transition-all duration-300 group-hover/field:text-[#214d72]">
                  <User className="w-4 h-4 mr-2 text-[#9675bc] transition-colors duration-200" />
                  Tu nombre de soñador *
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-xl blur-sm opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60 group-hover/field:text-[#9675bc] transition-colors duration-200 z-10" />
                  <input
                    {...registerField('username', { 
                      required: 'Tu nombre de soñador es requerido',
                      minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                    })}
                    type="text"
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField('')}
                    className="relative w-full pl-12 pr-4 py-4 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#9675bc]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                    placeholder="Ingresa tu nombre de soñador"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-4 h-4 text-[#f1b3be]/60 animate-pulse" />
                  </div>
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-in-down">
                    <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="group/field animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center transition-all duration-300 group-hover/field:text-[#214d72]">
                  <Lock className="w-4 h-4 mr-2 text-[#214d72] transition-colors duration-200" />
                  Tu llave secreta *
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#214d72]/10 to-[#9675bc]/10 rounded-xl blur-sm opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#214d72]/60 group-hover/field:text-[#214d72] transition-colors duration-200 z-10" />
                  <input
                    {...registerField('password', { 
                      required: 'Tu llave secreta es requerida para acceder'
                    })}
                    type={showPassword ? "text" : "password"}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="relative w-full pl-12 pr-16 py-4 border-2 border-[#214d72]/20 rounded-xl focus:ring-2 focus:ring-[#214d72]/40 focus:border-[#214d72] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#214d72]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                    placeholder="Ingresa tu llave mágica"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#214d72]/60 hover:text-[#214d72] transition-colors duration-200 p-1 rounded-full hover:bg-[#214d72]/10 cursor-pointer z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-in-down">
                    <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center group/check">
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-5 w-5 text-[#9675bc] focus:ring-[#9675bc]/40 border-[#9675bc]/30 rounded transition-all duration-200 cursor-pointer"
                    />
                    {rememberMe && (
                      <CheckCircle className="absolute inset-0 w-5 h-5 text-[#9675bc] animate-check-in pointer-events-none" />
                    )}
                  </div>
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-[#252c3e]/80 group-hover/check:text-[#252c3e] transition-colors cursor-pointer">
                    Recordar mi sesión onírica
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="group/forgot font-medium text-[#9675bc] hover:text-[#214d72] transition-all duration-300 relative cursor-pointer"
                  >
                    <span className="relative z-10">¿Olvidaste tu llave?</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9675bc] to-[#214d72] group-hover/forgot:w-full transition-all duration-300"></div>
                    <Moon className="inline w-3 h-3 ml-1 opacity-0 group-hover/forgot:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>

              <div className="pt-4 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-[#214d72] via-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:via-[#9675bc] hover:to-[#214d72] text-white font-bold py-5 px-8 rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-3xl text-lg cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Conectando con tus sueños...</span>
                        <Moon className="w-5 h-5 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <LoginIcon className="w-6 h-6" />
                        <span>Entrar a mi mundo onírico</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </button>
                
                <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-[#252c3e]/70">
                  <div className="flex items-center space-x-1 group/trust hover:scale-105 transition-transform duration-200">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Conexión Segura</span>
                  </div>
                  <div className="flex items-center space-x-1 group/trust hover:scale-105 transition-transform duration-200">
                    <Lock className="w-4 h-4 text-[#f1b3be]" />
                    <span>Datos Protegidos</span>
                  </div>
                  <div className="flex items-center space-x-1 group/trust hover:scale-105 transition-transform duration-200">
                    <Heart className="w-4 h-4 text-[#9675bc]" />
                    <span>Bienvenido a Casa</span>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-transparent via-[#f1b3be]/30 to-transparent" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(241, 179, 190, 0.3) 50%, transparent 100%)',
                    height: '1px'
                  }} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-r from-white/80 via-white/90 to-white/80 text-[#252c3e]/60 rounded-full backdrop-blur-sm border border-[#f1b3be]/20">
                    o descubre Noctiria
                  </span>
                </div>
              </div>

              <div className="animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                <button
                  type="button"
                  onClick={() => window.location.href = '/signup'}
                  className="group/signup relative w-full overflow-hidden bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-sm border-2 border-[#9675bc]/20 hover:border-[#9675bc]/40 text-[#252c3e] font-medium py-4 px-8 rounded-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/5 via-[#f1b3be]/5 to-[#ffe0db]/5 opacity-0 group-hover/signup:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center shadow-md group-hover/signup:scale-110 transition-transform duration-300">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold">Crear mi primera cuenta de sueños</span>
                    <Sparkles className="w-5 h-5 text-[#9675bc] group-hover/signup:text-[#f1b3be] transition-colors duration-300" />
                  </div>
                  
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center opacity-0 group-hover/signup:opacity-100 transition-opacity duration-300 animate-pulse">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </button>
              </div>

              <div className="text-center pt-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <div className="relative inline-block group/support">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-lg blur-sm opacity-0 group-hover/support:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white/40 backdrop-blur-sm px-6 py-3 rounded-lg border border-[#f1b3be]/20">
                    <p className="text-sm text-[#252c3e]/80">
                      ¿Problemas para acceder a tu mundo de sueños?{' '}
                      <button
                        type="button"
                        onClick={() => setShowAlert({
                          type: 'error',
                          title: 'Soporte de Noctiria',
                          message: 'Nuestro equipo de guías oníricas está aquí para ayudarte.\n\nContacta con nosotros y te ayudaremos a recuperar el acceso a tu mundo de sueños.'
                        })}
                        className="group/link font-semibold text-[#9675bc] hover:text-[#214d72] transition-all duration-300 relative cursor-pointer"
                      >
                        <span className="relative z-10">Contacta con nuestros guías</span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9675bc] to-[#214d72] group-hover/link:w-full transition-all duration-300"></div>
                        <Shield className="inline w-3 h-3 ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1b3be]/20 to-transparent rounded-lg blur-sm opacity-60"></div>
            <div className="relative bg-white/30 backdrop-blur-md rounded-lg border border-[#f1b3be]/20 p-4">
              <div className="text-center text-xs text-[#252c3e]/70">
                <p className="mb-2 flex items-center justify-center space-x-2">
                  <Lock className="w-3 h-3 text-[#9675bc]" />
                  <span>Al iniciar sesión, confirmas que aceptas nuestros</span>
                </p>
                <div className="space-x-1 flex items-center justify-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowAlert({
                      type: 'error',
                      title: 'Términos de Servicio',
                      message: 'Los términos de servicio de Noctiria están diseñados para proteger tu experiencia onírica.\n\nEsta funcionalidad estará disponible próximamente.'
                    })}
                    className="text-[#9675bc] hover:text-[#214d72] transition-colors duration-200 underline decoration-dotted underline-offset-2"
                  >
                    Términos de Servicio
                  </button>
                  <span>y</span>
                  <button
                    type="button"
                    onClick={() => setShowAlert({
                      type: 'error',
                      title: 'Política de Privacidad',
                      message: 'Tu privacidad y la seguridad de tus sueños son nuestra prioridad.\n\nEsta funcionalidad estará disponible próximamente.'
                    })}
                    className="text-[#9675bc] hover:text-[#214d72] transition-colors duration-200 underline decoration-dotted underline-offset-2"
                  >
                    Política de Privacidad
                  </button>
                </div>
                <div className="flex items-center justify-center mt-3 space-x-4 text-[#252c3e]/60">
                  <div className="flex items-center space-x-1">
                    <Moon className="w-3 h-3 animate-pulse" />
                    <span>Noctiria 2024</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-[#f1b3be] animate-pulse" />
                    <span>Hecho con magia</span>
                  </div>
                </div>
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
        
        @keyframes morph-slow {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 40% 60% 70% 30% / 50% 60% 30% 60%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          75% { border-radius: 70% 30% 40% 60% / 40% 70% 60% 30%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        
        @keyframes breath-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        
        @keyframes dream-shimmer-slow {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes dream-veil {
          0%, 100% { opacity: 0.05; transform: translateY(0px); }
          50% { opacity: 0.15; transform: translateY(-10px); }
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

        @keyframes float-hexagon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.1; }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-float-dream {
          animation: float-dream 6s ease-in-out infinite;
        }
        
        .animate-morph-slow {
          animation: morph-slow 12s ease-in-out infinite;
        }
        
        .animate-breath-slow {
          animation: breath-slow 6s ease-in-out infinite;
        }
        
        .animate-dream-shimmer-slow {
          background-size: 200% auto;
          animation: dream-shimmer-slow 12s linear infinite;
        }
        
        .animate-dream-veil {
          animation: dream-veil 8s ease-in-out infinite;
        }
        
        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
        
        .animate-shake-x {
          animation: shake-x 0.5s ease-in-out;
        }
        
        .animate-check-in {
          animation: check-in 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in-down {
          animation: slide-in-down 0.3s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-float-hexagon {
          animation: float-hexagon 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LogIn;