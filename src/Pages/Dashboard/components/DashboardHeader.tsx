// components/dashboard/DashboardHeader.tsx
import React from 'react';
import { LogOut, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  onLogout,
  isRefreshing
}) => {
  return (
    <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-xl border-b border-[#f1b3be]/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-xl p-1 shadow-lg">
              <img src="/img/Oniria.svg" alt="Oniria" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
              Noctiria
            </h1>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-[#f1b3be]/20 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-5 h-5 text-[#ffe0db] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/20 hover:from-red-500/30 hover:to-red-600/30 text-red-200 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;