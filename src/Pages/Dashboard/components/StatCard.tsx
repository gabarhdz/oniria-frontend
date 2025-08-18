import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  gradient: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  gradient,
  change,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Counter animation effect
  useEffect(() => {
    if (isVisible && typeof value === 'number' && countRef.current) {
      const element = countRef.current;
      const target = value;
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        element.textContent = current.toString();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = target.toString();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isVisible, value]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
      }}
    >
      {/* Dynamic glow that follows mouse */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(150, 117, 188, 0.1), transparent 40%)`,
        }}
      />
      
      {/* Ambient background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-10 group-hover:opacity-25 transition-all duration-700 scale-110`} />
      
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[#9675bc]/20 via-[#f1b3be]/30 to-[#ffe0db]/20 group-hover:from-[#9675bc]/40 group-hover:via-[#f1b3be]/50 group-hover:to-[#ffe0db]/40 transition-all duration-500">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl" />
      </div>
      
      {/* Floating sparkles on hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute top-3 right-4 w-1 h-1 bg-[#f1b3be] rounded-full opacity-0 group-hover:opacity-100 animate-twinkle transition-opacity duration-300" />
        <div 
          className="absolute bottom-4 left-5 w-1.5 h-1.5 bg-[#9675bc] rounded-full opacity-0 group-hover:opacity-80 animate-bounce transition-opacity duration-300"
          style={{ animationDelay: '0.2s' }}
        />
        <div 
          className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-[#ffe0db] rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
      
      {/* Main card content */}
      <div className="relative z-10 p-6 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
        
        {/* Header with title and change indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#252c3e]/60 uppercase tracking-wider leading-tight">
              {title}
            </p>
            {change && (
              <div className="flex items-center space-x-1">
                <TrendingUp className={`w-3 h-3 ${change.isPositive ? 'text-emerald-500' : 'text-red-500 rotate-180'}`} />
                <span className={`text-xs font-medium ${change.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {change.isPositive ? '+' : ''}{change.value}%
                </span>
              </div>
            )}
          </div>
          
          {/* Sparkles indicator */}
          <div className="opacity-30 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="w-4 h-4 text-[#f1b3be] animate-pulse" />
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex items-center justify-between">
          
          {/* Value section */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span 
                ref={countRef}
                className="text-4xl font-bold text-[#252c3e] group-hover:text-[#214d72] transition-colors duration-300 font-mono tracking-tight"
              >
                {typeof value === 'number' ? '0' : value}
              </span>
              {typeof value === 'number' && (
                <div className="w-2 h-8 bg-gradient-to-t from-[#f1b3be] to-[#9675bc] rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </div>
            
            {subtitle && (
              <p className="text-xs text-[#252c3e]/60 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Enhanced icon container */}
          <div className="relative">
            {/* Icon background glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-all duration-500 scale-110`} />
            
            {/* Icon background */}
            <div className={`relative p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden`}>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Icon */}
              <div className="text-white relative z-10 drop-shadow-lg">
                {icon}
              </div>
              
              {/* Pulsing border */}
              <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-pulse opacity-60" />
              
              {/* Corner accent */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white/40 rounded-full animate-ping" />
            </div>
          </div>
        </div>
        
        {/* Progress bar indicator */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#252c3e]/50 font-medium">Progreso</span>
            <span className="text-xs text-[#252c3e]/70 font-semibold">
              {typeof value === 'number' ? Math.min(Math.round((value / 100) * 100), 100) : 85}%
            </span>
          </div>
          <div className="w-full bg-[#252c3e]/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${typeof value === 'number' ? Math.min(Math.round((value / 100) * 100), 100) : 85}%`,
                transitionDelay: isVisible ? '0.5s' : '0s'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#9675bc]/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
      
      {/* Pulse effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9675bc]/5 to-[#f1b3be]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        /* Enhanced focus states */
        .group:focus-within {
          outline: 2px solid #9675bc;
          outline-offset: 2px;
        }
        
        /* Smooth scaling for better performance */
        .group:hover {
          transform: translateY(-2px) scale(1.02);
        }
      `}</style>
    </div>
  );
};



export default StatCard;