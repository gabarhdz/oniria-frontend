import React from 'react';

interface ActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  gradient, 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full overflow-hidden transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
      <div className="relative bg-gradient-to-br from-white/70 via-white/60 to-[#ffe0db]/70 backdrop-blur-sm rounded-xl p-4 border border-[#f1b3be]/20 shadow-lg group-hover:shadow-xl">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-[#252c3e] group-hover:text-[#214d72] transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-[#252c3e]/70">{description}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 bg-[#f1b3be] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ActionButton;