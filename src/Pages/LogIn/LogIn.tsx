import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

// Types
interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    is_psychologist: boolean;
    description?: string;
    profile_pic?: string;
  };
  // Agregar otros campos si tu backend devuelve más información
}

const LogIn: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Hook de navegación de React Router
  const navigate = useNavigate();

  // Ajusta esta URL según tu configuración de Django
  const API_LOGIN_URL = 'http://127.0.0.1:8000/auth/jwt/create'; // Cambia por tu endpoint de login

  const {
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>();

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

      // Console.log para verificar qué devuelve el backend
      console.log('🔍 Respuesta completa del backend:', data);
      console.log('🔍 Status de la respuesta:', response.status);
      console.log('🔍 Response OK:', response.ok);

      if (response.ok) {
        console.log('✅ Login exitoso, procesando tokens...');
        
        // Guardar tokens JWT (djoser típicamente devuelve access y refresh)
        if (data.access) {
          localStorage.setItem('authToken', data.access);
          localStorage.setItem('accessToken', data.access);
          console.log('💾 Access token guardado:', data.access.substring(0, 20) + '...');
        }
        
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
          console.log('💾 Refresh token guardado:', data.refresh.substring(0, 20) + '...');
        }
        
        // Si también devuelve información del usuario
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('👤 Información del usuario guardada:', data.user);
        }
        
        // Verificar si hay token en algún otro formato
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          console.log('💾 Token genérico guardado:', data.token.substring(0, 20) + '...');
        }
        
        console.log('📦 Datos completos guardados en localStorage');
        return data;
      } else {
        console.log('❌ Error en el login');
        console.log('📄 Datos de error:', data);
        
        // Manejar errores del backend
        const errorMessage = data.non_field_errors?.[0] || 
                           data.detail || 
                           data.message ||
                           Object.values(data).flat().join(', ') ||
                           'Credenciales incorrectas';
        console.log('⚠️ Mensaje de error procesado:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.log('🚨 Error en el proceso de login:', error);
      
      if (error instanceof TypeError) {
        console.log('🌐 Error de conexión con el servidor');
        throw new Error('No se puede conectar con el servidor. Verifica que el backend esté funcionando.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginData) => {
    setError('');
    setSuccess('');
    
    console.log('🚀 Iniciando proceso de login con datos:', { username: data.username, password: '[HIDDEN]' });
    
    try {
      const result = await loginUser(data);
      console.log('🎉 Login completado exitosamente');
      setSuccess('Login exitoso. Redirigiendo...');
      
      // Opcional: Limpiar el formulario
      reset();
      
      // Redirigir después de login exitoso usando React Router
      setTimeout(() => {
        console.log('➡️ Redirigiendo a /home...');
        navigate('/'); // Redirección a la página 'home'
      }, 1500);
      
    } catch (err) {
      console.log('💥 Error en onSubmit:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido en el login');
    }
  };

  const handleForgotPassword = () => {
    // Implementar lógica para recuperar contraseña
    alert('Funcionalidad de recuperar contraseña - implementar según necesites');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-gray-600">Accede a tu cuenta</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Campo Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                {...registerField('username', { 
                  required: 'El usuario es requerido',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                })}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa tu usuario"
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                {...registerField('password', { 
                  required: 'La contraseña es requerida',
                  minLength: { value: 1, message: 'La contraseña es requerida' }
                })}
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Recordar y Olvidé contraseña */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          {/* Botón de Login */}
          <div>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Botón para ir a registro usando Link */}
          <div>
            <Link
              to="/signup"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Crear nueva cuenta
            </Link>
          </div>

          {/* Enlaces adicionales */}
          <div className="text-center">
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                ¿Problemas para iniciar sesión?{' '}
                <button
                  type="button"
                  onClick={() => alert('Contactar soporte - implementar según necesites')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                >
                  Contacta soporte
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500">
            <p>Al iniciar sesión, aceptas nuestros</p>
            <div className="mt-1 space-x-1">
              <button
                type="button"
                onClick={() => alert('Términos de servicio')}
                className="text-blue-600 hover:text-blue-500"
              >
                Términos de Servicio
              </button>
              <span>y</span>
              <button
                type="button"
                onClick={() => alert('Política de privacidad')}
                className="text-blue-600 hover:text-blue-500"
              >
                Política de Privacidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;