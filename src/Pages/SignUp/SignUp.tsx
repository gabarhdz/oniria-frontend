import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Types
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

const SignUp: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:8000/api/users'; 

  const {
    register: registerField,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch('password');

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
      
      if (registerData.is_psychologist) {
        formData.append('is_psychologist', 'true');
      }

      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        // Formatear errores del backend
        const errorMessage = Object.entries(data)
          .map(([key, value]) => {
            const fieldName = key === 'password' ? 'Contraseña' : 
                             key === 'username' ? 'Usuario' :
                             key === 'email' ? 'Email' : key;
            return `${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}`;
          })
          .join('\n');
        throw new Error(errorMessage || 'Error en el registro');
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
    
    // Validar confirmación de contraseña en el frontend
    if (data.password !== data.password_confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const submitData = {
      ...data,
      profile_pic: selectedFile || undefined,
    };
    
    try {
      const result = await registerUser(submitData);
      setSuccess(`Usuario "${result.username}" registrado exitosamente`);
      reset();
      setSelectedFile(null);
      
      // Opcional: redirigir a login después del registro exitoso
      // window.location.href = '/login';
      
    } catch (err) {
      console.error('Error de registro:', err); 
      setError(err instanceof Error ? err.message : 'Error desconocido en el registro');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 5MB.');
        return;
      }
      
      setSelectedFile(file);
      setError(''); // Limpiar errores previos
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-gray-600">Únete a nuestra plataforma</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-md whitespace-pre-line">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠</span>
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
                <span className="text-green-400">✓</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Usuario y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario *
              </label>
              <input
                {...registerField('username', { 
                  required: 'El usuario es requerido',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                })}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Nombre de usuario"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                {...registerField('email', { 
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Formato de email inválido'
                  }
                })}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Contraseñas */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                {...registerField('password', { 
                  required: 'La contraseña es requerida',
                  pattern: {
                    value: /^(?=(.*[A-Z]){1,})(?=(.*\d){3,})(?=(.*[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]){1,}).{12,}$/,
                    message: 'La contraseña debe tener al menos 12 caracteres, 1 mayúscula, 3 números y 1 carácter especial'
                  }
                })}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Mínimo 12 caracteres"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
              <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">La contraseña debe contener:</p>
                <ul className="space-y-1">
                  <li>• Mínimo 12 caracteres</li>
                  <li>• Al menos 1 letra mayúscula</li>
                  <li>• Al menos 3 números</li>
                  <li>• Al menos 1 carácter especial (!@#$%^&*...)</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña *
              </label>
              <input
                {...registerField('password_confirm', {
                  required: 'Confirma tu contraseña',
                  validate: value => value === password || 'Las contraseñas no coinciden'
                })}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Repite la contraseña"
              />
              {errors.password_confirm && (
                <p className="mt-2 text-sm text-red-600">{errors.password_confirm.message}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Personal
            </label>
            <textarea
              {...registerField('description')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Cuéntanos sobre ti (opcional)"
              maxLength={15000}
            />
            <p className="mt-1 text-xs text-gray-500">Máximo 15,000 caracteres</p>
          </div>

          {/* Foto de perfil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de Perfil
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition duration-200">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Subir archivo</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                {selectedFile && (
                  <p className="text-sm text-green-600 font-medium">
                    ✓ {selectedFile.name} seleccionado
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Checkbox psicólogo */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                {...registerField('is_psychologist')}
                type="checkbox"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">
                Soy un psicólogo certificado
              </label>
              <p className="text-gray-500">Marca esta opción si eres un profesional certificado en psicología</p>
            </div>
          </div>

          {/* Botón de registro */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>

          {/* Link a login */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/login'} 
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;