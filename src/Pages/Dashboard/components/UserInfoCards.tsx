// components/dashboard/UserInfoCards.tsx
import React from 'react';
import { User, Mail, Shield } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserInfoCardsProps {
  user: User;
}

export const UserInfoCards: React.FC<UserInfoCardsProps> = ({ user }) => {
  const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    gradient: string;
  }> = ({ icon, title, value, gradient }) => (
    <div className="group relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
      <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-[#ffe0db]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#f1b3be]/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-[#252c3e]">{title}</h3>
            <p className="text-[#252c3e]/70 text-sm">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InfoCard
        icon={<User className="w-6 h-6 text-white" />}
        title="Nombre de Soñador"
        value={user.username}
        gradient="from-[#9675bc]/20 via-[#f1b3be]/20 to-[#ffe0db]/20"
      />

      <InfoCard
        icon={<Mail className="w-6 h-6 text-white" />}
        title="Correo Onírico"
        value={user.email}
        gradient="from-[#f1b3be]/20 via-[#ec4899]/20 to-[#9675bc]/20"
      />

      <InfoCard
        icon={<Shield className="w-6 h-6 text-white" />}
        title="ID de Usuario"
        value={`#${user.id.slice(0, 8)}`}
        gradient="from-[#ffe0db]/20 via-[#f97316]/20 to-[#f1b3be]/20"
      />
    </div>
  );
};

export default UserInfoCards;