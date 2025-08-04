import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  gradient: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  gradient 
}) => {
  return (
    <div className="group relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
      <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-[#ffe0db]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#f1b3be]/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#252c3e]/70">{title}</p>
            <p className="text-3xl font-bold text-[#252c3e]">{value}</p>
            {subtitle && (
              <p className="text-xs text-[#252c3e]/60">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;