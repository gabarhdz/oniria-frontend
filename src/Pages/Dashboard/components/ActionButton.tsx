import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface ActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
  disabled?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  gradient, 
  disabled = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative w-full overflow-hidden transition-all duration-500 ease-out ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.99] cursor-pointer'
      } ${className}`}
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
      }}
    >
      {/* Dynamic gradient background that follows mouse */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(150, 117, 188, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Ambient glow effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-700 scale-110`}
      />
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[#9675bc]/30 via-[#f1b3be]/20 to-[#ffe0db]/30 group-hover:from-[#9675bc]/50 group-hover:via-[#f1b3be]/40 group-hover:to-[#ffe0db]/50 transition-all duration-500">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/30 backdrop-blur-xl" />
      </div>
      
      {/* Floating dream particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {isHovered && (
          <>
            <div 
              className="absolute w-1 h-1 bg-[#f1b3be] rounded-full animate-float-particle opacity-60"
              style={{
                top: '20%',
                left: '15%',
                animationDelay: '0s',
                animationDuration: '3s'
              }}
            />
            <div 
              className="absolute w-1.5 h-1.5 bg-[#9675bc] rounded-full animate-float-particle opacity-40"
              style={{
                top: '70%',
                right: '20%',
                animationDelay: '1s',
                animationDuration: '4s'
              }}
            />
            <div 
              className="absolute w-0.5 h-0.5 bg-[#ffe0db] rounded-full animate-float-particle opacity-80"
              style={{
                top: '50%',
                left: '80%',
                animationDelay: '0.5s',
                animationDuration: '2.5s'
              }}
            />
          </>
        )}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 p-6 flex items-center space-x-5">
        
        {/* Icon container with enhanced effects */}
        <div className="relative">
          {/* Icon glow */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-all duration-500 scale-110`}
          />
          
          {/* Icon background */}
          <div 
            className={`relative p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden`}
          >
            {/* Shimmer effect on icon */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Icon */}
            <div className="text-white relative z-10 drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            
            {/* Pulsing border */}
            <div className="absolute inset-0 rounded-xl border-2 border-white/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 text-left space-y-1">
          <h3 className="font-bold text-lg text-[#252c3e] group-hover:text-[#214d72] transition-all duration-300 group-hover:drop-shadow-sm">
            {title}
          </h3>
          <p className="text-sm text-[#252c3e]/70 group-hover:text-[#252c3e]/90 transition-colors duration-300 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Arrow indicator with smooth animation */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative">
            {/* Indicator glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 scale-150" />
            
            {/* Main indicator */}
            <div className="relative w-8 h-8 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-90 shadow-lg">
              <ChevronRight className="w-4 h-4 text-white transform transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
          
          {/* Animated dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-[#f1b3be] rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300"
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#9675bc]/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9675bc]/20 to-[#f1b3be]/20 rounded-2xl transform scale-0 group-active:scale-100 transition-transform duration-200 origin-center" />
      </div>
      
      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-12px) translateX(8px) rotate(180deg) scale(1.2);
            opacity: 0.8;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20px) translateX(-5px) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
        
        .animate-float-particle {
          animation: float-particle 3s ease-in-out infinite;
        }
        
        /* Enhanced hover state for better accessibility */
        button:focus-visible {
          outline: 2px solid #9675bc;
          outline-offset: 2px;
        }
        
        /* Smooth transitions for better UX */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </button>
  );
};

// Demo component
const ActionButtonDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#252c3e] via-[#214d72] to-[#9675bc] p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}
          >
            Enhanced Action Buttons
          </h1>
          <p className="text-[#ffe0db]/80" style={{ fontFamily: 'var(--font-inter, "Inter", sans-serif)' }}>
            Buttons con efectos avanzados inspirados en interfaces modernas
          </p>
        </div>
        
        <ActionButton
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          title="Diario de Sueños"
          description="Registra y explora tus experiencias oníricas más profundas"
          gradient="from-[#9675bc] to-[#7c3aed]"
          onClick={() => alert('Diario de Sueños clicked!')}
        />
        
        <ActionButton
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg>}
          title="Análisis Emocional"
          description="Descubre los patrones emocionales ocultos en tus sueños"
          gradient="from-[#f1b3be] to-[#ec4899]"
          onClick={() => alert('Análisis clicked!')}
        />
      </div>
    </div>
  );
};

export default ActionButtonDemo;