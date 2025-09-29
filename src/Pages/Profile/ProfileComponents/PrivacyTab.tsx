import React from 'react';
import { Shield, Eye, Settings, Save } from 'lucide-react';
import type { PrivacySettings } from './types';

interface PrivacyTabProps {
  privacySettings: PrivacySettings;
  setPrivacySettings: (settings: PrivacySettings) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({
  privacySettings,
  setPrivacySettings,
  showNotification
}) => {
  return (
    <div className="animate-fade-in">
      <div className="bg-[#ffe0db]/10 backdrop-blur-2xl rounded-3xl border border-[#ffe0db]/20 shadow-2xl p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-[#ffe0db]">Configuración de Privacidad</h2>
            <p className="text-[#ffe0db]/70">Controla quién puede ver tu información y actividad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visibilidad del Perfil */}
          <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#ffe0db]/20">
            <h3 className="text-lg font-semibold text-[#ffe0db] mb-4 flex items-center">
              <Eye className="w-5 h-5 text-[#9675bc] mr-2" />
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
                    className="mt-1 w-4 h-4 text-[#9675bc] bg-[#ffe0db]/20 border-[#ffe0db]/30 focus:ring-[#9675bc]"
                  />
                  <div>
                    <div className="text-[#ffe0db] font-medium group-hover:text-[#f1b3be] transition-colors">
                      {option.label}
                    </div>
                    <div className="text-[#ffe0db]/60 text-sm">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Configuraciones Específicas */}
          <div className="bg-[#ffe0db]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#ffe0db]/20">
            <h3 className="text-lg font-semibold text-[#ffe0db] mb-4 flex items-center">
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
                <div key={setting.key} className="flex items-center justify-between group hover:bg-[#ffe0db]/5 rounded-lg p-2 transition-colors">
                  <div className="flex-1">
                    <div className="text-[#ffe0db] font-medium">{setting.label}</div>
                    <div className="text-[#ffe0db]/60 text-sm">{setting.desc}</div>
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
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9675bc]/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#9675bc]"></div>
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
  );
};