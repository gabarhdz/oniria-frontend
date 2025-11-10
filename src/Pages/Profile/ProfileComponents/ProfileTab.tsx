import React from 'react';
import { 
  Edit3, X, Save, Loader2, Heart, Moon, Calendar, Star, Shield,
  RefreshCw, User, Mail, Globe, Award, GraduationCap
} from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import type { UserProfile, PrivacySettings } from './types';

interface ProfileTabProps {
  user: UserProfile | null;
  editData: UserProfile | null;
  isEditing: boolean;
  isLoading: boolean;
  viewOnly: boolean;
  previewUrl: string | null;
  privacySettings: PrivacySettings;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setEditData: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  handleSave: () => void;
  handleCancel: () => void;
  formatJoinDate: (dateString?: string) => string;
  getUserInitials: (username: string) => string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  editData,
  isEditing,
  isLoading,
  viewOnly,
  previewUrl,
  privacySettings,
  setIsEditing,
  setEditData,
  handleSave,
  handleCancel,
  formatJoinDate,
  getUserInitials,
  fileInputRef
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      
      {/* Card Principal del Usuario */}
      <div className="lg:col-span-2">
        <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-8 relative overflow-hidden">
          {/* Efectos decorativos */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[#f1b3be]/20 to-[#9675bc]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-[#ffe0db]/20 to-[#f1b3be]/20 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            {/* Header de la card */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
               <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">

<ProfileAvatar
  size="large"
  editable={!viewOnly}
  user={user}
  previewUrl={previewUrl}
  isEditing={isEditing}
  viewOnly={viewOnly}
  fileInputRef={fileInputRef} 
  getUserInitials={getUserInitials}
/>
                  <div className="w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                      {isEditing && !viewOnly ? (
                        <input
                          type="text"
                          value={editData?.username || ''}
                          onChange={(e) => setEditData(editData ? {...editData, username: e.target.value} : null)}
                          className="text-2xl sm:text-3xl font-bold bg-[#ffe0db]/10 backdrop-blur-sm border border-[#ffe0db]/20 rounded-xl px-4 py-2 text-[#ffe0db] focus:ring-2 focus:ring-[#f1b3be] focus:border-[#f1b3be] w-full sm:w-auto"
                        />
                      ) : (
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#ffe0db]">{user ? user.username : ''}</h2>
                      )}
                      {(user ? user.is_psychologist: '') && (
                        <div className="bg-gradient-to-r from-blue-500 to-[#9675bc] rounded-full p-2 w-fit">
                          <User className="w-5 h-5 text-[#ffe0db]" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Mail className="w-4 h-4 text-[#f1b3be]" />
                      {isEditing && !viewOnly ? (
                        <input
                          type="email"
                          value={editData?.email || ''}
                          onChange={(e) => setEditData(editData ? {...editData, email: e.target.value} : null)}
                          className="bg-[#ffe0db]/10 backdrop-blur-sm border border-[#ffe0db]/20 rounded-lg px-3 py-1 text-[#f1b3be] focus:ring-2 focus:ring-[#f1b3be] w-full sm:w-auto"
                        />
                      ) : (
                        <span className="text-[#f1b3be] text-sm sm:text-base">{viewOnly ? '***@***.com' : user ? user.email: ''}</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-[#ffe0db]/60">
                      <Calendar className="w-4 h-4" />
                      <span>Miembro desde {formatJoinDate(user ? user.date_joined: '')}</span>
                    </div>
                  </div>
                </div>
                
                {!isEditing && !viewOnly && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-[#9675bc] to-[#f1b3be] hover:from-[#f1b3be] hover:to-[#9675bc] rounded-xl text-[#ffe0db] font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#f1b3be]/50 w-full sm:w-auto"
                  >
                    <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Editar</span>
                  </button>
                )}
              </div>

              {/* Botones de edición debajo del perfil - solo si no es viewOnly */}
              {isEditing && !viewOnly && (
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-[#ffe0db]/20">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-[#252c3e]/50 hover:bg-[#252c3e]/70 rounded-xl text-[#ffe0db] transition-all duration-300 hover:scale-105"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white transition-all duration-300 disabled:opacity-50 hover:scale-105"
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
              <h3 className="text-xl font-semibold text-[#ffe0db] mb-4 flex items-center">
                <Heart className="w-5 h-5 text-[#f1b3be] mr-2" />
                {viewOnly ? `El mundo onírico de ${user ? user.username: ''}` : 'Sobre mi mundo onírico'}
              </h3>
              {isEditing && !viewOnly ? (
                <textarea
                  value={editData?.description || ''}
                  onChange={(e) => setEditData(editData ? {...editData, description: e.target.value} : null)}
                  rows={6}
                  placeholder="Cuéntanos sobre tus sueños, experiencias y conexión con el mundo onírico..."
                  className="w-full bg-[#ffe0db]/10 backdrop-blur-sm border border-[#ffe0db]/20 rounded-xl px-4 py-3 text-[#ffe0db] placeholder-[#ffe0db]/50 focus:ring-2 focus:ring-[#f1b3be] focus:border-[#f1b3be] resize-none"
                  maxLength={1500}
                />
              ) : (
                <p className="text-[#ffe0db]/80 leading-relaxed">
                  {(user ? user.description:  '')|| (viewOnly ? 'Este usuario no ha compartido su historia onírica aún...' : 'Aún no has compartido tu historia onírica...')}
                </p>
              )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: 'Sueños Registrados', value: '47', icon: Moon, color: 'from-[#9675bc] to-indigo-500' },
                { label: 'Días Activo', value: '89', icon: Calendar, color: 'from-[#f1b3be] to-rose-500' },
                { label: 'Análisis Completos', value: '23', icon: Star, color: 'from-amber-500 to-[#ffe0db]' }
              ].map((stat, index) => (
                <div key={stat.label} className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-[#ffe0db]/20 hover:bg-[#ffe0db]/15 transition-all duration-300 group">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffe0db]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#ffe0db] mb-1">{stat.value}</div>
                  <div className="text-[#ffe0db]/60 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))
              }
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Card de Estado */}
        <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-6">
          <h3 className="text-xl font-semibold text-[#ffe0db] mb-4 flex items-center">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            Estado de la Cuenta
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#ffe0db]/70">Verificación</span>
              <span className="text-green-400 font-medium">✓ Verificado</span>
            </div>
            {!viewOnly && (
              <div className="flex items-center justify-between">
                <span className="text-[#ffe0db]/70">Privacidad</span>
                <span className="text-blue-400 font-medium capitalize">{privacySettings.profile_visibility}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[#ffe0db]/70">Tipo de Cuenta</span>
              <span className="text-[#f1b3be] font-medium">
                {(user? user.is_psychologist: '') ? 'Psicólogo' : 'Soñador'}
              </span>
            </div>
          </div>
        </div>

        {/* Card de Actividad Reciente */}
        <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-6">
          <h3 className="text-xl font-semibold text-[#ffe0db] mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 text-blue-400 mr-2" />
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Sueño registrado', time: 'Hace 2 horas', color: 'text-[#9675bc]' },
              { action: 'Análisis completado', time: 'Ayer', color: 'text-[#f1b3be]' },
              { action: 'Perfil actualizado', time: 'Hace 3 días', color: 'text-blue-400' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-[#ffe0db]/70 text-sm">{activity.action}</span>
                <span className={`text-xs ${activity.color} font-medium`}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card de Acciones Rápidas - solo si no es viewOnly */}
        {!viewOnly && (
          <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-[#ffe0db] mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-[#9675bc]/20 hover:bg-[#9675bc]/30 rounded-xl text-[#ffe0db] transition-all duration-300 group">
                <Moon className="w-5 h-5 text-[#9675bc] group-hover:rotate-12 transition-transform" />
                <span>Registrar Sueño</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-[#f1b3be]/20 hover:bg-[#f1b3be]/30 rounded-xl text-[#ffe0db] transition-all duration-300 group">
                <Star className="w-5 h-5 text-[#f1b3be] group-hover:scale-110 transition-transform" />
                <span>Ver Análisis</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-[#ffe0db] transition-all duration-300 group">
                <Globe className="w-5 h-5 text-blue-300 group-hover:rotate-180 transition-transform" />
                <span>Explorar Comunidad</span>
              </button>
            </div>
          </div>
        )}

        {/* Card para contactar usuario - solo si es viewOnly */}
        {viewOnly && (
          <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-[#ffe0db] mb-4">Conectar</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-[#9675bc]/20 hover:bg-[#9675bc]/30 rounded-xl text-[#ffe0db] transition-all duration-300 group">
                <User className="w-5 h-5 text-[#9675bc] group-hover:scale-110 transition-transform" />
                <span>Agregar Amigo</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-[#f1b3be]/20 hover:bg-[#f1b3be]/30 rounded-xl text-[#ffe0db] transition-all duration-300 group">
                <Mail className="w-5 h-5 text-[#f1b3be] group-hover:rotate-12 transition-transform" />
                <span>Enviar Mensaje</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-[#ffe0db] transition-all duration-300 group">
                <Star className="w-5 h-5 text-blue-300 group-hover:rotate-180 transition-transform" />
                <span>Ver Sueños Públicos</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};