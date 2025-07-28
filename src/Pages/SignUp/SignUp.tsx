import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Moon, Shield, UserPlus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';


interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  description?: string;
  profile_pic?: File;
  is_psychologist?: boolean;
}

interface User {
  url: string;
  id: string;
  username: string;
  email: string;
  SleepState: any;
  is_psychologist: boolean;
  description?: string;
  profile_pic?: string;
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
  const orbs = Array.from({ length: 8 }, (_, i) => ({
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
        className="absolute w-96 h-96 opacity-10 animate-morph-slow"
        style={{
          top: '10%',
          left: '5%',
          background: 'radial-gradient(ellipse, rgba(150, 117, 188, 0.6) 0%, rgba(241, 179, 190, 0.3) 50%, transparent 100%)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(2px)',
        }}
      />
      <div 
        className="absolute w-80 h-80 opacity-15 animate-morph-slow"
        style={{
          top: '60%',
          right: '10%',
          background: 'radial-gradient(ellipse, rgba(255, 224, 219, 0.5) 0%, rgba(241, 179, 190, 0.4) 50%, transparent 100%)',
          borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
          filter: 'blur(2px)',
          animationDelay: '2s',
        }}
      />
      <div 
        className="absolute w-72 h-72 opacity-12 animate-morph-slow"
        style={{
          bottom: '5%',
          left: '20%',
          background: 'radial-gradient(ellipse, rgba(150, 117, 188, 0.4) 0%, rgba(255, 224, 219, 0.3) 50%, transparent 100%)',
          borderRadius: '40% 60% 60% 40% / 60% 30% 40% 70%',
          filter: 'blur(3px)',
          animationDelay: '4s',
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
          top: '15%',
          left: '80%',
          background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.3) 0%, rgba(67, 56, 202, 0.2) 50%, rgba(147, 51, 234, 0.1) 100%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          filter: 'blur(1px)',
        }}
      />
      
      <div 
        className="absolute w-24 h-24 opacity-6 animate-spin-slow"
        style={{
          top: '75%',
          left: '15%',
          background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.1) 100%)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          filter: 'blur(2px)',
          animationDelay: '3s',
        }}
      />
      
      <div 
        className="absolute w-64 h-16 opacity-4 animate-wave-gentle"
        style={{
          top: '40%',
          right: '5%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 30%, rgba(34, 197, 94, 0.08) 70%, transparent 100%)',
          borderRadius: '50px',
          filter: 'blur(3px)',
        }}
      />
      
      <div 
        className="absolute w-40 h-40 opacity-3 animate-pulse-ring"
        style={{
          bottom: '20%',
          right: '25%',
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 30%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(2px)',
        }}
      />
      
      <div 
        className="absolute w-28 h-28 opacity-4 animate-spiral-slow"
        style={{
          top: '25%',
          left: '25%',
          background: 'conic-gradient(from 0deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 191, 36, 0.05) 50%, transparent 100%)',
          borderRadius: '50%',
          filter: 'blur(2px)',
          animationDelay: '2s',
        }}
      />
      
      <div 
        className="absolute w-56 h-1 opacity-3 animate-energy-flow"
        style={{
          top: '60%',
          left: '40%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.2) 20%, rgba(5, 150, 105, 0.3) 50%, rgba(16, 185, 129, 0.2) 80%, transparent 100%)',
          borderRadius: '10px',
          filter: 'blur(1px)',
          transform: 'rotate(15deg)',
        }}
      />
    </div>
  );
};

// Componente de alerta personalizada
const DreamAlert: React.FC<{ type: 'success' | 'error'; message: string; title: string; onClose: () => void }> = ({ 
  type, message, title, onClose 
}) => {
  const handleClose = () => {
    onClose();
    if (type === 'success') {
      window.location.href = '/login';
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
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SignUp: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const [showAlert, setShowAlert] = useState<{ type: 'success' | 'error'; message: string; title: string } | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:8000/api/users'; 

  const {
    register: registerField,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch('password');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const registerUser = async (registerData: RegisterData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      formData.append('username', registerData.username);
      formData.append('email', registerData.email);
      formData.append('password', registerData.password);
      
      if (registerData.description && registerData.description.trim()) {
        formData.append('description', registerData.description);
      }
      
      if (registerData.profile_pic) {
        formData.append('profile_pic', registerData.profile_pic);
      }
      
      formData.append('is_psychologist', 'false');

      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        // Manejo específico para diferentes tipos de errores
        if (response.status === 400 && data) {
          let errorMessage = '';
          
          // Verificar si es un error de email duplicado
          if (data.email && Array.isArray(data.email)) {
            const emailErrors = data.email;
            if (emailErrors.some((err: any) => 
              String(err).includes('already exists') || 
              String(err).includes('ya existe') || 
              String(err).includes('unique')
            )) {
              errorMessage = '💫 Este email ya pertenece a otro soñador en Noctiria.\n\n¿Ya tienes una cuenta? Intenta iniciar sesión o usa un email diferente para comenzar tu nueva aventura onírica.';
            } else {
              errorMessage = `Email: ${emailErrors.join(', ')}`;
            }
          }
          
          // Verificar si es un error de username duplicado
          if (data.username && Array.isArray(data.username)) {
            const usernameErrors = data.username;
            if (usernameErrors.some((err: any) => 
              String(err).includes('already exists') || 
              String(err).includes('ya existe') || 
              String(err).includes('unique')
            )) {
              errorMessage += (errorMessage ? '\n\n' : '') + '🌙 Este nombre de soñador ya está en uso.\n\nElige un nombre único para tu identidad en el mundo de los sueños.';
            } else {
              errorMessage += (errorMessage ? '\n\n' : '') + `Usuario: ${usernameErrors.join(', ')}`;
            }
          }
          
          // Manejar otros errores de campos
          if (data.password && Array.isArray(data.password)) {
            errorMessage += (errorMessage ? '\n\n' : '') + `Contraseña: ${data.password.join(', ')}`;
          }
          
          // Si no hay errores específicos, mostrar mensaje genérico
          if (!errorMessage) {
            errorMessage = Object.entries(data)
              .map(([key, value]) => {
                const fieldName = key === 'password' ? 'Contraseña' : 
                                 key === 'username' ? 'Usuario' :
                                 key === 'email' ? 'Email' : key;
                return `${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}`;
              })
              .join('\n');
          }
          
          throw new Error(errorMessage || 'Error en el registro');
        } else {
          throw new Error('Error inesperado en el servidor. Por favor intenta nuevamente.');
        }
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

  const onSubmit = async (data: RegisterData) => {
    setError('');
    setSuccess('');
    
    if (data.password !== data.password_confirm) {
      setShowAlert({
        type: 'error',
        title: 'Error en la validación',
        message: 'Las contraseñas no coinciden. Por favor verifica que ambas contraseñas sean idénticas.'
      });
      return;
    }

    const submitData = {
      ...data,
      profile_pic: selectedFile || undefined,
    };
    
    try {
      const result = await registerUser(submitData);
      setShowAlert({
        type: 'success',
        title: '¡Bienvenido a Noctiria!',
        message: `¡Hola ${result.username}! Tu cuenta ha sido creada exitosamente. Haz clic en "Continuar" para ir al login y comenzar tu viaje onírico.`
      });
      reset();
      setSelectedFile(null);
    } catch (err) {
      console.error('Error de registro:', err); 
      setShowAlert({
        type: 'error',
        title: 'Error en el registro',
        message: err instanceof Error ? err.message : 'Ha ocurrido un error inesperado durante el registro. Por favor intenta nuevamente.'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        setShowAlert({
          type: 'error',
          title: 'Formato de archivo inválido',
          message: 'Por favor selecciona un archivo de imagen válido (PNG, JPG, JPEG, etc.)'
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setShowAlert({
          type: 'error',
          title: 'Archivo demasiado grande',
          message: 'El archivo seleccionado excede el límite de 5MB. Por favor selecciona una imagen más pequeña.'
        });
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const validatePasswordStrength = (password: string) => {
    const requirements = [
      { test: password.length >= 12, text: 'Mínimo 12 caracteres' },
      { test: /[A-Z]/.test(password), text: 'Al menos 1 mayúscula' },
      { test: /\d/.test(password), text: 'Al menos 1 número' },
      { test: /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/.test(password), text: 'Al menos 1 carácter especial' }
    ];
    return requirements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <TwinklingStars count={30} />
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

      <div className={`max-w-2xl w-full transition-all duration-1000 ease-out relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center w-48 h-48 mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full blur-2xl opacity-15 animate-breath-slow group-hover:opacity-30 transition-opacity duration-1000"></div>
            <div className="absolute inset-3 bg-gradient-to-r from-[#f1b3be] via-[#ffe0db] to-[#9675bc] rounded-full blur-xl opacity-25 animate-breath-slow group-hover:opacity-40 transition-opacity duration-1000" style={{ animationDelay: '1s' }}></div>
            
            <Link to='/'>
             <div className="relative bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-3xl p-2 shadow-2xl group-hover:scale-105 transition-transform duration-500 w-40 h-40 flex items-center justify-center">
                <img src='/img/Oniria.svg' alt="Oniria Logo" className="w-36 h-36 object-contain drop-shadow-2xl filter" style={{ filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3)) drop-shadow(0 4px 8px rgba(150, 117, 188, 0.4))' }} />
             </div>
            </Link>
            
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#ffe0db] rounded-full animate-float-gentle opacity-80"></div>
            <div className="absolute -bottom-3 -left-3 w-2 h-2 bg-[#f1b3be] rounded-full animate-float-gentle opacity-70" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-[#9675bc] rounded-full animate-float-gentle opacity-60" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent animate-dream-shimmer-slow">
            Únete a Noctiria
          </h1>
          <p className="text-xl text-[#ffe0db]/90 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Donde tus sueños cobran vida y encuentran significado
          </p>
          <div className="flex items-center justify-center space-x-2 text-[#f1b3be]/80 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Shield className="w-5 h-5 animate-pulse" />
            <span className="text-sm">Espacio seguro para explorar tu mundo onírico</span>
          </div>
        </div>

        <div className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 via-[#f1b3be]/10 to-[#ffe0db]/10 rounded-3xl blur-xl transition-all duration-500 ${
            focusedField ? 'opacity-80 scale-105' : 'opacity-40'
          }`}></div>
          
          <div className="relative bg-gradient-to-br from-[#ffe0db]/85 via-white/80 to-[#f1b3be]/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#f1b3be]/20 p-8 group-hover:shadow-3xl transition-shadow duration-500">
            
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="group/field animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center transition-all duration-300 group-hover/field:text-[#214d72]">
                    <User className="w-4 h-4 mr-2 text-[#9675bc] transition-colors duration-200" />
                    Tu nombre en el mundo de los sueños *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-xl blur-sm opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60 group-hover/field:text-[#9675bc] transition-colors duration-200 z-10" />
                    <input
                      {...registerField('username', { 
                        required: 'Tu nombre de soñador es requerido',
                        minLength: { value: 3, message: 'Mínimo 3 caracteres para tu identidad onírica' }
                      })}
                      type="text"
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField('')}
                      className="relative w-full pl-12 pr-4 py-4 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#9675bc]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                      placeholder="¿Cómo te llamas, soñador?"
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
                    <Mail className="w-4 h-4 mr-2 text-[#9675bc] transition-colors duration-200" />
                    Tu correo del mundo real *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-xl blur-sm opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60 group-hover/field:text-[#9675bc] transition-colors duration-200 z-10" />
                    <input
                      {...registerField('email', { 
                        required: 'Necesitamos tu email para conectar realidad y sueños',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Formato de email mágico inválido'
                        }
                      })}
                      type="email"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className="relative w-full pl-12 pr-4 py-4 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#9675bc]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                      placeholder="tu@email-magico.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-in-down">
                      <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="group/field animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center transition-all duration-300 group-hover/field:text-[#214d72]">
                  <Lock className="w-4 h-4 mr-2 text-[#214d72] transition-colors duration-200" />
                  Llave secreta de tus sueños *
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#214d72]/10 to-[#9675bc]/10 rounded-xl blur-sm opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#214d72]/60 group-hover/field:text-[#214d72] transition-colors duration-200 z-10" />
                  <input
                    {...registerField('password', { 
                      required: 'Tu llave secreta es esencial para proteger tus sueños',
                      pattern: {
                        value: /^(?=(.*[A-Z]){1,})(?=(.*\d){1,})(?=(.*[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]){1,}).{12,}$/,
                        message: 'Tu llave debe ser poderosa: 12+ caracteres, 1 mayúscula, 1 número y 1 símbolo mágico'
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="relative w-full pl-12 pr-16 py-4 border-2 border-[#214d72]/20 rounded-xl focus:ring-2 focus:ring-[#214d72]/40 focus:border-[#214d72] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#214d72]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                    placeholder="Crea una llave mágica y segura"
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
                
                {password && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-[#ffe0db]/60 via-white/40 to-[#f1b3be]/60 backdrop-blur-sm rounded-xl border border-[#f1b3be]/30 animate-scale-in shadow-lg">
                    <div className="flex items-center mb-3">
                      <Shield className="w-4 h-4 text-[#214d72] mr-2 animate-pulse" />
                      <p className="font-semibold text-[#252c3e]">Fortaleza de tu llave mágica:</p>
                    </div>
                    <div className="space-y-2">
                      {validatePasswordStrength(password).map((req, index) => (
                        <div key={index} className="flex items-center group/req animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className={`w-5 h-5 rounded-full mr-3 transition-all duration-500 flex items-center justify-center ${
                            req.test 
                              ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-lg scale-110 animate-success-pulse' 
                              : 'bg-gray-200 group-hover/req:bg-gray-300'
                          }`}>
                            {req.test ? (
                              <CheckCircle className="w-3 h-3 text-white animate-check-in" />
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                            )}
                          </div>
                          <span className={`text-sm transition-all duration-300 ${
                            req.test 
                              ? 'text-green-700 font-medium' 
                              : 'text-[#252c3e]/70 group-hover/req:text-[#252c3e]'
                          }`}>
                            {req.text}
                          </span>
                          {req.test && (
                            <Sparkles className="w-3 h-3 text-green-500 ml-2 animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="group/field animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center transition-all duration-300 group-hover/field:text-[#214d72]">
                  <Lock className="w-4 h-4 mr-2 text-[#214d72] transition-colors duration-200" />
                  Confirma tu llave secreta *
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#214d72]/10 to-[#9675bc]/10 rounded-xl blur-sm opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#214d72]/60 group-hover/field:text-[#214d72] transition-colors duration-200 z-10" />
                  <input
                    {...registerField('password_confirm', {
                      required: 'Confirma tu llave secreta para asegurar tus sueños',
                      validate: value => value === password || 'Las llaves no coinciden, verifica tu magia'
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    onFocus={() => setFocusedField('confirm_password')}
                    onBlur={() => setFocusedField('')}
                    className="relative w-full pl-12 pr-16 py-4 border-2 border-[#214d72]/20 rounded-xl focus:ring-2 focus:ring-[#214d72]/40 focus:border-[#214d72] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:border-[#214d72]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.02] placeholder-[#252c3e]/50"
                    placeholder="Repite tu llave mágica"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#214d72]/60 hover:text-[#214d72] transition-colors duration-200 p-1 rounded-full hover:bg-[#214d72]/10 cursor-pointer z-10"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {password && watch('password_confirm') === password && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2 animate-check-in">
                      <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                    </div>
                  )}
                </div>
                {errors.password_confirm && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-in-down">
                    <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                    {errors.password_confirm.message}
                  </p>
                )}
              </div>

              <div className="group/field animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center transition-all duration-300 group-hover/field:text-[#214d72]">
                  <Sparkles className="w-4 h-4 mr-2 text-[#9675bc] transition-colors duration-200" />
                  Cuéntanos sobre tu mundo interior
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f1b3be]/10 to-[#ffe0db]/20 rounded-xl blur-sm opacity-0 group-hover/field:opacity-100 transition-opacity duration-300"></div>
                  <textarea
                    {...registerField('description')}
                    rows={4}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField('')}
                    className="relative w-full px-4 py-4 border-2 border-[#f1b3be]/20 rounded-xl focus:ring-2 focus:ring-[#f1b3be]/40 focus:border-[#f1b3be] transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/90 resize-none hover:border-[#f1b3be]/40 hover:shadow-lg focus:shadow-xl focus:scale-[1.01] placeholder-[#252c3e]/50"
                    placeholder="¿Qué sueños te visitan? ¿Qué emociones despiertan en ti? Comparte tu conexión con el mundo onírico..."
                    maxLength={15000}
                  />
                </div>
                <p className="mt-2 text-xs text-[#252c3e]/60 flex items-center justify-between">
                  <span className="flex items-center">
                    <Moon className="w-3 h-3 mr-1 animate-pulse" />
                    Opcional - Máximo 15,000 caracteres
                  </span>
                  <span className="flex items-center text-[#214d72]/80">
                    <Shield className="w-3 h-3 mr-1" />
                    Tu privacidad está protegida
                  </span>
                </p>
              </div>

              <div className="group/field animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
                <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center transition-all duration-300 group-hover/field:text-[#214d72]">
                  <Upload className="w-4 h-4 mr-2 text-[#9675bc] transition-colors duration-200" />
                  Tu avatar en el reino de los sueños
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="border-2 border-dashed border-[#9675bc]/30 rounded-xl p-12 text-center hover:border-[#9675bc]/60 hover:bg-gradient-to-br from-[#9675bc]/5 via-[#f1b3be]/5 to-[#ffe0db]/10 transition-all duration-500 bg-white/50 backdrop-blur-sm group-hover/field:scale-[1.01] group-hover/field:shadow-lg">
                    <div className="flex flex-col items-center space-y-8">
                      <div className="relative group/upload">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#214d72] via-[#9675bc] to-[#f1b3be] rounded-xl flex items-center justify-center shadow-lg transition-shadow duration-300 group-hover/upload:shadow-xl">
                          <Upload className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#f1b3be] rounded-full flex items-center justify-center animate-pulse">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      
                      {selectedFile ? (
                        <div className="text-center space-y-4 animate-scale-in">
                          <div className="flex items-center justify-center space-x-3">
                            <CheckCircle className="w-6 h-6 text-green-500 animate-check-in" />
                            <p className="text-base font-medium text-green-600">{selectedFile.name}</p>
                          </div>
                          <div className="w-full h-64 mx-auto bg-gradient-to-br from-green-50 via-white to-green-100 rounded-xl border-2 border-green-200 flex items-center justify-center shadow-md overflow-hidden">
                            <img 
                              src={URL.createObjectURL(selectedFile)} 
                              alt="Preview" 
                              className="w-full h-full object-cover rounded-lg shadow-sm" 
                            />
                          </div>
                          <p className="text-sm text-[#252c3e]/70 bg-green-50 px-4 py-2 rounded-full inline-block shadow-sm">
                            ✨ Tu avatar está listo para soñar
                          </p>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <p className="text-lg text-[#252c3e] font-medium group-hover/field:text-[#214d72] transition-colors">
                            Arrastra tu imagen mágica aquí
                          </p>
                          <p className="text-sm text-[#252c3e]/70">
                            o haz clic para seleccionar
                          </p>
                          <div className="flex items-center justify-center space-x-4 text-sm text-[#252c3e]/60 mt-6">
                            <span className="bg-[#ffe0db]/60 px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#ffe0db]/80">PNG</span>
                            <span className="bg-[#f1b3be]/60 px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#f1b3be]/80">JPG</span>
                            <span className="bg-[#9675bc]/60 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#9675bc]/80">Hasta 5MB</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 animate-slide-in-up" style={{ animationDelay: '0.7s' }}>
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
                        <span>Creando tu espacio de sueños...</span>
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-6 h-6" />
                        <span>Comenzar mi viaje onírico</span>
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
                    <span>100% Seguro</span>
                  </div>
                  <div className="flex items-center space-x-1 group/trust hover:scale-105 transition-transform duration-200">
                    <Lock className="w-4 h-4 text-[#f1b3be]" />
                    <span>Privacidad Protegida</span>
                  </div>
                  <div className="flex items-center space-x-1 group/trust hover:scale-105 transition-transform duration-200">
                    <Sparkles className="w-4 h-4 text-[#9675bc]" />
                    <span>Experiencia Mágica</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="relative inline-block group/login">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 to-[#f1b3be]/10 rounded-lg blur-sm opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#f1b3be]/20">
                    <p className="text-sm text-[#252c3e]/80">
                      ¿Ya formas parte de nuestra comunidad de soñadores?{' '}
                      <button
                        type="button"
                        onClick={() => window.location.href = '/login'} 
                        className="group/link font-semibold text-[#9675bc] hover:text-[#214d72] transition-all duration-300 relative cursor-pointer"
                      >
                        <span className="relative z-10">Inicia sesión aquí</span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9675bc] to-[#214d72] group-hover/link:w-full transition-all duration-300"></div>
                        <Sparkles className="inline w-3 h-3 ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                      </button>
                    </p>
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
        
        @keyframes success-bounce {
          0%, 20%, 50%, 80%, 100% { transform: scale(1); }
          40% { transform: scale(1.02); }
          60% { transform: scale(1.01); }
        }
        
        @keyframes check-in {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }
        
        @keyframes success-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
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
        
        @keyframes wave-gentle {
          0%, 100% { transform: translateX(0px) scaleY(1); }
          50% { transform: translateX(10px) scaleY(1.1); }
        }
        
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.1; }
        }
        
        @keyframes spiral-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes energy-flow {
          0% { transform: translateX(-100%) rotate(15deg); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateX(200%) rotate(15deg); opacity: 0; }
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
        
        .animate-success-bounce {
          animation: success-bounce 1s ease-in-out;
        }
        
        .animate-check-in {
          animation: check-in 0.5s ease-out;
        }
        
        .animate-success-pulse {
          animation: success-pulse 2s ease-in-out infinite;
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
        
        .animate-wave-gentle {
          animation: wave-gentle 6s ease-in-out infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 4s ease-in-out infinite;
        }
        
        .animate-spiral-slow {
          animation: spiral-slow 20s linear infinite;
        }
        
        .animate-energy-flow {
          animation: energy-flow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SignUp;