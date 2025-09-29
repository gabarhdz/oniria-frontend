import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Sparkles } from 'lucide-react';

// PANTALLA DE CARGA INICIAL - PANTALLA COMPLETA
export const UniversalLoader: React.FC<{ message?: string }> = ({ 
  message = 'Iniciando Noctiria...' 
}) => {
  const [loadingText, setLoadingText] = useState(message);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Bloquear scroll durante la carga inicial y forzar scroll al top
    const originalScrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    
    // Forzar scroll al top y bloquear scroll
    window.scrollTo(0, 0);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${originalScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const texts = [
      message,
      'Conectando con el reino de los sueños...',
      'Cargando comunidades oníricas...',
      'Preparando experiencia inmersiva...'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setLoadingText(texts[textIndex]);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    // Limpiar al desmontar el componente
    return () => {
      // Restaurar scroll y estilos originales
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = '';
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, originalScrollY);
      
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [message]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-oniria_darkblue via-oniria_blue to-oniria_purple relative overflow-hidden z-[99999]" 
         style={{ 
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           width: '100vw',
           height: '100vh'
         }}>
      
      {/* Enhanced background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          />
        ))}
        
        {/* Estrellas estáticas */}
        {Array.from({ length: 15 }, (_, i) => (
          <Star
            key={`star-${i}`}
            className="absolute text-oniria_lightpink/20 animate-pulse"
            style={{
              width: `${Math.random() * 12 + 8}px`,
              height: `${Math.random() * 12 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-8 relative z-10 px-4">
          {/* Logo container */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-oniria_purple via-oniria_pink to-oniria_lightpink rounded-full flex items-center justify-center shadow-xl">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
            </div>
            
            {/* Rotating rings */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-full h-full rounded-full border border-oniria_pink/20 border-dashed" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-oniria_lightpink via-oniria_pink to-oniria_purple bg-clip-text text-transparent">
              Centro de Comunidades
            </h2>
            
            <div className="space-y-3">
              <p className="text-base sm:text-lg text-oniria_lightpink/90 px-2">{loadingText}</p>
              
              {/* Progress bar */}
              <div className="w-56 sm:w-64 mx-auto">
                <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-oniria_purple via-oniria_pink to-oniria_lightpink rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-oniria_lightpink/60 mt-2">{Math.round(progress)}% completado</p>
              </div>
            </div>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-oniria_pink rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ALERTA DE CARGA PARA ACCIONES - ESTILO MODAL COMPACTO
export const ActionLoadingModal: React.FC<{ 
  isOpen: boolean; 
  message: string; 
}> = ({ isOpen, message }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      {/* Partículas sutiles de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-float"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 4}s`,
            }}
          />
        ))}
      </div>

      {/* Modal content - Responsive */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/30 shadow-2xl text-center max-w-xs sm:max-w-sm w-full relative overflow-hidden animate-modal-entrance">
        
        {/* Background gradient overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-oniria_purple/3 via-oniria_pink/3 to-oniria_lightpink/3 rounded-2xl" />
        
        <div className="relative z-10 space-y-3 sm:space-y-4">
          {/* Logo más pequeño y simple */}
          <div className="relative mx-auto w-10 h-10 sm:w-12 sm:h-12">
            {/* Logo principal */}
            <div className="w-full h-full bg-gradient-to-br from-oniria_purple via-oniria_pink to-oniria_lightpink rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/img/Oniria.svg" 
                alt="NOCTIRIA Logo" 
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter drop-shadow-sm animate-pulse" 
              />
            </div>
            
            {/* Solo un anillo giratorio */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-full h-full rounded-full border border-oniria_pink/30 border-dashed" />
            </div>
          </div>

          {/* Contenido compacto */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-oniria_purple via-oniria_pink to-oniria_lightpink bg-clip-text text-transparent">
              Noctiria
            </h3>
            
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-oniria_darkblue font-medium">
                {message}{dots}
              </p>
              <p className="text-xs text-oniria_darkblue/60">
                Un momento por favor
              </p>
            </div>

            {/* Barra de progreso más delgada */}
            <div className="w-full max-w-xs mx-auto">
              <div className="w-full bg-oniria_purple/15 rounded-full h-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-oniria_purple via-oniria_pink to-oniria_lightpink rounded-full animate-loading-bar" />
              </div>
            </div>

            {/* Puntos de carga más pequeños */}
            <div className="flex justify-center space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-gradient-to-br from-oniria_purple to-oniria_pink rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          {/* Mensaje de proceso más discreto */}
          <div className="bg-gradient-to-r from-oniria_purple/5 via-oniria_pink/5 to-oniria_lightpink/5 rounded-lg p-2 border border-oniria_purple/10">
            <p className="text-xs text-oniria_darkblue/60 flex items-center justify-center space-x-1.5">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
              <span>Procesando...</span>
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};