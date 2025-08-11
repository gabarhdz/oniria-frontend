import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Camera, Edit3, Save, X, Lock, Shield, Eye, EyeOff, 
  Settings, Bell, Moon, Sun, Globe, UserCheck, Mail, 
  Calendar, Heart, Star, Sparkles, CheckCircle, AlertCircle, 
  Upload, Loader2, RefreshCw, ArrowLeft, Trash2, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; 
import axios, { AxiosError } from 'axios';
import { Navigate } from 'react-router-dom';

// Tipos para TypeScript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  description?: string;
  profile_pic?: string;
  is_psychologist: boolean;
  date_joined?: string;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  email_visibility: boolean;
  dream_sharing: boolean;
  community_notifications: boolean;
}

// Configuración de axios
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);


const TwinklingStars: React.FC<{ count?: number; className?: string }> = ({ count = 30, className = '' }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 2,
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-300 to-pink-300 animate-twinkle opacity-60"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const FloatingOrbs: React.FC = () => {
  const orbs = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 6,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full animate-float-gentle opacity-20"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(219, 39, 119, 0.4) 50%, rgba(236, 72, 153, 0.2) 100%)`,
            filter: 'blur(2px)',
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const ParallaxClouds: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-10 animate-morph-slow"
          style={{
            width: `${120 + i * 30}px`,
            height: `${80 + i * 20}px`,
            left: `${10 + i * 20}%`,
            top: `${15 + i * 20}%`,
            transform: `translateY(${scrollY * (0.1 + i * 0.05)}px)`,
            background: `radial-gradient(ellipse, rgba(147, 51, 234, ${0.3 - i * 0.05}) 0%, rgba(219, 39, 119, ${0.2 - i * 0.03}) 50%, transparent 100%)`,
            borderRadius: `${60 + i * 10}% ${40 - i * 5}% ${30 + i * 10}% ${70 - i * 5}% / ${60 - i * 5}% ${30 + i * 10}% ${70 + i * 5}% ${40 - i * 5}%`,
            filter: 'blur(3px)',
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

// Componente principal
const Profile: React.FC = () => {
  const { user: authUser, logout } = useAuth(); 
  
  // Estados principales
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profile_visibility: 'public',
    email_visibility: false,
    dream_sharing: true,
    community_notifications: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'settings'>('profile');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efectos
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  // Cargar datos del usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get('/users/me/');
        const userData = response.data;
        
        // Mapear los datos de Django al formato esperado
        const userProfile: UserProfile = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          description: userData.description || '',
          profile_pic: userData.profile_pic,
          is_psychologist: userData.is_psychologist,
          date_joined: userData.date_joined || new Date().toISOString()
        };
        
        setUser(userProfile);
        setEditData(userProfile);
        
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            // Token expirado o inválido
            setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            logout(); // Cerrar sesión si el token es inválido
          } else {
            setError('Error al cargar los datos del usuario. Por favor, intenta nuevamente.');
          }
        } else {
          setError('Error inesperado al cargar los datos.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [logout]);

  // Funciones de manejo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'El archivo excede el límite de 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    if (!editData || !user) return;
    
    setIsLoading(true);
    
    try {
      // Preparar los datos para enviar
      const formData = new FormData();
      formData.append('username', editData.username);
      formData.append('email', editData.email);
      formData.append('description', editData.description || '');
      
      if (selectedFile) {
        formData.append('profile_pic', selectedFile);
      }

      // Actualizar el perfil
      const response = await apiClient.put('/users/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data;
      
      // Mapear la respuesta
      const userProfile: UserProfile = {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        description: updatedUser.description || '',
        profile_pic: updatedUser.profile_pic,
        is_psychologist: updatedUser.is_psychologist,
        date_joined: updatedUser.date_joined || user.date_joined
      };

      setUser(userProfile);
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      showNotification('success', '¡Perfil actualizado exitosamente!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          showNotification('error', 'Sesión expirada. Por favor, inicia sesión nuevamente.');
          logout();
        } else if (error.response?.status === 400) {
          const errorData = error.response.data;
          let errorMessage = 'Error al actualizar el perfil.';
          
          // Manejar errores específicos de validación
          if (errorData.username) {
            errorMessage = `Usuario: ${Array.isArray(errorData.username) ? errorData.username.join(', ') : errorData.username}`;
          } else if (errorData.email) {
            errorMessage = `Email: ${Array.isArray(errorData.email) ? errorData.email.join(', ') : errorData.email}`;
          } else if (errorData.password) {
            errorMessage = `Contraseña: ${Array.isArray(errorData.password) ? errorData.password.join(', ') : errorData.password}`;
          }
          
          showNotification('error', errorMessage);
        } else {
          showNotification('error', 'Error del servidor al actualizar el perfil');
        }
      } else {
        showNotification('error', 'Error inesperado al actualizar el perfil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDeleteAccount = () => {
    // Aquí iría la lógica de eliminación real
    showNotification('success', 'Solicitud de eliminación procesada');
    setShowDeleteModal(false);
  };

  const getUserInitials = (username: string): string => {
    return username.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const formatJoinDate = (dateString?: string): string => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  // Componente Avatar
  const ProfileAvatar: React.FC<{ size: 'small' | 'large'; editable?: boolean }> = ({ 
    size, 
    editable = false 
  }) => {
    const sizeClasses = size === 'small' ? 'w-20 h-20' : 'w-32 h-32';
    const textSize = size === 'small' ? 'text-lg' : 'text-3xl';

    const imageUrl = previewUrl || user?.profile_pic;

    return (
      <div className={`relative ${sizeClasses} group`}>
        <div className={`${sizeClasses} rounded-full overflow-hidden bg-gradient-to-br from-purple-500/40 via-pink-400/30 to-purple-600/20 border-4 border-white/20 shadow-2xl flex items-center justify-center relative transition-all duration-500 group-hover:scale-105 group-hover:shadow-purple-500/50`}>
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={`Avatar de ${user?.username || 'Usuario'}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // En caso de error al cargar la imagen, mostrar iniciales
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <span className={`text-white font-bold ${textSize} select-none`}>
              {user?.username ? getUserInitials(user.username) : '??'}
            </span>
          )}
          
          {/* Overlay de edición */}
          {editable && isEditing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <Camera className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Indicador de estado */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>

        {/* Efectos decorativos */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-40 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>
    );
  };

  // Componente de notificación
  const Notification: React.FC = () => {
    if (!notification) return null;

    return (
      <div className={`fixed top-24 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 max-w-sm ${
        notification.type === 'success' 
          ? 'bg-green-500/20 border-green-400/30 text-green-100' 
          : 'bg-red-500/20 border-red-400/30 text-red-100'
      } animate-slide-in-right`}>
        <div className="flex items-center space-x-3">
          {notification.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-400 animate-scale-in" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-400 animate-shake" />
          )}
          <p className="font-medium">{notification.message}</p>
        </div>
      </div>
    );
  };

  // Modal de confirmación de eliminación
  const DeleteConfirmModal: React.FC = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl transform animate-scale-in">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-400 animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">¿Eliminar Cuenta?</h3>
              <p className="text-slate-300">Esta acción es irreversible. Perderás todos tus sueños, análisis y datos.</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-slate-600/50 hover:bg-slate-600/70 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white text-xl">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-red-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error al cargar el perfil</h2>
          <p className="text-red-300 mb-4">{error || 'No se pudieron cargar los datos del usuario'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <TwinklingStars count={40} />
      <FloatingOrbs />
      <ParallaxClouds />
      
      {/* Overlay de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>

      {/* Input oculto para archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Notificación */}
      <Notification />

      {/* Modal de eliminación */}
      <DeleteConfirmModal />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors group">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al Dashboard</span>
          </button>


          <div className="flex items-center space-x-4">
            <div className="text-right">
              <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
              <p className="text-purple-300">Gestiona tu identidad en Noctiria</p>
            </div>
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className={`relative z-10 p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Pestañas de navegación */}
          <div className="flex space-x-2 mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-2">
            {[
              { key: 'profile', label: 'Perfil', icon: User },
              { key: 'privacy', label: 'Privacidad', icon: Shield },
              { key: 'settings', label: 'Configuración', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab: Perfil */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              
              {/* Card Principal del Usuario */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
                  {/* Efectos decorativos */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-2xl"></div>

                  <div className="relative z-10">
                    {/* Header de la card */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center space-x-6">
                        <ProfileAvatar size="large" editable={true} />
                        <div>
                          <div className="flex items-center space-x-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData?.username || ''}
                                onChange={(e) => setEditData(editData ? {...editData, username: e.target.value} : null)}
                                className="text-3xl font-bold bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                              />
                            ) : (
                              <h2 className="text-3xl font-bold text-white">{user.username}</h2>
                            )}
                            {user.is_psychologist && (
                              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                                <UserCheck className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Mail className="w-4 h-4 text-purple-300" />
                            {isEditing ? (
                              <input
                                type="email"
                                value={editData?.email || ''}
                                onChange={(e) => setEditData(editData ? {...editData, email: e.target.value} : null)}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1 text-purple-100 focus:ring-2 focus:ring-purple-400"
                              />
                            ) : (
                              <span className="text-purple-300">{user.email}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1 text-sm text-white/60">
                            <Calendar className="w-4 h-4" />
                            <span>Miembro desde {formatJoinDate(user.date_joined)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                        >
                          <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span>Editar</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleCancel}
                            className="flex items-center space-x-2 px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 rounded-xl text-white transition-all duration-300"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancelar</span>
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white transition-all duration-300 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            <span>Guardar</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Descripción */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Heart className="w-5 h-5 text-pink-400 mr-2" />
                        Sobre mi mundo onírico
                      </h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.description || ''}
                          onChange={(e) => setEditData(editData ? {...editData, description: e.target.value} : null)}
                          rows={6}
                          placeholder="Cuéntanos sobre tus sueños, experiencias y conexión con el mundo onírico..."
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
                          maxLength={1500}
                        />
                      ) : (
                        <p className="text-white/80 leading-relaxed">
                          {user.description || 'Aún no has compartido tu historia onírica...'}
                        </p>
                      )}
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: 'Sueños Registrados', value: '47', icon: Moon, color: 'from-purple-500 to-indigo-500' },
                        { label: 'Días Activo', value: '89', icon: Calendar, color: 'from-pink-500 to-rose-500' },
                        { label: 'Análisis Completos', value: '23', icon: Star, color: 'from-amber-500 to-orange-500' }
                      ].map((stat, index) => (
                        <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                          <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-white/60 text-sm">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Card de Estado */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Shield className="w-5 h-5 text-green-400 mr-2" />
                    Estado de la Cuenta
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Verificación</span>
                      <span className="text-green-400 font-medium">✓ Verificado</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Privacidad</span>
                      <span className="text-blue-400 font-medium capitalize">{privacySettings.profile_visibility}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Tipo de Cuenta</span>
                      <span className="text-purple-400 font-medium">
                        {user.is_psychologist ? 'Psicólogo' : 'Soñador'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card de Actividad Reciente */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <RefreshCw className="w-5 h-5 text-blue-400 mr-2" />
                    Actividad Reciente
                  </h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Sueño registrado', time: 'Hace 2 horas', color: 'text-purple-400' },
                      { action: 'Análisis completado', time: 'Ayer', color: 'text-pink-400' },
                      { action: 'Perfil actualizado', time: 'Hace 3 días', color: 'text-blue-400' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">{activity.action}</span>
                        <span className={`text-xs ${activity.color} font-medium`}>{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card de Acciones Rápidas */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-white transition-all duration-300 group">
                      <Moon className="w-5 h-5 text-purple-300 group-hover:rotate-12 transition-transform" />
                      <span>Registrar Sueño</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl text-white transition-all duration-300 group">
                      <Star className="w-5 h-5 text-pink-300 group-hover:scale-110 transition-transform" />
                      <span>Ver Análisis</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-white transition-all duration-300 group">
                      <Globe className="w-5 h-5 text-blue-300 group-hover:rotate-180 transition-transform" />
                      <span>Explorar Comunidad</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Privacidad */}
          {activeTab === 'privacy' && (
            <div className="animate-fade-in">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Configuración de Privacidad</h2>
                    <p className="text-white/70">Controla quién puede ver tu información y actividad</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Visibilidad del Perfil */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Eye className="w-5 h-5 text-purple-400 mr-2" />
                      Visibilidad del Perfil
                    </h3>
                    <div className="space-y-3">
                      {[
                        { value: 'public', label: 'Público', desc: 'Visible para todos los usuarios' },
                        { value: 'friends', label: 'Solo Amigos', desc: 'Visible solo para tus conexiones' },
                        { value: 'private', label: 'Privado', desc: 'Solo visible para ti' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-start space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="profile_visibility"
                            value={option.value}
                            checked={privacySettings.profile_visibility === option.value}
                            onChange={(e) => setPrivacySettings({
                              ...privacySettings,
                              profile_visibility: e.target.value as any
                            })}
                            className="mt-1 w-4 h-4 text-purple-600 bg-white/20 border-white/30 focus:ring-purple-500"
                          />
                          <div>
                            <div className="text-white font-medium group-hover:text-purple-300 transition-colors">
                              {option.label}
                            </div>
                            <div className="text-white/60 text-sm">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Configuraciones Específicas */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Settings className="w-5 h-5 text-green-400 mr-2" />
                      Configuraciones Específicas
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: 'email_visibility',
                          label: 'Email Visible',
                          desc: 'Mostrar email en tu perfil público'
                        },
                        {
                          key: 'dream_sharing',
                          label: 'Compartir Sueños',
                          desc: 'Permitir que otros vean tus sueños públicos'
                        },
                        {
                          key: 'community_notifications',
                          label: 'Notificaciones de Comunidad',
                          desc: 'Recibir notificaciones de actividad comunitaria'
                        }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between group hover:bg-white/5 rounded-lg p-2 transition-colors">
                          <div className="flex-1">
                            <div className="text-white font-medium">{setting.label}</div>
                            <div className="text-white/60 text-sm">{setting.desc}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings[setting.key as keyof PrivacySettings] as boolean}
                              onChange={(e) => setPrivacySettings({
                                ...privacySettings,
                                [setting.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botón de Guardar Privacidad */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => showNotification('success', 'Configuración de privacidad guardada')}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/50"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar Configuración</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Configuración */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Configuración de Cuenta */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-7 h-7 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Configuración de Cuenta</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Cambiar Contraseña */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Lock className="w-5 h-5 text-yellow-400 mr-2" />
                        Cambiar Contraseña
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Contraseña actual"
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        />
                        <input
                          type="password"
                          placeholder="Nueva contraseña"
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        />
                        <input
                          type="password"
                          placeholder="Confirmar nueva contraseña"
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        />
                      </div>
                      <button className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-300 font-medium transition-all duration-300">
                        <Lock className="w-4 h-4" />
                        <span>Actualizar Contraseña</span>
                      </button>
                    </div>

                    {/* Preferencias de Notificación */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Bell className="w-5 h-5 text-purple-400 mr-2" />
                        Notificaciones
                      </h3>
                      <div className="space-y-3">
                        {[
                          'Nuevos análisis de sueños',
                          'Mensajes de la comunidad',
                          'Recordatorios de registro',
                          'Actualizaciones de la aplicación'
                        ].map((notif, index) => (
                          <label key={index} className="flex items-center justify-between cursor-pointer group hover:bg-white/5 rounded-lg p-2 transition-colors">
                            <span className="text-white/80 group-hover:text-white">{notif}</span>
                            <input
                              type="checkbox"
                              defaultChecked={index < 2}
                              className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tema */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Sun className="w-5 h-5 text-orange-400 mr-2" />
                        Apariencia
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'dark', label: 'Modo Oscuro', icon: Moon, active: true },
                          { key: 'light', label: 'Modo Claro', icon: Sun, active: false }
                        ].map((theme) => (
                          <button
                            key={theme.key}
                            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                              theme.active
                                ? 'bg-purple-500/30 text-white border-2 border-purple-400'
                                : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                            }`}
                          >
                            <theme.icon className="w-4 h-4" />
                            <span>{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuración Peligrosa */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-red-500/30 shadow-2xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <AlertTriangle className="w-7 h-7 text-red-400" />
                    <h2 className="text-xl font-bold text-white">Zona Peligrosa</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Exportar Datos */}
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Exportar Mis Datos</h3>
                      <p className="text-white/70 text-sm mb-4">
                        Descarga una copia de todos tus datos personales, sueños y análisis.
                      </p>
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-orange-300 font-medium transition-all duration-300">
                        <Upload className="w-4 h-4" />
                        <span>Solicitar Exportación</span>
                      </button>
                    </div>

                    {/* Desactivar Cuenta */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Desactivar Cuenta</h3>
                      <p className="text-white/70 text-sm mb-4">
                        Desactiva temporalmente tu cuenta. Podrás reactivarla más tarde.
                      </p>
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-300 font-medium transition-all duration-300">
                        <EyeOff className="w-4 h-4" />
                        <span>Desactivar Cuenta</span>
                      </button>
                    </div>

                    {/* Eliminar Cuenta */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Eliminar Cuenta</h3>
                      <p className="text-white/70 text-sm mb-4">
                        Elimina permanentemente tu cuenta y todos tus datos. Esta acción no se puede deshacer.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 font-medium transition-all duration-300 group"
                      >
                        <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
                        <span>Eliminar Cuenta</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Estilos CSS personalizados */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        
        @keyframes morph-slow {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 40% 60% 70% 30% / 50% 60% 30% 60%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          75% { border-radius: 70% 30% 40% 60% / 40% 70% 60% 30%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(100%); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-float-gentle { animation: float-gentle 8s ease-in-out infinite; }
        .animate-morph-slow { animation: morph-slow 20s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Profile;