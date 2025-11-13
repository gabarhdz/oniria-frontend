import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Moon, 
  Sparkles, 
  Eye,
  Heart,
  CloudRain,
  RefreshCw,
  TrendingUp,
  Brain,
  Waves,
  Stars
} from 'lucide-react';

// Enhanced StatCard specifically for StatisticsSection
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
  delay?: number;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  gradient,
  change,
  delay = 0,
  isLoading = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  // Counter animation
  useEffect(() => {
    if (isVisible && typeof value === 'number' && !isLoading) {
      const duration = 2000;
      const startTime = Date.now();
      const startValue = 0;
      const endValue = value;
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        setAnimatedValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isVisible, value, isLoading]);

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
      }`}
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
      }}
    >
      {/* Dynamic mouse-following glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(150, 117, 188, 0.12), transparent 50%)`,
        }}
      />
      
      {/* Ambient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-8 group-hover:opacity-20 transition-all duration-700 scale-110`} />
      
      {/* Enhanced glass border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[#9675bc]/25 via-[#f1b3be]/35 to-[#ffe0db]/25 group-hover:from-[#9675bc]/45 group-hover:via-[#f1b3be]/55 group-hover:to-[#ffe0db]/45 transition-all duration-500">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/95 via-white/88 to-[#ffe0db]/25 backdrop-blur-xl" />
      </div>
      
      {/* Floating dream elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute top-3 right-4 w-1.5 h-1.5 bg-[#f1b3be] rounded-full opacity-0 group-hover:opacity-100 animate-dream-sparkle transition-opacity duration-300" />
        <div 
          className="absolute bottom-4 left-5 w-2 h-2 bg-[#9675bc] rounded-full opacity-0 group-hover:opacity-80 animate-dream-float transition-opacity duration-300"
          style={{ animationDelay: '0.3s' }}
        />
        <div 
          className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#ffe0db] rounded-full opacity-0 group-hover:opacity-100 animate-dream-pulse transition-opacity duration-300"
          style={{ animationDelay: '0.6s' }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 p-6 space-y-4 transform transition-all duration-500 group-hover:scale-[1.01] group-hover:-translate-y-1">
        
        {/* Header section */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-xs font-bold text-[#252c3e]/60 uppercase tracking-widest">
                {title}
              </p>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="relative">
            <div className="w-3 h-3 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] rounded-full animate-ping opacity-30" />
          </div>
        </div>
        
        {/* Value section */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            {/* Main value */}
            <div className="flex items-baseline space-x-2">
              {isLoading ? (
                <div className="flex space-x-1">
                  <div className="w-8 h-8 bg-[#252c3e]/10 rounded animate-pulse" />
                  <div className="w-12 h-8 bg-[#252c3e]/10 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <span className="text-4xl font-bold text-[#252c3e] group-hover:text-[#214d72] transition-colors duration-300 font-mono tracking-tight">
                    {typeof value === 'number' ? animatedValue : value}
                  </span>
                  {typeof value === 'number' && (
                    <div className="w-1.5 h-8 bg-gradient-to-t from-[#f1b3be] to-[#9675bc] rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </>
              )}
            </div>
            
            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm text-[#252c3e]/60 font-medium leading-tight">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Enhanced icon */}
          <div className="relative">
            {/* Icon glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500 scale-125`} />
            
            {/* Icon container */}
            <div className={`relative p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-xl group-hover:shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden`}>
              
              {/* Inner shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Icon */}
              <div className="text-white relative z-10 drop-shadow-lg">
                {icon}
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-pulse" />
              
              {/* Corner highlight */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white/50 rounded-full animate-ping opacity-70" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#9675bc]/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
    </div>
  );
};

// User Stats Interface
interface UserStats {
  dreamsLogged: number;
  daysSinceJoined: number;
  favoriteTime: string;
  dreamCategories: number;
}

interface StatisticsSectionProps {
  userStats: UserStats;
  isLoadingStats: boolean;
  statsError: string | null;
  onRetryStats: () => void;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  userStats,
  isLoadingStats,
  statsError,
  onRetryStats
}) => {
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

  const statsCards = [
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "Pensamientos Registrados",
      value: userStats.dreamsLogged,
      subtitle: "experiencias noctiricas",
      gradient: "from-[#9675bc] to-[#7c3aed]",
      change: { value: 15, isPositive: true }
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: "Días en Noctiria",
      value: userStats.daysSinceJoined,
      subtitle: "días explorando",
      gradient: "from-[#f1b3be] to-[#ec4899]",
      change: { value: 8, isPositive: true }
    },
    {
      icon: <Moon className="w-7 h-7" />,
      title: "Hora Favorita",
      value: userStats.favoriteTime,
      subtitle: "momento onírico",
      gradient: "from-[#ffe0db] to-[#f97316]"
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: "Emociones",
      value: userStats.dreamCategories,
      subtitle: "tipos detectados",
      gradient: "from-[#214d72] to-[#0f172a]",
      change: { value: 12, isPositive: true }
    }
  ];

  return (
    <div 
      ref={sectionRef}
      className="relative"
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating emotion bubbles */}
        <div 
          className="absolute animate-emotion-float opacity-8"
          style={{
            top: '60%',
            right: '15%',
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #f1b3be, #ffe0db)',
            borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
            filter: 'blur(2px)'
          }}
        />
        
        {/* Ethereal sparkles */}
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-ethereal-twinkle"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
              width: `${1.5 + Math.random() * 2}px`,
              height: `${1.5 + Math.random() * 2}px`,
              background: ['#ffe0db', '#f1b3be', '#9675bc'][Math.floor(Math.random() * 3)],
              borderRadius: '50%',
              animationDelay: `${Math.random() * 4}s`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 space-y-10 pb-16">
        
        {/* Section header */}
        <div className={`text-center space-y-6 transform transition-all duration-700 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative inline-flex flex-col items-center">
            {/* Title sin iconos del ojo y corazón */}
            <div className="flex items-center space-x-4 mb-3">
              <h2 
                className="text-4xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent"
                style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}
              >
                Tu Viaje en Noctiria
              </h2>
            </div>
            
            {/* Subtitle */}
            <p className="text-lg text-[#ffe0db]/80 max-w-2xl leading-relaxed">
              Estadísticas profundas de tu exploración emocional en Noctiria
            </p>
            
            {/* Decorative elements - sin animación */}
            <div className="mt-4 flex items-center space-x-2">
              <Stars className="w-5 h-5 text-[#9675bc]/60" />
              <Waves className="w-6 h-6 text-[#f1b3be]/50" />
              <Sparkles className="w-5 h-5 text-[#ffe0db]/60" />
            </div>
          </div>
        </div>

        {/* Enhanced error state */}
        {statsError && (
          <div className={`transform transition-all duration-700 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative bg-gradient-to-br from-red-500/15 via-red-400/10 to-pink-500/15 backdrop-blur-xl border border-red-400/25 rounded-2xl p-8 text-center overflow-hidden">
              
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/5 to-transparent animate-shimmer" />
              
              {/* Content */}
              <div className="relative z-10 space-y-4">
                <CloudRain className="w-12 h-12 text-red-300 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-red-200">Error al cargar estadísticas</h3>
                <p className="text-red-200/80 max-w-md mx-auto leading-relaxed">{statsError}</p>
                <button
                  onClick={onRetryStats}
                  className="group inline-flex items-center space-x-2 px-6 py-3 bg-red-500/25 hover:bg-red-500/40 rounded-xl text-red-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25 font-medium"
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Reintentar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced loading state */}
        {isLoadingStats && !statsError && (
          <div className={`transform transition-all duration-700 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center py-16 space-y-6">
              {/* Animated loader */}
              <div className="relative inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#f1b3be] border-t-transparent shadow-lg" />
                <div className="absolute inset-0 rounded-full border-4 border-[#9675bc]/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-[#ffe0db]/40 animate-pulse" />
              </div>
              
              {/* Loading text */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-[#ffe0db]">Analizando patrones oníricos...</h3>
                <p className="text-[#ffe0db]/70">Procesando tus experiencias emocionales</p>
                
                {/* Loading dots */}
                <div className="flex justify-center space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-[#f1b3be] rounded-full animate-bounce"
                      style={{animationDelay: `${i * 0.2}s`}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics cards */}
        {!isLoadingStats && !statsError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsCards.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                gradient={stat.gradient}
                change={stat.change}
                delay={index + 1}
                isLoading={isLoadingStats}
              />
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes dream-sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.4) rotate(180deg);
          }
        }
        
        @keyframes dream-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-8px) translateX(4px) scale(1.1);
            opacity: 1;
          }
        }
        
        @keyframes dream-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes emotion-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0.08;
          }
          33% {
            transform: translateY(-15px) translateX(10px) rotate(120deg) scale(1.1);
            opacity: 0.15;
          }
          66% {
            transform: translateY(-5px) translateX(-5px) rotate(240deg) scale(0.9);
            opacity: 0.06;
          }
        }
        
        @keyframes ethereal-twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-dream-sparkle {
          animation: dream-sparkle 2.5s ease-in-out infinite;
        }
        
        .animate-dream-float {
          animation: dream-float 3s ease-in-out infinite;
        }
        
        .animate-dream-pulse {
          animation: dream-pulse 2s ease-in-out infinite;
        }
        
        .animate-emotion-float {
          animation: emotion-float 8s ease-in-out infinite;
        }
        
        .animate-ethereal-twinkle {
          animation: ethereal-twinkle 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StatisticsSection;