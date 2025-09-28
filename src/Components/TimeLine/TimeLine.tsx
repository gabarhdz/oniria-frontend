import React, { useState, useEffect, useRef } from 'react';

// Ejemplo de datos para la timeline
const timeline = [
  { title: 'Inicio del viaje', date: '2023-01-01' },
  { title: 'Primer descubrimiento', date: '2023-03-15' },
  { title: 'Reflexión profunda', date: '2023-06-10' },
  { title: 'Nuevo propósito', date: '2023-09-05' },
];

// Hook simple para animaciones de entrada
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) setVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return [ref, visible] as const;
}

export default function TimeLine() {
  const [titleRef, titleVisible] = useScrollReveal();
  const [timelineRef, timelineVisible] = useScrollReveal();
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
    <div className="w-full bg-gradient-to-br from-[#fae5df] via-[#f8ddd7] to-[#fae5df] py-12 md:py-24 px-2 md:px-6 text-center relative overflow-hidden min-h-screen">
      {/* Título */}
      <div ref={titleRef} className={`mb-8 transition-all duration-1000 ${
        titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2">Sigue tu progreso</h2>
        <p className="text-base md:text-lg text-[#8b7355] font-medium opacity-80 max-w-xl mx-auto">
          Cada momento de introspección te acerca más a la comprensión profunda de tu ser interior
        </p>
      </div>

      {/* Timeline */}
      <div
        ref={timelineRef}
        className="flex flex-col md:flex-row justify-between items-start md:items-start max-w-full md:max-w-5xl mx-auto mb-12 md:mb-24 mt-8 md:mt-16 gap-8 md:gap-0"
      >
        {timeline.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center z-20 w-full md:w-48 relative`}
          >
            {/* Tarjeta */}
            <div className={`bg-white/90 backdrop-blur-sm shadow-lg p-4 md:p-6 rounded-2xl mb-4 border border-[#ffd6f1]/50 relative transition-all duration-500 ${
              timelineVisible ? 'opacity-100' : 'opacity-0'
            } ${activeItem === idx ? 'scale-105 border-[#c29cd9]' : ''}`}>
              <h3 className="font-bold text-base md:text-lg text-[#2c1810] mb-1">{item.title}</h3>
              <p className="text-sm md:text-base text-[#8b7355] font-medium">{item.date}</p>
            </div>
            {/* Punto en la línea */}
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-[#ffd6f1] to-[#c29cd9] shadow-lg border-2 border-white/50" />
            {/* Línea vertical (solo mobile) */}
            {idx < timeline.length - 1 && (
              <div className="md:hidden w-1 h-12 bg-gradient-to-b from-[#c29cd9] to-transparent my-2" />
            )}
            {/* Línea horizontal (solo desktop) */}
            {idx < timeline.length - 1 && (
              <div className="hidden md:block absolute top-1/2 right-0 w-12 h-1 bg-gradient-to-r from-[#c29cd9] to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}