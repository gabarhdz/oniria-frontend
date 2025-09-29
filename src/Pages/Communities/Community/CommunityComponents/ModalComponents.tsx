import React from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';

// Enhanced Error Alert
export const ErrorAlert: React.FC<{ 
  message: string; 
  onRetry?: () => void; 
  onClose: () => void 
}> = ({ message, onRetry, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-4">
    <div className="bg-gradient-to-br from-red-500/20 via-red-400/10 to-pink-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-red-400/30 shadow-2xl text-center max-w-sm sm:max-w-md w-full relative overflow-hidden">
      
      <div className="relative z-10 space-y-4 sm:space-y-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-oniria_lightpink">Error en Noctiria</h3>
          <p className="text-sm text-oniria_lightpink/80 leading-relaxed px-2">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base"
            >
              Reintentar
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-white/20 hover:bg-white/30 text-oniria_lightpink px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium text-sm sm:text-base"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Confirmation Modal
export const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar", 
  isDestructive = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-center max-w-sm sm:max-w-md w-full relative overflow-hidden animate-modal-entrance">
        
        <div className="relative z-10 space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold text-oniria_lightpink">{title}</h3>
            <p className="text-sm text-oniria_lightpink/80 leading-relaxed px-2">{message}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base ${
                isDestructive 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                  : 'bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white'
              }`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white/20 hover:bg-white/30 text-oniria_lightpink px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-medium text-sm sm:text-base"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};