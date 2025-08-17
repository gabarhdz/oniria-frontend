// src/Pages/ResetPassword/ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Key, 
  Shield, 
  Clock,
  ArrowLeft,
  Moon,
  Star,
  Heart,
  Sparkles,
  Timer
} from 'lucide-react';
import axios from 'axios';

interface ResetPasswordData {
  new_password: string;
  confirm_password: string;
}

interface TokenValidation {
  valid: boolean;
  message: string;
  detail: string;
  username?: string;
  expires_at?: string;
  expired?: boolean;
}

interface ResetResponse {
  message: string;
  detail: string;
  success: boolean;
  username?: string;
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
  type: 'success' | 'error' | 'warning'; 
  message: string; 
  title: string; 
  detail?: string;
  onClose: () => void 
}> = ({ type, message, title, detail, onClose }) => {
  const colors = {
    success: {
      bg: 'from-green-50/95 via-white/90 to-[#ffe0db]/95 border-green-200/50',
      text: 'text-green-800',
      textSecondary: 'text-green-700',
      textDetail: 'text-green-600',
      button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      icon: 'text-green-500'
    },
    error: {
      bg: 'from-red-50/95 via-white/90 to-[#ffe0db]/95 border-red-200/50',
      text: 'text-red-800',
      textSecondary: 'text-red-700',
      textDetail: 'text-red-600',
      button: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      icon: 'text-red-500'
    },
    warning: {
      bg: 'from-yellow-50/95 via-white/90 to-[#ffe0db]/95 border-yellow-200/50',
      text: 'text-yellow-800',
      textSecondary: 'text-yellow-700',
      textDetail: 'text-yellow-600',
      button: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      icon: 'text-yellow-500'
    }
  };

  const colorSet = colors[type];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="relative max-w-lg w-full mx-4">
        <TwinklingStars count={15} className="rounded-2xl" />
        <div className={`relative bg-gradient-to-br backdrop-blur-xl rounded-2xl shadow-2xl border p-8 animate-scale-in ${colorSet.bg}`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${type === 'success' ? 'animate-check-in' : 'animate-shake-x'}`}>
              {type === 'success' ? (
                <CheckCircle className={`w-8 h-8 ${colorSet.icon}`} />
              ) : type === 'warning' ? (
                <Timer className={`w-8 h-8 ${colorSet.icon}`} />
              ) : (
                <AlertCircle className={`w-8 h-8 ${colorSet.icon}`} />
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className={`font-bold text-xl mb-3 ${colorSet.text}`}>
                {title}
              </h3>
              <p className={`text-base whitespace-pre-line mb-2 ${colorSet.textSecondary}`}>
                {message}
              </p>
              {detail && (
                <p className={`text-sm whitespace-pre-line opacity-80 ${colorSet.textDetail}`}>
                  {detail}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${colorSet.button}`}
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

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:\'",.<>\/?]/.test(password);
  const hasMinLength = password.length >= 12;

  const checks = [
    { label: '12 caracteres mínimo', met: hasMinLength, icon: '📏' },
    { label: '1 letra mayúscula', met: hasUpperCase, icon: '🔤' },
    { label: '1 número', met: hasNumber, icon: '🔢' },
    { label: '1 carácter especial', met: hasSpecialChar, icon: '🔣' },
  ];

  const strength = checks.filter(check => check.met).length;
  const strengthColors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200'];
  const strengthLabels = ['Débil', 'Regular', 'Buena', 'Excelente'];

  return (
    <div className="mt-3 p-3 bg-white/50 rounded-lg border border-[#f1b3be]/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#252c3e]">Seguridad de la contraseña:</span>
        <span className={`text-xs font-bold ${
          strength === 4 ? 'text-green-600' : 
          strength === 3 ? 'text-yellow-600' : 
          strength >= 1 ? 'text-orange-600' : 'text-red-600'
        }`}>
          {strengthLabels[strength - 1] || 'Muy débil'}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength - 1] || 'bg-gray-200'}`}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        {checks.map((check, index) => (
          <div key={index} className={`flex items-center space-x-1 ${check.met ? 'text-green-600' : 'text-gray-500'}`}>
            <span>{check.icon}</span>
            <span className={check.met ? 'line-through' : ''}>{check.label}</span>
            {check.met && <CheckCircle className="w-3 h-3 text-green-500" />}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<TokenValidation | null>(null);
  const [showAlert, setShowAlert] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    title: string;
    detail?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordData>();

  const watchPassword = watch('new_password', '');

  // Validar token al cargar el componente
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setShowAlert({
          type: 'error',
          title: 'Token no válido',
          message: 'No se proporcionó un token de recuperación válido.',
          detail: 'Por favor solicita un nuevo enlace de recuperación.'
        });
        setIsValidating(false);
        return;
      }

      try {
        const response = await axios.get<TokenValidation>(
          `http://127.0.0.1:8000/api/users/password-reset/validate/${token}/`
        );

        setTokenValid(response.data);
        setIsValidating(false);
        setIsVisible(true);

      } catch (error) {
        console.error('Error validating token:', error);
        
        if (axios.isAxiosError(error) && error.response) {
          const errorData = error.response.data;
          
          if (errorData.expired) {
            setShowAlert({
              type: 'warning',
              title: '⏰ Enlace expirado',
              message: errorData.message,
              detail: errorData.detail
            });
          } else {
            setShowAlert({
              type: 'error',
              title: '🔒 Enlace inválido',
              message: errorData.message,
              detail: errorData.detail
            });
          }
        } else {
          setShowAlert({
            type: 'error',
            title: 'Error de conexión',
            message: 'No se pudo verificar el enlace de recuperación.',
            detail: 'Por favor verifica tu conexión e intenta nuevamente.'
          });
        }
        
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await axios.post<ResetResponse>(
        'http://127.0.0.1:8000/api/users/password-reset/confirm/',
        {
          token,
          new_password: data.new_password,
          confirm_password: data.confirm_password
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setShowAlert({
        type: 'success',
        title: '🎉 ¡Contraseña actualizada!',
        message: response.data.message,
        detail: response.data.detail
      });

    } catch (error) {
      console.error('Error resetting password:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        let errorMessage = errorData.message || 'Hubo un error al cambiar la contraseña.';
        let errorDetail = errorData.detail || 'Por favor intenta nuevamente.';

        // Manejar errores específicos
        if (errorData.errors) {
          const errors = errorData.errors;
          if (errors.token) {
            errorMessage = Array.isArray(errors.token) ? errors.token[0] : errors.token;
          } else if (errors.new_password) {
            errorMessage = Array.isArray(errors.new_password) ? errors.new_password[0] : errors.new_password;
          } else if (errors.confirm_password) {
            errorMessage = Array.isArray(errors.confirm_password) ? errors.confirm_password[0] : errors.confirm_password;
          }
        }

        setShowAlert({
          type: 'error',
          title: 'Error al cambiar contraseña',
          message: errorMessage,
          detail: errorDetail
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

  // Pantalla de carga mientras se valida el token
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Key className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#ffe0db] mb-2">
            Verificando enlace de recuperación...
          </h2>
          <p className="text-[#ffe0db]/70">
            Validando tu llave secreta mágica
          </p>
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
    );
  }

  // Si el token no es válido, mostrar solo el modal de error
  if (!tokenValid?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center relative overflow-hidden">
        <TwinklingStars count={35} />
        
        {showAlert && (
          <DreamAlert
            type={showAlert.type}
            title={showAlert.title}
            message={showAlert.message}
            detail={showAlert.detail}
            onClose={() => navigate('/forgot-password')}
          />
        )}
        
        <div className="text-center text-[#ffe0db] space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Enlace no válido</h1>
          <p className="text-xl max-w-md mx-auto">
            Este enlace de recuperación no es válido o ha expirado
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Solicitar nuevo enlace</span>
          </Link>
        </div>
      </div>
    );
  }

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
              navigate('/login');
            }
          }}
        />
      )}

      <div className={`max-w-lg w-full transition-all duration-1000 ease-out relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full blur-2xl opacity-20 animate-breath-slow group-hover:opacity-40 transition-opacity duration-1000"></div>
            
            <Link to="/" className="relative">
              <div className="relative bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-3xl p-2 shadow-2xl group-hover:scale-105 transition-transform duration-500 w-32 h-32 flex items-center justify-center">
                <Key className="w-20 h-20 text-white drop-shadow-2xl" />
              </div>
            </Link>

            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffe0db] rounded-full animate-float-gentle opacity-80"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-[#f1b3be] rounded-full animate-float-gentle opacity-70" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent animate-dream-shimmer-slow">
            Crea tu nueva llave secreta
          </h1>
          <p className="text-lg text-[#ffe0db]/90 mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Hola <span className="font-semibold text-[#f1b3be]">{tokenValid.username}</span>
          </p>
          <p className="text-sm text-[#ffe0db]/70 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Tu nueva contraseña te permitirá acceder a Noctiria de forma segura
          </p>
          <div className="flex items-center justify-center space-x-2 text-[#f1b3be]/80 mt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Shield className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Proceso seguro y encriptado</span>
            <Clock className="w-4 h-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Form Container */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 via-[#f1b3be]/10 to-[#ffe0db]/10 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          
          <div className="relative bg-gradient-to-br from-[#ffe0db]/90 via-white/85 to-[#f1b3be]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#f1b3be]/20 p-8">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* New Password Field */}
              <div className="group/field animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-3 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-[#9675bc]" />
                  Nueva contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60 group-hover/field:text-[#9675bc] transition-colors duration-200 z-10" />
                  <input
                    {...register('new_password', { 
                      required: 'La nueva contraseña es requerida',
                      minLength: { value: 12, message: 'Mínimo 12 caracteres' },
                      pattern: {
                        value: /^(?=(.*[A-Z]){1,})(?=(.*\d){1,})(?=(.*[!@#$%^&*()_+\-=\[\]{}|;:\'",.<>\/?]){1,}).{12,}$/,
                        message: 'Debe tener al menos 12 caracteres, 1 mayúscula, 1 número y un carácter especial'
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    className="relative w-full pl-12 pr-16 py-4 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#9675bc]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                    placeholder="Ingresa tu nueva contraseña mágica"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9675bc]/60 hover:text-[#9675bc] transition-colors duration-200 p-1 rounded-full hover:bg-[#9675bc]/10 z-10"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-in-down">
                    <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                    {errors.new_password.message}
                  </p>
                )}
                
                {/* Password Strength Indicator */}
                {watchPassword && <PasswordStrengthIndicator password={watchPassword} />}
              </div>

              {/* Confirm Password Field */}
              <div className="group/field animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-3 flex items-center">
                  <Key className="w-4 h-4 mr-2 text-[#214d72]" />
                  Confirmar nueva contraseña *
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#214d72]/60 group-hover/field:text-[#214d72] transition-colors duration-200 z-10" />
                  <input
                    {...register('confirm_password', { 
                      required: 'Debes confirmar tu nueva contraseña',
                      validate: (value) => value === watchPassword || 'Las contraseñas no coinciden'
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="relative w-full pl-12 pr-16 py-4 border-2 border-[#214d72]/20 rounded-xl focus:ring-2 focus:ring-[#214d72]/40 focus:border-[#214d72] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#214d72]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                    placeholder="Repite tu nueva contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#214d72]/60 hover:text-[#214d72] transition-colors duration-200 p-1 rounded-full hover:bg-[#214d72]/10 z-10"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-in-down">
                    <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              {/* Security Info */}
              <div className="bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-xl p-4 border border-[#9675bc]/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-[#9675bc] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-[#252c3e]/80">
                    <p className="font-medium mb-2">🛡️ Recomendaciones de seguridad:</p>
                    <ul className="space-y-1 text-xs opacity-90">
                      <li>• Usa una contraseña única que no uses en otros sitios</li>
                      <li>• Combina letras, números y símbolos de forma creativa</li>
                      <li>• Evita información personal como nombres o fechas</li>
                      <li>• Guárdala en un lugar seguro</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
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
                        <span>Actualizando tu llave secreta...</span>
                        <Moon className="w-5 h-5 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <Key className="w-6 h-6" />
                        <span>Cambiar mi contraseña</span>
                        <Star className="w-5 h-5 animate-pulse" />
                      </>
                    )}
                  </div>
                </button>
                
                <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-[#252c3e]/70">
                  <div className="flex items-center space-x-1 group/trust hover:scale-105 transition-transform duration-200">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Encriptación Segura</span>
                  </div>
                  <div className="flex items-center space-x-1 group/trust hover:scale-105 transition-transform duration-200">
                    <Lock className="w-4 h-4 text-[#f1b3be]" />
                    <span>Datos Protegidos</span>
                  </div>
                  <div className="flex items-center space-x-1 group/trust hover:scale-105 transition-transform duration-200">
                    <Heart className="w-4 h-4 text-[#9675bc]" />
                    <span>Proceso Seguro</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-[#f1b3be]/20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-center text-sm text-[#252c3e]/70">
                <p className="mb-3">Una vez cambiada tu contraseña:</p>
                <div className="space-y-2">
                  <p className="text-xs flex items-center justify-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Podrás iniciar sesión inmediatamente</span>
                  </p>
                  <p className="text-xs flex items-center justify-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Tu cuenta estará completamente segura</span>
                  </p>
                  <p className="text-xs flex items-center justify-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Este enlace se desactivará automáticamente</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg border border-[#f1b3be]/20 p-4">
            <p className="text-xs text-[#252c3e]/70 mb-2">
              ¿Ya recordaste tu contraseña anterior?{' '}
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

export default ResetPassword;