import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10 animate-pulse"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      ))}
    </div>
    <div className="text-center z-10">
      <div className="relative mb-8">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
          <img 
            src="/img/Oniria.svg" 
            alt="Oniria" 
            className="w-24 h-24 object-contain drop-shadow-lg" 
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="w-8 h-8 text-[#f1b3be] animate-spin" />
          <h2 className="text-2xl font-bold text-[#ffe0db]">
            Cargando perfil...
          </h2>
        </div>
        <div className="flex justify-center space-x-1 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#9675bc] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);