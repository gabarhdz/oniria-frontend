import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  Award, 
  Settings, 
  Sparkles, 
  Star, 
  ChevronRight,
  Zap
} from 'lucide-react';

// Enhanced Action Button specifically for ActionsSection
interface ActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
  disabled?: boolean;
  delay?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  gradient, 
  disabled = false,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (buttonRef.current) observer.observe(buttonRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative w-full overflow-hidden transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:-translate-y-2 active:scale-[0.99] cursor-pointer'
      }`}
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
      }}
    >
      {/* Enhanced background with depth */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-25 transition-all duration-700 scale-110`} />
      
      {/* Multi-layer glass effect */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[#9675bc]/30 via-[#f1b3be]/20 to-[#ffe0db]/30 group-hover:from-[#9675bc]/50 group-hover:via-[#f1b3be]/40 group-hover:to-[#ffe0db]/50 transition-all duration-500">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/95 via-white/85 to-[#ffe0db]/20 backdrop-blur-xl shadow-inner" />
      </div>
      
      {/* Dream particles floating effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {isHovered && (
          <>
            {/* Main floating particles */}
            <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-[#f1b3be] rounded-full animate-dream-float opacity-70" />
            <div 
              className="absolute top-8 right-8 w-2 h-2 bg-[#9675bc] rounded-full animate-dream-float opacity-50"
              style={{ animationDelay: '0.5s', animationDuration: '4s' }}
            />
            <div 
              className="absolute bottom-6 left-1/3 w-1 h-1 bg-[#ffe0db] rounded-full animate-dream-float opacity-80"
              style={{ animationDelay: '1s', animationDuration: '3s' }}
            />
            
            {/* Sparkle trail */}
            <div className="absolute top-1/2 left-4 w-0.5 h-0.5 bg-[#f1b3be] rounded-full animate-sparkle-trail opacity-60" />
            <div 
              className="absolute top-1/2 left-8 w-0.5 h-0.5 bg-[#9675bc] rounded-full animate-sparkle-trail opacity-40"
              style={{ animationDelay: '0.2s' }}
            />
            <div 
              className="absolute top-1/2 left-12 w-0.5 h-0.5 bg-[#ffe0db] rounded-full animate-sparkle-trail opacity-80"
              style={{ animationDelay: '0.4s' }}
            />
          </>
        )}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 p-8 flex items-center space-x-6">
        
        {/* Enhanced icon section */}
        <div className="relative flex-shrink-0">
          {/* Icon glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-700 scale-125`} />
          
          {/* Icon container with depth */}
          <div className={`relative p-5 rounded-xl bg-gradient-to-br ${gradient} shadow-2xl group-hover:shadow-3xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden`}>
            
            {/* Inner glow */}
            <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200" />
            
            {/* Icon */}
            <div className="text-white relative z-10 drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl border-2 border-white/20 animate-pulse group-hover:border-white/40 transition-colors duration-300" />
            
            {/* Corner sparkle */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" />
          </div>
        </div>
        
        {/* Content section */}
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <h3 className="font-bold text-xl text-[#252c3e] group-hover:text-[#214d72] transition-all duration-300 group-hover:drop-shadow-sm leading-tight">
              {title}
            </h3>
            <p className="text-base text-[#252c3e]/70 group-hover:text-[#252c3e]/90 transition-colors duration-300 leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-[#f1b3be]" />
              <span className="text-xs text-[#252c3e]/60 font-medium">AI Powered</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#9675bc]" />
              <span className="text-xs text-[#252c3e]/60 font-medium">Análisis Profundo</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced arrow indicator */}
        <div className="flex flex-col items-center space-y-3 flex-shrink-0">
          {/* Main arrow */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 scale-150" />
            <div className="relative w-12 h-12 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-90 shadow-lg group-hover:shadow-xl">
              <ChevronRight className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="flex flex-col space-y-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-[#f1b3be] rounded-full opacity-30 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: isHovered ? 'pulse 2s infinite' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9675bc]/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
        <div className="h-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] animate-pulse" />
      </div>
      
      {/* Click ripple effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9675bc]/10 to-[#f1b3be]/10 rounded-2xl transform scale-0 group-active:scale-100 transition-transform duration-200 origin-center" />
      </div>
    </button>
  );
};

// Main ActionsSection Component
export const ActionsSection: React.FC = () => {
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const actions = [
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "Diario de Sueños",
      description: "Registra y explora tus experiencias oníricas más profundas con IA avanzada",
      gradient: "from-[#9675bc] to-[#7c3aed]",
      onClick: () => {
        console.log('Navegando a diario de sueños...');
        // window.location.href = '/dreams';
      }
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: "Análisis Emocional",
      description: "Descubre los patrones emocionales y psicológicos ocultos en tus sueños",
      gradient: "from-[#f1b3be] to-[#ec4899]",
      onClick: () => {
        console.log('Navegando a análisis emocional...');
        // window.location.href = '/analysis';
      }
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Logros Oníricos",
      description: "Celebra tus hitos como explorador de sueños y consciencia",
      gradient: "from-[#ffe0db] to-[#f97316]",
      onClick: () => {
        console.log('Navegando a logros...');
        // window.location.href = '/achievements';
      }
    },
    {
      icon: <Settings className="w-7 h-7" />,
      title: "Configuración Avanzada",
      description: "Personaliza tu experiencia de análisis onírico en Noctiria",
      gradient: "from-[#214d72] to-[#0f172a]",
      onClick: () => {
        console.log('Navegando a configuración...');
        // window.location.href = '/settings';
      }
    }
  ];

  return (
    <div 
      ref={sectionRef}
      className="relative pb-24"
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
      }}
    >
      {/* Floating dream elements background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dream bubbles */}
        <div 
          className="absolute animate-dream-bubble opacity-8"
          style={{
            top: '10%',
            left: '8%',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #9675bc, #f1b3be)',
            borderRadius: '50%',
            filter: 'blur(2px)',
          }}
        />
        <div 
          className="absolute animate-dream-bubble opacity-12"
          style={{
            top: '70%',
            right: '12%',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #f1b3be, #ffe0db)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            filter: 'blur(1.5px)',
            animationDelay: '2s'
          }}
        />
        
        {/* Ethereal sparkles */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-ethereal-sparkle"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              background: Math.random() > 0.5 ? '#ffe0db' : '#f1b3be',
              borderRadius: '50%',
              animationDelay: `${Math.random() * 4}s`,
              opacity: 0.4 + Math.random() * 0.3
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 space-y-12">
        
        {/* Section header */}
        <div className={`text-center space-y-6 transform transition-all duration-700 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Title with decorative elements */}
          <div className="relative inline-flex flex-col items-center">
            <div className="flex items-center space-x-4 mb-3">
              <Sparkles className="w-6 h-6 text-[#f1b3be] animate-pulse" />
              <h2 
                className="text-4xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent"
                style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}
              >
                Explorar Noctiria
              </h2>
              <Star className="w-6 h-6 text-[#9675bc] animate-twinkle" />
            </div>
            
            {/* Subtitle */}
            <p className="text-lg text-[#ffe0db]/80 max-w-2xl leading-relaxed">
              Descubre todas las herramientas avanzadas para analizar tus sueños y emociones
            </p>
          </div>
        </div>

        {/* Action buttons grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={action.onClick}
              gradient={action.gradient}
              delay={index + 2}
            />
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes dream-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-8px) translateX(4px) rotate(5deg) scale(1.1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-4px) translateX(-4px) rotate(-3deg) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-12px) translateX(2px) rotate(2deg) scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes sparkle-trail {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }
        
        @keyframes dream-bubble {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
            opacity: 0.08;
          }
          33% {
            transform: translateY(-15px) translateX(8px) scale(1.1) rotate(120deg);
            opacity: 0.12;
          }
          66% {
            transform: translateY(-8px) translateX(-8px) scale(0.9) rotate(240deg);
            opacity: 0.06;
          }
        }
        
        @keyframes ethereal-sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.4) rotate(180deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .animate-dream-float {
          animation: dream-float 4s ease-in-out infinite;
        }
        
        .animate-sparkle-trail {
          animation: sparkle-trail 2s ease-in-out infinite;
        }
        
        .animate-dream-bubble {
          animation: dream-bubble 8s ease-in-out infinite;
        }
        
        .animate-ethereal-sparkle {
          animation: ethereal-sparkle 3s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ActionsSection;