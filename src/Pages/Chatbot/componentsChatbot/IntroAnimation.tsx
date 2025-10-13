import React from 'react';
import Orb from './Orb';

const IntroAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple animate-fade-out" style={{ animationDelay: '2.5s' }}>
      <div className="text-center space-y-8 animate-scale-in">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
          <Orb isActive={true} size="large" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-oniria_lightpink via-oniria_pink to-oniria_purple bg-clip-text text-transparent">
            Noctiria AI
          </h1>
          <p className="text-lg sm:text-xl text-oniria_lightpink/90">
            Tu asistente onírico inteligente
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;