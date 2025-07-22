import React, { useState, useEffect, useRef } from 'react';

const timeline = [
  { title: "Primer sueño", date: "12 Mayo" },
  { title: "Patrón descubierto", date: "18 Mayo" },
  { title: "Sesión con experto", date: "25 Mayo" },
  { title: "Insight personal", date: "2 Junio" },
];

// Componente de partículas flotantes
const FloatingParticles = () => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Componente de orbes mágicos expandidos
const MagicalOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-16 left-10 w-36 h-36 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl animate-pulse" />
    <div className="absolute top-40 right-16 w-28 h-28 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-lg animate-bounce"
      style={{ animationDuration: '3s' }} />
    <div className="absolute top-1/2 left-20 w-44 h-44 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"
      style={{ animationDelay: '2s' }} />
    <div className="absolute bottom-32 right-12 w-32 h-32 bg-gradient-to-br from-indigo-400/30 to-blue-400/30 rounded-full blur-xl animate-pulse"
      style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-16 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/25 to-purple-400/25 rounded-full blur-lg animate-bounce"
      style={{ animationDuration: '4s', animationDelay: '3s' }} />
  </div>
);

// Componente de líneas ondulantes mejoradas
const WavyLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        d="M0,50 Q25,30 50,50 T100,50"
        stroke="url(#gradient1)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      >
        <animate
          attributeName="d"
          values="M0,50 Q25,30 50,50 T100,50;M0,50 Q25,70 50,50 T100,50;M0,50 Q25,30 50,50 T100,50"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M0,30 Q25,10 50,30 T100,30"
        stroke="url(#gradient2)"
        strokeWidth="0.3"
        fill="none"
        opacity="0.2"
      >
        <animate
          attributeName="d"
          values="M0,30 Q25,10 50,30 T100,30;M0,30 Q25,50 50,30 T100,30;M0,30 Q25,10 50,30 T100,30"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M0,70 Q25,50 50,70 T100,70"
        stroke="url(#gradient3)"
        strokeWidth="0.4"
        fill="none"
        opacity="0.15"
      >
        <animate
          attributeName="d"
          values="M0,70 Q25,50 50,70 T100,70;M0,70 Q25,90 50,70 T100,70;M0,70 Q25,50 50,70 T100,70"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c29cd9" />
          <stop offset="100%" stopColor="#ffd6f1" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffd6f1" />
          <stop offset="100%" stopColor="#c29cd9" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c29cd9" />
          <stop offset="50%" stopColor="#ffd6f1" />
          <stop offset="100%" stopColor="#c29cd9" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Hook para detectar scroll
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
};

// Componente principal
export default function Timeline() {
  const [titleRef, titleVisible] = useScrollReveal();
  const [timelineRef, timelineVisible] = useScrollReveal();
  const [footerRef, footerVisible] = useScrollReveal();
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    if (timelineVisible) {
      const interval = setInterval(() => {
        setActiveItem((prev) => (prev + 1) % timeline.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [timelineVisible]);

  return (
    <div className="w-full bg-gradient-to-br from-[#fae5df] via-[#f8ddd7] to-[#fae5df] py-32 px-6 text-center relative overflow-hidden min-h-screen">
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes dreamPulse {
          0%, 100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 25px rgba(194, 156, 217, 0.3); }
          50% { transform: scale(1.05) rotate(2deg); box-shadow: 0 0 35px rgba(194, 156, 217, 0.5); }
        }
        @keyframes cardReveal {
          0% { opacity: 0; transform: translateY(40px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lineGrow {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); background-color: #c29cd9; }
          50% { transform: scale(1.3); background-color: #ffd6f1; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #2c1810 25%, #c29cd9 50%, #2c1810 75%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }
        .dream-card {
          animation: dreamPulse 3s ease-in-out infinite;
        }
        .card-reveal {
          animation: cardReveal 0.8s ease-out forwards;
        }
        .line-grow {
          animation: lineGrow 2s ease-out forwards;
        }
        .dot-pulse {
          animation: dotPulse 2s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2.5s linear infinite;
        }
        .fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>

      {/* Elementos decorativos de fondo */}
      <FloatingParticles />
      <MagicalOrbs />
      <WavyLines />

      {/* Sección superior con más espacio */}
      <div className="relative z-10 mb-20">
        {/* Subtítulo */}
        <div ref={titleRef} className={`transition-all duration-1000 mb-8 ${
          titleVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <p className="text-[#8b7355] font-medium text-lg mb-4 tracking-wide">
            Tu viaje hacia el autoconocimiento
          </p>
        </div>

        {/* Título con efecto shimmer */}
        <div className={`mb-16 transition-all duration-1000 ${
          titleVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <h2 className="text-6xl md:text-7xl font-playfair mb-6">
            <span className="shimmer-text">
              Sigue tu progreso
            </span>
          </h2>
          <p className="text-xl text-[#8b7355] font-medium opacity-80 max-w-2xl mx-auto">
            Cada momento de introspección te acerca más a la comprensión profunda de tu ser interior
          </p>
        </div>

        {/* Decoración expandida debajo del título */}
        <div className="flex justify-center items-center mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-[#c29cd9] to-transparent w-48" />
          <div className="mx-6 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#c29cd9] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#ffd6f1] animate-pulse" style={{animationDelay: '0.5s'}} />
            <div className="w-3 h-3 rounded-full bg-[#c29cd9] animate-pulse" style={{animationDelay: '1s'}} />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#c29cd9] to-transparent w-48" />
        </div>
      </div>

      {/* Timeline mejorado con más espacio */}
      <div ref={timelineRef} className="relative flex justify-between items-start max-w-6xl mx-auto mb-32 mt-24 font-inter">
        {/* Línea central animada */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-[#c29cd9]/30 via-[#c29cd9] to-[#c29cd9]/30 z-0 rounded-full" />
        <div className={`absolute top-12 left-0 h-1 bg-gradient-to-r from-[#ffd6f1] to-[#c29cd9] z-10 rounded-full shadow-lg ${
          timelineVisible ? 'line-grow' : 'w-0'
        }`} />
        
        {/* Círculos decorativos en la línea */}
        <div className="absolute top-10 left-1/6 w-5 h-5 bg-gradient-to-br from-[#ffd6f1] to-[#c29cd9] rounded-full animate-pulse opacity-60" />
        <div className="absolute top-10 left-1/3 w-4 h-4 bg-gradient-to-br from-[#c29cd9] to-[#ffd6f1] rounded-full animate-pulse opacity-50" 
          style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-10 right-1/3 w-4 h-4 bg-gradient-to-br from-[#ffd6f1] to-[#c29cd9] rounded-full animate-pulse opacity-50" 
          style={{ animationDelay: '1s' }} />
        <div className="absolute top-10 right-1/6 w-5 h-5 bg-gradient-to-br from-[#c29cd9] to-[#ffd6f1] rounded-full animate-pulse opacity-60" 
          style={{ animationDelay: '1.5s' }} />

        {/* Eventos */}
        {timeline.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center z-20 w-44 relative">
            {/* Efecto de brillo activo expandido */}
            {activeItem === idx && (
              <div className="absolute -inset-6 bg-gradient-to-r from-[#c29cd9]/20 to-[#ffd6f1]/20 rounded-3xl blur-xl animate-pulse" />
            )}

            {/* Tarjeta mejorada y expandida */}
            <div className={`bg-white/90 backdrop-blur-sm shadow-2xl p-6 rounded-3xl mb-6 border-2 border-[#ffd6f1]/50 relative overflow-hidden transition-all duration-500 ${
              timelineVisible ? 'card-reveal' : 'opacity-0'
            } ${activeItem === idx ? 'dream-card scale-105' : ''}`}
              style={{ animationDelay: `${idx * 0.2}s` }}>
              {/* Efecto shimmer en la tarjeta */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
              {/* Contenido de la tarjeta */}
              <div className="relative z-10">
                <h3 className="font-bold text-lg text-[#2c1810] mb-2">{item.title}</h3>
                <p className="text-base text-[#8b7355] font-medium">{item.date}</p>
              </div>
              {/* Decoración en las esquinas expandida */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-[#ffd6f1] to-[#c29cd9] rounded-full opacity-60" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-gradient-to-br from-[#c29cd9] to-[#ffd6f1] rounded-full opacity-60" />
            </div>

            {/* Punto en la línea mejorado */}
            <div className={`relative ${timelineVisible ? 'dot-pulse' : 'opacity-0'}`}
              style={{ animationDelay: `${idx * 0.3}s` }}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd6f1] to-[#c29cd9] shadow-lg border-3 border-white/50" />
              {activeItem === idx && (
                <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd6f1] to-[#c29cd9] animate-ping" />
              )}
            </div>

            {/* Línea conectora vertical expandida */}
            <div className={`absolute top-28 w-px h-12 bg-gradient-to-b from-[#c29cd9] to-transparent transition-all duration-1000 ${
              timelineVisible ? 'opacity-100' : 'opacity-0'
            }`} style={{ animationDelay: `${idx * 0.2}s` }} />
          </div>
        ))}
      </div>

      {/* Sección de pie expandida */}
      <div ref={footerRef} className="relative z-10 mt-20">
        {/* Elementos decorativos adicionales */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-3">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-[#c29cd9]/40 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Texto motivacional expandido */}
        <div className={`transition-all duration-1000 ${
          footerVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-4'
        }`}>
          <blockquote className="text-[#8b7355] font-medium italic text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            "Cada sueño es un paso hacia el conocimiento de ti mismo, cada reflexión una puerta hacia la sabiduría interior"
          </blockquote>
          
          {/* Mensaje adicional */}
          <div className={`mt-8 transition-all duration-1000 delay-500 ${
            footerVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
          }`}>
            <p className="text-[#8b7355]/80 font-light text-lg">
              Continúa explorando los misterios de tu mente
            </p>
          </div>
        </div>

        {/* Decoración final */}
        <div className={`mt-16 transition-all duration-1000 delay-700 ${
          footerVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-4'
        }`}>
          <div className="flex justify-center items-center">
            <div className="h-px bg-gradient-to-r from-transparent via-[#c29cd9]/60 to-transparent w-64" />
            <div className="mx-8 w-4 h-4 rounded-full bg-gradient-to-br from-[#ffd6f1] to-[#c29cd9] animate-pulse" />
            <div className="h-px bg-gradient-to-r from-transparent via-[#c29cd9]/60 to-transparent w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}