import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  showDeleteModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  showDeleteModal, 
  onClose, 
  onConfirm 
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-[#252c3e]/95 via-[#214d72]/90 to-[#252c3e]/95 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl transform animate-scale-in">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-red-400 animate-pulse" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-[#ffe0db] mb-2">¿Eliminar Cuenta?</h3>
            <p className="text-[#ffe0db]/70">Esta acción es irreversible. Perderás todos tus sueños, análisis y datos.</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#252c3e]/50 hover:bg-[#252c3e]/70 text-[#ffe0db] rounded-xl transition-all duration-300 hover:scale-105"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
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