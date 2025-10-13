import React from 'react';
import Orb from './Orb';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-3 sm:space-x-4 animate-fade-in-up">
      <div className="relative w-12 h-12 sm:w-14 sm:h-14">
        <Orb isActive={true} size="small" />
      </div>
      <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-oniria_pink rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-oniria_pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-oniria_pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;