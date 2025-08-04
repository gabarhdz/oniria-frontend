import React from 'react';
import { User, Crown, Moon, Star } from 'lucide-react';

interface User {
  username: string;
  profile_pic?: string;
  is_psychologist: boolean;
  description?: string;
}

interface WelcomeSectionProps {
  user: User;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  return (
    <div className="text-center space-y-4">
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full blur-2xl opacity-20 animate-pulse w-32 h-32"></div>
        <div className="relative">
          {user.profile_pic ? (
            <img
              src={user.profile_pic}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-2xl"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9675bc] via-[#f1b3be] to-[#ffe0db] flex items-center justify-center shadow-2xl">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent">
          ¡Bienvenido, {user.username}!
        </h1>
        <div className="flex items-center justify-center space-x-2 text-[#ffe0db]/80">
          {user.is_psychologist ? (
            <>
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Psicólogo Certificado</span>
              <Crown className="w-5 h-5 text-yellow-400" />
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-[#f1b3be]" />
              <span className="text-sm">Explorador de Sueños</span>
              <Star className="w-5 h-5 text-[#ffe0db]" />
            </>
          )}
        </div>
        {user.description && (
          <p className="text-[#ffe0db]/70 max-w-2xl mx-auto">
            {user.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default WelcomeSection;