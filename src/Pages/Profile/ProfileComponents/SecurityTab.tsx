import React from 'react';
import { 
  Lock, Key, Bell, Shield, AlertTriangle, Download, EyeOff, Trash2 
} from 'lucide-react';

interface SecurityTabProps {
  setShowDeleteModal: (show: boolean) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ setShowDeleteModal }) => {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Configuración de Seguridad */}
        <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="w-7 h-7 text-yellow-400" />
            <h2 className="text-xl font-bold text-[#ffe0db]">Seguridad de la Cuenta</h2>
          </div>

          <div className="space-y-6">
            {/* Cambiar Contraseña */}
            <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-xl p-4 border border-[#ffe0db]/20">
              <h3 className="text-lg font-semibold text-[#ffe0db] mb-3 flex items-center">
                <Key className="w-5 h-5 text-yellow-400 mr-2" />
                Cambiar Contraseña
              </h3>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  className="w-full bg-[#ffe0db]/10 backdrop-blur-sm border border-[#ffe0db]/20 rounded-lg px-4 py-3 text-[#ffe0db] placeholder-[#ffe0db]/50 focus:ring-2 focus:ring-[#f1b3be] focus:border-[#f1b3be]"
                />
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  className="w-full bg-[#ffe0db]/10 backdrop-blur-sm border border-[#ffe0db]/20 rounded-lg px-4 py-3 text-[#ffe0db] placeholder-[#ffe0db]/50 focus:ring-2 focus:ring-[#f1b3be] focus:border-[#f1b3be]"
                />
                <input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  className="w-full bg-[#ffe0db]/10 backdrop-blur-sm border border-[#ffe0db]/20 rounded-lg px-4 py-3 text-[#ffe0db] placeholder-[#ffe0db]/50 focus:ring-2 focus:ring-[#f1b3be] focus:border-[#f1b3be]"
                />
              </div>
              <button className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-300 font-medium transition-all duration-300">
                <Key className="w-4 h-4" />
                <span>Actualizar Contraseña</span>
              </button>
            </div>

            {/* Preferencias de Notificación */}
            <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-xl p-4 border border-[#ffe0db]/20">
              <h3 className="text-lg font-semibold text-[#ffe0db] mb-3 flex items-center">
                <Bell className="w-5 h-5 text-[#f1b3be] mr-2" />
                Notificaciones de Seguridad
              </h3>
              <div className="space-y-3">
                {[
                  'Inicio de sesión desde nuevo dispositivo',
                  'Cambios en la configuración de seguridad',
                  'Intentos de acceso fallidos',
                  'Cambios en la información del perfil'
                ].map((notif, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer group hover:bg-[#ffe0db]/5 rounded-lg p-2 transition-colors">
                    <span className="text-[#ffe0db]/80 group-hover:text-[#ffe0db]">{notif}</span>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 text-[#9675bc] bg-[#ffe0db]/20 border-[#ffe0db]/30 rounded focus:ring-[#9675bc]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Autenticación en dos pasos */}
            <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-xl p-4 border border-[#ffe0db]/20">
              <h3 className="text-lg font-semibold text-[#ffe0db] mb-3 flex items-center">
                <Shield className="w-5 h-5 text-green-400 mr-2" />
                Autenticación en Dos Pasos
              </h3>
              <p className="text-[#ffe0db]/70 text-sm mb-4">
                Añade una capa extra de seguridad a tu cuenta requiriendo un código adicional al iniciar sesión.
              </p>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-300 font-medium transition-all duration-300">
                <Shield className="w-4 h-4" />
                <span>Configurar 2FA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Zona Peligrosa */}
        <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-red-500/30 shadow-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-7 h-7 text-red-400" />
            <h2 className="text-xl font-bold text-[#ffe0db]">Zona Peligrosa</h2>
          </div>

          <div className="space-y-6">
            {/* Exportar Datos */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#ffe0db] mb-2">Exportar Mis Datos</h3>
              <p className="text-[#ffe0db]/70 text-sm mb-4">
                Descarga una copia de todos tus datos personales, sueños y análisis.
              </p>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-orange-300 font-medium transition-all duration-300">
                <Download className="w-4 h-4" />
                <span>Solicitar Exportación</span>
              </button>
            </div>

            {/* Desactivar Cuenta */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#ffe0db] mb-2">Desactivar Cuenta</h3>
              <p className="text-[#ffe0db]/70 text-sm mb-4">
                Desactiva temporalmente tu cuenta. Podrás reactivarla más tarde.
              </p>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-300 font-medium transition-all duration-300">
                <EyeOff className="w-4 h-4" />
                <span>Desactivar Cuenta</span>
              </button>
            </div>

            {/* Eliminar Cuenta */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[#ffe0db] mb-2">Eliminar Cuenta</h3>
              <p className="text-[#ffe0db]/70 text-sm mb-4">
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
  );
};