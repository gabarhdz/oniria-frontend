import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield, UserPlus, GraduationCap, FileText, Award, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Componente de estrellas
const TwinklingStars: React.FC<{ count?: number }> = ({ count = 25 }) => {
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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

// Types for alert
type AlertType = { type: 'success' | 'error'; message: string; title: string };
type DreamAlertProps = {
  type: 'success' | 'error';
  message: string;
  title: string;
  onClose: () => void;
};

// Componente de Alert personalizado
const DreamAlert: React.FC<DreamAlertProps> = ({ type, message, title, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="relative max-w-md w-full mx-4">
        <TwinklingStars count={15} />
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
              onClick={onClose}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                type === 'success'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              } hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
            >
              {type === 'success' ? 'Continuar' : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PsychologistSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>('');
  const [showAlert, setShowAlert] = useState<AlertType | null>(null);
  const [universities, setUniversities] = useState<{ id: number; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>();

  const password = (watch('password') as string) || '';

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cargar universidades (solo para display en frontend)
  useEffect(() => {
    setUniversities([
      { id: 1, name: 'Universidad de Costa Rica' },
      { id: 2, name: 'Universidad Nacional' },
      { id: 3, name: 'Universidad Latina' },
      { id: 4, name: 'ULACIT' },
      { id: 5, name: 'Universidad Fidélitas' },
      { id: 6, name: 'Universidad Autónoma de Centro América (UACA)' },
      { id: 7, name: 'Universidad Veritas' },
      { id: 8, name: 'Universidad Santa Paula' },
    ]);
  }, []);

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

  const onSubmit = async (data: any) => {
    if (data.password !== data.password_confirm) {
      setShowAlert({
        type: 'error',
        title: 'Error en la validación',
        message: 'Las contraseñas no coinciden. Por favor verifica que ambas contraseñas sean idénticas.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Datos básicos del usuario
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('is_psychologist', 'true');
      
      // Descripción profesional
      if (data.professional_description) {
        formData.append('description', data.professional_description);
      }
      
      // Foto de perfil
      if (selectedFile) {
        formData.append('profile_pic', selectedFile);
      }

      // Paso 1: Crear el usuario
      const userResponse = await axios.post('http://127.0.0.1:8000/api/users/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      console.log('✅ Usuario creado:', userResponse.data);

      // Paso 2: Hacer login para obtener el token
      const loginResponse = await axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', {
        username: data.username,
        password: data.password
      });

      const accessToken = loginResponse.data.access;
      console.log('✅ Token obtenido');

      // Paso 3: Crear el perfil de psicólogo usando el token
      // Enviamos el nombre de la universidad en lugar del ID
      const universityName = universities.find(u => u.id === parseInt(data.university))?.name || '';
      
      const psychologistData = {
        university: universityName,  // Enviamos el nombre en lugar del ID
        description: data.professional_description || '',
      };

      console.log('📤 Enviando datos de psicólogo:', psychologistData);

      await axios.post(
        `http://127.0.0.1:8000/api/psychologists/psychologists/`,
        psychologistData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      console.log('✅ Perfil de psicólogo creado');

      setShowAlert({
        type: 'success',
        title: '¡Bienvenido a Noctiria!',
        message: `¡Hola Dr(a). ${userResponse.data.username}! Tu cuenta profesional ha sido creada exitosamente.\n\nAhora puedes iniciar sesión y comenzar a ayudar a otros en su viaje onírico.`
      });
      
      reset();
      setSelectedFile(null);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('❌ Error de registro:', err);
      
      let errorMessage = 'Ha ocurrido un error inesperado durante el registro.';
      
      if (err?.response?.data) {
        const data = err.response.data;
        console.error('Error data:', data);
        
        if (data.email) {
          errorMessage = '💫 Este email ya está registrado.\n\n¿Ya tienes una cuenta? Intenta iniciar sesión.';
        } else if (data.username) {
          errorMessage = '🌙 Este nombre de usuario ya está en uso.\n\nElige un nombre único para tu perfil profesional.';
        } else if (data.password) {
          errorMessage = `Contraseña: ${Array.isArray(data.password) ? data.password.join(', ') : data.password}`;
        } else if (data.error) {
          errorMessage = data.error;
        } else {
          try {
            errorMessage = Object.values(data).flat().join('\n');
          } catch {
            errorMessage = JSON.stringify(data);
          }
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setShowAlert({
        type: 'error',
        title: 'Error en el registro',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <TwinklingStars count={30} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]"></div>

      {showAlert && (
        <DreamAlert
          type={showAlert.type}
          title={showAlert.title}
          message={showAlert.message}
          onClose={() => {
            setShowAlert(null);
            if (showAlert.type === 'success') {
              navigate('/login');
            }
          }}
        />
      )}

      <div className={`max-w-3xl w-full transition-all duration-1000 ease-out relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center w-48 h-48 mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full blur-2xl opacity-15 animate-breath-slow"></div>
            
            <Link to='/'>
              <div className="relative bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-3xl p-2 shadow-2xl group-hover:scale-105 transition-transform duration-500 w-40 h-40 flex items-center justify-center">
                <img src='/img/Oniria.svg' alt="Oniria Logo" className="w-36 h-36 object-contain drop-shadow-2xl" />
              </div>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
            Registro Profesional
          </h1>
          <p className="text-xl text-[#ffe0db]/90 mb-4">
            Únete como psicólogo certificado en Noctiria
          </p>
          <div className="flex items-center justify-center space-x-2 text-[#f1b3be]/80">
            <Shield className="w-5 h-5 animate-pulse" />
            <span className="text-sm">Cuenta profesional verificada</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-r from-[#9675bc]/10 via-[#f1b3be]/10 to-[#ffe0db]/10 rounded-3xl blur-xl transition-all duration-500 ${
            focusedField ? 'opacity-80 scale-105' : 'opacity-40'
          }`}></div>
          
          <div className="relative bg-gradient-to-br from-[#ffe0db]/85 via-white/80 to-[#f1b3be]/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#f1b3be]/20 p-8">
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Información Personal */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#252c3e] flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#9675bc]" />
                  Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="group/field">
                    <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                      Nombre de usuario *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60 z-10" />
                      <input
                        {...register('username', { 
                          required: 'El nombre de usuario es requerido',
                          minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                        })}
                        type="text"
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField('')}
                        className="w-full pl-12 pr-4 py-4 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70 backdrop-blur-sm"
                        placeholder="Dr. Juan Pérez"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {String((errors.username as any)?.message ?? errors.username)}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group/field">
                    <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                      Correo profesional *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60 z-10" />
                      <input
                        {...register('email', { 
                          required: 'El email es requerido',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Formato de email inválido'
                          }
                        })}
                        type="email"
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className="w-full pl-12 pr-4 py-4 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70 backdrop-blur-sm"
                        placeholder="doctor@ejemplo.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {String((errors.email as any)?.message ?? errors.email)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Universidad */}
                <div className="group/field">
                  <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-[#9675bc]" />
                    Universidad *
                  </label>
                  <select
                    {...register('university', { required: 'Selecciona una universidad' })}
                    className="w-full px-4 py-4 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  >
                    <option value="">Selecciona tu universidad</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>{uni.name}</option>
                    ))}
                  </select>
                  {errors.university && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {String((errors.university as any)?.message ?? errors.university)}
                    </p>
                  )}
                </div>

                {/* Contraseñas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="group/field">
                    <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#214d72]/60 z-10" />
                      <input
                        {...register('password', { 
                          required: 'La contraseña es requerida',
                          pattern: {
                            value: /^(?=(.*[A-Z]){1,})(?=(.*\d){1,})(?=(.*[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]){1,}).{12,}$/,
                            message: 'Mínimo 12 caracteres, 1 mayúscula, 1 número y 1 símbolo'
                          }
                        })}
                        type={showPassword ? "text" : "password"}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        className="w-full pl-12 pr-16 py-4 border-2 border-[#214d72]/20 rounded-xl focus:ring-2 focus:ring-[#214d72]/40 focus:border-[#214d72] transition-all duration-300 bg-white/70 backdrop-blur-sm"
                        placeholder="Contraseña segura"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#214d72]/60 hover:text-[#214d72] z-10"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {String((errors.password as any)?.message ?? errors.password)}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="group/field">
                    <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                      Confirmar contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#214d72]/60 z-10" />
                      <input
                        {...register('password_confirm', {
                          required: 'Confirma tu contraseña',
                          validate: value => value === password || 'Las contraseñas no coinciden'
                        })}
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full pl-12 pr-16 py-4 border-2 border-[#214d72]/20 rounded-xl focus:ring-2 focus:ring-[#214d72]/40 focus:border-[#214d72] transition-all duration-300 bg-white/70 backdrop-blur-sm"
                        placeholder="Repite tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#214d72]/60 hover:text-[#214d72] z-10"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password_confirm && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {String((errors.password_confirm as any)?.message ?? errors.password_confirm)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="p-4 bg-gradient-to-br from-[#ffe0db]/60 via-white/40 to-[#f1b3be]/60 backdrop-blur-sm rounded-xl border border-[#f1b3be]/30">
                    <div className="flex items-center mb-3">
                      <Shield className="w-4 h-4 text-[#214d72] mr-2" />
                      <p className="font-semibold text-[#252c3e]">Fortaleza de contraseña:</p>
                    </div>
                    <div className="space-y-2">
                      {validatePasswordStrength(password).map((req, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                            req.test ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'
                          }`}>
                            {req.test && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-sm ${req.test ? 'text-green-700 font-medium' : 'text-[#252c3e]/70'}`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Información Profesional */}
              <div className="space-y-6 pt-6 border-t border-[#f1b3be]/30">
                <h3 className="text-lg font-bold text-[#252c3e] flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-[#9675bc]" />
                  Información Profesional
                </h3>

                {/* Descripción profesional */}
                <div className="group/field">
                  <label className="block text-sm font-semibold text-[#252c3e] mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[#9675bc]" />
                    Descripción profesional
                  </label>
                  <textarea
                    {...register('professional_description')}
                    rows={4}
                    className="w-full px-4 py-4 border-2 border-[#f1b3be]/20 rounded-xl focus:ring-2 focus:ring-[#f1b3be]/40 focus:border-[#f1b3be] transition-all duration-300 bg-white/70 backdrop-blur-sm resize-none"
                    placeholder="Especialidades, años de experiencia, enfoque terapéutico..."
                    maxLength={500}
                  />
                  <p className="mt-2 text-xs text-[#252c3e]/60">
                    Opcional - Máximo 500 caracteres
                  </p>
                </div>

                {/* Foto de perfil */}
                <div className="group/field">
                  <label className="block text-sm font-semibold text-[#252c3e] mb-2">
                    Foto de perfil profesional
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="border-2 border-dashed border-[#9675bc]/30 rounded-xl p-8 text-center hover:border-[#9675bc]/60 transition-all duration-500 bg-white/50">
                      {selectedFile ? (
                        <div className="space-y-4">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                          <p className="text-base font-medium text-green-600">{selectedFile.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 text-[#9675bc] mx-auto" />
                          <p className="text-lg text-[#252c3e] font-medium">
                            Arrastra tu foto aquí o haz clic
                          </p>
                          <p className="text-sm text-[#252c3e]/60">
                            PNG, JPG o JPEG (máx. 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de registro */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#214d72] via-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:via-[#9675bc] hover:to-[#214d72] text-white font-bold py-5 px-8 rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Creando cuenta profesional...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <UserPlus className="w-6 h-6" />
                      <span>Registrarme como psicólogo</span>
                      <Award className="w-6 h-6" />
                    </div>
                  )}
                </button>
              </div>

              {/* Link a login */}
              <div className="text-center pt-4">
                <p className="text-sm text-[#252c3e]/80">
                  ¿Ya tienes una cuenta profesional?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-[#9675bc] hover:text-[#214d72] transition-colors duration-300"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes breath-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
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
        
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-breath-slow { animation: breath-slow 6s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-shake-x { animation: shake-x 0.5s ease-in-out; }
        .animate-check-in { animation: check-in 0.5s ease-out; }
      `}</style>

    </div>
  );
};

export default PsychologistSignUp;