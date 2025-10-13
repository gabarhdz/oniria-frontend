import { Menu, RefreshCw, Download, ArrowLeft } from 'lucide-react';
import React from 'react';
import type { HeaderProps } from './types';
import Orb from './Orb';

const Header: React.FC<HeaderProps> = ({
  showSidebar,
  currentConversation,
  onToggleSidebar,
  onRefresh,
  onExport
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 py-4 sm:px-6 sm:py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all hover:scale-105"
          >
            <Menu className="w-5 h-5 text-oniria_lightpink" />
          </button>
          
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Orb isActive={false} size="small" />
          </div>
          
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-oniria_lightpink">Noctiria AI</h1>
            <p className="text-xs sm:text-sm text-oniria_lightpink/70">
              {currentConversation?.title || 'Asistente Inteligente'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-oniria_lightpink transition-all duration-300 hover:scale-105"
            title="Volver al dashboard"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={onRefresh}
            className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-oniria_lightpink transition-all duration-300 hover:scale-105 hover:rotate-180"
            title="Refrescar página"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
          </button>
          <button
            onClick={onExport}
            className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-oniria_lightpink transition-all duration-300 hover:scale-105"
            title="Exportar chat"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
