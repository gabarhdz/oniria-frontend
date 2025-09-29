import React, { useEffect, useRef, useState } from "react";

interface FeatureProps {
  number: number;
  title: string;
  color: string;
  description: string;
  Icon: React.ElementType;
  index?: number;
}

const Feature: React.FC<FeatureProps> = ({
  number,
  title,
  description,
  color,
  Icon,
  index = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, index * 150);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        group relative w-full max-w-sm mx-auto
        transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
      `}
      style={{
        transitionDelay: `${index * 200}ms`,
        transform: `translateY(${scrollProgress * -30}px) rotateX(${scrollProgress * 5}deg)`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Main card container */}
      <div
        className={`
          relative bg-[#FEEFE8] p-6 sm:p-8 min-h-[420px] sm:min-h-[450px] w-full
          rounded-3xl shadow-2xl transition-all duration-700 ease-out
          text-center flex flex-col items-center justify-between
          border border-white/60 backdrop-blur-sm overflow-hidden
          hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]
          hover:-translate-y-3 hover:scale-[1.02]
          transform-gpu perspective-1000
        `}
        style={{
          background: `linear-gradient(135deg, 
            #FEEFE8 0%, 
            rgba(254, 239, 232, 0.98) 30%, 
            rgba(254, 239, 232, 0.95) 70%, 
            rgba(254, 239, 232, 0.92) 100%
          )`,
          boxShadow: isHovered
            ? `0 35px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px ${color}40, 0 0 60px ${color}25`
            : '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
          transform: isHovered ? 'rotateY(5deg) rotateX(5deg)' : 'rotateY(0deg) rotateX(0deg)'
        }}
      >
        {/* Glare effect */}
        <div
          className={`
            absolute inset-0 rounded-3xl pointer-events-none
            transition-opacity duration-500
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(255, 255, 255, 0.4) 0%, 
              rgba(255, 255, 255, 0.2) 25%, 
              transparent 50%
            )`
          }}
        />

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-4 right-4 w-3 h-3 bg-blue-200/60 rounded-full animate-pulse-gentle" />
          <div className="absolute bottom-8 left-4 w-2 h-2 bg-green-200/70 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-purple-200/80 rounded-full animate-pulse-gentle" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/4 right-1/4 w-2.5 h-2.5 bg-indigo-200/50 rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }} />
          {/* Aura effect */}
          <div
            className={`
              absolute inset-0 rounded-3xl transition-all duration-1000
              ${isHovered ? 'opacity-30' : 'opacity-0'}
            `}
            style={{
              background: `conic-gradient(from ${mousePosition.x}deg, 
                transparent 0deg, 
                ${color}20 45deg, 
                transparent 90deg,
                ${color}15 135deg,
                transparent 180deg,
                ${color}10 225deg,
                transparent 270deg,
                ${color}20 315deg,
                transparent 360deg
              )`,
              animation: isHovered ? 'rotate-security 4s linear infinite' : 'none'
            }}
          />
        </div>

        {/* Glassmorphism layers */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-sm pointer-events-none" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/5 via-transparent to-white/15 pointer-events-none" />

        {/* Number badge */}
        <div className="relative z-10 mb-6 sm:mb-8">
          <div
            className={`
              relative text-white font-black w-20 h-20 sm:w-28 sm:h-28 rounded-full 
              flex items-center justify-center text-2xl sm:text-3xl
              transition-all duration-500 ease-out
              ${isHovered ? 'scale-110' : 'scale-100'}
              shadow-2xl
            `}
            style={{
              backgroundColor: color,
              boxShadow: `
                0 20px 40px ${color}60, 
                inset 0 4px 8px rgba(255,255,255,0.4),
                0 0 0 4px rgba(255,255,255,0.1)
              `,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
            }}
          >
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/60 via-white/30 to-transparent pointer-events-none" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div
              className={`
                absolute inset-0 rounded-full border-2 border-white/40
                transition-all duration-700
                ${isHovered ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
              `}
            />
            <div
              className={`
                absolute inset-0 rounded-full border border-white/30
                transition-all duration-1000
                ${isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
              `}
            />
            <span className="relative z-10 font-black tracking-wide drop-shadow-lg">
              {number.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Title and badge */}
        <div className="relative z-10 mb-4 sm:mb-6">
          <h3
            className={`
              text-2xl sm:text-3xl font-bold text-gray-800 mb-2 font-inter
              transition-all duration-500 ease-out
              ${isHovered ? 'scale-105 text-gray-900' : 'scale-100'}
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              textShadow: isHovered
                ? `0 4px 12px rgba(0,0,0,0.15), 0 0 20px ${color}30`
                : '0 2px 4px rgba(0,0,0,0.1)',
              transitionDelay: isVisible ? '300ms' : '0ms'
            }}>
            {title}
          </h3>
          <div
            className={`
              text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider
              transition-all duration-500 flex items-center justify-center gap-2
              ${isHovered ? 'text-gray-600' : 'text-gray-500'}
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              transitionDelay: isVisible ? '400ms' : '0ms'
            }}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-gentle" />
            Experiencia Segura
          </div>
          <div
            className={`
              h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent
              transition-all duration-500 ease-out mt-3 mx-auto
              ${isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'}
            `}
            style={{
              background: `linear-gradient(to right, transparent, ${color}80, transparent)`,
              maxWidth: '200px'
            }}
          />
        </div>

        {/* Description */}
        <div className="relative z-10 flex-grow flex items-center w-full px-2">
          <div className="space-y-2 sm:space-y-3">
            <p
              className={`
                text-gray-700 text-sm sm:text-lg leading-relaxed font-playfair
                transition-all duration-500 ease-out
                ${isHovered ? 'text-gray-800 scale-[1.02]' : 'text-gray-700 scale-100'}
                ${isVisible ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                textShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                transitionDelay: isVisible ? '500ms' : '0ms'
              }}>
              {description}
            </p>
            <div
              className={`
                text-xs sm:text-sm text-gray-500 italic font-light flex items-center justify-center gap-2
                transition-all duration-500
                ${isHovered ? 'text-gray-600 scale-105' : 'text-gray-500 scale-100'}
                ${isVisible ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                transitionDelay: isVisible ? '600ms' : '0ms'
              }}>
              <div className="w-1 h-1 bg-blue-400 rounded-full" />
              Protegido y Confidencial
              <div className="w-1 h-1 bg-green-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Icon */}
        <div className="relative z-10 mt-6 sm:mt-8">
          <div
            className={`
              relative bg-white/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl
              border border-white/80 shadow-xl
              transition-all duration-500 ease-out
              ${isHovered ? 'scale-105 bg-white/70' : 'scale-100 bg-white/50'}
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              transitionDelay: isVisible ? '700ms' : '0ms',
              boxShadow: isHovered
                ? `0 20px 40px ${color}25, 0 0 0 2px ${color}40, inset 0 2px 4px rgba(255,255,255,0.8)`
                : '0 12px 24px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.6)'
            }}>
            <div
              className={`
                absolute inset-0 rounded-2xl transition-all duration-500
                ${isHovered ? 'opacity-40' : 'opacity-0'}
              `}
              style={{
                background: `radial-gradient(circle at center, ${color}40, transparent 70%)`
              }}
            />
            <div
              className={`
                absolute inset-0 rounded-2xl border border-white/30
                transition-all duration-1000
                ${isHovered ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}
              `}
            />
            <Icon
              className={`
                relative z-10 w-12 h-12 sm:w-16 sm:h-16 transition-all duration-500
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
              style={{
                color: color,
                filter: isHovered
                  ? `drop-shadow(0 0 20px ${color}80) drop-shadow(0 8px 16px rgba(0,0,0,0.2))`
                  : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;

