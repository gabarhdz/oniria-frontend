import React, { useState, useEffect, useRef } from 'react';
import { User, Shield, Settings, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; 
import { DashboardFooter } from '../Dashboard/components/DashboardFooter';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

// Importar componentes
import { TwinklingStars } from './ProfileComponents/TwinklingStars';
import { LoadingScreen } from './ProfileComponents/LoadingScreen';
import { ProfileBreadcrumbs } from './ProfileComponents/ProfileBreadcrumbs';
import { ProfileHeader } from './ProfileComponents/ProfileHeader';
import { Notification } from './ProfileComponents/Notification';
import { DeleteConfirmModal } from './ProfileComponents/DeleteConfirmModal';
import { ProfileTab } from './ProfileComponents/ProfileTab';
import { PrivacyTab } from './ProfileComponents/PrivacyTab';
import { SecurityTab } from './ProfileComponents/SecurityTab';
import { apiClient } from './ProfileComponents/apiClient';

// Importar tipos
import type { 
  UserProfile, 
  ProfileProps, 
  PrivacySettings, 
  NotificationState,
} from './ProfileComponents/types';

// Componente principal
const Profile: React.FC<ProfileProps> = ({ viewOnly = false }) => {
  const { user: authUser, logout } = useAuth(); 
  const { section, userId } = useParams<{ section?: string; userId?: string }>();
  
  // Estados
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'security'>(
    (section as 'profile' | 'privacy' | 'security') || 'profile'
  );
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effects
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
  
  useEffect(() => {
    if (section && ['profile', 'privacy', 'security'].includes(section)) {
      setActiveTab(section as 'profile' | 'privacy' | 'security');
    }
  }, [section]);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        if (viewOnly && userId) {
          response = await apiClient.get(`/users/${userId}/`);
        } else {
          response = await apiClient.get('/users/me/');
        }
        const userData = response.data;
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
            setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            logout();
          } else if (err.response?.status === 404) {
            setError('Usuario no encontrado.');
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
    fetchUser();
  }, [logout, viewOnly, userId]);

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
      const formData = new FormData();
      
      // Solo agregar campos que han cambiado
      if (editData.username !== user.username) {
        formData.append('username', editData.username);
      }
      if (editData.email !== user.email) {
        formData.append('email', editData.email);
      }
      if (editData.description !== user.description) {
        formData.append('description', editData.description || '');
      }
      
      if (selectedFile) {
        formData.append('profile_pic', selectedFile);
      }

      // Solo hacer la petición si hay campos para actualizar
      const hasChanges = Array.from(formData.keys()).length > 0;
      
      if (!hasChanges && !selectedFile) {
        showNotification('error', 'No hay cambios para guardar');
        setIsLoading(false);
        return;
      }

      const response = await apiClient.put('/users/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data;
      
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
      setEditData(userProfile);
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

  // Estados de carga y error
  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
        <div className="text-center bg-red-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#ffe0db] mb-2">Error al cargar el perfil</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      {/* Efectos de fondo */}
      <TwinklingStars count={40} />
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9675bc]/3 to-transparent"></div>

      {/* Input oculto para archivos - solo si no es viewOnly */}
      
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      

      {/* Notificación */}
      <Notification notification={notification} />

      {/* Modal de eliminación - solo si no es viewOnly */}
      {!viewOnly && (
        <DeleteConfirmModal 
          showDeleteModal={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}

      {/* Header */}
      <ProfileHeader activeTab={activeTab} viewOnly={viewOnly} username={user?.username} />

      {/* Contenido principal */}
      <main className={`relative z-10 p-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumbs */}
          <ProfileBreadcrumbs activeSection={activeTab} viewOnly={viewOnly} username={user?.username} />
          
          {/* Pestañas de navegación - solo si no es viewOnly */}
          {!viewOnly && (
            <div className="flex space-x-2 mb-8 bg-[#ffe0db]/10 backdrop-blur-xl rounded-2xl p-2 overflow-x-auto">
              {[
                { key: 'profile', label: 'Perfil', icon: User, path: '/dashboard/profile/profile' },
                { key: 'privacy', label: 'Privacidad', icon: Shield, path: '/dashboard/profile/privacy' },
                { key: 'security', label: 'Seguridad', icon: Settings, path: '/dashboard/profile/security' }
              ].map(({ key, label, icon: Icon, path }) => (
                <Link
                  key={key}
                  to={path}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-[#ffe0db] shadow-lg'
                      : 'text-[#ffe0db]/70 hover:text-[#ffe0db] hover:bg-[#ffe0db]/10'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Renderizado de pestañas */}
          {activeTab === 'profile' && (
            <ProfileTab
              user={user}
              editData={editData}
              isEditing={isEditing}
              isLoading={isLoading}
              viewOnly={viewOnly}
              previewUrl={previewUrl}
              privacySettings={privacySettings}
              setIsEditing={setIsEditing}
              setEditData={setEditData}
              handleSave={handleSave}
              handleCancel={handleCancel}
              formatJoinDate={formatJoinDate}
              getUserInitials={getUserInitials}
              fileInputRef ={fileInputRef}
            />
          )}

          {activeTab === 'privacy' && !viewOnly && (
            <PrivacyTab
              privacySettings={privacySettings}
              setPrivacySettings={setPrivacySettings}
              showNotification={showNotification}
            />
          )}

          {activeTab === 'security' && !viewOnly && (
            <SecurityTab setShowDeleteModal={setShowDeleteModal} />
          )}
        </div>
      </main>

      {/* Footer */}
      <DashboardFooter />

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