// components/dashboard/DashboardFooter.tsx
import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="text-center py-8 border-t border-[#f1b3be]/20">
      <div className="space-y-2">
        <p className="text-[#ffe0db]/60 text-sm">
          © 2024 Noctiria - Tu compañero en la exploración onírica
        </p>
        <div className="flex items-center justify-center space-x-4 text-[#ffe0db]/50">
          <button className="hover:text-[#f1b3be] transition-colors duration-200">
            Privacidad
          </button>
          <span>•</span>
          <button className="hover:text-[#f1b3be] transition-colors duration-200">
            Términos
          </button>
          <span>•</span>
          <button className="hover:text-[#f1b3be] transition-colors duration-200">
            Soporte
          </button>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;